import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const params = await context.params;
    const { filename } = params;
    
    // Get Netlify Blobs store
    const store = getStore({ name: 'product-images' });
    
    // Retrieve the blob
    const blob = await store.get(filename, { type: 'arrayBuffer' });
    
    if (!blob) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Determine content type based on file extension
    const extension = filename.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
    };
    const contentType = contentTypes[extension || ''] || 'image/jpeg';
    
    // Return the image with proper headers
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving blob:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}
