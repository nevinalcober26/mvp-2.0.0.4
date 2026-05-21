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
  Armchair,
  Box,
  Circle,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { subMinutes } from 'date-fns';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
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
    color: 'text-blue-600',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50/50',
    accent: 'bg-blue-500',
    badge: 'bg-blue-500 text-white',
    text: 'PENDING'
  },
  accepted: {
    label: 'ACCEPTED',
    subLabel: 'Confirmed & in queue',
    icon: CheckCircle2,
    color: 'text-indigo-600',
    dot: 'bg-indigo-500',
    bg: 'bg-indigo-50/50',
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
    bg: 'bg-teal-50/50',
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

const exitConfig: Record<ExitType, { bg: string; text: string; icon: any; pulseColor: string; textColor: string; dot: string }> = {
  COMPLETED: { bg: 'bg-emerald-500', text: 'COMPLETED', icon: CheckCircle2, pulseColor: 'bg-emerald-500', textColor: 'text-emerald-500', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-rose-500', text: 'CANCELLED', icon: XCircle, pulseColor: 'bg-rose-500', textColor: 'text-rose-500', dot: 'bg-rose-500' },
  REJECTED: { bg: 'bg-rose-600', text: 'REJECTED', icon: XCircle, pulseColor: 'bg-rose-600', textColor: 'text-rose-600', dot: 'bg-rose-600' },
  FAILED: { bg: 'bg-slate-900', text: 'FAILED', icon: AlertCircle, pulseColor: 'bg-slate-900', textColor: 'text-slate-900', dot: 'bg-slate-900' },
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
    const minutesAgo = Math.floor(Math.random() * 10) + 1; 
    const timestamp = subMinutes(new Date(), minutesAgo).getTime();
    
    return {
      id: `${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `#${4820 + i}`,
      table: `T${Math.floor(Math.random() * 20) + 1}`,
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
  const config = isExiting && order.exitType ? exitConfig[order.exitType] : statusConfig[order.status];
  const Icon = isExiting ? exitConfig[order.exitType!].icon : (config as any).icon;
  
  const durationMs = now - order.timestamp;
  const isNew = durationMs < 5000;

  useEffect(() => {
    if (isExiting && cardRef.current) {
      const tl = gsap.timeline();
      tl.to(cardRef.current, {
        delay: 2.2,
        duration: 0.5,
        opacity: 0,
        scale: 0.8,
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
          "group relative transition-all duration-300 border-0 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-lg",
          isExiting && cn(config.bg, "scale-105 z-20 shadow-xl animate-status-blink text-white border-transparent")
        )}
      >
        <CardContent className="p-0 flex flex-col h-full relative z-10 text-left">
          {/* Status Left Accent Bar */}
          {!isExiting && (
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", (config as any).accent)} />
          )}

          <div className="p-5 space-y-4">
            {/* Top Row: ID & Status Badge */}
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className={cn("text-[9px] font-black uppercase tracking-widest", isExiting ? "text-white/60" : "text-slate-400")}>
                  ORDER ID
                </span>
                <h3 className={cn("text-xl font-bold tracking-tight", isExiting ? "text-white" : "text-slate-900")}>
                  {order.orderNumber}
                </h3>
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm",
                isExiting ? "bg-white text-slate-900" : (config as any).badge
              )}>
                <Icon className="h-3 w-3" />
                {(isExiting && order.exitType ? exitConfig[order.exitType].text : (config as any).text).toUpperCase()}
              </div>
            </div>

            {/* Middle Row: Server, Table & Timer */}
            <div className="flex items-end justify-between">
              <div className={cn("space-y-1.5", isExiting ? "text-white/80" : "text-slate-500")}>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 opacity-60" />
                  <span className="text-xs font-bold whitespace-nowrap">By Staff {order.server}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Armchair className="h-3.5 w-3.5 opacity-60" />
                  <span className="text-xs font-bold whitespace-nowrap">Table {order.table}</span>
                </div>
              </div>

              <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-lg font-black text-[10px] font-mono shadow-inner border",
                isExiting ? "bg-white/10 border-white/20 text-white" : "bg-slate-50 border-slate-100 text-slate-400"
              )}>
                <Clock className="h-3 w-3" />
                {formatDuration(durationMs)}
              </div>
            </div>

            {/* Bottom Row: Item Summary Box */}
            <div className={cn(
              "flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed",
              isExiting ? "bg-white/10 border-white/20" : "bg-slate-50/50 border-slate-100"
            )}>
               <Box className={cn("h-4 w-4", isExiting ? "text-white" : "text-slate-400")} />
               <span className={cn("text-xs font-black uppercase tracking-widest", isExiting ? "text-white" : "text-slate-500")}>
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
  const [now, setNow] = useState(Date.now());

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
            table: `T${Math.floor(Math.random() * 20) + 1}`,
            status: 'pending',
            itemsCount: Math.floor(Math.random() * 5) + 1,
            server: servers[Math.floor(Math.random() * servers.length)],
            timestamp: Date.now(),
          };
          return [newOrder, ...prev];
        }
        if (rand > 0.15 && rand < 0.35) {
          const pendingIdx = prev.findIndex(o => o.status === 'pending');
          if (pendingIdx !== -1) {
            return prev.map((o, i) => i === pendingIdx ? { ...o, status: 'accepted' as HubStatus } : o);
          }
        }
        if (rand > 0.35 && rand < 0.55) {
          const acceptedIdx = prev.findIndex(o => o.status === 'accepted');
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
        const randomExit = Math.random() > 0.8 ? (['CANCELLED', 'REJECTED', 'FAILED'][Math.floor(Math.random() * 3)] as ExitType) : 'COMPLETED';
        let target: HubOrder | undefined;
        if (randomExit === 'COMPLETED') {
          const preparingCandidates = candidates.filter(o => o.status === 'in_progress');
          if (preparingCandidates.length > 0) target = preparingCandidates[Math.floor(Math.random() * preparingCandidates.length)];
          else return prev;
        } else {
          target = candidates[Math.floor(Math.random() * candidates.length)];
        }
        if (!target) return prev;
        const newLog: EventLog = {
          id: Math.random().toString(),
          orderNumber: target.orderNumber,
          type: randomExit,
          timestamp: new Date(),
          server: target.server,
          isNew: true
        };
        setRecentExits(prevExits => [newLog, ...prevExits.map(le => ({ ...le, isNew: false }))].slice(0, 20));
        const updated = prev.map(o => o.id === target!.id ? { ...o, status: 'exiting' as HubStatus, exitType: randomExit, originalStatus: o.status } : o);
        setTimeout(() => setOrders(current => current.filter(o => o.id !== target!.id)), 3200);
        return updated;
      });
    }, 10000);
    return () => clearInterval(finalizationInterval);
  }, []);

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

  const columns: { id: HubStatus; label: string; subLabel: string; dot: string }[] = [
    { id: 'pending', label: 'PENDING', subLabel: 'New orders to review', dot: 'bg-blue-500' },
    { id: 'accepted', label: 'ACCEPTED', subLabel: 'Confirmed & in queue', dot: 'bg-indigo-500' },
    { id: 'in_progress', label: 'PREPARING', subLabel: 'Kitchen is cooking now', dot: 'bg-teal-500' },
  ];

  return (
    <div className={cn("min-h-screen bg-slate-50 flex flex-col", inter.className)}>
      <DashboardHeader />
      
      <div className="bg-white border-b px-6 py-6 shrink-0 text-left">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 text-left">
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
                  placeholder="Search order, table, or waiter..." 
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
                   <SelectItem value="24" className="font-bold">Today</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 relative overflow-visible">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-10">
          {/* Kanban Columns */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0 h-full">
            {columns.map((col) => {
              const columnOrders = getFilteredStatusOrders(col.id);
              return (
                <div key={col.id} className="flex flex-col min-w-0 h-full text-left">
                  <div className="flex items-center justify-between mb-5 px-1">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", col.dot)} />
                        <h2 className="text-sm font-black text-slate-900 tracking-wider">{col.label}</h2>
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 pl-4">{col.subLabel}</p>
                    </div>
                    <Badge className="bg-slate-900 text-white font-black px-2.5 py-1 text-[11px] rounded-lg shadow-sm">
                      {columnOrders.length}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 space-y-4 pb-20">
                    {columnOrders.length > 0 ? columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} now={now} />
                    )) : (
                      <div className="py-20 text-center opacity-20 flex flex-col items-center">
                        <ClipboardList className="h-10 w-10 mb-2 text-slate-300" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Queue Clear</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Log Sidebar */}
          <aside className="xl:col-span-1 sticky top-[88px] self-start text-left h-fit">
            <div className="space-y-6">
              <Card className="border-0 shadow-2xl bg-white overflow-hidden flex flex-col rounded-[32px] h-[640px]">
                <CardHeader className="bg-[#18B4A6] text-white p-6 pb-8 shrink-0 relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg font-black tracking-tight uppercase">
                        Activity Log
                      </CardTitle>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 font-black px-3 py-1 rounded-full text-xs">
                      20
                    </Badge>
                  </div>
                  <p className="relative z-10 text-white/80 text-[11px] font-bold uppercase tracking-wider pl-1">
                    Track your finalized orders
                  </p>
                </CardHeader>
                
                <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
                  {/* Timeline Background Line */}
                  <div className="absolute left-10 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-100 z-0" />

                  <ScrollArea className="flex-1">
                    <div className="p-6 pt-2 space-y-8 relative z-10">
                      {recentExits.length > 0 ? recentExits.map((event) => {
                        const config = exitConfig[event.type];
                        return (
                          <div 
                            key={event.id} 
                            className={cn(
                              "relative transition-all duration-500 rounded-2xl",
                              event.isNew && cn("animate-status-blink z-20 shadow-xl text-white py-4 px-6 scale-[1.02]", config.bg)
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "h-2 w-2 rounded-full mt-2.5 shrink-0 shadow-sm relative z-10", 
                                event.isNew ? "bg-white ring-4 ring-white/30" : config.dot
                              )} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                   <span className={cn("text-base font-black tracking-tight", event.isNew ? "text-white" : "text-slate-900")}>
                                     Order {event.orderNumber}
                                   </span>
                                   <span className={cn("text-[9px] font-black uppercase tracking-widest", event.isNew ? "text-white/60" : "text-slate-400")}>
                                     JUST NOW
                                   </span>
                                </div>
                                <div className="flex items-center gap-3">
                                   <div className={cn(
                                     "px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase",
                                     event.isNew ? "bg-white text-slate-900" : cn(config.bg, "text-white")
                                   )}>
                                      {event.type}
                                    </div>
                                   <span className={cn("text-xs font-bold", event.isNew ? "text-white/80" : "text-slate-500")}>
                                     Staff {event.server}
                                   </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="py-32 text-center opacity-30 flex flex-col items-center gap-4 px-10">
                          <Activity className="h-10 w-10 text-slate-200" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Monitoring Feeds</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-5 bg-slate-50/50 border-t flex items-center justify-center shrink-0">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">End of Feed</p>
                  </div>
                </div>
              </Card>

              {/* Informational Gradient Box */}
              <div className="rounded-[32px] bg-gradient-to-br from-yellow-50 via-white to-purple-50 p-6 shadow-sm border border-white/80 text-left">
                 <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-200/50">
                      <HelpCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-1.5 text-left">
                       <p className="text-sm font-black text-slate-900 leading-none">Live Order Tracking</p>
                       <p className="text-[11px] leading-relaxed text-slate-500 font-bold">
                         This board simulates real kitchen flow. Timers show exactly how many minutes have passed since the customer ordered.
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
