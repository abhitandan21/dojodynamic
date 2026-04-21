import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from "react-router-dom";

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#instructors', label: 'Instructors' },
  { href: '#classes', label: 'Classes' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [studentOpen, setStudentOpen] = useState(false);
  const [mobileStudentOpen, setMobileStudentOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 pb-10 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-elegant' : 'bg-transparent'
    }`}>
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
              <img src="../public/logo-amsa.jpg" alt="" className="w-12 h-12 rounded-full" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-2xl text-foreground tracking-wider">ABHISHEK</span>
              <span className="font-display text-2xl text-primary tracking-wider ml-2">
                MARTIAL ARTS and SPORTS ACADEMY
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 justify-center">

            {navLinks.map((link) => (
              link.href === "/blog" ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 animated-underline"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="font-body text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 animated-underline"
                >
                  {link.label}
                </button>
              )
            ))}

            {/* ✅ Student Corner (Aligned like Blog) */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setStudentOpen(true)}
              onMouseLeave={() => setStudentOpen(false)}
            >
              <span className="font-body text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 animated-underline cursor-pointer">
                Student Corner ▾
              </span>

              {studentOpen && (
                <div className="absolute top-8 left-0 bg-card shadow-lg rounded-lg p-3 flex flex-col gap-2 min-w-[200px] z-50">

                  <Link to="/students" className="hover:text-primary">Students Details</Link>
                  <Link to="/competition" className="hover:text-primary">Competition Details</Link>
                  <Link to="/lathi" className="hover:text-primary">Lathi</Link>
                  <Link to="/nunchaku" className="hover:text-primary">Nunchaku</Link>
                  <Link to="/help" className="hover:text-primary">Help Desk</Link>

                </div>
              )}
            </div>

            {!user ? (
              <Button size="sm" onClick={() => (window.location.href = "/login")}>
                Login
              </Button>
            ) : (
              <>
                {user.role === "admin" ? (
                  <Button size="sm" onClick={() => (window.location.href = "/admin")}>
                    Admin Panel
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => (window.location.href = "/dashboard")}>
                    Dashboard
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-foreground p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 bg-card/95 backdrop-blur-md rounded-lg mb-4">

            {navLinks.map((link) => (
              link.href === "/blog" ? (
                <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-2 text-muted-foreground">
                  {link.label}
                </Link>
              ) : (
                <button key={link.href} onClick={() => scrollToSection(link.href)}
                  className="block w-full px-4 py-2 text-muted-foreground">
                  {link.label}
                </button>
              )
            ))}

            {/* ✅ Mobile Student Corner FIX */}
            <div className="px-4 py-2 text-muted-foreground">
              <button
                onClick={() => setMobileStudentOpen(!mobileStudentOpen)}
                className="w-full text-left font-semibold"
              >
                Student Corner ▾
              </button>

              {mobileStudentOpen && (
                <div className="ml-3 mt-2 flex flex-col gap-2">
                  <Link to="/students" onClick={() => setIsOpen(false)}>Students Details</Link>
                  <Link to="/competition" onClick={() => setIsOpen(false)}>Competition Details</Link>
                  <Link to="/lathi" onClick={() => setIsOpen(false)}>Lathi</Link>
                  <Link to="/nunchaku" onClick={() => setIsOpen(false)}>Nunchaku</Link>
                  <Link to="/help" onClick={() => setIsOpen(false)}>Help Desk</Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};