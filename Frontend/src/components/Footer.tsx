import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const footerLinks = {
  programs: [
    { label: 'Little Dragons', href: '#classes' },
    { label: 'Junior Karate', href: '#classes' },
    { label: 'Adult Karate', href: '#classes' },
    { label: 'Competition Team', href: '#classes' },
    { label: 'Self-Defense', href: '#classes' },
  ],
  about: [
    { label: 'Our Philosophy', href: '#about' },
    { label: 'Instructors', href: '#instructors' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Schedule', href: '#schedule' },
  ],
  support: [
    { label: 'Contact Us', href: '#contact' },
    { label: 'FAQs', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/share/1KWqzr53HR/', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/abhishekmartialartsacademy26?utm_source=qr&igsh=eGx0cjd3N2pxNjAw', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/@abhishekmartialartsandsportsac?si=zDNOIwQSF5S24dh4', label: 'YouTube' },
 
];

export const Footer = () => {
  const scrollToSection = (href: string) => {
    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-background border-t border-border">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-crimson">
               
               <img src="../public/logo-amsa.jpg" alt="" className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-crimson group-hover:scale-110 transition-transform duration-300"/>

              </div>
                

              <div>
                <span className="font-display text-2xl text-foreground tracking-wider">ABHISHEK MARTIAL ARTS </span>
                <span className="font-display text-2xl text-primary tracking-wider ml-2">and SPORTS ACADEMY</span>
              </div>
            </div>
            <p className="font-body text-muted-foreground mb-6 max-w-sm">
              Empowering warriors since 2022. Join us on the path to self-mastery through 
              traditional  Karate Lathi Nunchaku and Sports.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Programs</h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-foreground mb-4">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-muted-foreground">
              © {new Date().getFullYear()} AMAASA Dojo. All rights reserved.
            </p>
            <p className="font-body text-sm text-muted-foreground">
              <span className="text-primary">OSS</span> — The Way of Respect
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
