import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileNav({ isOpen, onOpenChange }: MobileNavProps) {
  return (
    <div className="sticky top-0 z-50 md:hidden">
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="absolute top-4 left-4 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
      >
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}