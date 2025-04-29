'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Image,
  PlusCircle,
  MessageCircle,
  Wand,
  Zap,
  Heart,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data for community generated images
  const feedImages = [
    {
      id: 1,
      prompt: 'A cyberpunk city street at night with neon signs and flying cars',
      creator: 'techartist42',
      likes: 247,
      comments: 14,
      date: '2024-07-12',
      tags: ['cyberpunk', 'scifi', 'city'],
    },
    {
      id: 2,
      prompt: 'Underwater city with bioluminescent architecture and merfolk swimming about',
      creator: 'oceandreamer',
      likes: 189,
      comments: 7,
      date: '2024-07-11',
      tags: ['underwater', 'fantasy', 'city'],
    },
    {
      id: 3,
      prompt: 'Space station orbiting a gas giant with rings at sunset',
      creator: 'stargazer',
      likes: 312,
      comments: 21,
      date: '2024-07-10',
      tags: ['space', 'scifi', 'planet'],
    },
    {
      id: 4,
      prompt: 'A magical library with floating books and glowing runes',
      creator: 'bookworm99',
      likes: 176,
      comments: 9,
      date: '2024-07-09',
      tags: ['fantasy', 'magic', 'library'],
    },
    {
      id: 5,
      prompt: 'Dragon soaring above mountain peaks at dawn',
      creator: 'dragonrider',
      likes: 256,
      comments: 18,
      date: '2024-07-08',
      tags: ['fantasy', 'dragon', 'mountains'],
    },
    {
      id: 6,
      prompt: 'Futuristic samurai in neon-lit Japanese garden',
      creator: 'neosamurai',
      likes: 224,
      comments: 12,
      date: '2024-07-07',
      tags: ['cyberpunk', 'samurai', 'japan'],
    },
  ];

  // Filter images based on search term
  const filteredImages = feedImages.filter(
    image =>
      image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      image.creator.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='flex h-14 sticky top-0 z-10 items-center border-b bg-background px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 h-5' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className='flex-1 p-6'>
        <h1 className='text-3xl font-bold mb-8'>Welcome to GPT Image Generator</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Generate Image Card */}
          <Link href='/generate' className='group cursor-pointer'>
            <div className='border rounded-lg p-6 h-full transition-all hover:border-primary hover:shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='p-2 rounded-full bg-primary/10 text-primary'>
                  <Wand className='h-5 w-5' />
                </div>
                <PlusCircle className='h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
              <h2 className='font-semibold text-xl mb-2'>Generate Image</h2>
              <p className='text-muted-foreground text-sm'>
                Create new images using AI. Describe what you want to see and let the AI bring it to
                life.
              </p>
            </div>
          </Link>

          {/* My Images Card */}
          <Link href='/results' className='group cursor-pointer'>
            <div className='border rounded-lg p-6 h-full transition-all hover:border-primary hover:shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='p-2 rounded-full bg-primary/10 text-primary'>
                  <Image className='h-5 w-5' />
                </div>
                <PlusCircle className='h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
              <h2 className='font-semibold text-xl mb-2'>My Images</h2>
              <p className='text-muted-foreground text-sm'>
                Browse, manage, and share all your previously generated images.
              </p>
            </div>
          </Link>

          {/* Prompt Helper Card */}
          <Link href='/prompt-helper' className='group cursor-pointer'>
            <div className='border rounded-lg p-6 h-full transition-all hover:border-primary hover:shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='p-2 rounded-full bg-primary/10 text-primary'>
                  <Zap className='h-5 w-5' />
                </div>
                <PlusCircle className='h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
              <h2 className='font-semibold text-xl mb-2'>Prompt Helper</h2>
              <p className='text-muted-foreground text-sm'>
                Get assistance crafting the perfect prompt to create your desired images.
              </p>
            </div>
          </Link>

          {/* Quick Generation Card */}
          <div className='border rounded-lg p-6 h-full'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-2 rounded-full bg-primary/10 text-primary'>
                <MessageCircle className='h-5 w-5' />
              </div>
            </div>
            <h2 className='font-semibold text-xl mb-2'>Quick Prompt</h2>
            <textarea
              className='w-full p-2 border rounded-md text-sm min-h-[80px] resize-none mb-2'
              placeholder='Enter a quick prompt to generate an image...'></textarea>
            <Button className='w-full'>Generate</Button>
          </div>
        </div>

        <div className='mt-12 mb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
            <h2 className='text-2xl font-bold'>Recently Generated Images</h2>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search images...'
                  className='pl-8 w-[250px]'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant='outline' size='icon' aria-label='Filter images'>
                <Filter className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <Tabs defaultValue='trending'>
            <TabsList className='mb-6'>
              <TabsTrigger value='trending'>Trending</TabsTrigger>
              <TabsTrigger value='latest'>Latest</TabsTrigger>
              <TabsTrigger value='following'>Following</TabsTrigger>
            </TabsList>

            <TabsContent value='trending'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredImages.length > 0 ? (
                  filteredImages.map(image => (
                    <Card key={image.id} className='overflow-hidden h-full'>
                      <div className='aspect-square bg-muted/50 flex items-center justify-center'>
                        {/* Placeholder for image */}
                        <div className='text-muted-foreground'>Image {image.id}</div>
                      </div>
                      <div className='p-3'>
                        <div className='flex items-center justify-between mb-2'>
                          <div className='font-medium text-sm'>@{image.creator}</div>
                          <div className='text-xs text-muted-foreground'>{image.date}</div>
                        </div>
                        <p className='text-xs mb-2 line-clamp-2'>{image.prompt}</p>
                        <div className='flex flex-wrap gap-1 mb-2'>
                          {image.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant='secondary' className='text-xs'>
                              #{tag}
                            </Badge>
                          ))}
                          {image.tags.length > 2 && (
                            <Badge variant='secondary' className='text-xs'>
                              +{image.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className='flex justify-between items-center pt-2 border-t text-xs'>
                          <div className='flex gap-3'>
                            <button
                              className='flex items-center gap-1 text-muted-foreground hover:text-primary'
                              aria-label={`Like image, current likes: ${image.likes}`}>
                              <Heart className='h-3 w-3' />
                              <span>{image.likes}</span>
                            </button>
                            <button
                              className='flex items-center gap-1 text-muted-foreground hover:text-primary'
                              aria-label={`View comments, current comments: ${image.comments}`}>
                              <MessageCircle className='h-3 w-3' />
                              <span>{image.comments}</span>
                            </button>
                          </div>
                          <button
                            className='text-muted-foreground hover:text-primary'
                            aria-label='Download image'>
                            <Download className='h-3 w-3' />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className='col-span-full flex items-center justify-center h-40 text-muted-foreground'>
                    No images found matching your search criteria
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value='latest'>
              <div className='flex items-center justify-center h-40 text-muted-foreground'>
                Latest images will appear here
              </div>
            </TabsContent>

            <TabsContent value='following'>
              <div className='flex items-center justify-center h-40 text-muted-foreground'>
                Images from creators you follow will appear here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
