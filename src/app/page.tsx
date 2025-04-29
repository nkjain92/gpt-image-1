import Image from 'next/image';
import ImageForm from '@/components/ImageForm';
import Tabs from '@/components/Tab';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl font-bold p-4'>AI Image Generator</h1>
          <Tabs />
        </div>
      </header>

      <main className='flex-1 py-6'>
        <div className='max-w-7xl mx-auto'>
          <ImageForm />
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
