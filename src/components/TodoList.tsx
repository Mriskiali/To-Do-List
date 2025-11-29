'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Todo } from '@/types/todo';
import { useEffect, useState } from 'react';

interface TodoListProps {
  todos?: Todo[];
  onTaskClick: (task: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos = [], onTaskClick }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <Card 
          key={todo.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onTaskClick(todo)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{todo.title}</CardTitle>
              <Button variant="ghost" size="sm">
                {/* More options icon would go here */}
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge 
                variant={todo.priority === 'HIGH' ? 'destructive' : 
                        todo.priority === 'MEDIUM' ? 'default' : 'secondary'}
              >
                {todo.priority.toLowerCase()}
              </Badge>
              {todo.status === 'TODO' && <Badge variant="secondary">{todo.status.toLowerCase().replace('_', ' ')}</Badge>}
              {todo.status === 'IN_PROGRESS' && <Badge variant="default">{todo.status.toLowerCase().replace('_', ' ')}</Badge>}
              {todo.status === 'DONE' && <Badge variant="default" className="bg-green-100 text-green-800">Done</Badge>}
              {todo.dueDate && (
                <Badge variant="outline">
                  <Calendar className="mr-1 h-3 w-3" />
                  {isClient ? new Date(todo.dueDate).toLocaleDateString() : 'Loading...'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{todo.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TodoList;