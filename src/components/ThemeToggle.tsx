import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2.5 hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-primary hover:text-primary/90 transition-colors" />
      ) : (
        <Moon className="h-5 w-5 text-primary hover:text-primary/90 transition-colors" />
      )}
    </button>
  );
}