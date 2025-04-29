'use client';

import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Download,
  EllipsisVertical,
  Expand,
  FolderOpen,
  Loader2,
  Search,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ImageFile {
  filename: string;
  url: string;
  timestamp: number;
}

export default function ResultsPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch image files from the results directory
  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const response = await fetch('/api/images');

        if (response.ok) {
          const data = await response.json();
          setImages(data.images || []);
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
              <BreadcrumbPage>My Generated Images</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className='flex-1 p-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
            <h1 className='text-3xl font-bold'>My Generated Images</h1>
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
              <Link href='/generate'>
                <Button>Generate New Image</Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <Loader2 className='h-10 w-10 animate-spin text-muted-foreground' />
              <p className='mt-4 text-muted-foreground'>Loading your images...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              {searchTerm ? (
                <>
                  <p className='text-xl font-medium'>No matching images found</p>
                  <p className='mt-2 text-muted-foreground'>Try a different search term</p>
                </>
              ) : (
                <>
                  <p className='text-xl font-medium'>You haven't generated any images yet</p>
                  <p className='mt-2 text-muted-foreground'>
                    Create your first image to get started
                  </p>
                  <Link href='/generate' className='mt-6'>
                    <Button>Generate Your First Image</Button>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredImages.map(image => (
                <Card key={image.filename} className='overflow-hidden'>
                  <div className='relative group'>
                    <div className='aspect-square relative'>
                      <Image
                        src={image.url}
                        alt={`Generated image ${image.filename}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <a href={image.url} target='_blank' rel='noopener noreferrer'>
                        <Button
                          variant='secondary'
                          size='icon'
                          className='mr-2'
                          aria-label='View full size'>
                          <Expand className='h-4 w-4' />
                        </Button>
                      </a>
                      <a href={image.url} download>
                        <Button
                          variant='secondary'
                          size='icon'
                          className='mr-2'
                          aria-label='Download image'>
                          <Download className='h-4 w-4' />
                        </Button>
                      </a>
                      <Button variant='secondary' size='icon' aria-label='Share image'>
                        <Share2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <CardContent className='p-4'>
                    <p className='line-clamp-2 text-sm'>{image.filename}</p>
                  </CardContent>
                  <CardFooter className='px-4 py-3 flex justify-between border-t bg-muted/10'>
                    <span className='text-xs text-muted-foreground'>
                      {new Date(image.timestamp).toLocaleDateString()}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <EllipsisVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                          <a href={image.url} target='_blank' rel='noopener noreferrer'>
                            View Full Size
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={image.url} download>
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem className='text-destructive'>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
