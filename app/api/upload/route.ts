import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Handle both 'files' (array) and 'file' (single) form field names
    let files = formData.getAll('files') as File[];
    if (!files || files.length === 0 || (files.length === 1 && files[0].name === '')) {
      const singleFile = formData.get('file') as File;
      if (singleFile && singleFile.name !== '') {
        files = [singleFile];
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit' },
          { status: 400 }
        );
      }
    }

    // Check if running on Netlify (use Netlify Blobs) or local (use file system)
    const isNetlify = process.env.NETLIFY === 'true' || process.env.NETLIFY_BLOBS_CONTEXT === 'true';

    if (isNetlify) {
      // Use Netlify Blobs for production
      const { getStore } = await import('@netlify/blobs');
      const store = getStore({ name: 'product-images' });

      const uploadedUrls: string[] = [];
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${randomString}.${extension}`;

        await store.set(filename, bytes);
        uploadedUrls.push(`/api/blobs/${filename}`);
      }

      return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    } else {
      // Use local file system for development
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const uploadedUrls: string[] = [];
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(file.name);
        const filename = `${timestamp}-${randomString}${extension}`;
        const filepath = path.join(uploadsDir, filename);

        await writeFile(filepath, buffer);
        uploadedUrls.push(`/uploads/${filename}`);
      }

      return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
