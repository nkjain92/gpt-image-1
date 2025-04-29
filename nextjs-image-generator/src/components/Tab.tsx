'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabProps {
  href: string;
  label: string;
  active?: boolean;
}

function Tab({ href, label, active }: TabProps) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-md text-sm font-medium ${
        active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}>
      {label}
    </Link>
  );
}

export default function Tabs() {
  const pathname = usePathname();

  return (
    <div className='flex gap-2 p-4 border-b'>
      <Tab href='/' label='Generate' active={pathname === '/' || pathname === '/generate'} />
      <Tab href='/results' label='Results' active={pathname === '/results'} />
      <Tab href='/uploads' label='Upload' active={pathname === '/uploads'} />
    </div>
  );
}
