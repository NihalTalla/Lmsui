import React from 'react';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, Search, Settings, LogOut, Code2, Home, BookOpen, FileCode, MessageSquare, Award, Users, BarChart3, Calendar } from 'lucide-react';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const getNavItems = () => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'courses', label: 'Courses', icon: BookOpen },
    ];

    if (currentUser.role === 'student') {
      return [
        ...common,
        { id: 'problems', label: 'Problems', icon: FileCode },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'messages', label: 'Q&A', icon: MessageSquare },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
      ];
    } else if (currentUser.role === 'faculty') {
      return [
        ...common,
        { id: 'batches', label: 'Batches', icon: Users },
        { id: 'grading', label: 'Grading Queue', icon: FileCode },
        { id: 'messages', label: 'Q&A', icon: MessageSquare },
      ];
    } else {
      return [
        ...common,
        { id: 'users', label: 'Users', icon: Users },
        { id: 'batches', label: 'Batches', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Code2 className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
              <span className="font-bold text-xl">Codify LMS</span>
              <div 
                className="px-2 py-1 rounded text-xs capitalize"
                style={{
                  backgroundColor: currentUser.role === 'student' 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : currentUser.role === 'faculty'
                    ? 'rgba(20, 184, 166, 0.1)'
                    : 'rgba(124, 58, 237, 0.1)',
                  color: currentUser.role === 'student'
                    ? 'var(--color-accent)'
                    : currentUser.role === 'faculty'
                    ? 'var(--color-secondary)'
                    : 'var(--color-primary)',
                }}
              >
                {currentUser.role}
              </div>
            </div>
            
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search courses, problems, or users..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <div>{currentUser.name}</div>
                    <div className="text-sm text-neutral-400">{currentUser.email}</div>
                    <div className="text-xs mt-1 px-2 py-0.5 rounded-full bg-neutral-100 inline-block capitalize">
                      {currentUser.role}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate('profile')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  logout();
                  toast.success('Logged out successfully');
                }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-neutral-200">
          <nav className="p-4 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                  style={isActive ? { backgroundColor: 'var(--color-primary)' } : {}}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}