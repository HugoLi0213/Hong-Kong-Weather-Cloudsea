import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  title: string;
  isOnline: boolean;
  lastUpdated?: string;
}

export function Header({ title, isOnline, lastUpdated }: HeaderProps) {
  return (
    <header className="relative flex flex-col items-center py-4">
      <div className="absolute right-4 top-6">
        <ThemeToggle />
      </div>
      <h1 className="text-xl font-bold mb-1">{title}</h1>
      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
        <span className={isOnline ? 'text-green-600' : 'text-red-500'}>
          {isOnline ? '在線' : '離線'}
        </span>
        {lastUpdated && (
          <span>最後更新：{lastUpdated}</span>
        )}
      </div>
    </header>
  );
}
