import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';

const galleryItems = [
  {
    type: 'image',
    title: 'Training Session',
    category: 'Training',
    src: '/Tranning Session.jpeg'
  },
   {
    type: 'image',
    title: 'Training Session',
    category: 'Training',
    src: '/tra1.jpeg'
  },
   {
    type: 'image',
    title: 'Training Session',
    category: 'Training',
    src: '/tra2.jpeg'
  },
   {
    type: 'image',
    title: 'Training Session',
    category: 'Training',
    src: '/tra3.jpeg'
  },
    {
    type: 'image',
    title: 'Training Session',
    category: 'Training',
    src: '/sparring.jpeg'
  },
  {
    type: 'image',
    title: 'Self Defence Program for womens ',
    category: 'Events',
    src: 'e3.jpeg'
  },
   
   {
    type: 'image',
    title: 'Belt Ceremony',
    category: 'Student of the Month',
    src: 'e4.jpeg'
  },
   {
    type: 'image',
    title: 'Marathon',
    category: 'Events',
    src: 'e6.jpeg'
  },
   {
    type: 'image',
    title: 'Award Ceremony for National Champions',
    category: 'Events',
    src: 'e8.jpeg'
  },
  {
    type: 'image',
    title: 'Won 100+ Medals in National Championship',
    category: 'Competition',
    src: '/victory-2.jpeg'
  },
   {
    type: 'image',
    title: 'Our Team and Victory',
    category: 'Competition',
    src: '/c2.jpeg'
  },
   {
    type: 'image',
    title: 'Won 86+ Medals in National Championship',
    category: 'Competition',
    src: '/c3.jpeg'
  },
   {
    type: 'image',
    title: 'Won 1st Runner up Trophy',
    category: 'Competition',
    src: '/c4.jpeg'
  },
   {
    type: 'image',
    title: 'Won 60+ Medals in District Championship',
    category: 'Competition',
    src: '/c5.jpeg'
  },


  {
    type: 'image',
    title: 'Sensei Demonstration',
    category: 'Training',
    src: '/Sensei Demonstration.jpeg'
  },
    {
    type: 'image',
    title: ' Class',
    category: 'Youth',
    src: '/y2.jpg'
  },
   {
    type: 'image',
    title: ' Class',
    category: 'Youth',
    src: '/y1.jpg'
  },
   {
    type: 'image',
    title: ' Class',
    category: 'Youth',
    src: '/y3.jpg'
  },
  
 
];

const categories = ['All', 'Training', 'Events', 'Competition', 'Youth'];

export const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;
    const newIndex =
      direction === 'prev'
        ? (selectedIndex - 1 + filteredItems.length) % filteredItems.length
        : (selectedIndex + 1) % filteredItems.length;
    setSelectedIndex(newIndex);
  };

  return (
    <section id="gallery" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-[0.3em] text-primary block mb-4">
            Gallery
          </span>
          <h2 className="text-5xl font-bold text-foreground mb-6">
            WITNESS THE <span className="text-primary">JOURNEY</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full uppercase text-sm transition ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-card border text-muted-foreground hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border group"
            >
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Play className="text-white ml-1" />
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                <p className="text-white text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-300">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white">
              <X size={32} />
            </button>

            <button onClick={() => navigate('prev')} className="absolute left-6 text-white">
              <ChevronLeft size={48} />
            </button>

            <button onClick={() => navigate('next')} className="absolute right-6 text-white">
              <ChevronRight size={48} />
            </button>

            <div className="max-w-4xl w-full aspect-video bg-black rounded-xl overflow-hidden">
              {filteredItems[selectedIndex].type === 'image' ? (
                <img
                  src={filteredItems[selectedIndex].src}
                  alt={filteredItems[selectedIndex].title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={filteredItems[selectedIndex].src}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
