import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';
import { randomUUID } from 'crypto';

// Disable Next.js body parsing to allow formidable to handle the request
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data
const parseForm = async (
  req: Request,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      filename: (name, ext) => `${randomUUID()}${ext}`,
      keepExtensions: true,
      filter: part => {
        return !!(
          part.name === 'file' &&
          part.mimetype &&
          (part.mimetype.includes('image/jpeg') ||
            part.mimetype.includes('image/png') ||
            part.mimetype.includes('image/webp'))
        );
      },
    });

    // Create uploads directory if it doesn't exist
    fs.mkdir(path.join(process.cwd(), 'public/uploads'), { recursive: true })
      .then(() => {
        form.parse(req as any, (err, fields, files) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({ fields, files });
        });
      })
      .catch(reject);
  });
};

export async function POST(request: NextRequest) {
  try {
    const { files } = await parseForm(request as unknown as Request);

    const uploadedFile = files.file && Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
    }

    // Get the filename only (not the full path)
    const filename = path.basename(uploadedFile.filepath);

    return NextResponse.json({
      success: true,
      filename,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
