import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { Zap, Coins } from 'lucide-react';

interface HeaderProps {
  points: number;
}

export const Header: React.FC<HeaderProps> = ({ points }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            AutoPoints
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="font-mono font-medium text-slate-200">{points} PTS</span>
          </div>
          <TonConnectButton />
        </div>
      </div>
      
      {/* Mobile points display */}
      <div className="md:hidden bg-slate-900/50 border-b border-slate-800 py-2 px-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="font-mono font-medium text-slate-200">{points} Points Available</span>
        </div>
      </div>
    </header>
  );
};