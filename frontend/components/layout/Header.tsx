'use client';

import Image from 'next/image';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 lg:px-6 transition-colors">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium overflow-hidden ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700 transition-all">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="Avatar"
              width={36}
              height={36}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase() || 'G'
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}