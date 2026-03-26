import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'KAVYA VERMA',
    role: 'Parent',
    content: "AMAASA Dojo has transformed my son's life. He was shy and struggled with focus, but after just six months, he's become confident, disciplined, and excels both in the dojo and at school. The senseis truly care about each student.",
    rating: 5,
    years: '2 years',
  },
  {
    name: 'DIKSHA PATIL',
    role: 'Adult Student - Brown Belt',
    content: "I started training at 35, thinking I was too old to begin martial arts. Sensei Tanaka proved me wrong. The adult program is challenging yet accessible, and the community here is incredibly supportive. Best decision I've ever made.",
    rating: 5,
    years: '4 years',
  },
  {
    name: 'SAUMYA ',
    role: 'Competition Team Member',
    content: "Training with the competition team has taken my karate to levels I never imagined. I've competed nationally and even internationally, all thanks to the elite coaching and rigorous training at Dragon Dojo.",
    rating: 5,
    years: '6 years',
  },
  {
    name: 'ASHUTOSH TRIPATHY',
    role: 'Adult Student - Black Belt',
    content: "Earning my black belt at Dragon Dojo was the proudest achievement of my life. The journey taught me that with persistence and proper guidance, anything is possible. The dojo has become my second family.",
    rating: 5,
    years: '7 years',
  },
  {
    name: 'RAJSHREE VERMA',
    role: 'Parent of Two',
    content: "Both my children train here, and the family atmosphere is what keeps us coming back. The values they learn—respect, discipline, perseverance—have made them better students and better people.",
    rating: 5,
    years: '3 years',
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const navigate = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      direction === 'prev' 
        ? (prev - 1 + testimonials.length) % testimonials.length
        : (prev + 1) % testimonials.length
    );
  };

  return (
    <section id="testimonials" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <span className="font-display text-[40rem] text-foreground select-none">信</span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 block">
            Testimonials
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            VOICES OF OUR <span className="text-gradient-gold">WARRIORS</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto" />
        </div>

        {/* Main testimonial carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card rounded-2xl p-8 md:p-12 border border-border shadow-elegant">
            {/* Quote icon */}
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-crimson">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={() => navigate('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>

            {/* Testimonial content */}
            <div className="text-center px-8 md:px-12">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-body text-lg md:text-xl text-foreground leading-relaxed mb-8 min-h-[120px]">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Author */}
              <div>
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="font-display text-2xl text-primary">
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>
                <h4 className="font-display text-xl text-foreground">{testimonials[currentIndex].name}</h4>
                <p className="font-body text-primary text-sm">{testimonials[currentIndex].role}</p>
                <p className="font-body text-muted-foreground text-xs mt-1">
                  Training for {testimonials[currentIndex].years}
                </p>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className={`bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300 ${
                index === currentIndex % 3 ? 'opacity-50' : ''
              }`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="font-display text-sm text-primary">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-body text-sm text-foreground font-medium">{testimonial.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
