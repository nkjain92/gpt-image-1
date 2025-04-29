import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Define the results directory path
    const resultsDirectory = path.join(process.cwd(), 'public', 'results');

    try {
      // Ensure the directory exists to prevent errors on first run
      await fs.mkdir(resultsDirectory, { recursive: true });

      // Read all files in the directory
      const files = await fs.readdir(resultsDirectory);

      // Filter for image files (png, jpg, jpeg, webp)
      const imageFiles = files.filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file));

      // Get stats for each file
      const fileStats = await Promise.all(
        imageFiles.map(async file => {
          const filePath = path.join(resultsDirectory, file);
          const stats = await fs.stat(filePath);
          return {
            filename: file,
            url: `/results/${file}`,
            timestamp: stats.mtime.getTime(),
          };
        }),
      );

      // Sort by modification time, newest first
      const sortedFiles = fileStats.sort((a, b) => b.timestamp - a.timestamp);

      return NextResponse.json({
        success: true,
        images: sortedFiles,
      });
    } catch (error) {
      console.error('Error reading results directory:', error);

      // If the directory doesn't exist or is empty, return empty array
      return NextResponse.json({
        success: true,
        images: [],
      });
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
