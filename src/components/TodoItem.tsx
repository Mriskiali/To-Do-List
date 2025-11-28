'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Trash2, Calendar, Tag, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: Priority;
  category: string;
  dueDate: string | null;
  createdAt: string;
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleStatus = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !todo.isCompleted }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      await deleteTodo.mutateAsync();
      setIsDeleting(false);
    }
  };

  const priorityColors = {
    LOW: 'bg-green-100 text-green-800 border-green-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    HIGH: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityIcons = {
    LOW: <div className="w-2 h-2 rounded-full bg-green-500" />,
    MEDIUM: <div className="w-2 h-2 rounded-full bg-yellow-500" />,
    HIGH: <AlertCircle size={14} className="text-red-500" />,
  };

  return (
    <div className={clsx(
      "group bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md",
      todo.isCompleted && "opacity-75 bg-gray-50"
    )}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleStatus.mutate()}
          disabled={toggleStatus.isPending}
          className="mt-1 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
        >
          {todo.isCompleted ? (
            <CheckCircle2 className="text-green-500" size={22} />
          ) : (
            <Circle size={22} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={clsx(
              "font-medium text-gray-900 truncate pr-2",
              todo.isCompleted && "line-through text-gray-500"
            )}>
              {todo.title}
            </h3>
            <div className={clsx(
              "px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 flex-shrink-0",
              priorityColors[todo.priority]
            )}>
              {priorityIcons[todo.priority]}
              {todo.priority.charAt(0) + todo.priority.slice(1).toLowerCase()}
            </div>
          </div>

          {todo.description && (
            <p className={clsx(
              "text-sm text-gray-600 mt-1 line-clamp-2",
              todo.isCompleted && "text-gray-400"
            )}>
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
              <Tag size={12} />
              <span>{todo.category}</span>
            </div>
            
            {todo.dueDate && (
              <div className={clsx(
                "flex items-center gap-1.5 px-2 py-1 rounded-md",
                new Date(todo.dueDate) < new Date() && !todo.isCompleted ? "bg-red-50 text-red-600" : "bg-gray-100"
              )}>
                <Calendar size={12} />
                <span>{format(new Date(todo.dueDate), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting || deleteTodo.isPending}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}