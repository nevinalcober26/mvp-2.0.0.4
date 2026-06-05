'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Search,
  Activity,
  User,
  RefreshCw,
  ClipboardList,
  Calendar,
  Armchair,
  Box,
  HelpCircle,
  Ban,
  LayoutGrid,
  Columns,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { subMinutes, isSameDay, format } from 'date-fns';
import gsap from 'gsap';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const inter = Inter({ subsets: ['latin'] });

type HubStatus = 'pending' | 'accepted' | 'in_progress' | 'exiting';
type ExitType = 'COMPLETED' | 'CANCELLED' | 'REJECTED' | 'FAILED';

interface HubOrder {
  id: string;
  orderNumber: string;
  table: string;
  status: HubStatus;
  exitType?: ExitType;
  itemsCount: number;
  server: string;
  timestamp: number;
  originalStatus?: HubStatus;
}

interface EventLog {
  id: string;
  orderNumber: string;
  type: ExitType;
  timestamp: Date;
  server: string;
  isNew?: boolean;
}

const statusConfig: Record<HubStatus, { label: string; subLabel: string; icon: any; color: string; dot: string; bg: string; accent: string; badge: string; text: string }> = {
  pending: {
    label: 'PENDING',
    subLabel: 'New orders to review',
    icon: Clock,
    color: 'text-yellow-600',
    dot: 'bg-yellow-400',
    bg: 'bg-[#fffbeb]',
    accent: 'bg-yellow-400',
    badge: 'bg-yellow-400 text-yellow-900',
    text: 'PENDING'
  },
  accepted: {
    label: 'ACCEPTED',
    subLabel: 'Confirmed & in queue',
    icon: CheckCircle2,
    color: 'text-indigo-600',
    dot: 'bg-indigo-500',
    bg: 'bg-[#f5f5ff]',
    accent: 'bg-indigo-500',
    badge: 'bg-indigo-500 text-white',
    text: 'ACCEPTED'
  },
  in_progress: {
    label: 'PREPARING',
    subLabel: 'Kitchen is cooking now',
    icon: Play,
    color: 'text-teal-600',
    dot: 'bg-teal-500',
    bg: 'bg-[#f4fbf9]',
    accent: 'bg-teal-500',
    badge: 'bg-teal-500 text-white',
    text: 'PREPARING'
  },
  exiting: {
    label: 'UPDATING',
    subLabel: 'Processing...',
    icon: RefreshCw,
    color: 'text-white',
    dot: 'bg-white',
    bg: 'bg-slate-900',
    accent: 'bg-white',
    badge: 'bg-slate-900 text-white',
    text: 'UPDATING'
  }
};

const exitConfig: Record<ExitType, { bg: string; text: string; icon: any; dot: string }> = {
  COMPLETED: { bg: 'bg-[#10b981]', text: 'Completed', icon: CheckCircle2, dot: 'bg-[#10b981]' },
  CANCELLED: { bg: 'bg-[#f43f5e]', text: 'Cancelled', icon: XCircle, dot: 'bg-[#f43f5e]' },
  REJECTED: { bg: 'bg-[#f97316]', text: 'Rejected', icon: Ban, dot: 'bg-[#f97316]' },
  FAILED: { bg: 'bg-[#1e293b]', text: 'Failed', icon: AlertCircle, dot: 'bg-[#1e293b]' },
};

const servers = ['Alex', 'Maria', 'John', 'Sarah', 'Emma', 'Lisa', 'David', 'James', 'Sophie', 'Michael'];
const statuses: HubStatus[] = ['pending', 'accepted', 'in_progress'];

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

const generateMockOrders = (count: number): HubOrder[] => {
  return Array.from({ length: count }, (_, i) => {
    const minutesAgo = Math.floor(Math.random() * 25) + 1; 
    const secondsAgo = Math.floor(Math.random() * 60);
    const timestamp = subMinutes(new Date(), minutesAgo).getTime() - (secondsAgo * 1000);
    
    return {
      id: `${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `#${4820 + i}`,
      table: `T${Math.floor(Math.random() * 24) + 1}`,
      status: statuses[i % 3],
      itemsCount: Math.floor(Math.random() * 6) + 1,
      server: servers[Math.floor(Math.random() * servers.length)],
      timestamp: timestamp,
    };
  });
};

const OrderCard = ({ order, now }: { order: HubOrder; now: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isExiting = order.status === 'exiting';
  const durationMs = now - order.timestamp;
  const isCritical = durationMs >= 1200000; // 20 minutes
  const isNew = durationMs < 5000;

  const config = isExiting && order.exitType ? exitConfig[order.exitType] : statusConfig[order.status];
  const Icon = isExiting ? exitConfig[order.exitType!].icon : (config as any).icon;

  useEffect(() => {
    if (isExiting && cardRef.current) {
      const tl = gsap.timeline();
      tl.to(cardRef.current, {
        delay: 2.2,
        duration: 0.5,
        opacity: 0,
        scale: 0.95,
        ease: 'power2.in'
      })
      .to(cardRef.current, {
        duration: 0.3,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        overflow: 'hidden',
        ease: 'power2.inOut'
      });
    }
  }, [isExiting]);

  return (
    <div 
      ref={cardRef} 
      className={cn(
        "w-full",
        isNew ? "animate-flip-x-in" : "animate-in fade-in slide-in-from-left-4 duration-500"
      )}
    >
      <Card 
        className={cn(
          "group relative transition-all duration-300 border shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md",
          isCritical && !isExiting && "bg-rose-50/50 border-rose-500 ring-1 ring-rose-500/10",
          isExiting && cn(config.bg, "scale-[1.02] z-20 shadow-lg animate-status-blink text-white border-transparent")
        )}
      >
        <CardContent className="p-0 flex flex-col h-full relative z-10 text-left">
          {!isExiting && (
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", isCritical ? "bg-rose-500" : (config as any).accent)} />
          )}

          <div className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[10px] font-bold uppercase", isExiting ? "text-white/60" : "text-slate-400")}>
                    ORDER ID
                  </span>
                  {isCritical && !isExiting && (
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-3.5 w-3.5 text-rose-500 animate-pulse cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white border-0 text-[11px] p-2 rounded-lg shadow-xl">
                          <p>Late Order: Exceeded 20-minute operational threshold.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <h3 className={cn("text-lg font-bold", isExiting ? "text-white" : "text-slate-900")}>
                  {order.orderNumber}
                </h3>
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold",
                isExiting ? "bg-white text-slate-900" : (config as any).badge
              )}>
                <Icon className="h-3.5 w-3.5" />
                {(isExiting && order.exitType ? exitConfig[order.exitType].text.toUpperCase() : (config as any).text)}
              </div>
            </div>

            <div className="h-px bg-slate-100 opacity-50 mx-[-16px]" />

            <div className="flex items-end justify-between">
              <div className={cn("space-y-1.5 text-left", isExiting ? "text-white/80" : "text-slate-600")}>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 opacity-60" />
                  <span className="text-[13px] font-semibold">By Staff {order.server}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Armchair className="h-3.5 w-3.5 opacity-60" />
                  <span className="text-[13px] font-semibold">Table {order.table}</span>
                </div>
              </div>

              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium text-[11px] font-mono border",
                isExiting ? "bg-white/10 border-white/20 text-white" : isCritical ? "bg-white border-rose-200 text-rose-600" : "bg-slate-50 border-slate-100 text-slate-500"
              )}>
                <Clock className={cn("h-3.5 w-3.5", isCritical && !isExiting && "text-rose-500")} />
                {formatDuration(durationMs)}
              </div>
            </div>

            <div className={cn(
              "flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-colors",
              isExiting ? "bg-white/10 border-white/20 text-white" : isCritical ? "bg-white/50 border-rose-200/50" : "bg-slate-50/50 border-slate-100"
            )}>
               <Box className="h-4 w-4" />
               <span className={cn("text-[11px] font-bold uppercase", isExiting ? "text-white" : "text-slate-500")}>
                 {order.itemsCount} Items
               </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const GridItem = ({ order }: { order?: HubOrder }) => {
  if (!order) {
    return <div className="aspect-[4/2.2] rounded-lg bg-slate-50/50 border border-slate-100/50" />;
  }

  const config = statusConfig[order.status === 'exiting' ? (order.originalStatus || 'pending') : order.status];
  
  return (
    <div className={cn(
      "aspect-[4/2.2] rounded-lg p-2 flex flex-col justify-center gap-0.5 text-white transition-all shadow-sm",
      config.accent
    )}>
      <p className="text-[15px] font-black leading-none">{order.orderNumber.replace('#', '')}</p>
      <p className="text-[9px] font-bold opacity-80 truncate uppercase tracking-tighter">
        #NDAGPJC{order.orderNumber.replace('#', '')}...
      </p>
    </div>
  );
};

export default function OrderHubPage() {
  const [orders, setOrders] = useState<HubOrder[]>([]);
  const [recentExits, setRecentExits] = useState<EventLog[]>([]);
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(Date.now());
  const [view, setView] = useState<'grid' | 'board'>('grid');
  const [zoom, setZoom] = useState(100);
  const [gridStatusFilter, setGridStatusFilter] = useState<HubStatus | 'all'>('all');
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setOrders(generateMockOrders(20));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Aggressive Inflow Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const rand = Math.random();
        
        // High frequency new order (40% chance every 3s)
        if (rand < 0.40) {
          const newOrder: HubOrder = {
            id: Math.random().toString(36).substr(2, 9),
            orderNumber: `#${4800 + Math.floor(Math.random() * 5000)}`,
            table: `T${Math.floor(Math.random() * 24) + 1}`,
            status: 'pending',
            itemsCount: Math.floor(Math.random() * 8) + 1,
            server: servers[Math.floor(Math.random() * servers.length)],
            timestamp: Date.now(),
          };
          return [newOrder, ...prev];
        }

        // Fast transition Pending -> Accepted
        if (rand > 0.40 && rand < 0.65) {
          const pendingIdx = prev.findIndex(o => o.status === 'pending' && o.status !== 'exiting');
          if (pendingIdx !== -1) {
            return prev.map((o, i) => i === pendingIdx ? { ...o, status: 'accepted' as HubStatus } : o);
          }
        }

        // Fast transition Accepted -> In Progress
        if (rand > 0.65 && rand < 0.85) {
          const acceptedIdx = prev.findIndex(o => o.status === 'accepted' && o.status !== 'exiting');
          if (acceptedIdx !== -1) {
            return prev.map((o, i) => i === acceptedIdx ? { ...o, status: 'in_progress' as HubStatus } : o);
          }
        }

        return prev;
      });
    }, 3000); // Accelerated generation loop
    return () => clearInterval(interval);
  }, []);

  // Exit Simulation
  useEffect(() => {
    const finalizationInterval = setInterval(() => {
      setOrders(prev => {
        const candidates = prev.filter(o => o.status !== 'exiting');
        if (candidates.length < 5) return prev; 
        
        const exitOptions: ExitType[] = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'];
        const randomExit = exitOptions[Math.floor(Math.random() * exitOptions.length)];
        
        let target: HubOrder | undefined;
        
        if (randomExit === 'COMPLETED') {
            const inPreparing = candidates.filter(o => o.status === 'in_progress');
            if (inPreparing.length > 0) {
              target = inPreparing[Math.floor(Math.random() * inPreparing.length)];
            } else {
              target = candidates[Math.floor(Math.random() * candidates.length)];
            }
        } else {
            target = candidates[Math.floor(Math.random() * candidates.length)];
        }

        if (!target) return prev;
        return executeExit(prev, target, randomExit);
      });
    }, 8000); 
    return () => clearInterval(finalizationInterval);
  }, []);

  const executeExit = (prev: HubOrder[], target: HubOrder, exitType: ExitType) => {
    const newLog: EventLog = {
      id: Math.random().toString(),
      orderNumber: target.orderNumber,
      type: exitType,
      timestamp: new Date(),
      server: target.server,
      isNew: true
    };
    
    setRecentExits(prevExits => [newLog, ...prevExits.map(le => ({ ...le, isNew: false }))].slice(0, 30));

    const updated = prev.map(o => o.id === target.id ? { 
      ...o, 
      status: 'exiting' as HubStatus, 
      exitType: exitType, 
      originalStatus: o.status 
    } : o);
    
    setTimeout(() => {
      setOrders(current => current.filter(o => o.id !== target.id));
    }, 3200);

    return updated;
  };

  const getFilteredStatusOrders = (status: HubStatus) => {
    return orders.filter(o => {
      const activeStatus = o.status === 'exiting' ? o.originalStatus : o.status;
      if (activeStatus !== status) return false;
      
      const orderDate = new Date(o.timestamp);
      if (date && !isSameDay(orderDate, date)) return false;

      return o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
             o.server.toLowerCase().includes(search.toLowerCase()) ||
             o.table.toLowerCase().includes(search.toLowerCase());
    }).sort((a, b) => a.timestamp - b.timestamp);
  };

  const activeOrders = useMemo(() => orders.filter(o => {
    if (o.status === 'exiting') return false;
    const orderDate = new Date(o.timestamp);
    return date ? isSameDay(orderDate, date) : true;
  }), [orders, date]);
  
  const gridSlots = useMemo(() => {
    const sorted = [...orders].filter(o => {
      const isExiting = o.status === 'exiting';
      if (isExiting) return false;

      const orderDate = new Date(o.timestamp);
      if (date && !isSameDay(orderDate, date)) return false;

      if (gridStatusFilter === 'all') return true;
      return o.status === gridStatusFilter;
    }).sort((a, b) => a.timestamp - b.timestamp);
    
    const slots = Array(80).fill(null);
    sorted.forEach((o, i) => { if (i < 80) slots[i] = o; });
    return slots;
  }, [orders, gridStatusFilter, date]);

  const columns: { id: HubStatus; label: string; subLabel: string; dot: string; bg: string }[] = [
    { id: 'pending', label: 'PENDING', subLabel: 'New orders to review', dot: 'bg-yellow-400', bg: 'bg-[#fffbeb]' },
    { id: 'accepted', label: 'ACCEPTED', subLabel: 'Confirmed & in queue', dot: 'bg-indigo-500', bg: 'bg-[#f5f5ff]' },
    { id: 'in_progress', label: 'PREPARING', subLabel: 'Kitchen is cooking now', dot: 'bg-teal-500', bg: 'bg-[#f4fbf9]' },
  ];

  return (
    <div className={cn("min-h-screen bg-[#fafbfc]", inter.className)}>
      <DashboardHeader />
      
      {/* Tactical Header */}
      <div className="bg-white border-b px-8 py-4 shrink-0 text-left">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Order Hub</h1>
            
            <div className="h-10 w-px bg-slate-100 mx-2" />

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 px-4 py-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl shadow-sm">
                <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[11px] font-black text-[#166534] uppercase">Real-time Sync</span>
              </div>
              
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-slate-900 tabular-nums leading-none">
                  {activeOrders.length}
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    Active
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                    Tickets
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 px-5 py-3 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all shadow-sm group">
                  <Calendar className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span className="text-sm font-black text-slate-900">
                    {date && isSameDay(date, new Date()) ? 'Today' : date ? format(date, 'MMM d, yyyy') : 'Select Date'}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <div className="h-10 w-px bg-slate-100 mx-2" />

            <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-[20px] border border-slate-200/40 shadow-inner">
              <button 
                onClick={() => setView('grid')}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                  view === 'grid' 
                    ? "bg-white text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-100" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <LayoutGrid className={cn("h-4 w-4", view === 'grid' ? "text-slate-900" : "text-slate-400")} /> 
                Grid
              </button>
              <button 
                onClick={() => setView('board')}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                  view === 'board' 
                    ? "bg-white text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-100" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Columns className={cn("h-4 w-4", view === 'board' ? "text-slate-900" : "text-slate-400")} /> 
                Board
              </button>
            </div>
          </div>

        </div>
      </div>

      <main className="p-8">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-12">
          
          <div className="xl:col-span-3 min-w-0">
            {view === 'grid' ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                
                {/* Tactical Grid Controls */}
                <div className="flex items-center justify-between">
                  <div className="bg-white border border-slate-100 rounded-full p-1.5 flex items-center shadow-sm">
                    <button 
                      onClick={() => setGridStatusFilter('all')}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-200",
                        gridStatusFilter === 'all' 
                          ? "bg-[#f0fdf4]/50 border border-[#bbf7d0] text-[#166534]" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <div className="h-2 w-2 rounded-full bg-[#10b981]" />
                      <span className="text-[11px] font-bold uppercase">Live</span>
                      <span className={cn("text-[11px] font-bold ml-0.5", gridStatusFilter === 'all' ? "text-[#166534]/60" : "text-slate-300")}>
                        {orders.filter(o => {
                          const orderDate = new Date(o.timestamp);
                          return o.status !== 'exiting' && (date ? isSameDay(orderDate, date) : true);
                        }).length}
                      </span>
                    </button>
                    
                    <div className="h-4 w-px bg-slate-100 mx-2" />

                    <button 
                      onClick={() => setGridStatusFilter('pending')}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-200",
                        gridStatusFilter === 'pending' 
                          ? "bg-yellow-50/50 border border-yellow-200 text-yellow-700" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <div className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                      <span className="text-[11px] font-bold uppercase">Pending</span>
                      <span className={cn("text-[11px] font-bold ml-0.5", gridStatusFilter === 'pending' ? "text-yellow-700/60" : "text-slate-300")}>
                        {orders.filter(o => {
                          const orderDate = new Date(o.timestamp);
                          return o.status === 'pending' && (date ? isSameDay(orderDate, date) : true);
                        }).length}
                      </span>
                    </button>

                    <button 
                      onClick={() => setGridStatusFilter('accepted')}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-200",
                        gridStatusFilter === 'accepted' 
                          ? "bg-indigo-50/50 border border-indigo-200 text-indigo-700" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <div className="h-2 w-2 rounded-full bg-[#6366f1]" />
                      <span className="text-[11px] font-bold uppercase">Accepted</span>
                      <span className={cn("text-[11px] font-bold ml-0.5", gridStatusFilter === 'accepted' ? "text-indigo-700/60" : "text-slate-300")}>
                        {orders.filter(o => {
                          const orderDate = new Date(o.timestamp);
                          return o.status === 'accepted' && (date ? isSameDay(orderDate, date) : true);
                        }).length}
                      </span>
                    </button>

                    <button 
                      onClick={() => setGridStatusFilter('in_progress')}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-200",
                        gridStatusFilter === 'in_progress' 
                          ? "bg-[#f0fdfa] border border-[#ccfbf1] text-[#149d94]" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <div className="h-2 w-2 rounded-full bg-[#149d94]" />
                      <span className="text-[11px] font-bold uppercase">Preparing</span>
                      <span className={cn("text-[11px] font-bold ml-0.5", gridStatusFilter === 'in_progress' ? "text-[#149d94]/60" : "text-slate-300")}>
                        {orders.filter(o => {
                          const orderDate = new Date(o.timestamp);
                          return o.status === 'in_progress' && (date ? isSameDay(orderDate, date) : true);
                        }).length}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {zoom !== 100 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        onClick={() => setZoom(100)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="bg-white border border-slate-100 rounded-[20px] p-1 flex items-center shadow-sm">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        onClick={() => setZoom(prev => Math.max(50, prev - 25))}
                      >
                        <ZoomOut className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        onClick={() => setZoom(prev => Math.min(300, prev + 25))}
                      >
                        <ZoomIn className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <ScrollArea className="w-full">
                  <Card className="border-0 shadow-sm overflow-hidden rounded-[24px] bg-white ring-1 ring-slate-100" style={{ width: zoom > 100 ? `${zoom}%` : '100%' }}>
                    <div className="p-1 gap-1 grid grid-cols-10 border border-slate-100 bg-slate-50/20">
                      {gridSlots.map((order, idx) => (
                        <GridItem key={idx} order={order || undefined} />
                      ))}
                    </div>
                  </Card>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-w-0 animate-in fade-in slide-in-from-right-4 duration-500">
                {columns.map((col) => {
                  const columnOrders = getFilteredStatusOrders(col.id);
                  return (
                    <div key={col.id} className="flex flex-col min-w-0 h-[800px]">
                      <div className={cn("mb-6 rounded-2xl border border-slate-100 p-4 transition-all shadow-sm shrink-0", col.bg)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-left">
                            <div className={cn("h-2 w-2 rounded-full", col.dot)} />
                            <h2 className="text-sm font-bold text-slate-900 uppercase">{col.label}</h2>
                          </div>
                          <div className="bg-[#1e293b] text-white font-bold px-2 py-1 text-[10px] rounded shadow-sm min-w-[24px] text-center">
                            {columnOrders.length}
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400 mt-1 pl-[20px] text-left">{col.subLabel}</p>
                      </div>
                      
                      <ScrollArea className="flex-1">
                        <div className="space-y-5 pr-4 pb-12">
                          {columnOrders.length > 0 ? columnOrders.map((order) => (
                            <OrderCard key={order.id} order={order} now={now} />
                          )) : (
                            <div className="py-24 text-center opacity-25 flex flex-col items-center">
                              <ClipboardList className="h-10 w-10 mb-2 text-slate-300" />
                              <p className="text-[10px] font-bold uppercase text-slate-400">Queue Clear</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="xl:col-span-1 sticky top-[108px] self-start space-y-8 z-30">
            <div className="space-y-4">
              <div className="rounded-[24px] bg-gradient-to-br from-[#fefce8] via-white to-[#f5f3ff] p-6 shadow-sm border border-slate-100 text-left relative overflow-hidden">
                <div className="relative z-10 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-200/50 shadow-sm">
                      <HelpCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <p className="text-sm font-bold text-slate-900 leading-none">Live Order Tracking</p>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                        Real-time feed of all finalized transactions across the RAK branch network.
                      </p>
                    </div>
                </div>
              </div>

              <Card className="border-0 shadow-2xl bg-white overflow-hidden flex flex-col rounded-[32px] h-[680px]">
                <CardHeader className="bg-[#18B4A6] text-white p-6 shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
                    <Activity className="h-48 w-48 text-white" />
                  </div>
                  <div className="relative z-10 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md shadow-inner">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight">Activity Log</CardTitle>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 font-bold px-3 py-1 rounded-full text-[10px] shadow-sm">
                      20 ENTRIES
                    </Badge>
                  </div>
                  <p className="relative z-10 text-white/80 text-[10px] font-bold uppercase pl-1 text-left">Track your finalized orders</p>
                </CardHeader>
                
                <ScrollArea className="flex-1 bg-white">
                  <div className="relative p-6 pt-8 space-y-0 text-left">
                    <div className="absolute left-[39px] top-0 bottom-0 w-px border-l border-dashed border-slate-200 z-0" />
                    
                    {recentExits.length > 0 ? recentExits.map((event, index) => {
                      const config = exitConfig[event.type];
                      const isLatest = index === 0;
                      return (
                        <div 
                          key={event.id} 
                          className={cn(
                            "relative group transition-all duration-500 my-12",
                            event.isNew ? "z-20" : ""
                          )}
                        >
                          <div className={cn(
                              "relative flex items-start gap-4 p-4 rounded-2xl border transition-all",
                              isLatest ? "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] scale-[1.02] border-slate-100 animate-status-blink" : "bg-white border-transparent",
                              isLatest && cn("border-l-4", `border-l-${event.type === 'FAILED' ? 'slate-900' : event.type === 'REJECTED' ? 'orange-500' : event.type === 'CANCELLED' ? 'rose-500' : 'emerald-500'}`)
                          )}>
                            <div className={cn(
                              "h-3 w-3 rounded-full mt-1.5 shrink-0 shadow-sm relative z-10 border-2 border-white", 
                              config.dot
                            )} />
                            
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center justify-between mb-2">
                                 <span className="text-[15px] font-black tracking-tight text-slate-900">
                                   Order {event.orderNumber}
                                 </span>
                                 <span className="text-[9px] font-black uppercase text-slate-300 tracking-[0.1em]">
                                   JUST NOW
                                 </span>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3">
                                 <Badge className={cn("text-[9px] font-black uppercase px-3 py-0.5 rounded-full border-0", config.bg, "text-white")}>
                                   {event.type}
                                 </Badge>
                                 <span className="text-[11px] font-bold text-slate-400">
                                   Staff {event.server}
                                 </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="py-40 text-center opacity-30 flex flex-col items-center gap-4 px-10">
                        <Activity className="h-10 w-10 text-slate-200" />
                        <p className="text-[10px] font-bold uppercase text-slate-400">Monitoring Feeds</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-8 bg-slate-50/50 border-t flex items-center justify-center shrink-0">
                   <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-4">
                     <span className="h-px w-8 bg-slate-200" />
                     End of Feed
                     <span className="h-px w-8 bg-slate-200" />
                   </p>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
