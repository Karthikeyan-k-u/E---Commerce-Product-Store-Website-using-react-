import React from 'react';
import { ShippingAddress } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MapPin, Building, Navigation, ArrowRight, ArrowLeft } from 'lucide-react';

interface ShippingStepProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  onNext: () => void;
  onBack: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 
  'Punjab', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export const ShippingStep: React.FC<ShippingStepProps> = ({
  address,
  onChange,
  onNext,
  onBack,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-surface border border-surface-border space-y-5">
      <div className="border-b border-surface-border pb-3">
        <h3 className="text-base font-bold text-text-primary">2. Shipping Destination</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Enter your doorstep delivery address (India-wide express logistics).
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Flat, House no., Building or Company"
          placeholder="e.g. 42, Tech Innovation Boulevard, Sector 4"
          leftIcon={<Building className="w-4 h-4" />}
          value={address.street}
          onChange={(e) => onChange({ ...address, street: e.target.value })}
          required
        />

        <Input
          label="Area, Colony, Street, Landmark"
          placeholder="e.g. Near BDA Complex, HSR Layout"
          leftIcon={<Navigation className="w-4 h-4" />}
          value={address.landmark || ''}
          onChange={(e) => onChange({ ...address, landmark: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="City"
            placeholder="Bengaluru"
            value={address.city}
            onChange={(e) => onChange({ ...address, city: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              State
            </label>
            <select
              value={address.state}
              onChange={(e) => onChange({ ...address, state: e.target.value })}
              className="w-full h-11 px-3 bg-surface text-text-primary rounded-xl border border-surface-border text-sm outline-none focus:border-indigo-500"
              required
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="PIN Code"
            placeholder="560102"
            maxLength={6}
            value={address.pincode}
            onChange={(e) => onChange({ ...address, pincode: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Continue to Payment
        </Button>
      </div>
    </form>
  );
};
