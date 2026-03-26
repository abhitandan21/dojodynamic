import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

export const HeroSection = () => {
  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pattern-overlay overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Japanese character decoration */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
        <span className="font-display text-[20rem] text-foreground/5 leading-none select-none">
          武
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtitle */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary font-body text-sm uppercase tracking-[0.3em] rounded-full mb-8">
              Traditional Karate Lathi Nunchaku Sport • Modern Training
            </span>
          </div>

          {/* Main headline */}
          <h1 
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-none mb-6 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            MASTER THE ART OF
            <span className="block text-gradient-crimson mt-2">DISCIPLINE</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="font-body text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
           Abhishek Martial Arts and Sports Academy provide regular class mainly focus on the self Defence and development of the each students, including personality development, character building, fitness and Confidence and sports 
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: '0.6s' }}
          >
            <Button 
              variant="hero"
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Your Journey
            </Button>
            <Button 
              variant="heroOutline"
              onClick={() => {
                const element = document.querySelector('#classes');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Classes
            </Button>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/30 animate-fade-up"
            style={{ animationDelay: '0.8s' }}
          >
            <div>
              <span className="font-display text-4xl sm:text-5xl text-primary">05+</span>
              <p className="font-body text-sm text-muted-foreground mt-2 uppercase tracking-wider">Years Experience</p>
            </div>
            <div>
              <span className="font-display text-4xl sm:text-5xl text-secondary">2000+</span>
              <p className="font-body text-sm text-muted-foreground mt-2 uppercase tracking-wider">Students Trained</p>
            </div>
            <div>
              <span className="font-display text-4xl sm:text-5xl text-primary">110+</span>
              <p className="font-body text-sm text-muted-foreground mt-2 uppercase tracking-wider">Championships</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors duration-300 animate-float"
        aria-label="Scroll to about section"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};
