import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Priority } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'all', 'active', 'completed'
    const priority = searchParams.get('priority'); // 'LOW', 'MEDIUM', 'HIGH'
    const search = searchParams.get('search');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status === 'active') {
      where.isCompleted = false;
    } else if (status === 'completed') {
      where.isCompleted = true;
    }

    if (priority && Object.values(Priority).includes(priority as Priority)) {
      where.priority = priority as Priority;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Error fetching todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, priority, category, dueDate } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        category: category || 'General',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Error creating todo' },
      { status: 500 }
    );
  }
}