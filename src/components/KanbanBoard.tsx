'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar } from 'lucide-react';
import { Todo } from '@/types/todo';
import { useEffect } from 'react';
import { useToast } from '@/hooks/useToast';


interface KanbanBoardProps {
  todos: Todo[];
  onStatusChange: (id: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
  onTaskClick: (task: Todo) => void;
}

const statusColumns = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ todos, onStatusChange, onTaskClick }) => {
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination or dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Find the dragged task
    const task = todos.find(t => t.id === draggableId);
    const newStatus = destination.droppableId as 'TODO' | 'IN_PROGRESS' | 'DONE';

    // Update the task status
    onStatusChange(draggableId, newStatus);
    
    // Show success toast
    toast({
      title: 'Task updated',
      description: `"${task?.title}" status changed to ${newStatus.toLowerCase().replace('_', ' ')}.`,
    });
  };

  // Group todos by status
  const groupedTodos = {
    TODO: todos.filter(todo => todo.status === 'TODO'),
    IN_PROGRESS: todos.filter(todo => todo.status === 'IN_PROGRESS'),
    DONE: todos.filter(todo => todo.status === 'DONE'),
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusColumns.map((column) => (
          <div key={column.id}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{column.title}</h3>
              <Badge variant="secondary">{groupedTodos[column.id]?.length || 0}</Badge>
            </div>
            
            <Droppable droppableId={column.id}>
              {(droppableProvided) => (
                <div
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                  className="min-h-[100px] bg-gray-50 rounded-md p-2"
                >
                  {groupedTodos[column.id]?.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <Card 
                            className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onTaskClick(todo)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{todo.title}</CardTitle>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Badge 
                                  variant={todo.priority === 'HIGH' ? 'destructive' : 
                                          todo.priority === 'MEDIUM' ? 'default' : 'secondary'}
                                >
                                  {todo.priority.toLowerCase()}
                                </Badge>
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;