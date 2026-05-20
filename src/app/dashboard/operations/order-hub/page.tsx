'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Package,
  History,
  ClipboardList,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

type HubStatus = 'pending' | 'accepted' | 'in_progress' | 'exiting';
type ExitType = 'COMPLETED' | 'CANCELLED' | 'REJECTED' | 'FAILED';

interface HubOrder {
  id: string;
  orderNumber: string;
  status: HubStatus;
  exitType?: ExitType;
  itemsCount: number;
  server: string;
  timeOpen: string;
  floor: string;
  timestamp: number;
}

const statusConfig: Record<HubStatus, { label: string; icon: any; color: string; accent: string; bg: string }> = {
  pending: {
    label: 'Pending',
    icon: AlertCircle,
    color: 'text-blue-600',
    accent: 'bg-blue-500',
    bg: 'bg-blue-50/50',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    color: 'text-amber-600',
    accent: 'bg-amber-500',
    bg: 'bg-amber-50/50',
  },
  in_progress: {
    label: 'In Progress',
    icon: Play,
    color: 'text-teal-600',
    accent: 'bg-teal-500',
    bg: 'bg-teal-50/50',
  },
  exiting: {
    label: 'Exiting...',
    icon: Clock,
    color: 'text-gray-400',
    accent: 'bg-gray-400',
    bg: 'bg-gray-100',
  }
};

const exitConfig: Record<ExitType, { color: string; bg: string; text: string }> = {
  COMPLETED: { color: 'text-white', bg: 'bg-green-600', text: 'SUCCESS' },
  CANCELLED: { color: 'text-white', bg: 'bg-red-600', text: 'CANCELLED' },
  REJECTED: { color: 'text-white', bg: 'bg-red-600', text: 'REJECTED' },
  FAILED: { color: 'text-white', bg: 'bg-red-700', text: 'FAILED' },
};

const initialOrders: HubOrder[] = [
  { id: '1', orderNumber: '#4421', status: 'pending', itemsCount: 4, server: 'Alex', timeOpen: '2m', floor: 'Ground', timestamp: Date.now() },
  { id: '2', orderNumber: '#4422', status: 'accepted', itemsCount: 2, server: 'Maria', timeOpen: '5m', floor: 'Ground', timestamp: Date.now() },
  { id: '3', orderNumber: '#4423', status: 'in_progress', itemsCount: 6, server: 'Sarah', timeOpen: '8m', floor: 'First', timestamp: Date.now() },
  { id: '4', orderNumber: '#4424', status: 'pending', itemsCount: 1, server: 'John', timeOpen: '1m', floor: 'Ground', timestamp: Date.now() },
  { id: '5', orderNumber: '#4425', status: 'in_progress', itemsCount: 3, server: 'Emma', timeOpen: '12m', floor: 'Ground', timestamp: Date.now() },
  { id: '6', orderNumber: '#4426', status: 'accepted', itemsCount: 5, server: 'Lisa', timeOpen: '4m', floor: 'First', timestamp: Date.now() },
];

export default function OrderHubPage() {
  const [orders, setOrders] = useState<HubOrder[]>(initialOrders);
  const [lookbackDays, setLookbackDays] = useState('1');
  const [activeFilter, setActiveFilter] = useState<'all' | HubStatus>('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const candidates = prev.filter(o => o.status !== 'exiting');
        if (candidates.length === 0) return prev;

        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const exitTypes: ExitType[] = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'];
        const randomExit = exitTypes[Math.floor(Math.random() * exitTypes.length)];

        const updated = prev.map(o => {
          if (o.id === target.id) {
            return { ...o, status: 'exiting' as HubStatus, exitType: randomExit };
          }
          return o;
        });

        setTimeout(() => {
          setOrders(current => current.filter(o => o.id !== target.id));
        }, 3500);

        return updated;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => activeFilter === 'all' || o.status === activeFilter);
  }, [orders, activeFilter]);

  return (
    <div className={cn("min-h-screen bg-[#F8FAFC]", inter.className)}>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-10 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Order Hub</h1>
              <p className="text-slate-500 text-sm font-medium">Monitor and manage active floor operations in real-time.</p>
            </div>
          </div>

          <Card className="border-0 shadow-sm overflow-hidden bg-white rounded-xl">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Select value={lookbackDays} onValueChange={setLookbackDays}>
                  <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 font-medium text-slate-700">
                    <History className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Lookback" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last 24 Hours</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
                <div className="h-6 w-px bg-slate-200" />
                <span className="text-sm font-semibold text-slate-600">
                  {orders.length} ACTIVE ORDERS
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200">
                <Button 
                  variant={activeFilter === 'all' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={cn("h-8 px-4 text-xs font-semibold rounded-md transition-all", activeFilter === 'all' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </Button>
                {['pending', 'accepted', 'in_progress'].map((status) => (
                  <Button 
                    key={status}
                    variant={activeFilter === status ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className={cn(
                      "h-8 px-3 text-xs font-semibold rounded-md transition-all capitalize", 
                      activeFilter === status ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
                    )}
                    onClick={() => setActiveFilter(status as HubStatus)}
                  >
                    {status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredOrders.map((order) => {
              const isExiting = order.status === 'exiting';
              const config = isExiting && order.exitType ? exitConfig[order.exitType] : statusConfig[order.status];
              const Icon = isExiting ? (order.exitType === 'COMPLETED' ? CheckCircle2 : XCircle) : config.icon;

              return (
                <Card 
                  key={order.id}
                  className={cn(
                    "group relative transition-all duration-300 border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md",
                    isExiting && "animate-status-blink scale-[1.02] z-10 border-transparent ring-4 ring-white shadow-2xl",
                    isExiting && config.bg
                  )}
                >
                  {/* Status Side Bar */}
                  {!isExiting && (
                    <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.accent)} />
                  )}

                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Header */}
                    <div className={cn(
                      "p-5 flex items-center justify-between border-b border-slate-100 transition-colors",
                      isExiting ? "border-transparent" : "bg-white"
                    )}>
                      <div className="space-y-0.5 text-left">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", isExiting ? "text-white/60" : "text-slate-400")}>Order ID</span>
                        <h3 className={cn("text-xl font-bold tracking-tight", isExiting ? "text-white" : "text-slate-900")}>
                          {order.orderNumber}
                        </h3>
                      </div>
                      <div className={cn("flex flex-col items-end gap-1 text-right")}>
                         <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors",
                            isExiting ? "bg-white/20 text-white" : cn(config.bg, config.color)
                          )}>
                            <Icon className="h-3 w-3" />
                            {isExiting && order.exitType ? exitConfig[order.exitType].text : config.label}
                         </div>
                         <div className={cn("flex items-center gap-1 text-[10px] font-medium transition-colors", isExiting ? "text-white/60" : "text-slate-400")}>
                            <Clock className="h-3 w-3" />
                            {order.timeOpen}
                         </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-4 text-left">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className={cn("text-[10px] font-bold uppercase tracking-wider", isExiting ? "text-white/60" : "text-slate-400")}>Location</p>
                          <div className={cn("flex items-center gap-1.5 font-medium text-sm", isExiting ? "text-white" : "text-slate-700")}>
                            <MapPin className={cn("h-3.5 w-3.5 opacity-50", isExiting ? "text-white/60" : "text-slate-400")} />
                            {order.floor} Floor
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className={cn("text-[10px] font-bold uppercase tracking-wider", isExiting ? "text-white/60" : "text-slate-400")}>Server</p>
                          <div className={cn("flex items-center gap-1.5 font-medium text-sm", isExiting ? "text-white" : "text-slate-700")}>
                            <Users className={cn("h-3.5 w-3.5 opacity-50", isExiting ? "text-white/60" : "text-slate-400")} />
                            {order.server}
                          </div>
                        </div>
                      </div>

                      <div className={cn(
                        "flex items-center justify-between p-3 rounded-xl border border-dashed transition-colors",
                        isExiting ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200"
                      )}>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                            isExiting ? "bg-white/20" : "bg-slate-200/50"
                          )}>
                             <Package className={cn("h-4 w-4", isExiting ? "text-white" : "text-slate-500")} />
                          </div>
                          <div>
                            <p className={cn("text-xs font-bold", isExiting ? "text-white" : "text-slate-700")}>
                              {order.itemsCount} Items
                            </p>
                            <p className={cn("text-[10px] font-medium transition-colors", isExiting ? "text-white/60" : "text-slate-500")}>
                              In this ticket
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 opacity-30", isExiting ? "text-white" : "text-slate-400")} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-32 text-center space-y-4">
              <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto border border-slate-200">
                <ClipboardList className="h-10 w-10 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-900">No active orders</p>
                <p className="text-sm font-medium text-slate-500">Wait for guests to scan and order from their menu.</p>
              </div>
              <Button variant="outline" className="font-bold rounded-lg px-6" onClick={() => setActiveFilter('all')}>View All History</Button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
