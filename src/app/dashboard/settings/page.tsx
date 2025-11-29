import { redirect } from 'next/navigation';

// Redirect to the main dashboard for now since we don't have specific settings functionality yet
export default function SettingsPage() {
  redirect('/dashboard');
}