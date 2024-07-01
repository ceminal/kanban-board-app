import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Task from '../../../../models/Task';


const handleError = (error:unknown) => {
  return NextResponse.json({success:false, error:(error as Error).message})
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await connectToDatabase();
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' });
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { id } = params;
    await connectToDatabase();
    const task = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' });
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDatabase();
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return NextResponse.json({ success: false, error: 'Task not found' });
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    return handleError(error);
  }
}
