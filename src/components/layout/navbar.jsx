"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  const navLinks = [
    { name: 'Template', href: '/#' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setHasScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav
        className={`w-full sticky top-0 left-0 z-50 py-4 transition-transform duration-300 bg-white font-medium ${
          hasScrolled ? 'shadow-lg' : ''
        } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex-shrink-0"
            aria-label="Go to home"
          >
            <object
              data="/assets/Logo.svg"
              type="image/svg+xml"
              width="150"
              height="80"
              className="h-auto w-[180px]"
              aria-label="Brand Logo"
            >
              <img src="/assets/Logo.svg" alt="Brand Logo" />
            </object>
          </Link>

          <button
            className="lg:hidden text-gray-900 focus:outline-none relative w-6 h-6 z-50 -translate-x-4"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`absolute w-6 h-1 bg-gray-900 transition-all duration-500 ease-in-out ${isOpen ? "rotate-45 top-3" : "top-1"
                }`}
            />
            <span
              className={`absolute w-6 h-1 bg-gray-900 transition-all duration-500 ease-in-out ${isOpen ? "opacity-0" : "top-3"
                }`}
            />
            <span
              className={`absolute w-6 h-1 bg-gray-900 transition-all duration-500 ease-in-out ${isOpen ? "-rotate-45 top-3" : "top-5"
                }`}
            />
          </button>

          <div className="hidden lg:flex items-center justify-center flex-grow gap-5" role="menubar">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-900 text-base font-medium hover:text-gray-600 px-4 py-2 transition-all duration-300 ease-in-out tracking-widest"
                  role="menuitem"
                >
                  {link.name}
                </Link>
            ))}
          </div>

          <div className="hidden lg:block">
              <Link
                className="flex flex-row items-center bg-gray-900 text-white font-semibold transition-all duration-300 tracking-widest text-sm px-8 py-3 rounded-full hover:bg-gray-800 hover:scale-105 hover:shadow-lg"
                aria-label="Call to action"
                href="/#"
              >
                <p>CTA</p>
              </Link>
          </div>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-500 z-30 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={toggleMenu}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        className={`lg:hidden fixed top-0 right-0 w-[80%] h-full bg-white transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          } z-40`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full pt-20 px-6">
          <nav className="flex flex-col space-y-6" role="navigation" aria-label="Mobile menu">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-900 font-medium hover:text-gray-600 px-3 py-2 text-lg transition-all duration-300 ease-in-out tracking-wider"
                onClick={toggleMenu}
                role="menuitem"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto py-6">
              <Link
                href="/#"
                className="flex flex-row items-center w-full bg-gray-900 text-white px-7 py-3 font-semibold hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 tracking-wider rounded-full justify-center"
                onClick={toggleMenu}
              >
                <p>CTA</p>
              </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;