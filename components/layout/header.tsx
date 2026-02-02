'use client'
import { useState } from "react";
import Link from "next/link";
import { IoPricetags } from "react-icons/io5";
import { link } from "fs/promises";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { href: "/", label: "Home" },    
    { href: "/about", label: "About" },
  ];

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-inherit no-underline">
          <IoPricetags color={'var(--primary)'}/>
          <span className="font-semibold text-lg">Game Deals</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 list-none m-0 p-0 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-sky-600">{link.label}</Link>
              </li>
            ))}            
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {/* Simple hamburger icon */}
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-800 absolute top-16 bg-background border-b z-10 w-full">
          <ul className="flex flex-col gap-4 p-4 text-sm">            
            {links.map((link) => (
              <li key={link.href} className="hover:text-sky-600">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}