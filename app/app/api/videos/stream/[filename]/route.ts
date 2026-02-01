import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filepath = path.join(process.cwd(), 'public', 'videos', filename);
    
    // Check if file exists
    try {
      await fs.stat(filepath);
    } catch {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const buffer = await fs.readFile(filepath);
    const fileSize = buffer.length;
    const range = request.headers.get('range');

    // Handle range requests for video seeking
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            'Content-Range': `bytes */${fileSize}`,
          },
        });
      }

      const chunk = buffer.slice(start, end + 1);

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(end - start + 1),
          'Content-Type': 'video/mp4',
        },
      });
    }

    // Return full file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(fileSize),
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
