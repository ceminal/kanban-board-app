import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Board from '../../../models/Board';


const handleError = (error: unknown) => {
  return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
};

export async function GET(request: NextRequest) {
  await connectToDatabase();

  try {
    const boards = await Board.find({});
    return NextResponse.json({ success: true, data: boards });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const board = await Board.create(body);
    return NextResponse.json({ success: true, data: board }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
