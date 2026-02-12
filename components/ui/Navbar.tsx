import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  children?: React.ReactNode;
  className?: string;
}

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ children, className = '' }) => {
  return (
    <nav className={`surface border-b ${className}`} style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {children}
        </div>
      </div>
    </nav>
  );
};

export const NavbarItem: React.FC<NavbarItemProps> = ({ href, children, active = false, className = '' }) => {
  return (
    <Link
      href={href}
      className={`text-primary hover:opacity-80 transition-colors ${active ? 'font-semibold' : ''} ${className}`}
      style={{ color: active ? 'var(--accent)' : undefined }}
    >
      {children}
    </Link>
  );
};
