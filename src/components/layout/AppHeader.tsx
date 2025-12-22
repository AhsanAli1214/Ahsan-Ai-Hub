'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';
import { LogIn, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


export function AppHeader({ title }: { title: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="font-headline text-xl font-semibold md:text-2xl">{title}</h1>
      <div className={cn("ml-auto flex items-center gap-2 md:gap-4", "w-auto")}>
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="flex items-center gap-2">
              <Button variant="ghost" asChild size={isMobile ? 'icon' : 'default'}>
                <Link href="/login">
                  <LogIn className={cn(!isMobile && "mr-2", "h-4 w-4")} />
                  <span className={cn(isMobile && "sr-only")}>Login</span>
                </Link>
              </Button>
              <Button asChild className={cn(isMobile && "hidden")}>
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
