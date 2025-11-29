import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Todo App</h1>
        <p className="text-gray-600 mb-8">
          Organize your tasks and boost your productivity with our simple and intuitive todo app.
        </p>
        <Link href="/dashboard">
          <Button size="lg">
            Access Dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
