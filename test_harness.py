import json
import os
import sys
import time
from pydantic import BaseModel, ValidationError, Field
from typing import List, Optional
from google import genai
from google.genai import types
from google.genai.errors import APIError

# Define the exact Pydantic schema for validation
class Vulnerabilities(BaseModel):
    child: bool = False
    elderly: bool = False
    pregnant: bool = False
    disability: bool = False
    medical_dependency: Optional[str] = None

class Hazards(BaseModel):
    rising_water: bool = False
    fire: bool = False
    structural_collapse: bool = False

class RequiredCapabilities(BaseModel):
    skills: List[str] = Field(default_factory=list)
    vehicle: Optional[str] = None
    equipment: List[str] = Field(default_factory=list)
    min_capacity: Optional[int] = None

class FieldConfidence(BaseModel):
    category: float
    people_affected: float
    vulnerabilities: float
    hazards: float
    required_capabilities: float

class Confidence(BaseModel):
    overall: float
    field_confidence: FieldConfidence

class ExtractionOutput(BaseModel):
    category: str
    description: str
    people_affected: Optional[int] = None
    vulnerabilities: Vulnerabilities
    hazards: Hazards
    required_capabilities: RequiredCapabilities
    confidence: Confidence
    needs_verification: List[str] = Field(default_factory=list)

def run_tests():
    keys_str = os.environ.get("GEMINI_API_KEYS")
    if not keys_str:
        print("Error: GEMINI_API_KEYS environment variable not set.")
        sys.exit(1)
        
    api_keys = [k.strip() for k in keys_str.split(",")]
    key_idx = 0

    with open("system_prompt.txt", "r", encoding="utf-8") as f:
        system_prompt = f.read()

    with open("edge_cases.json", "r", encoding="utf-8") as f:
        cases = json.load(f)

    results = []

    for case in cases:
        print(f"Testing Case {case['id']}...")
        time.sleep(2)  # Small sleep to be polite
        
        success = False
        attempts = 0
        while not success and attempts < len(api_keys):
            try:
                client = genai.Client(api_key=api_keys[key_idx])
                response = client.models.generate_content(
                    model='gemini-3.5-flash',
                    contents=f"Extract details from this report:\n\n{case['input_text']}",
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.0,
                        response_mime_type="application/json",
                        response_schema=ExtractionOutput
                    ),
                )
                
                output_text = response.text.strip()
                
                # Parse JSON
                try:
                    parsed_json = json.loads(output_text)
                    ExtractionOutput.model_validate(parsed_json)
                    schema_valid = True
                    validation_error = None
                except json.JSONDecodeError as e:
                    schema_valid = False
                    validation_error = f"Invalid JSON: {e}"
                    parsed_json = None
                except ValidationError as e:
                    schema_valid = False
                    validation_error = f"Schema error: {e}"
                    
                # Check logical expectations
                logic_pass = True
                logic_notes = []
                
                if schema_valid and parsed_json:
                    expected = case.get("expected", {})
                    for k, v in expected.items():
                        if k in parsed_json:
                            if isinstance(v, dict) and isinstance(parsed_json[k], dict):
                                for sub_k, sub_v in v.items():
                                    if parsed_json[k].get(sub_k) != sub_v:
                                        logic_pass = False
                                        logic_notes.append(f"Mismatch in {k}.{sub_k}: expected {sub_v}, got {parsed_json[k].get(sub_k)}")
                            else:
                                if parsed_json[k] != v:
                                    logic_pass = False
                                    logic_notes.append(f"Mismatch in {k}: expected {v}, got {parsed_json[k]}")
                        
                    if "needs_verification_contains" in case:
                        for nv in case["needs_verification_contains"]:
                            if nv not in parsed_json.get("needs_verification", []):
                                logic_pass = False
                                logic_notes.append(f"Expected {nv} in needs_verification")
                                
                    if "skills_contains" in case:
                        skills = parsed_json.get("required_capabilities", {}).get("skills", [])
                        has_skill = False
                        for sc in case["skills_contains"]:
                            if sc in skills:
                                has_skill = True
                                break
                        if not has_skill:
                            logic_pass = False
                            logic_notes.append(f"Expected at least one of {case['skills_contains']} in skills")
                                
                    if case.get("low_confidence"):
                        conf = parsed_json.get("confidence", {}).get("overall", 1.0)
                        if conf >= 0.3:
                            logic_pass = False
                            logic_notes.append(f"Expected confidence < 0.3, got {conf}")

                results.append({
                    "id": case["id"],
                    "schema_valid": schema_valid,
                    "logic_pass": logic_pass,
                    "notes": validation_error if not schema_valid else ", ".join(logic_notes)
                })
                success = True

            except APIError as e:
                print(f"API Error with key index {key_idx}: {e}")
                if e.code == 429:
                    print("Rotating API Key...")
                    key_idx = (key_idx + 1) % len(api_keys)
                    attempts += 1
                else:
                    results.append({
                        "id": case["id"],
                        "schema_valid": False,
                        "logic_pass": False,
                        "notes": f"API Error: {e}"
                    })
                    break
            except Exception as e:
                results.append({
                    "id": case["id"],
                    "schema_valid": False,
                    "logic_pass": False,
                    "notes": f"Exception: {e}"
                })
                break
                
        if not success and attempts >= len(api_keys):
            results.append({
                "id": case["id"],
                "schema_valid": False,
                "logic_pass": False,
                "notes": "All API keys exhausted for this case."
            })
            break

    # Print markdown table
    print("\n## Test Results\n")
    print("| Case | Schema Valid | Logic Pass | Notes |")
    print("|---|---|---|---|")
    for r in results:
        schema_icon = "PASS" if r['schema_valid'] else "FAIL"
        logic_icon = "PASS" if r['logic_pass'] else "FAIL"
        print(f"| {r['id']} | {schema_icon} | {logic_icon} | {r['notes']} |")

if __name__ == "__main__":
    run_tests()
