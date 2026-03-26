import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#instructors', label: 'Instructors' },
  { href: '#classes', label: 'Classes' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-elegant' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-crimson group-hover:scale-110 transition-transform duration-300">
              {/*<span className="font-display text-2xl text-primary-foreground">龍</span>*/}
              <img src="../public/logo-amsa.jpg" alt="" className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-crimson group-hover:scale-110 transition-transform duration-300"/>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-2xl text-foreground tracking-wider">ABHISHEK</span>
              <span className="font-display text-2xl text-primary tracking-wider ml-2">MARTIAL ARTS and SPORTS ACADEMY</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="font-body text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 animated-underline"
              >
                {link.label}
              </button>
            ))}
            <Button variant="default" size="sm" onClick={() => scrollToSection('#contact')}>
              Join Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-4 bg-card/95 backdrop-blur-md rounded-lg mb-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-4 py-2 font-body text-sm uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-accent transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 pt-2">
              <Button variant="default" className="w-full" onClick={() => scrollToSection('#contact')}>
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
