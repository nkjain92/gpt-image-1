'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImageIcon, Loader2, SparklesIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          size,
          quality,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Failed to generate image. Please try again.');
        }
      }

      setGeneratedImage(data.imageUrl);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleReset() {
    setPrompt('');
    setGeneratedImage(null);
    setError(null);
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='flex h-14 sticky top-0 z-10 items-center border-b bg-background px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 h-5' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Generate Image</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className='flex-1 p-6'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-3xl font-bold mb-6'>Generate Image</h1>

          {generatedImage ? (
            <div className='space-y-6'>
              <Card>
                <CardContent className='p-6'>
                  <div className='aspect-square relative rounded-md overflow-hidden border mb-4'>
                    <Image
                      src={generatedImage}
                      alt='Generated image'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <p className='text-sm text-muted-foreground mb-4'>
                    <strong>Prompt:</strong> {prompt}
                  </p>
                  <div className='flex gap-3'>
                    <Button variant='outline' onClick={handleReset}>
                      Create New Image
                    </Button>
                    <Button onClick={() => router.push('/results')}>View All My Images</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Image Generation</CardTitle>
                <CardDescription>
                  Describe what you want to see, and our AI will create it for you
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='prompt'>Image Prompt</Label>
                  <Textarea
                    id='prompt'
                    placeholder='Describe the image you want to generate...'
                    className='min-h-32 resize-none'
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                  />
                  <p className='text-sm text-muted-foreground'>
                    Be specific and descriptive for best results
                  </p>
                </div>

                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='model'>AI Model</Label>
                      <Select defaultValue='gpt-image-1' disabled>
                        <SelectTrigger>
                          <SelectValue placeholder='Select model' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='gpt-image-1'>GPT Image 1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='size'>Image Size</Label>
                      <Select defaultValue='1024x1024' value={size} onValueChange={setSize}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select size' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='1024x1024'>1:1 (1024×1024)</SelectItem>
                          <SelectItem value='1792x1024'>16:9 (1792×1024)</SelectItem>
                          <SelectItem value='1024x1792'>9:16 (1024×1792)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='quality'>Image Quality</Label>
                      <Select defaultValue='high' value={quality} onValueChange={setQuality}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select quality' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='low'>Low (Faster)</SelectItem>
                          <SelectItem value='medium'>Medium (Balanced)</SelectItem>
                          <SelectItem value='high'>High (Best)</SelectItem>
                          <SelectItem value='auto'>Auto (System Choice)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className='p-3 bg-destructive/10 text-destructive rounded-md text-sm'>
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
                  {isGenerating ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className='h-4 w-4 mr-2' />
                      Generate Image
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
