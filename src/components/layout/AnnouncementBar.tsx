import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="relative z-40 bg-[#0F172A] border-b border-slate-800 py-2 px-4 text-center text-xs font-medium text-slate-300 overflow-hidden">
      <div className="relative flex items-center justify-center gap-2.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4F46E5]/20 text-indigo-300 text-[10px] font-semibold tracking-wide uppercase border border-[#4F46E5]/40">
          <Sparkles className="w-3 h-3 text-[#10B981]" />
          Special Offer
        </span>
        <span className="text-slate-300 text-xs">
          Free Express Delivery on orders above ₹999 • Use code <strong className="text-white font-bold tracking-wide">WLMART10</strong> for 10% off
        </span>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline-offset-4 hover:underline ml-1 text-xs"
        >
          Shop Now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
