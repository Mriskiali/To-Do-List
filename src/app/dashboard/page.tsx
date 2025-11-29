'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ListFilter, Calendar } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';
import TaskDialog from '@/components/TaskDialog';
import TodoList from '@/components/TodoList';
import { Todo } from '@/types/todo';
import { useToast } from '@/hooks/useToast';

// Mock data and functions for todos without authentication
const mockTodos: Todo[] = [
  {
    id: '1',
    userId: 'mock-user',
    title: 'Setup project',
    description: 'Initialize the project with basic components',
    status: 'DONE',
    priority: 'HIGH',
    dueDate: '2024-12-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'mock-user',
    title: 'Implement authentication',
    description: 'Add login and registration functionality',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2024-12-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'mock-user',
    title: 'Create dashboard UI',
    description: 'Design the main dashboard interface',
    status: 'TODO',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board'); // Default to board view
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const { toast } = useToast();
  
  const handleCreateTodo = (newTodo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const todo: Todo = {
      ...newTodo,
      id: Date.now().toString(),
      userId: 'mock-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos([...todos, todo]);
    toast({
      title: 'Task created',
      description: `"${todo.title}" has been added to your tasks.`,
    });
  };

  const handleUpdateTodo = (updatedTodo: Partial<Todo>) => {
    if (updatedTodo.id) {
      setTodos(todos.map(todo => 
        todo.id === updatedTodo.id ? { ...todo, ...updatedTodo, updatedAt: new Date().toISOString() } : todo
      ));
      toast({
        title: 'Task updated',
        description: `"${updatedTodo.title}" has been updated successfully.`,
      });
    }
  };

  const handleUpdateTodoStatus = (id: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const todo = todos.find(t => t.id === id);
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status, updatedAt: new Date().toISOString() } : todo
    ));
    toast({
      title: 'Task updated',
      description: `"${todo?.title}" status changed to ${status.toLowerCase().replace('_', ' ')}.`,
    });
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: 'Task deleted',
      description: `"${todo?.title}" has been removed from your tasks.`,
      variant: 'destructive',
    });
  };

  const handleTaskClick = (task: Todo) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = (task: Partial<Todo>) => {
    if (task.id) {
      handleUpdateTodo(task);
    } else {
      handleCreateTodo(task as Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
    }
    setIsTaskDialogOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    handleDeleteTodo(id);
    setIsTaskDialogOpen(false);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <div className="flex space-x-2">
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'board' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
            >
              Board
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'board' ? (
        <KanbanBoard 
          todos={todos} 
          onStatusChange={handleUpdateTodoStatus}
          onTaskClick={handleTaskClick}
        />
      ) : (
        <TodoList 
          todos={todos} 
          onTaskClick={handleTaskClick} 
        />
      )}

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        isLoading={false}
      />
    </div>
  );
}