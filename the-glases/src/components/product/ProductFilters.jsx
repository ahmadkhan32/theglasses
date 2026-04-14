import React from 'react';
import { CATEGORIES } from '../../utils/constants';
import { Search, Filter, X } from 'lucide-react';

const ProductFilters = ({ selected, onSelect, search, onSearch }) => {
    return (
        <div className="flex flex-col md:flex-row flex-wrap gap-6 items-center mb-16 relative z-20">
            {/* Search Input Bar */}
            <div className="relative flex-1 w-full md:min-w-[300px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search premium glasses..."
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-border bg-white shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-dark font-medium placeholder:text-light/60"
                />
                {search && (
                    <button 
                        onClick={() => onSearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-light hover:text-dark transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <div className="hidden lg:flex items-center gap-2 mr-2 text-light text-xs font-bold uppercase tracking-widest">
                    <Filter size={14} />
                    Filters:
                </div>
                {CATEGORIES.map((cat) => {
                    const isActive = selected === cat.value;
                    return (
                        <button
                            key={cat.value}
                            onClick={() => onSelect(cat.value)}
                            className={`
                                flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border
                                ${isActive 
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-blue-500/20' 
                                    : 'bg-white text-dark/70 border-border hover:border-primary/50 hover:bg-primary/5'}
                            `}
                        >
                            {cat.label}
                            {isActive && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductFilters;
