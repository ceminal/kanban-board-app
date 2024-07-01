import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Task from '../../../models/Task';


const handleError = (error: unknown) => {
  return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');
    if (!boardId) {
      return NextResponse.json({ success: false, error: 'Missing boardId' }, { status: 400 });
    }

    const tasks = await Task.find({ boardId }).sort({ order: 1 }); 
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const lastTask = await Task.findOne({ boardId: body.boardId }).sort({ order: -1 }); 
    const newOrder = lastTask ? lastTask.order + 1 : 1; 

    const task = await Task.create({ ...body, order: newOrder });
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    const task = await Task.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    if (!taskId) {
      return NextResponse.json({ success: false, error: 'Missing task ID' }, { status: 400 });
    }
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    return handleError(error);
  }
}
