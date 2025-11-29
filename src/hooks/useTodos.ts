import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTodos as getTodosAction, 
  createTodo as createTodoAction, 
  updateTodo as updateTodoAction, 
  updateTodoStatus as updateTodoStatusAction,
  deleteTodo as deleteTodoAction 
} from '@/actions/todo';
import { Todo } from '@/types/todo';

export const useTodos = () => {
  const queryClient = useQueryClient();

  const todosQuery = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: getTodosAction,
    staleTime: 1000 * 60 * 5,
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodoAction,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
      
      const optimisticTodo: Todo = {
        id: `optimistic-${Date.now()}`,
        userId: 'current-user-id',
        title: newTodo.title,
        description: newTodo.description || '',
        status: 'TODO',
        priority: newTodo.priority,
        dueDate: newTodo.dueDate?.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      queryClient.setQueryData(['todos'], (old: Todo[] = []) => [
        optimisticTodo,
        ...old,
      ]);
      
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) => 
      updateTodoAction(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
      
      queryClient.setQueryData(['todos'], (old: Todo[] = []) => 
        old.map(todo => 
          todo.id === id ? { ...todo, ...data, updatedAt: new Date().toISOString() } : todo
        )
      );
      
      return { previousTodos };
    },
    onError: (err, { id, data }, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE' }) => 
      updateTodoStatusAction(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
      
      queryClient.setQueryData(['todos'], (old: Todo[] = []) => 
        old.map(todo => 
          todo.id === id ? { ...todo, status, updatedAt: new Date().toISOString() } : todo
        )
      );
      
      return { previousTodos };
    },
    onError: (err, { id, status }, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodoAction,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
      
      queryClient.setQueryData(['todos'], (old: Todo[] = []) => 
        old.filter(todo => todo.id !== id)
      );
      
      return { previousTodos };
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    todos: todosQuery.data,
    isLoading: todosQuery.isLoading,
    isError: todosQuery.isError,
    createTodo: createTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    updateTodoStatus: updateTodoStatusMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    isMutating: 
      createTodoMutation.isPending || 
      updateTodoMutation.isPending || 
      updateTodoStatusMutation.isPending || 
      deleteTodoMutation.isPending,
    createTodoAsync: createTodoMutation.mutateAsync,
    updateTodoAsync: updateTodoMutation.mutateAsync,
    updateTodoStatusAsync: updateTodoStatusMutation.mutateAsync,
    deleteTodoAsync: deleteTodoMutation.mutateAsync,
  };
};