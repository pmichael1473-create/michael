import React, { useState, useEffect } from 'react';
import { useTonConnectUI, useTonWallet, SendTransactionRequest, SendTransactionResponse } from '@tonconnect/ui-react';
import { Header } from './components/Header';
import { PricingCard } from './components/PricingCard';
import { AITool } from './components/AITool';
import { PACKAGES, TREASURY_WALLET_ADDRESS } from './constants';
import { PointPackage } from './types';

const App: React.FC = () => {
  // -- State --
  const [points, setPoints] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // -- TON Hooks --
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  // -- Effects --
  useEffect(() => {
    // Load points from local storage on mount
    const storedPoints = localStorage.getItem('autopoints_balance');
    if (storedPoints) {
      setPoints(parseInt(storedPoints, 10));
    }
  }, []);

  useEffect(() => {
    // Persist points
    localStorage.setItem('autopoints_balance', points.toString());
  }, [points]);

  // -- Handlers --
  
  const deductPoints = (amount: number) => {
    setPoints(prev => Math.max(0, prev - amount));
  };

  const handleBuyPoints = async (pkg: PointPackage) => {
    if (!wallet) {
      setNotification({ type: 'error', message: 'Please connect your wallet first.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsProcessing(true);
    setNotification(null);

    // Convert TON to Nanotons (1 TON = 1,000,000,000 Nanotons)
    // Use Math.round to handle floating point math (e.g., 0.004 * 1e9) correctly
    const amountInNanotons = Math.round(pkg.tonPrice * 1000000000).toString();

    const transaction: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 600, // Valid for 10 minutes
      messages: [
        {
          address: TREASURY_WALLET_ADDRESS,
          amount: amountInNanotons,
          // Optional: payload to identify the package in a real backend
          // payload: "..." 
        },
      ],
    };

    try {
      // Send transaction using TON Connect
      const result: SendTransactionResponse = await tonConnectUI.sendTransaction(transaction);
      
      // IMPORTANT: In a real production app, you NEVER credit points based solely on the frontend promise resolution.
      // You must verify the transaction hash on your backend using TON API/LiteServer.
      // For this frontend-only demo, we optimistically credit points.
      console.log('Transaction successful:', result);
      
      setPoints(prev => prev + pkg.points);
      setNotification({ 
        type: 'success', 
        message: `Successfully purchased ${pkg.points} points! Transaction sent.` 
      });
    } catch (e) {
      console.error('Transaction failed or canceled', e);
      setNotification({ 
        type: 'error', 
        message: 'Transaction canceled or failed. Please try again.' 
      });
    } finally {
      setIsProcessing(false);
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header points={points} />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md animate-fade-in-down
          ${notification.type === 'success' 
            ? 'bg-green-500/10 border-green-500/50 text-green-400' 
            : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}
        >
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
        </div>

        {/* Hero Section */}
        <section className="py-20 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Power your Workflow with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">TON & AI</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Securely purchase generation credits using your TON wallet. Instant delivery. No subscriptions.
          </p>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {PACKAGES.map((pkg) => (
              <PricingCard
                key={pkg.id}
                pkg={pkg}
                onBuy={handleBuyPoints}
                loading={isProcessing}
                disabled={!wallet}
              />
            ))}
          </div>
          {!wallet && (
            <div className="text-center mt-8 text-slate-500 text-sm">
              Connect your TON wallet to view purchasing options.
            </div>
          )}
        </section>

        {/* AI Tool Section */}
        <section className="container mx-auto px-4 mb-24">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">AutoGenerator</h2>
                <p className="text-slate-400">Use your points to generate content powered by Gemini 2.5.</p>
            </div>
            <AITool points={points} deductPoints={deductPoints} />
        </section>
      </main>
      
      <footer className="py-8 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} AutoPoints. Built with React, Tailwind & TON Connect.</p>
      </footer>
    </div>
  );
};

export default App;