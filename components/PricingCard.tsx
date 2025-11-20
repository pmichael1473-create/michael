import React from 'react';
import { PointPackage } from '../types';
import { Check, Zap } from 'lucide-react';

interface PricingCardProps {
  pkg: PointPackage;
  onBuy: (pkg: PointPackage) => void;
  loading: boolean;
  disabled: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ pkg, onBuy, loading, disabled }) => {
  return (
    <div className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full
      ${pkg.popular 
        ? 'bg-slate-900/80 border-blue-500 shadow-lg shadow-blue-500/10 scale-105 z-10' 
        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
      }`}>
      
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
          <Zap className="w-3 h-3 mr-1" fill="currentColor" />
          MOST POPULAR
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-medium text-slate-400">{pkg.name}</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-4xl font-bold text-white">{pkg.tonPrice} TON</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">One-time payment</p>
      </div>

      <div className="flex-1 py-4 border-t border-slate-800 border-dashed mb-6">
        <div className="flex items-center text-slate-300 mb-2">
          <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mr-3">
            <Check className="w-3 h-3" />
          </div>
          <span className="font-bold text-white text-lg">{pkg.points} Points</span>
        </div>
        <div className="flex items-center text-slate-400 text-sm">
          <div className="w-5 h-5 mr-3" />
          <span>Instant Delivery</span>
        </div>
        <div className="flex items-center text-slate-400 text-sm mt-2">
          <div className="w-5 h-5 mr-3" />
          <span>Powered by TON</span>
        </div>
      </div>

      <button
        onClick={() => onBuy(pkg)}
        disabled={disabled || loading}
        className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center
          ${disabled 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : pkg.popular
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40'
              : 'bg-white text-slate-900 hover:bg-slate-100'
          }
        `}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
        ) : (
          `Purchase for ${pkg.tonPrice} TON`
        )}
      </button>
    </div>
  );
};