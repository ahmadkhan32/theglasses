import React from 'react';
import Hero from '../components/sections/Hero';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import Categories from '../components/sections/Categories';
import OffersBanner from '../components/sections/OffersBanner';
import Testimonials from '../components/sections/Testimonials';
import Newsletter from '../components/sections/Newsletter';
import TryOnOverlay from '../components/animation/TryOnOverlay';

const Home = () => {
    return (
        <main>
            <Hero />
            <FeaturedProducts />
            <Categories />
            <OffersBanner />
            <section id="try-on" style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>
                        🕶️ Try Before You Buy
                    </h2>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <TryOnOverlay />
                    </div>
                </div>
            </section>
            <Testimonials />
            <Newsletter />
        </main>
    );
};

export default Home;
