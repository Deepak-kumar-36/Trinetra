import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Theme';

export default function VoiceReportScreen() {
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      // Mock transcription for MVP UI purposes
      setTranscript("Two adults and a child are trapped on a rooftop. Water is rising. One person has asthma.");
    } else {
      setRecording(true);
      setTranscript('');
    }
  };

  const handleNext = () => {
    // In real app, pass the transcript to the next screen or save to context
    router.push({
      pathname: '/(citizen)/report/location',
      params: { transcript }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Report</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.instruction}>
          {recording ? "Listening..." : "Tap the button below and describe your emergency."}
        </Text>
        
        <View style={styles.transcriptContainer}>
          {transcript ? (
            <Text style={styles.transcriptText}>"{transcript}"</Text>
          ) : null}
        </View>

        <TouchableOpacity 
          style={[styles.recordButton, recording && styles.recordButtonActive]}
          onPress={toggleRecording}
        >
          <Text style={styles.recordButtonText}>
            {recording ? "⏹ Stop Recording" : "⏺ Start Recording"}
          </Text>
        </TouchableOpacity>

        {transcript ? (
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Confirm & Next</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Layout.padding,
    paddingTop: 60,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.urgent,
  },
  content: {
    padding: Layout.padding,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  transcriptContainer: {
    minHeight: 100,
    width: '100%',
    padding: Layout.padding,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius,
    marginBottom: 40,
  },
  transcriptText: {
    fontSize: 18,
    color: Colors.text,
    fontStyle: 'italic',
  },
  recordButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.urgent,
    borderWidth: 2,
    padding: 20,
    borderRadius: 50,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButtonActive: {
    backgroundColor: Colors.urgent,
  },
  recordButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: Layout.radiusButton,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.background,
  }
});
