import { redirect } from 'next/navigation';

// Redirect to the main dashboard for now since we don't have specific today functionality yet
export default function TodayPage() {
  redirect('/dashboard');
}