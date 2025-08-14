import { type NextRequest, NextResponse } from 'next/server';
import { createBatchTasks } from '@/cron/batch-tasks-cron';

export async function GET(req: NextRequest) {
  // Verify the cron secret if set
  const authToken = req.headers.get('authorization')?.replace('Bearer ', '');
  
  if (process.env.CRON_SECRET && authToken !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized access. Invalid token.' },
      { status: 401 }
    );
  }

  try {
    // Run the batch task creation
    await createBatchTasks();
    
    return NextResponse.json(
      { message: 'Cron job executed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error executing cron job:', error);
    return NextResponse.json(
      { error: 'Failed to execute cron job' },
      { status: 500 }
    );
  }
} 