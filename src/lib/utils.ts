export const generateUUID = (str?: string): string => {
  if (!str) return crypto.randomUUID();
  
  // Simple deterministic hash to convert a string (like Firebase UID) into a UUID format
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  
  // Return UUID format: 8-4-4-4-12
  return `${hex}-0000-4000-8000-000000000000`;
};
