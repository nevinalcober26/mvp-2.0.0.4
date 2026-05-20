
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Package,
  Search,
  Activity,
  Timer,
  HelpCircle,
  User,
  RefreshCw,
  ClipboardList,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { formatDistanceToNow, subDays, subHours } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import gsap from 'gsap';

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
  timeOpenMinutes: number;
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

const statusConfig: Record<HubStatus, { label: string; subLabel: string; icon: any; color: string; dot: string; bg: string; accent: string; tooltip: string }> = {
  pending: {
    label: 'PENDING',
    subLabel: 'New orders to review',
    icon: Clock,
    color: 'text-blue-600',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50/50',
    accent: 'bg-blue-500',
    tooltip: 'Total time since customer placed the order. Awaiting staff acknowledgement.',
  },
  accepted: {
    label: 'ACCEPTED',
    subLabel: 'Confirmed & in queue',
    icon: CheckCircle2,
    color: 'text-indigo-600',
    dot: 'bg-indigo-500',
    bg: 'bg-indigo-50/50',
    accent: 'bg-indigo-500',
    tooltip: 'Total time since customer placed the order. Staff has confirmed, ticket is in kitchen queue.',
  },
  in_progress: {
    label: 'PREPARING',
    subLabel: 'Kitchen is cooking now',
    icon: Play,
    color: 'text-teal-600',
    dot: 'bg-teal-500',
    bg: 'bg-teal-50/50',
    accent: 'bg-teal-500',
    tooltip: 'Total time since customer placed the order. Kitchen is currently cooking this order.',
  },
  exiting: {
    label: 'UPDATING',
    subLabel: 'Processing...',
    icon: RefreshCw,
    color: 'text-white',
    dot: 'bg-white',
    bg: 'bg-slate-900',
    accent: 'bg-white',
    tooltip: 'Finalizing ticket status...',
  }
};

const exitConfig: Record<ExitType, { bg: string; text: string; icon: any; pulseColor: string }> = {
  COMPLETED: { bg: 'bg-emerald-600', text: 'COMPLETED', icon: CheckCircle2, pulseColor: 'bg-emerald-50' },
  CANCELLED: { bg: 'bg-rose-600', text: 'CANCELLED', icon: XCircle, pulseColor: 'bg-rose-50' },
  REJECTED: { bg: 'bg-rose-700', text: 'REJECTED', icon: XCircle, pulseColor: 'bg-rose-100' },
  FAILED: { bg: 'bg-slate-900', text: 'FAILED', icon: AlertCircle, pulseColor: 'bg-slate-100' },
};

const servers = ['Alex', 'Maria', 'John', 'Sarah', 'Emma', 'Lisa', 'David', 'James', 'Sophie', 'Michael'];
const statuses: HubStatus[] = ['pending', 'accepted', 'in_progress'];

const generateMockOrders = (count: number): HubOrder[] => {
  return Array.from({ length: count }, (_, i) => {
    const hoursAgo = Math.floor(Math.random() * 48); 
    const timestamp = subHours(new Date(), hoursAgo).getTime();
    
    return {
      id: `${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `#${4420 + i}`,
      status: statuses[i % 3],
      itemsCount: Math.floor(Math.random() * 6) + 1,
      server: servers[Math.floor(Math.random() * servers.length)],
      timeOpenMinutes: Math.floor(Math.random() * 20) + 1,
      timestamp: timestamp,
    };
  });
};

const OrderCard = ({ order }: { order: HubOrder }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isExiting = order.status === 'exiting';
  const config = isExiting && order.exitType ? exitConfig[order.exitType] : statusConfig[order.status];
  const Icon = isExiting ? exitConfig[order.exitType!].icon : (config as any).icon;
  const isDelayed = order.timeOpenMinutes > 15 && order.status === 'pending';

  useEffect(() => {
    if (isExiting && cardRef.current) {
      const tl = gsap.timeline();
      tl.to(cardRef.current, {
        delay: 2.2,
        duration: 0.5,
        opacity: 0,
        scale: 0.95,
        ease: 'power2.inOut'
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
        "w-full animate-in fade-in zoom-in-95 duration-500",
        order.timeOpenMinutes === 0 ? "slide-in-from-top-4" : "slide-in-from-left-4"
      )}
    >
      <Card 
        className={cn(
          "group relative transition-all duration-300 border shadow-sm rounded-xl overflow-hidden",
          isExiting ? cn(config.bg, "scale-105 z-20 shadow-xl animate-status-blink text-white border-transparent") : "bg-white hover:shadow-md",
          isDelayed && !isExiting && "border-rose-200 bg-rose-50/30"
        )}
      >
        <CardContent className="p-0 flex flex-col h-full relative z-10 text-left">
          {!isExiting && (
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", (config as any).accent)} />
          )}

          <div className={cn(
            "px-4 py-3 flex items-center justify-between",
            isExiting ? "bg-black/10" : "border-b bg-slate-50/50"
          )}>
            <div className="flex flex-col">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-tight", 
                isExiting ? "text-white/60" : "text-slate-400"
              )}>
                  {isExiting ? 'Final Status' : 'Order ID'}
              </span>
              <h3 className={cn("text-base font-bold", isExiting ? "text-white" : "text-slate-900")}>
                {order.orderNumber}
              </h3>
            </div>
            
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm",
              isExiting ? "bg-white text-slate-900" : cn((config as any).accent, "text-white")
            )}>
              <Icon className="h-3 w-3" />
              {(isExiting && order.exitType ? exitConfig[order.exitType].text : (config as any).label).toUpperCase()}
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className={cn("flex items-center gap-1.5", isExiting ? "text-white/80" : "text-slate-500")}>
                  <User className="h-3.5 w-3.5 opacity-70" />
                  <span className="font-medium text-xs text-inherit">Waiter: {order.server}</span>
                </div>
                
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-xs cursor-help transition-colors",
                        isExiting ? "bg-white/10" : isDelayed ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
                      )}>
                        <Timer className="h-3 w-3" />
                        {order.timeOpenMinutes}m
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[280px] p-3 text-xs leading-relaxed bg-slate-900 text-white border-slate-800 shadow-xl z-[100]">
                      <p className="font-bold mb-1">Status Timing</p>
                      <p className="opacity-90 font-medium">{(config as any).tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className={cn(
              "flex items-center justify-center gap-2 py-2 rounded-lg border",
              isExiting ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-100"
            )}>
               <Package className={cn("h-4 w-4", isExiting ? "text-white" : "text-primary/70")} />
               <span className={cn("text-xs font-bold", isExiting ? "text-white" : "text-slate-700")}>
                 {order.itemsCount} Items
               </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function OrderHubPage() {
  const [orders, setOrders] = useState<HubOrder[]>([]);
  const [recentExits, setRecentExits] = useState<EventLog[]>([]);
  const [search, setSearch] = useState('');
  const [lookbackHours, setLookbackHours] = useState('24');

  useEffect(() => {
    setOrders(generateMockOrders(20));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const rand = Math.random();

        // 1. Chance to add a new PENDING order
        if (rand < 0.15) {
          const newOrder: HubOrder = {
            id: Math.random().toString(36).substr(2, 9),
            orderNumber: `#${4500 + Math.floor(Math.random() * 1000)}`,
            status: 'pending',
            itemsCount: Math.floor(Math.random() * 5) + 1,
            server: servers[Math.floor(Math.random() * servers.length)],
            timeOpenMinutes: 0,
            timestamp: Date.now(),
          };
          return [newOrder, ...prev];
        }

        // 2. Chance to progress an order from PENDING -> ACCEPTED
        if (rand > 0.15 && rand < 0.35) {
          const pendingIdx = prev.findIndex(o => o.status === 'pending');
          if (pendingIdx !== -1) {
            return prev.map((o, i) => i === pendingIdx ? { ...o, status: 'accepted' } : o);
          }
        }

        // 3. Chance to progress an order from ACCEPTED -> PREPARING
        if (rand > 0.35 && rand < 0.55) {
          const acceptedIdx = prev.findIndex(o => o.status === 'accepted');
          if (acceptedIdx !== -1) {
            return prev.map((o, i) => i === acceptedIdx ? { ...o, status: 'in_progress' } : o);
          }
        }

        // 4. Chance to FINALIZE an order (Exit Simulation)
        if (rand > 0.55 && rand < 0.75) {
          const candidates = prev.filter(o => o.status === 'in_progress');
          if (candidates.length === 0) return prev;

          const target = candidates[Math.floor(Math.random() * candidates.length)];
          const exitTypes: ExitType[] = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'];
          const randomExit = Math.random() > 0.7 ? exitTypes[Math.floor(Math.random() * exitTypes.length)] : 'COMPLETED';

          const updated = prev.map(o => {
            if (o.id === target.id) {
              return { 
                ...o, 
                status: 'exiting' as HubStatus, 
                exitType: randomExit as ExitType,
                originalStatus: o.status 
              };
            }
            return o;
          });

          // Log the event
          const newLog: EventLog = {
            id: Math.random().toString(),
            orderNumber: target.orderNumber,
            type: randomExit as ExitType,
            timestamp: new Date(),
            server: target.server,
            isNew: true
          };

          setRecentExits(prevExits => [newLog, ...prevExits.map(le => ({ ...le, isNew: false }))].slice(0, 15));

          // Physical removal after animation completion
          setTimeout(() => {
            setOrders(current => current.filter(o => o.id !== target.id));
          }, 3000);

          return updated;
        }

        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getFilteredStatusOrders = (status: HubStatus) => {
    const now = new Date().getTime();
    const lookbackThreshold = now - (parseInt(lookbackHours) * 60 * 60 * 1000);

    return orders.filter(o => {
      const activeStatus = o.status === 'exiting' ? o.originalStatus : o.status;
      if (activeStatus !== status) return false;

      // Filter by Lookback Period
      if (o.timestamp < lookbackThreshold) return false;

      // Filter by Search Query
      const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                           o.server.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    }).sort((a, b) => b.timeOpenMinutes - a.timeOpenMinutes);
  };

  const columns: { id: HubStatus; label: string; subLabel: string; dot: string; bg: string }[] = [
    { id: 'pending', label: 'PENDING', subLabel: 'New orders to review', dot: 'bg-blue-500', bg: 'bg-blue-50/50' },
    { id: 'accepted', label: 'ACCEPTED', subLabel: 'Confirmed & in queue', dot: 'bg-indigo-500', bg: 'bg-indigo-50/50' },
    { id: 'in_progress', label: 'PREPARING', subLabel: 'Kitchen is cooking now', dot: 'bg-teal-500', bg: 'bg-teal-50/50' },
  ];

  return (
    <div className={cn("min-h-screen bg-slate-50 flex flex-col", inter.className)}>
      <DashboardHeader />
      
      <div className="bg-white border-b px-6 py-6 shrink-0 text-left">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Live Order Hub</h1>
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 gap-1.5 px-2 py-0.5 font-bold text-[10px]">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 SYSTEM LIVE
               </Badge>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{orders.filter(o => o.status !== 'exiting').length} ACTIVE TICKETS</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search order or waiter..." 
                  className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all shadow-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>

             <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 h-11">
               <Calendar className="h-4 w-4 text-slate-400" />
               <Label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Period:</Label>
               <Select value={lookbackHours} onValueChange={setLookbackHours}>
                 <SelectTrigger className="w-[140px] border-0 bg-transparent shadow-none focus:ring-0 font-bold text-slate-900 p-0 h-auto">
                   <SelectValue placeholder="Lookback" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl shadow-xl">
                   <SelectItem value="1" className="font-bold">Last Hour</SelectItem>
                   <SelectItem value="6" className="font-bold">Last 6 Hours</SelectItem>
                   <SelectItem value="12" className="font-bold">Last 12 Hours</SelectItem>
                   <SelectItem value="24" className="font-bold">Today</SelectItem>
                   <SelectItem value="48" className="font-bold">Last 2 Days</SelectItem>
                   <SelectItem value="168" className="font-bold">Last 7 Days</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-6 flex gap-6">
        <div className="flex-1 flex gap-6 min-w-0">
          {columns.map((col) => {
            const columnOrders = getFilteredStatusOrders(col.id);
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[280px] h-full text-left">
                <div className={cn("flex flex-col gap-0.5 mb-4 px-4 py-4 rounded-xl border transition-all", col.bg)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2.5 w-2.5 rounded-full", col.dot)} />
                      <h2 className="text-sm font-bold text-slate-800 tracking-tight">{col.label}</h2>
                    </div>
                    <Badge className="bg-slate-900 text-white font-bold px-2 py-0 h-5 text-[10px] rounded-md">
                      {columnOrders.length}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 pl-4.5 mt-0.5">{col.subLabel}</p>
                </div>
                
                <ScrollArea className="flex-1 rounded-2xl bg-slate-200/20 border border-white/50 p-4 shadow-inner">
                  <div className="flex flex-col gap-4 pb-20">
                    {columnOrders.length > 0 ? columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    )) : (
                      <div className="py-20 text-center opacity-30">
                        <ClipboardList className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Column Clear</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>

        <aside className="w-80 hidden xl:flex flex-col gap-6 shrink-0 text-left">
          <Card className="flex-1 border shadow-sm bg-white overflow-hidden flex flex-col rounded-2xl">
            <CardHeader className="bg-slate-900 text-white p-6 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <CardTitle className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-400" /> Activity Log
                </CardTitle>
                <Badge className="bg-white/10 text-white border-0 text-[10px] font-bold px-2 py-0 rounded-md">{recentExits.length}</Badge>
              </div>
              <CardDescription className="text-white/40 text-[10px] font-medium uppercase tracking-wider">
                History of finalized tickets.
              </CardDescription>
            </CardHeader>
            
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {recentExits.length > 0 ? recentExits.map((event) => {
                  const config = exitConfig[event.type];
                  return (
                    <div 
                      key={event.id} 
                      className={cn(
                        "relative pl-6 pb-6 border-l last:border-0 last:pb-0 transition-all duration-1000",
                        event.isNew ? cn("animate-status-blink rounded-r-lg py-2 -ml-2 pl-8", config.pulseColor) : ""
                      )}
                    >
                      <div className={cn("absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white shadow-sm", config.bg)} />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-slate-900">Order {event.orderNumber}</span>
                           <span className="text-[9px] font-bold text-slate-400">{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge className={cn("text-[9px] font-bold h-4 px-1.5 border-0 rounded-md", config.bg, "text-white")}>
                              {event.type}
                           </Badge>
                           <span className="text-[10px] font-medium text-slate-500 italic">By {event.server}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-20 text-center opacity-30">
                    <Activity className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Monitoring...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          <Card className="bg-white border p-5 rounded-2xl shadow-sm">
             <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                   <p className="text-xs font-bold text-slate-900">Simulation Active</p>
                   <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                     The system is simulating live orders. New cards will <span className="text-primary font-bold">fade and zoom in</span> as they progress through the kitchen columns.
                   </p>
                </div>
             </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
