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
  ArrowRight,
  Filter,
  Activity,
  History,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

const statusConfig: Record<HubStatus, { label: string; icon: any; color: string; bg: string; border: string }> = {
  pending: {
    label: 'Pending',
    icon: AlertCircle,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-500',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
  },
  in_progress: {
    label: 'In Progress',
    icon: Play,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-500',
  },
  exiting: {
    label: 'Exiting...',
    icon: Activity,
    color: 'text-gray-400',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
  }
};

const exitConfig: Record<ExitType, { color: string; bg: string; border: string; text: string }> = {
  COMPLETED: { color: 'text-white', bg: 'bg-green-500', border: 'border-green-600', text: 'SUCCESS' },
  CANCELLED: { color: 'text-white', bg: 'bg-red-500', border: 'border-red-600', text: 'CANCELLED' },
  REJECTED: { color: 'text-white', bg: 'bg-red-500', border: 'border-red-600', text: 'REJECTED' },
  FAILED: { color: 'text-white', bg: 'bg-red-600', border: 'border-red-700', text: 'FAILED' },
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
  const { toast } = useToast();
  const [orders, setOrders] = useState<HubOrder[]>(initialOrders);
  const [lookbackDays, setLookbackDays] = useState('1');
  const [activeFilter, setActiveFilter] = useState<'all' | HubStatus>('all');

  // Simulator for exiting orders
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        // Find a random non-exiting order to "complete"
        const candidates = prev.filter(o => o.status !== 'exiting');
        if (candidates.length === 0) return prev;

        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const exitTypes: ExitType[] = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'];
        const randomExit = exitTypes[Math.floor(Math.random() * exitTypes.length)];

        // Update the order to exiting state
        const updated = prev.map(o => {
          if (o.id === target.id) {
            return { ...o, status: 'exiting' as HubStatus, exitType: randomExit };
          }
          return o;
        });

        // Set timeout to remove it after blink
        setTimeout(() => {
          setOrders(current => current.filter(o => o.id !== target.id));
        }, 3500);

        return updated;
      });
    }, 12000); // Simulate periodically

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => activeFilter === 'all' || o.status === activeFilter);
  }, [orders, activeFilter]);

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8 space-y-6 bg-muted/20 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Live Order Hub</h1>
              <p className="text-muted-foreground text-sm font-medium">Real-time order monitoring and dispatch control center.</p>
            </div>
          </div>

          <Card className="p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Select value={lookbackDays} onValueChange={setLookbackDays}>
                  <SelectTrigger className="w-[200px] bg-background border-border font-semibold">
                    <History className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Lookback Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last 24 Hours</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
                <div className="h-8 w-px bg-border mx-2" />
                <span className="text-sm font-bold text-foreground">
                  {orders.length} Orders Active
                </span>
              </div>

              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                <Button 
                  variant={activeFilter === 'all' ? 'default' : 'ghost'} 
                  size="sm" 
                  className={cn("shadow-sm font-semibold", activeFilter === 'all' && "bg-white text-foreground hover:bg-white")}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </Button>
                {['pending', 'accepted', 'in_progress'].map((status) => (
                  <Button 
                    key={status}
                    variant={activeFilter === status ? 'default' : 'ghost'} 
                    size="sm" 
                    className={cn(
                      "shadow-sm font-semibold gap-2 capitalize", 
                      activeFilter === status && "bg-white text-foreground hover:bg-white"
                    )}
                    onClick={() => setActiveFilter(status as HubStatus)}
                  >
                    <div className={cn("h-2 w-2 rounded-full", statusConfig[status as HubStatus].bg.replace('bg-', 'bg-').replace('-50', '-500'))} />
                    {status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredOrders.map((order) => {
              const isExiting = order.status === 'exiting';
              const config = isExiting && order.exitType ? exitConfig[order.exitType] : statusConfig[order.status];
              const Icon = isExiting ? (order.exitType === 'COMPLETED' ? CheckCircle2 : XCircle) : config.icon;

              return (
                <Card 
                  key={order.id}
                  className={cn(
                    "group relative transition-all duration-300 border-2 overflow-hidden",
                    config.border,
                    isExiting && "animate-status-blink scale-[1.05] z-10",
                    isExiting && config.bg
                  )}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center aspect-square text-center space-y-4">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center transition-colors shadow-sm",
                      isExiting ? "bg-white/20" : config.bg
                    )}>
                      <Icon className={cn("h-6 w-6", isExiting ? "text-white" : config.color)} />
                    </div>

                    <div className="space-y-1">
                      <p className={cn("text-3xl font-black tracking-tighter", isExiting ? "text-white" : "text-foreground")}>
                        {order.orderNumber}
                      </p>
                      <p className={cn("text-[10px] font-black uppercase tracking-widest", isExiting ? "text-white/80" : config.color)}>
                        {isExiting && order.exitType ? exitConfig[order.exitType].text : config.label}
                      </p>
                    </div>

                    <div className={cn(
                        "w-full grid grid-cols-2 gap-y-2 pt-2 border-t border-dashed",
                        isExiting ? "border-white/20" : "border-border"
                    )}>
                      <div className="text-left space-y-0.5">
                        <p className={cn("text-[10px] font-bold uppercase tracking-wider", isExiting ? "text-white/60" : "text-muted-foreground")}>Floor</p>
                        <p className={cn("text-xs font-bold", isExiting ? "text-white" : "text-foreground")}>{order.floor}</p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className={cn("text-[10px] font-bold uppercase tracking-wider", isExiting ? "text-white/60" : "text-muted-foreground")}>Time</p>
                        <p className={cn("text-xs font-bold", isExiting ? "text-white" : "text-foreground")}>{order.timeOpen}</p>
                      </div>
                      <div className="text-left space-y-0.5">
                        <p className={cn("text-[10px] font-bold uppercase tracking-wider", isExiting ? "text-white/60" : "text-muted-foreground")}>Server</p>
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", isExiting ? "bg-white/20" : "bg-primary/10")}>
                            <Users className={cn("h-2.5 w-2.5", isExiting ? "text-white" : "text-primary")} />
                          </div>
                          <span className={cn("text-xs font-bold", isExiting ? "text-white" : "text-foreground")}>{order.server}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className={cn("text-[10px] font-bold uppercase tracking-wider", isExiting ? "text-white/60" : "text-muted-foreground")}>Items</p>
                        <div className="flex items-center justify-end gap-1.5">
                           <Package className={cn("h-3 w-3", isExiting ? "text-white/60" : "text-muted-foreground")} />
                           <span className={cn("text-xs font-bold", isExiting ? "text-white" : "text-foreground")}>{order.itemsCount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-32 text-center space-y-4">
              <div className="h-20 w-20 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto">
                <ClipboardList className="h-10 w-10 text-muted-foreground opacity-20" />
              </div>
              <p className="text-lg font-bold text-muted-foreground">No orders matching your criteria.</p>
              <Button variant="link" onClick={() => setActiveFilter('all')}>Clear all filters</Button>
            </div>
          )}

        </div>
      </main>
    </>
  );
}