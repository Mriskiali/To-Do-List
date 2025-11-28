'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ClipboardList } from 'lucide-react';
import TodoItem from './TodoItem';
import FilterBar from './FilterBar';
import TodoForm from './TodoForm';

type FilterStatus = 'all' | 'active' | 'completed';
type Priority = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';

export default function TodoList() {
  const [status, setStatus] = useState<FilterStatus>('all');
  const [priority, setPriority] = useState<Priority>('ALL');
  const [search, setSearch] = useState('');

  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ['todos', status, priority, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      if (priority !== 'ALL') params.append('priority', priority);
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/todos?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      return response.json();
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-500">Stay organized and get things done</p>
      </div>

      <TodoForm />
      
      <FilterBar
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        search={search}
        setSearch={setSearch}
      />

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 size={32} className="animate-spin mb-2" />
            <p>Loading tasks...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-100">
            <p>Error loading tasks. Please try again later.</p>
          </div>
        ) : todos?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ClipboardList size={32} className="text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-600">No tasks found</p>
            <p className="text-sm">
              {search || status !== 'all' || priority !== 'ALL'
                ? "Try adjusting your filters"
                : "Start by adding a new task above"}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {todos.map((todo: any) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}