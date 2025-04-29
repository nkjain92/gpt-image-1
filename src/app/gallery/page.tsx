'use client';

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
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Heart, MessageSquare, Download, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GalleryPage() {
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
              <BreadcrumbPage>Image Feed</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className='flex-1 p-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
            <h1 className='text-3xl font-bold'>Community Image Feed</h1>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input type='search' placeholder='Search images...' className='pl-8 w-[250px]' />
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

            <TabsContent value='trending' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {feedImages.map(image => (
                  <Card key={image.id} className='overflow-hidden'>
                    <div className='aspect-square bg-muted/50 flex items-center justify-center'>
                      {/* Placeholder for image */}
                      <div className='text-muted-foreground'>Image {image.id}</div>
                    </div>
                    <div className='p-4'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='font-medium'>@{image.creator}</div>
                        <div className='text-xs text-muted-foreground'>{image.date}</div>
                      </div>
                      <p className='text-sm mb-3 line-clamp-2'>{image.prompt}</p>
                      <div className='flex flex-wrap gap-1 mb-3'>
                        {image.tags.map(tag => (
                          <Badge key={tag} variant='secondary' className='text-xs'>
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className='flex justify-between items-center pt-2 border-t'>
                        <div className='flex gap-3'>
                          <button
                            className='flex items-center gap-1 text-muted-foreground hover:text-primary'
                            aria-label={`Like image, current likes: ${image.likes}`}>
                            <Heart className='h-4 w-4' />
                            <span className='text-xs'>{image.likes}</span>
                          </button>
                          <button
                            className='flex items-center gap-1 text-muted-foreground hover:text-primary'
                            aria-label={`View comments, current comments: ${image.comments}`}>
                            <MessageSquare className='h-4 w-4' />
                            <span className='text-xs'>{image.comments}</span>
                          </button>
                        </div>
                        <button
                          className='text-muted-foreground hover:text-primary'
                          aria-label='Download image'>
                          <Download className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
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
