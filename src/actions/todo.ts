'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Get all todos for the current user
export async function getTodos() {
  try {
    // Create Supabase client for server component
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies().getAll();
          },
        },
      }
    );
    
    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    const userId = session.user.id;

    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new Error('Failed to fetch todos');
  }
}

export async function createTodo(data: { title: string; description?: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; dueDate?: Date }) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies().getAll();
          },
        },
      }
    );
    
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    const userId = session.user.id;

    const todo = await prisma.todo.create({
      data: {
        ...data,
        userId,
        status: 'TODO',
      },
    });

    revalidatePath('/dashboard');
    return todo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw new Error('Failed to create todo');
  }
}

// Update a todo
export async function updateTodo(id: string, data: Partial<{ title: string; description?: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE'; priority: 'LOW' | 'MEDIUM' | 'HIGH'; dueDate?: Date }>) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies().getAll();
          },
        },
      }
    );
    
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    const userId = session.user.id;
    
    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!todo) {
      throw new Error('Todo not found or access denied');
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data,
    });

    revalidatePath('/dashboard');
    return updatedTodo;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw new Error('Failed to update todo');
  }
}

export async function updateTodoStatus(id: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies().getAll();
          },
        },
      }
    );
    
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    const userId = session.user.id;
    
    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!todo) {
      throw new Error('Todo not found or access denied');
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/dashboard');
    return updatedTodo;
  } catch (error) {
    console.error('Error updating todo status:', error);
    throw new Error('Failed to update todo status');
  }
}

export async function deleteTodo(id: string) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies().getAll();
          },
        },
      }
    );
    
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    const userId = session.user.id;
    
    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!todo) {
      throw new Error('Todo not found or access denied');
    }

    await prisma.todo.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw new Error('Failed to delete todo');
  }
}