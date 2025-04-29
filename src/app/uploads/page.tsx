'use client';

import { useState, useRef } from 'react';
import Tabs from '@/components/Tab';
import Image from 'next/image';

export default function UploadsPage() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    // Clear previous states
    setError(null);
    setSuccess(null);
    setUploadedImage(null);

    // Preview the image
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target && typeof e.target.result === 'string') {
        setUploadedImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);

    // Upload the file
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      setUploadedImage(null);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl font-bold p-4'>AI Image Generator</h1>
          <Tabs />
        </div>
      </header>

      <main className='flex-1 py-6'>
        <div className='max-w-3xl mx-auto px-4'>
          <h2 className='text-xl font-semibold mb-6'>Upload Image</h2>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label='Drop zone for uploading images'
            role='region'>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              accept='image/jpeg,image/png,image/webp'
              onChange={handleFileChange}
              aria-label='Image file upload'
              title='Upload an image file'
            />

            {!uploadedImage ? (
              <div>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path>
                </svg>
                <p className='mt-2 text-sm text-gray-600'>
                  Drag and drop an image file here, or{' '}
                  <button
                    type='button'
                    className='text-blue-600 hover:text-blue-800'
                    onClick={triggerFileInput}
                    aria-label='Browse for an image file'>
                    browse
                  </button>
                </p>
                <p className='mt-1 text-xs text-gray-500'>PNG, JPG, or WebP up to 5MB</p>
              </div>
            ) : (
              <div className='relative'>
                <div className='relative w-full max-w-md mx-auto aspect-square'>
                  <Image
                    src={uploadedImage}
                    alt='Uploaded image preview'
                    fill
                    className='object-contain'
                  />
                </div>
                <button
                  type='button'
                  className='mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium'
                  onClick={() => setUploadedImage(null)}
                  disabled={uploading}
                  aria-label='Change image'>
                  Change image
                </button>
              </div>
            )}

            {uploading && (
              <div className='mt-4' aria-live='polite'>
                <div className='animate-pulse flex space-x-4'>
                  <div className='flex-1 space-y-4 py-1'>
                    <div className='h-2 bg-blue-200 rounded w-3/4 mx-auto'></div>
                  </div>
                </div>
                <p className='text-sm text-gray-600 mt-2'>Uploading image...</p>
              </div>
            )}
          </div>

          {error && (
            <div
              className='mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'
              role='alert'
              aria-live='assertive'>
              {error}
            </div>
          )}

          {success && (
            <div
              className='mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md'
              role='status'
              aria-live='polite'>
              {success}
            </div>
          )}

          <div className='mt-8'>
            <h3 className='text-lg font-medium mb-4'>About Image Uploads</h3>
            <p className='text-gray-600 mb-2'>
              Upload images that you want to use for editing with our AI system. After uploading,
              you can:
            </p>
            <ul className='list-disc pl-5 text-gray-600 space-y-1'>
              <li>Generate variations of your image</li>
              <li>Edit specific parts with inpainting</li>
              <li>Use as reference for new image generation</li>
            </ul>
            <p className='text-gray-600 mt-2'>
              For best results, use high-quality images with clear subjects and good lighting.
            </p>
          </div>
        </div>
      </main>

      <footer className='bg-gray-100 py-4 mt-8'>
        <div className='max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm'>
          Powered by OpenAI GPT Image Generation
        </div>
      </footer>
    </div>
  );
}
