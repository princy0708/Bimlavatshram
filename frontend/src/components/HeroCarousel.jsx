import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/banners/festive.png',
    title: 'New Arrivals',
    subtitle: 'Festive Collection 2026',
    description: 'Discover our stunning new range of handcrafted Kurtas perfect for every celebration.',
    cta: 'Shop Now',
  },
  {
    image: '/banners/summer.png',
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    description: 'Lightweight cotton Kurtas designed for comfort and style this season.',
    cta: 'Grab the Deal',
  },
  {
    image: '/banners/wedding.png',
    title: 'Wedding Collection',
    subtitle: 'Royal Elegance',
    description: 'Luxurious embroidered Kurtas crafted for your most special moments.',
    cta: 'Explore',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => setCurrent(index);
  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="hero-carousel">
      <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, i) => (
          <div key={i} className="carousel-slide">
            <img src={slide.image} alt={slide.title} />
            <div className="carousel-overlay">
              <p style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                {slide.subtitle}
              </p>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <button className="btn btn-primary" style={{ width: 'fit-content' }}>
                {slide.cta} →
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-arrow prev" onClick={prev}>
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-arrow next" onClick={next}>
        <ChevronRight size={24} />
      </button>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
