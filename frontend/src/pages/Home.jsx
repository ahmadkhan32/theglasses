import React, { useEffect } from 'react';
import Hero from '../components/sections/Hero';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import Categories from '../components/sections/Categories';
import OffersBanner from '../components/sections/OffersBanner';
import Testimonials from '../components/sections/Testimonials';
import Newsletter from '../components/sections/Newsletter';
import initScrollReveal from '../animations/scrollReveal';

const Home = () => {
  useEffect(() => {
    initScrollReveal();
  }, []);

  return (
    <>
      <Hero />
      <OffersBanner />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
