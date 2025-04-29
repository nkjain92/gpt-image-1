'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { ChevronDown, Home, Image, LayoutGrid, Wand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: {
    title: string;
    href: string;
  }[];
}

export function AppSidebar() {
  const [openSections, setOpenSections] = useState<string[]>(['Community']);

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title],
    );
  };

  const sections: SidebarSection[] = [
    {
      title: 'Home',
      icon: <Home className='h-4 w-4' />,
      items: [
        {
          title: 'Dashboard',
          href: '/',
        },
      ],
    },
    {
      title: 'Community',
      icon: <LayoutGrid className='h-4 w-4' />,
      items: [
        {
          title: 'Gallery',
          href: '/gallery',
        },
      ],
    },
    {
      title: 'Image Generation',
      icon: <Image className='h-4 w-4' />,
      items: [
        {
          title: 'Generate Image',
          href: '/generate',
        },
        {
          title: 'My Generated Images',
          href: '/results',
        },
      ],
    },
    {
      title: 'Tools',
      icon: <Wand className='h-4 w-4' />,
      items: [
        {
          title: 'Image Prompt Helper',
          href: '/prompt-helper',
        },
      ],
    },
  ];

  return (
    <Sidebar>
      <div className='flex h-14 items-center border-b px-4'>
        <Link href='/' className='flex items-center gap-2 font-semibold'>
          <Wand className='h-5 w-5' />
          <span>GPT Image Generator</span>
        </Link>
      </div>
      <SidebarContent>
        <SidebarMenu>
          {sections.map(section => (
            <div key={section.title} className='px-2 py-1'>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted'
                onClick={() => toggleSection(section.title)}>
                <span className='flex items-center gap-2'>
                  {section.icon}
                  <span className='text-sm font-medium'>{section.title}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSections.includes(section.title) ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              {openSections.includes(section.title) && (
                <div className='mt-1 space-y-1 pl-9'>
                  {section.items.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
