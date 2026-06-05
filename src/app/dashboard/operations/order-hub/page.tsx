'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { subMinutes } from 'date-fns';
import gsap from 'gsap';

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
  const [lookbackHours, setLookbackHours] = useState('24');
  const [now, setNow] = useState(Date.now());
  const [view, setView] = useState<'grid' | 'board'>('grid');

  useEffect(() => {
    setOrders(generateMockOrders(20));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const rand = Math.random();
        if (rand < 0.15) {
          const newOrder: HubOrder = {
            id: Math.random().toString(36).substr(2, 9),
            orderNumber: `#${4800 + Math.floor(Math.random() * 1000)}`,
            table: `T${Math.floor(Math.random() * 24) + 1}`,
            status: 'pending',
            itemsCount: Math.floor(Math.random() * 5) + 1,
            server: servers[Math.floor(Math.random() * servers.length)],
            timestamp: Date.now(),
          };
          return [newOrder, ...prev];
        }
        if (rand > 0.15 && rand < 0.35) {
          const pendingIdx = prev.findIndex(o => o.status === 'pending' && o.status !== 'exiting');
          if (pendingIdx !== -1) {
            return prev.map((o, i) => i === pendingIdx ? { ...o, status: 'accepted' as HubStatus } : o);
          }
        }
        if (rand > 0.35 && rand < 0.55) {
          const acceptedIdx = prev.findIndex(o => o.status === 'accepted' && o.status !== 'exiting');
          if (acceptedIdx !== -1) {
            return prev.map((o, i) => i === acceptedIdx ? { ...o, status: 'in_progress' as HubStatus } : o);
          }
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const finalizationInterval = setInterval(() => {
      setOrders(prev => {
        const candidates = prev.filter(o => o.status !== 'exiting');
        if (candidates.length === 0) return prev;
        
        const exitOptions: ExitType[] = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'];
        const randomExit = exitOptions[Math.floor(Math.random() * exitOptions.length)];
        
        let target: HubOrder | undefined;
        
        if (randomExit === 'COMPLETED') {
            const inPreparing = candidates.filter(o => o.status === 'in_progress');
            if (inPreparing.length > 0) {
              target = inPreparing[Math.floor(Math.random() * inPreparing.length)];
            } else {
              const fallbackExits: ExitType[] = ['CANCELLED', 'REJECTED', 'FAILED'];
              const fallbackExit = fallbackExits[Math.floor(Math.random() * fallbackExits.length)];
              target = candidates[Math.floor(Math.random() * candidates.length)];
              if (!target) return prev;
              return executeExit(prev, target, fallbackExit);
            }
        } else {
            target = candidates[Math.floor(Math.random() * candidates.length)];
        }

        if (!target) return prev;
        return executeExit(prev, target, randomExit);
      });
    }, 10000);
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
    
    setRecentExits(prevExits => [newLog, ...prevExits.map(le => ({ ...le, isNew: false }))].slice(0, 20));

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
    const lookbackThreshold = now - (parseInt(lookbackHours) * 60 * 60 * 1000);
    return orders.filter(o => {
      const activeStatus = o.status === 'exiting' ? o.originalStatus : o.status;
      if (activeStatus !== status) return false;
      if (o.timestamp < lookbackThreshold) return false;
      return o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
             o.server.toLowerCase().includes(search.toLowerCase()) ||
             o.table.toLowerCase().includes(search.toLowerCase());
    }).sort((a, b) => a.timestamp - b.timestamp);
  };

  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'exiting'), [orders]);
  
  const gridSlots = useMemo(() => {
    const sorted = [...activeOrders].sort((a, b) => a.timestamp - b.timestamp);
    const slots = Array(80).fill(null);
    sorted.forEach((o, i) => { if (i < 80) slots[i] = o; });
    return slots;
  }, [activeOrders]);

  const columns: { id: HubStatus; label: string; subLabel: string; dot: string; bg: string }[] = [
    { id: 'pending', label: 'PENDING', subLabel: 'New orders to review', dot: 'bg-yellow-400', bg: 'bg-[#fffbeb]' },
    { id: 'accepted', label: 'ACCEPTED', subLabel: 'Confirmed & in queue', dot: 'bg-indigo-500', bg: 'bg-[#f5f5ff]' },
    { id: 'in_progress', label: 'PREPARING', subLabel: 'Kitchen is cooking now', dot: 'bg-teal-500', bg: 'bg-[#f4fbf9]' },
  ];

  return (
    <div className={cn("min-h-screen bg-[#fafbfc]", inter.className)}>
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-6 shrink-0 text-left">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <h1 className="text-[28px] font-black tracking-tight text-slate-900">Live Order Hub</h1>
            <div className="flex items-center gap-1.5 bg-slate-50 border rounded-lg p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-slate-600"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-slate-600"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
             <div className="flex items-center gap-5 px-6 py-2.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#10b981]" />
                  <span className="text-[11px] font-bold text-slate-900 uppercase">Live <span className="text-slate-400 ml-0.5">{activeOrders.length}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="text-[11px] font-bold text-slate-900 uppercase">Pending <span className="text-slate-400 ml-0.5">{activeOrders.filter(o => o.status === 'pending').length}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-[11px] font-bold text-slate-900 uppercase">Accepted <span className="text-slate-400 ml-0.5">{activeOrders.filter(o => o.status === 'accepted').length}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-teal-500" />
                  <span className="text-[11px] font-bold text-slate-900 uppercase">In Progress <span className="text-slate-400 ml-0.5">{activeOrders.filter(o => o.status === 'in_progress').length}</span></span>
                </div>
             </div>

             <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
               <Button 
                size="sm"
                onClick={() => setView('grid')}
                className={cn(
                  "rounded-lg h-9 px-4 font-bold transition-all",
                  view === 'grid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
               >
                 <LayoutGrid className="h-4 w-4 mr-2" /> Grid
               </Button>
               <Button 
                size="sm"
                onClick={() => setView('board')}
                className={cn(
                  "rounded-lg h-9 px-4 font-bold transition-all",
                  view === 'board' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
               >
                 <Columns className="h-4 w-4 mr-2" /> Board
               </Button>
             </div>
          </div>
        </div>
      </div>

      <main className="p-8">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-12">
          
          <div className="xl:col-span-3 min-w-0">
            {view === 'grid' ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <Card className="border-0 shadow-sm overflow-hidden rounded-[24px] bg-white ring-1 ring-slate-100">
                  <div className="p-1 gap-1 grid grid-cols-10 border border-slate-100 bg-slate-50/20">
                    {gridSlots.map((order, idx) => (
                      <GridItem key={idx} order={order} />
                    ))}
                  </div>
                </Card>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {columns.map(col => {
                    const count = activeOrders.filter(o => o.status === col.id).length;
                    return (
                      <Card key={col.id} className="border shadow-none rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                        <CardHeader className={cn("p-5 border-b transition-colors", col.bg)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn("h-3 w-3 rounded-full", col.dot)} />
                              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{col.label}</span>
                            </div>
                            <span className="text-xl font-black text-slate-900">{count}</span>
                          </div>
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-w-0 animate-in fade-in slide-in-from-right-4 duration-500">
                {columns.map((col) => {
                  const columnOrders = getFilteredStatusOrders(col.id);
                  return (
                    <div key={col.id} className="flex flex-col min-w-0">
                      <div className={cn("mb-6 rounded-2xl border border-slate-100 p-4 transition-all shadow-sm", col.bg)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("h-2 w-2 rounded-full", col.dot)} />
                            <h2 className="text-sm font-bold text-slate-900 uppercase">{col.label}</h2>
                          </div>
                          <div className="bg-[#1e293b] text-white font-bold px-2 py-1 text-[10px] rounded shadow-sm min-w-[24px] text-center">
                            {columnOrders.length}
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400 mt-1 pl-[20px] text-left">{col.subLabel}</p>
                      </div>
                      
                      <div className="space-y-5">
                        {columnOrders.length > 0 ? columnOrders.map((order) => (
                          <OrderCard key={order.id} order={order} now={now} />
                        )) : (
                          <div className="py-24 text-center opacity-25 flex flex-col items-center">
                            <ClipboardList className="h-10 w-10 mb-2 text-slate-300" />
                            <p className="text-[10px] font-bold uppercase text-slate-400">Queue Clear</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="xl:col-span-1 sticky top-[108px] self-start space-y-8 z-30">
            <div className="space-y-4">
              <div className="rounded-[24px] bg-white p-6 shadow-sm border border-slate-100 text-left">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-200/50">
                      <HelpCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <p className="text-sm font-bold text-slate-900 leading-none">Order Tracking</p>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                        {view === 'grid' 
                          ? "Grid View provides a bird's eye view of all active machine IDs currently in processing."
                          : "Board View tracks specific ticket timers to help staff manage throughput speed."
                        }
                      </p>
                    </div>
                </div>
              </div>

              <Card className="border-0 shadow-2xl bg-white overflow-hidden flex flex-col rounded-[32px] h-[640px]">
                <CardHeader className="bg-[#18B4A6] text-white p-6 shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
                    <Activity className="h-48 w-48 text-white" />
                  </div>
                  <div className="relative z-10 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold uppercase">Activity Log</CardTitle>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 font-bold px-3 py-1 rounded-full text-[10px]">
                      {recentExits.length} ENTRIES
                    </Badge>
                  </div>
                  <p className="relative z-10 text-white/80 text-[10px] font-bold uppercase pl-1 text-left">Track your finalized orders</p>
                </CardHeader>
                
                <ScrollArea className="flex-1 bg-white">
                  <div className="relative p-6 pt-8 space-y-0">
                    <div className="absolute left-[39px] top-0 bottom-0 w-px border-l border-dashed border-slate-200 z-0" />
                    
                    {recentExits.length > 0 ? recentExits.map((event, index) => {
                      const config = exitConfig[event.type];
                      const isLatest = index === 0;
                      return (
                        <div 
                          key={event.id} 
                          className={cn(
                            "relative group transition-all duration-500 rounded-2xl mb-8",
                            event.isNew ? "animate-status-blink z-20" : ""
                          )}
                        >
                          {event.isNew && (
                              <div className={cn("absolute -inset-2 rounded-2xl opacity-10 blur-xl", config.bg)} />
                          )}
                          
                          <div className={cn(
                              "relative flex items-start gap-4 p-4 rounded-2xl border transition-all",
                              isLatest ? "bg-white shadow-xl scale-[1.02] border-slate-100" : "bg-white border-transparent",
                              event.isNew ? cn("border-l-4", `border-l-${event.type.toLowerCase()}-500`) : isLatest ? cn("border-l-4", `border-l-${event.type.toLowerCase()}-500`) : ""
                          )}>
                            {isLatest && (
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl", config.bg)} />
                            )}
                            
                            <div className={cn(
                              "h-3 w-3 rounded-full mt-1.5 shrink-0 shadow-sm relative z-10 border-2 border-white", 
                              config.dot
                            )} />
                            
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center justify-between mb-2">
                                 <span className="text-[15px] font-bold tracking-tight text-slate-900">
                                   Order {event.orderNumber}
                                 </span>
                                 <span className="text-[9px] font-bold uppercase text-slate-400">
                                   JUST NOW
                                 </span>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3">
                                 <Badge className={cn("text-[9px] font-bold uppercase px-3 py-0.5 rounded-full border-0", config.bg, "text-white")}>
                                   {event.type}
                                 </Badge>
                                 <span className="text-[11px] font-semibold text-slate-500">
                                   By Staff {event.server}
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
                
                <div className="p-5 bg-slate-50 border-t flex items-center justify-center shrink-0">
                   <p className="text-[10px] font-bold text-slate-300 uppercase">End of Log</p>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
