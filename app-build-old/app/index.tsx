import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: Add auth state checking here
  // For now, redirect to the onboarding flow
  return <Redirect href="/onboarding" />;
}
