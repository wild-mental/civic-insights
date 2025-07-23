import Link from 'next/link';
import { Newspaper, Twitter, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Newspaper className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-foreground">
              Civic Insights
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Civic Insights. All rights reserved.
            <br />
            Deepening understanding, shaping the future.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
