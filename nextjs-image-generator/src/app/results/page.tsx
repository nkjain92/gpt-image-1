import Tabs from '@/components/Tab';
import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';

async function getImageFiles() {
  const resultsDirectory = path.join(process.cwd(), 'public/results');

  try {
    // Ensure the directory exists to prevent errors on first run
    await fs.mkdir(resultsDirectory, { recursive: true });

    const files = await fs.readdir(resultsDirectory);

    // Filter for image files (png, jpg, jpeg, webp)
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file));

    // Sort by modification time, newest first
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

    return fileStats.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading results directory:', error);
    return [];
  }
}

export default async function ResultsPage() {
  const images = await getImageFiles();

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl font-bold p-4'>AI Image Generator</h1>
          <Tabs />
        </div>
      </header>

      <main className='flex-1 py-6'>
        <div className='max-w-7xl mx-auto px-4'>
          <h2 className='text-xl font-semibold mb-6'>Generated Images</h2>

          {images.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              No images generated yet. Try generating some images first!
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {images.map(image => (
                <div
                  key={image.filename}
                  className='bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                  <div className='relative aspect-square'>
                    <Image
                      src={image.url}
                      alt={`Generated image ${image.filename}`}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      className='object-cover'
                    />
                  </div>
                  <div className='p-3 flex justify-between items-center'>
                    <div className='text-xs text-gray-500'>
                      {new Date(image.timestamp).toLocaleDateString()}
                    </div>
                    <a
                      href={image.url}
                      download
                      className='text-xs text-blue-600 hover:text-blue-800'>
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className='bg-gray-100 py-4'>
        <div className='max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm'>
          Powered by OpenAI GPT Image Generation
        </div>
      </footer>
    </div>
  );
}
