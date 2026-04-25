import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    console.log('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
    });

    const formData = await request.formData();
    console.log('FormData received');
    
    // Handle both 'files' (array) and 'file' (single) form field names
    let files = formData.getAll('files') as File[];
    if (!files || files.length === 0 || (files.length === 1 && files[0].name === '')) {
      const singleFile = formData.get('file') as File;
      if (singleFile && singleFile.name !== '') {
        files = [singleFile];
      }
    }

    console.log('Files to upload:', files?.length);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      console.log('File:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.' },
          { status: 400 }
        );
      }

      // No file size limit for banner images
    }

    // Upload to Cloudinary
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convert buffer to base64 for Cloudinary upload
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      console.log('Starting upload to Cloudinary for:', file.name);

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(
          base64,
          {
            folder: 'nextgenfarming/banners',
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' },
              { width: 1600, crop: 'limit' }, // Auto-adjust width, max 1600px
            ],
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else if (result) {
              console.log('Cloudinary upload success:', result.secure_url);
              resolve(result);
            } else {
              reject(new Error('No result from Cloudinary'));
            }
          }
        );
      });

      if (result && result.secure_url) {
        uploadedUrls.push(result.secure_url);
      }
    }

    console.log('All uploads completed:', uploadedUrls);
    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload files' },
      { status: 500 }
    );
  }
}
