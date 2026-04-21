import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";

const images = [
  "/hero1.jpg.jpeg",
  "/hero2.jpeg",
  "/hero3.jpeg",
  "/victory-2.jpg",
  "/e8.jpeg",
  "/c4.jpeg",
];

export const HeroSection = () => {
  const [index, setIndex] = useState(0);

  // 🔄 Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ✅ Social Icons (LEFT SIDE CENTER) */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 text-2xl">

        {/* WhatsApp */}
        <a
          href="https://wa.me/917898764542"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-green-400 transition"
        >
          <FaWhatsapp />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/abhishekmartialartsacademy26?utm_source=qr&igsh=eGx0cjd3N2pxNjAw"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-pink-500 transition"
        >
          <FaInstagram />
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/@AbhishekMartialArtsandSportsAc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-red-500 transition"
        >
          <FaYoutube />
        </a>

      </div>

      {/* 🔥 Background Slider */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${images[index]})`,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Japanese character */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
        <span className="font-display text-[20rem] text-white/5 select-none">
          武
        </span>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary text-sm uppercase tracking-[0.3em] rounded-full mb-8">
              Traditional Karate Lathi Nunchaku Sport • Modern Training
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-6 animate-fade-up">
            MASTER THE ART OF
            <span className="block text-red-500 mt-2">DISCIPLINE</span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-up">
            Abhishek Martial Arts and Sports Academy provide regular class mainly focus on the self Defence and development...
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
            <Button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Your Journey
            </Button>

            <Button variant="heroOutline" onClick={() => document.querySelector('#classes')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Classes
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20 animate-fade-up">
            <div>
              <span className="text-4xl text-red-500">09+</span>
              <p className="text-sm text-gray-400 mt-2">Years Experience</p>
            </div>
            <div>
              <span className="text-4xl text-yellow-400">2000+</span>
              <p className="text-sm text-gray-400 mt-2">Students Trained</p>
            </div>
            <div>
              <span className="text-4xl text-red-500">110+</span>
              <p className="text-sm text-gray-400 mt-2">Championships</p>
            </div>
          </div>

        </div>
      </div>

      {/* ⬅️ Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/50 px-4 py-2 text-white rounded"
      >
        ◀
      </button>

      {/* ➡️ Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/50 px-4 py-2 text-white rounded"
      >
        ▶
      </button>

      {/* 🔘 Dots */}
      <div className="absolute bottom-16 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === index ? "bg-red-500" : "bg-white"
            }`}
          />
        ))}
      </div>

      {/* Scroll arrow */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};