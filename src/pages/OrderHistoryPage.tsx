import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { formatINR } from '../lib/utils';
import { OrderStatus } from '../types';

export const OrderHistoryPage: React.FC = () => {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const userOrders = orders.filter((order) => order.userId === user?.uid);

  const filteredOrders = userOrders.filter((o) => {
    if (filterStatus === 'All') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Shipped':
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" /> In Transit
          </span>
        );
      case 'Processing':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Orders' }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-display tracking-tight">
              Order History & Tracking
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Live status and tracking history for all your orders.
            </p>
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-surface-border overflow-x-auto">
            {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  filterStatus === st
                    ? 'bg-surface text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center text-text-muted text-sm rounded-2xl bg-surface border border-surface-border">
          No orders found matching the filter "{filterStatus}".
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 rounded-2xl bg-surface border border-surface-border hover:border-indigo-500/40 shadow-sm transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-sm font-bold text-text-primary">{order.id}</div>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="text-xs text-text-muted">{order.date}</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Items Thumbnails & Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 flex items-center gap-3 overflow-x-auto">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-surface-border"
                      />
                      <div className="text-xs max-w-[140px]">
                        <div className="font-semibold text-text-primary truncate">{item.name}</div>
                        <div className="text-[11px] text-text-muted">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sm:col-span-4 flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-text-muted uppercase">Total Paid</div>
                    <div className="text-sm font-bold text-text-primary">{formatINR(order.total)}</div>
                  </div>
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-400 p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors shrink-0"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
