import React, { useState } from 'react';
import { PaymentMethodType, CardDetails } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CreditCard, QrCode, Building2, Banknote, ArrowRight, ArrowLeft, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface PaymentStepProps {
  method: PaymentMethodType;
  onMethodChange: (method: PaymentMethodType) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  method,
  onMethodChange,
  onNext,
  onBack,
}) => {
  const [card, setCard] = useState<CardDetails>({
    cardNumber: '•••• •••• •••• 4242',
    cardHolder: 'KARTHIKEYAN K',
    expiryMonth: '12',
    expiryYear: '28',
    cvv: '•••',
  });

  const [upiId, setUpiId] = useState('student@okaxis');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-surface border border-surface-border space-y-5">
      <div className="border-b border-surface-border pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">3. Demo Payment Gateway</h3>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">
            Mock Mode
          </span>
        </div>
        <p className="text-xs text-text-muted mt-0.5">
          Select a simulated payment method. No real bank accounts or funds will be charged.
        </p>
      </div>

      {/* Demo Project Alert Banner */}
      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>College Project Notice:</strong> This is a frontend architectural demonstration with pre-filled mock credentials. You can safely proceed through the entire checkout flow.
        </p>
      </div>

      {/* Payment Method Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => onMethodChange('upi')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
            method === 'upi'
              ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-glow-sm'
              : 'border-surface-border text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span>UPI / QR</span>
        </button>

        <button
          type="button"
          onClick={() => onMethodChange('card')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
            method === 'card'
              ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-glow-sm'
              : 'border-surface-border text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Card</span>
        </button>

        <button
          type="button"
          onClick={() => onMethodChange('netbanking')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
            method === 'netbanking'
              ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-glow-sm'
              : 'border-surface-border text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Net Banking</span>
        </button>

        <button
          type="button"
          onClick={() => onMethodChange('cod')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
            method === 'cod'
              ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-glow-sm'
              : 'border-surface-border text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Banknote className="w-5 h-5" />
          <span>Pay on Delivery</span>
        </button>
      </div>

      {/* Dynamic Method UI */}
      <div className="pt-2">
        {method === 'upi' && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-4">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-text-primary">Instant UPI Transfer</span>
              <span className="text-emerald-500 font-semibold">Zero Fee</span>
            </div>
            <Input
              label="Virtual Payment Address (VPA / UPI ID)"
              placeholder="username@okhdfcbank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
            <div className="flex flex-wrap gap-2 text-xs">
              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                <span
                  key={app}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-surface-border text-text-secondary text-[11px]"
                >
                  ✓ {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {method === 'card' && (
          <div className="space-y-4">
            {/* Interactive Futuristic Card Visual */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-float relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs tracking-widest font-mono text-indigo-300">WHOLE MART PLATINUM</span>
                <span className="font-extrabold text-sm text-cyan-400">VISA</span>
              </div>
              <div className="font-mono text-base sm:text-lg tracking-widest mb-4">
                {card.cardNumber}
              </div>
              <div className="flex justify-between items-end text-xs font-mono text-slate-300">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</div>
                  <div>{card.cardHolder}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Expires</div>
                  <div>
                    {card.expiryMonth}/{card.expiryYear}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Cardholder Name"
                value={card.cardHolder}
                onChange={(e) => setCard({ ...card, cardHolder: e.target.value })}
                required
              />
              <Input
                label="Card Number"
                value={card.cardNumber}
                onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {method === 'netbanking' && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-3">
            <label className="block text-xs font-medium text-text-secondary">
              Select Your Bank
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                <div
                  key={b}
                  className="p-2.5 rounded-xl border border-surface-border bg-surface text-text-primary flex items-center justify-between cursor-pointer hover:border-indigo-500/50"
                >
                  <span>{b}</span>
                  <Check className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {method === 'cod' && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-2">
            <h4 className="text-xs font-bold text-text-primary">Cash / UPI on Delivery</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Pay via cash or dynamic UPI QR code when our delivery courier reaches your doorstep.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Review Order
        </Button>
      </div>
    </form>
  );
};
