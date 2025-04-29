'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

const sizeOptions = [
  { value: '1024x1024', label: 'Square (1024x1024)' },
  { value: '1024x1536', label: 'Portrait (1024x1536)' },
  { value: '1536x1024', label: 'Landscape (1536x1024)' },
];

const qualityOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function ImageForm() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, size, quality }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-3xl mx-auto p-4'>
      <form onSubmit={handleSubmit} className='mb-8'>
        <div className='mb-4'>
          <label htmlFor='prompt' className='block text-sm font-medium mb-2'>
            Prompt
          </label>
          <textarea
            id='prompt'
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter a description of the image you want to generate...'
            rows={3}
            required
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
          <div>
            <label htmlFor='size' className='block text-sm font-medium mb-2'>
              Size
            </label>
            <select
              id='size'
              value={size}
              onChange={e => setSize(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
              {sizeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='quality' className='block text-sm font-medium mb-2'>
              Quality
            </label>
            <select
              id='quality'
              value={quality}
              onChange={e => setQuality(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
              {qualityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300'>
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4'>
          {error}
        </div>
      )}

      {imageUrl && (
        <div className='mt-6'>
          <h2 className='text-xl font-semibold mb-3'>Generated Image</h2>
          <div className='relative bg-gray-100 rounded-md overflow-hidden'>
            <Image
              src={imageUrl}
              alt='Generated image'
              width={1024}
              height={1024}
              className='mx-auto'
              style={{
                objectFit: 'contain',
                maxHeight: '70vh',
              }}
            />
            <a
              href={imageUrl}
              download
              target='_blank'
              rel='noopener noreferrer'
              className='absolute bottom-4 right-4 bg-white py-2 px-4 rounded-md shadow-md hover:bg-gray-100'>
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
