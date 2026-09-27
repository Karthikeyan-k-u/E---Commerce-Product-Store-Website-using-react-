import React from 'react';
import { CustomerInfo } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';

interface CustomerStepProps {
  customer: CustomerInfo;
  onChange: (customer: CustomerInfo) => void;
  onNext: () => void;
}

export const CustomerStep: React.FC<CustomerStepProps> = ({ customer, onChange, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.email || !customer.phone) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-surface border border-surface-border space-y-5">
      <div className="border-b border-surface-border pb-3">
        <h3 className="text-base font-bold text-text-primary">1. Customer Information</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Enter your contact details for order confirmation and live delivery tracking updates.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Legal Name"
          placeholder="e.g. Karthikeyan K"
          leftIcon={<User className="w-4 h-4" />}
          value={customer.fullName}
          onChange={(e) => onChange({ ...customer, fullName: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="karthikeyan.k.u777@gmail.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={customer.email}
            onChange={(e) => onChange({ ...customer, email: e.target.value })}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            leftIcon={<Phone className="w-4 h-4" />}
            value={customer.phone}
            onChange={(e) => onChange({ ...customer, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Continue to Shipping
        </Button>
      </div>
    </form>
  );
};
