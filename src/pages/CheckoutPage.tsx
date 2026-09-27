import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { useGroupBuyStore } from '../store/groupBuyStore';
import { getCommunityForProduct } from '../data/communities';
import { CustomerStep } from '../components/checkout/CustomerStep';
import { ShippingStep } from '../components/checkout/ShippingStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { ReviewStep } from '../components/checkout/ReviewStep';
import { CheckoutStepper } from '../components/checkout/CheckoutStepper';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import { CustomerInfo, ShippingAddress, PaymentMethodType, Order } from '../types';
import { generateOrderId, getEstimatedDeliveryDate, formatINR } from '../lib/utils';
import { ShoppingBag } from 'lucide-react';

const STEPS = ['Customer Info', 'Shipping', 'Payment', 'Review'];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getDiscount, getShippingFee, getTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { user } = useAuthStore();
  const recordPurchase = useGroupBuyStore((state) => state.recordPurchase);

  const [currentStep, setCurrentStep] = useState(0);

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '42, Tech Innovation Boulevard, Sector 4',
    landmark: 'Near BDA Complex',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const total = getTotal();

  if (!user) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="No Items to Checkout"
          description="Your cart is currently empty. Please add items before proceeding with checkout."
          actionLabel="Return to Catalog"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  const handleCompleteOrder = () => {
    const orderId = generateOrderId();
    const orderDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newOrder: Order = {
      id: orderId,
      userId: user.uid,
      date: orderDate,
      items: [...items],
      customer,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      shipping,
      total,
      status: 'Processing',
      estimatedDelivery: getEstimatedDeliveryDate(),
      timeline: [
        {
          status: 'Processing',
          date: `${orderDate}, Just now`,
          description: 'Payment authorized & order confirmed',
          completed: true,
          current: true,
        },
        {
          status: 'Shipped',
          date: 'Tomorrow, Est.',
          description: 'Awaiting packing & air dispatch',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          date: getEstimatedDeliveryDate(),
          description: 'Courier assignment',
          completed: false,
        },
        {
          status: 'Delivered',
          date: getEstimatedDeliveryDate(),
          description: 'Estimated doorstep arrival',
          completed: false,
        },
      ],
    };

    addOrder(newOrder);

    // A placed order is the one honest signal that moves the group-buy ladder.
    items.forEach((item) => {
      const community = getCommunityForProduct(item.productId);
      if (!community) return;
      recordPurchase({
        productId: item.productId,
        communitySlug: community.slug,
        units: item.quantity,
        variant: [item.selectedColor?.name, item.selectedSize].filter(Boolean).join(' · ') || undefined,
      });
    });

    clearCart();
    navigate(`/order/success?orderId=${orderId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Breadcrumb & Title */}
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-display tracking-tight">
          Express Checkout
        </h1>
        <p className="text-xs text-text-muted">
          Complete your acquisition through our secure payment gateway
        </p>
      </div>

      {/* Progress Stepper */}
      <CheckoutStepper currentStep={currentStep} steps={STEPS} />

      {/* Multi-Step Forms */}
      <div className="pt-2">
        {currentStep === 0 && (
          <CustomerStep
            customer={customer}
            onChange={setCustomer}
            onNext={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 1 && (
          <ShippingStep
            address={shippingAddress}
            onChange={setShippingAddress}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        )}

        {currentStep === 2 && (
          <PaymentStep
            method={paymentMethod}
            onMethodChange={setPaymentMethod}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <ReviewStep
            customer={customer}
            address={shippingAddress}
            paymentMethod={paymentMethod}
            items={items}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
            onPlaceOrder={handleCompleteOrder}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
};
