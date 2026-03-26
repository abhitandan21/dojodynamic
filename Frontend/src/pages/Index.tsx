import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { InstructorsSection } from '@/components/InstructorsSection';
import { ClassesSection } from '@/components/ClassesSection';
import { ScheduleSection } from '@/components/ScheduleSection';
import { GallerySection } from '@/components/GallerySection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <InstructorsSection />
      <ClassesSection />
      <ScheduleSection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
