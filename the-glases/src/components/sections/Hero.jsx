import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassesHeroAnimation from '../animation/GlassesHeroAnimation';
import Button from '../ui/Button';
import { scrollFadeInLeft, scrollFadeInRight } from '../../animations/scrollReveal';
import { ShoppingBag, Sparkles, Truck, RotateCcw } from 'lucide-react';

const Hero = () => {
    return (
        <section className="min-h-[90vh] flex items-center bg-soft relative overflow-hidden py-20">
            {/* Background Decorative Elements */}
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
            
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left — Text Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={scrollFadeInLeft}
                        className="relative z-10"
                    >
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20"
                        >
                            <Sparkles size={14} />
                            Premium Eyewear — Pakistan
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] text-dark font-heading">
                            Elevate Your <span className="text-gradient">Vision</span>,<br /> Redefine Your <span className="text-primary">Style.</span>
                        </h1>

                        <p className="text-lg text-light mb-10 max-w-[500px] leading-relaxed font-medium">
                            Discover our curated collection of luxury eyewear. From Blue Light protection to designer Sunglasses, see clearly and look better.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-14">
                            <Link to="/shop">
                                <Button variant="primary" size="lg" className="px-10 h-[60px] rounded-xl text-md shadow-xl shadow-blue-500/20 group">
                                    <span className="flex items-center gap-2">
                                        Explore Collection
                                        <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                                    </span>
                                </Button>
                            </Link>
                            <Button 
                                variant="outline" 
                                size="lg" 
                                className="px-10 h-[60px] rounded-xl text-md border-2 hover:bg-white hover:shadow-lg transition-all"
                                onClick={() => document.getElementById('try-on')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Try On Frames 🕶️
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                            {[
                                { icon: <Truck size={18} />, label: 'Free Delivery', sub: 'Orders over 2k' },
                                { icon: <RotateCcw size={18} />, label: '7-Day Return', sub: 'No questions asked' },
                                { icon: <Sparkles size={18} />, label: '10k+ Joys', sub: 'Happy clients' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-dark font-bold text-sm">
                                        <span className="text-primary">{item.icon}</span>
                                        {item.label}
                                    </div>
                                    <span className="text-[11px] text-light font-bold uppercase tracking-wider">{item.sub}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Animated Visual */}
                    <motion.div 
                        initial="hidden" 
                        animate="visible" 
                        variants={scrollFadeInRight}
                        className="relative"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-radial-glow opacity-40" />
                        <div className="relative z-10 glass rounded-3xl p-4 md:p-8 animate-float">
                            <GlassesHeroAnimation image="/images/hero_glasses.png" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
