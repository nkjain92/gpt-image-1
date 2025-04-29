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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyIcon, LightbulbIcon, MessageSquare, RefreshCcw, Wand2 } from 'lucide-react';

export default function PromptHelperPage() {
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
              <BreadcrumbPage>Image Prompt Helper</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className='flex-1 p-6'>
        <div className='max-w-5xl mx-auto'>
          <h1 className='text-3xl font-bold mb-6'>Image Prompt Helper</h1>

          <p className='text-muted-foreground mb-8'>
            Struggling with creating the perfect prompt? Let our AI assist you in crafting detailed
            and effective prompts for image generation.
          </p>

          <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
            <div className='lg:col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Your Initial Idea</CardTitle>
                  <CardDescription>Tell us what kind of image you have in mind</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-2'>
                    <Textarea
                      placeholder="E.g., 'a fantasy forest' or 'cyberpunk city'"
                      className='min-h-32 resize-none'
                    />
                    <p className='text-xs text-muted-foreground'>
                      It's okay to start simple! Our AI will help expand your idea.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-sm font-medium'>Image Style</p>
                    <div className='flex flex-wrap gap-2'>
                      {[
                        'Photorealistic',
                        'Digital Art',
                        'Anime',
                        'Oil Painting',
                        '3D Render',
                        'Sketch',
                      ].map(style => (
                        <Badge
                          key={style}
                          variant='outline'
                          className='cursor-pointer hover:bg-primary/10'>
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-sm font-medium'>Mood/Atmosphere</p>
                    <div className='flex flex-wrap gap-2'>
                      {['Bright', 'Dark', 'Dreamy', 'Ethereal', 'Dramatic', 'Peaceful'].map(
                        mood => (
                          <Badge
                            key={mood}
                            variant='outline'
                            className='cursor-pointer hover:bg-primary/10'>
                            {mood}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>
                    <LightbulbIcon className='h-4 w-4 mr-2' />
                    Generate Suggestions
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className='lg:col-span-3'>
              <Card className='h-full'>
                <CardHeader>
                  <CardTitle>AI-Enhanced Prompts</CardTitle>
                  <CardDescription>
                    Select one of the generated prompts or refine them further
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1'>
                  <Tabs defaultValue='generated'>
                    <TabsList className='mb-4'>
                      <TabsTrigger value='generated'>Generated</TabsTrigger>
                      <TabsTrigger value='history'>History</TabsTrigger>
                      <TabsTrigger value='favorites'>Favorites</TabsTrigger>
                    </TabsList>

                    <TabsContent value='generated' className='space-y-4'>
                      {/* Sample generated prompts */}
                      {[1, 2, 3].map(idx => (
                        <div
                          key={idx}
                          className='p-4 border rounded-lg relative hover:border-primary/50 hover:bg-muted/20 transition-colors'>
                          <p className='text-sm mb-3'>
                            {idx === 1 &&
                              'A mystical enchanted forest at dusk, with ancient trees covered in luminescent moss and mushrooms. Tiny fairies with glowing wings float among the foliage, creating a magical atmosphere with beams of golden light filtering through the canopy.'}
                            {idx === 2 &&
                              'An otherworldly forest glen with twisted, ancient trees that reach towards a star-filled twilight sky. Crystal-clear ponds reflect the light of a large crescent moon. Magic dust particles float in the air, illuminating a hidden stone archway covered in mysterious runes and overgrown with bioluminescent vines.'}
                            {idx === 3 &&
                              'A deep forest bathed in ethereal blue moonlight, with towering trees bearing leaves of silver and gold. A hidden pathway winds through the mist, leading to a small clearing where a circle of standing stones emits a subtle magical glow. Fireflies dance around the scene, and ghostly spirit animals observe from the shadows.'}
                          </p>
                          <div className='flex flex-wrap gap-2 mb-3'>
                            <Badge variant='secondary' className='text-xs'>
                              enchanted forest
                            </Badge>
                            <Badge variant='secondary' className='text-xs'>
                              magic
                            </Badge>
                            <Badge variant='secondary' className='text-xs'>
                              fantasy
                            </Badge>
                            <Badge variant='secondary' className='text-xs'>
                              ethereal
                            </Badge>
                          </div>
                          <div className='flex justify-between items-center'>
                            <Button variant='outline' size='sm'>
                              <Wand2 className='h-3.5 w-3.5 mr-1.5' />
                              Use This
                            </Button>
                            <div className='flex gap-1'>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <CopyIcon className='h-4 w-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <MessageSquare className='h-4 w-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <RefreshCcw className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value='history'>
                      <div className='flex items-center justify-center h-32 text-muted-foreground'>
                        Your prompt history will appear here
                      </div>
                    </TabsContent>

                    <TabsContent value='favorites'>
                      <div className='flex items-center justify-center h-32 text-muted-foreground'>
                        Your favorite prompts will appear here
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
