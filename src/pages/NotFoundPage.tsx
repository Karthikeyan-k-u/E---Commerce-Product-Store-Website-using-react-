import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, Sparkles } from 'lucide-react';
import { FloatingElement } from '../components/motion/FloatingElement';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <FloatingElement duration={6} distance={12} className="inline-block">
          <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-glow mx-auto">
            <Compass className="w-12 h-12 animate-spin-slow" />
          </div>
        </FloatingElement>

        <div className="space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-bold">
            404 • Gravity Defied
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary font-display tracking-tight">
            Lost in Cosmic Orbit
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            The page or product coordinates you navigated to do not exist in this gravitational zone.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="primary" onClick={() => navigate('/')} leftIcon={<Home className="w-4 h-4" />}>
            Return Home
          </Button>
          <Button variant="outline" onClick={() => navigate('/shop')}>
            Browse Catalog
          </Button>
        </div>
      </div>
    </div>
  );
};
