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
    color: 'text-blue-600',
    dot: 'bg-[#4379ee]',
    bg: 'bg-[#f4f7ff]',
    accent: 'bg-blue-500',
    badge: 'bg-blue-600 text-white',
    text: 'PENDING'
  },
  accepted: {
    label: 'ACCEPTED',
    subLabel: 'Confirmed & in queue',
    icon: CheckCircle2,
    color: 'text-indigo-600',
    dot: 'bg-[#6366f1]',
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
    dot: 'bg-[#50bfa5]',
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
  COMPLETED: { bg: 'bg-emerald-500', text: 'COMPLETED', icon: CheckCircle2, dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-orange-500', text: 'CANCELLED', icon: XCircle, dot: 'bg-orange-500' },
  REJECTED: { bg: 'bg-rose-600', text: 'REJECTED', icon: XCircle, dot: 'bg-rose-600' },
  FAILED: { bg: 'bg-purple-600', text: 'FAILED', icon: AlertCircle, dot: 'bg-purple-600' },
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
    // Generate realistic kitchen wait times between 1 and 21 minutes
    const minutesAgo = Math.floor(Math.random() * 21) + 1; 
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
  const isCritical = durationMs >= 1200000; // 20 minutes in ms
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
          "group relative transition-all duration-300 border shadow-sm rounded-[24px] overflow-hidden bg-white hover:shadow-lg",
          isCritical && "bg-[#fff1f1] border-red-500 ring-1 ring-red-500/20",
          isExiting && cn(config.bg, "scale-105 z-20 shadow-xl animate-status-blink text-white border-transparent")
        )}
      >
        <CardContent className="p-0 flex flex-col h-full relative z-10 text-left">
          {!isExiting && (
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", isCritical ? "bg-red-500" : (config as any).accent)} />
          )}

          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className={cn("text-[9px] font-black uppercase tracking-widest", isExiting ? "text-white/60" : "text-slate-400")}>
                  ORDER ID
                </span>
                <h3 className={cn("text-2xl font-bold tracking-tight", isExiting ? "text-white" : "text-slate-900")}>
                  {order.orderNumber}
                </h3>
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black shadow-sm",
                isExiting ? "bg-white text-slate-900" : (config as any).badge
              )}>
                <Icon className="h-3 w-3" />
                {(isExiting && order.exitType ? exitConfig[order.exitType].text : (config as any).text).toUpperCase()}
              </div>
            </div>

            <div className="h-px bg-slate-100 opacity-50 mx-[-20px]" />

            <div className="flex items-end justify-between">
              <div className={cn("space-y-2", isExiting ? "text-white/80" : "text-slate-600")}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 opacity-60" />
                  <span className="text-sm font-bold whitespace-nowrap">By Staff {order.server}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Armchair className="h-4 w-4 opacity-60" />
                  <span className="text-sm font-bold whitespace-nowrap">Table {order.table}</span>
                </div>
              </div>

              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs font-mono border",
                isExiting ? "bg-white/10 border-white/20 text-white" : isCritical ? "bg-white border-red-200 text-red-600" : "bg-slate-50 border-slate-100 text-slate-500"
              )}>
                <Clock className={cn("h-3.5 w-3.5", isCritical && !isExiting && "text-red-500")} />
                {formatDuration(durationMs)}
              </div>
            </div>

            <div className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed transition-colors",
              isExiting ? "bg-white/10 border-white/20" : isCritical ? "bg-white/50 border-red-200/50" : "bg-slate-50/50 border-slate-100"
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

  // Simulate new orders and status movements
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const rand = Math.random();
        // 15% chance for a new order
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
        // Move Pending to Accepted
        if (rand > 0.15 && rand < 0.35) {
          const pendingIdx = prev.findIndex(o => o.status === 'pending');
          if (pendingIdx !== -1) {
            return prev.map((o, i) => i === pendingIdx ? { ...o, status: 'accepted' as HubStatus } : o);
          }
        }
        // Move Accepted to Preparing
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

  // Strict 10-second synchronized finalization cycle
  useEffect(() => {
    const finalizationInterval = setInterval(() => {
      setOrders(prev => {
        const candidates = prev.filter(o => o.status !== 'exiting');
        if (candidates.length === 0) return prev;
        
        const inPreparing = candidates.filter(o => o.status === 'in_progress');
        
        const exitOptions: ExitType[] = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'];
        const randomExit = exitOptions[Math.floor(Math.random() * exitOptions.length)];
        
        let target: HubOrder | undefined;
        
        // "COMPLETED" only applies to "Preparing" column
        if (randomExit === 'COMPLETED') {
            if (inPreparing.length > 0) {
              target = inPreparing[Math.floor(Math.random() * inPreparing.length)];
            } else {
              // If no preparing items, we could either skip or force another status
              // For consistency, let's just skip this 10s tick for COMPLETED if nothing is cooking
              return prev; 
            }
        } else {
            // Cancel/Reject/Fail can happen at any stage
            target = candidates[Math.floor(Math.random() * candidates.length)];
        }

        if (!target) return prev;
        
        // Log the exit event to synchronize with Activity Log
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
        
        // Cleanup after blinking (matching GSAP timeline)
        setTimeout(() => {
          setOrders(current => current.filter(o => o.id !== target!.id));
        }, 3200);

        return updated;
      });
    }, 10000); // 10s cycle
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

  const longestWait = useMemo(() => {
    if (orders.length === 0) return 0;
    return Math.max(...orders.map(o => now - o.timestamp));
  }, [orders, now]);

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
          
          {/* Kanban Area - Spanning 75% width */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0 h-full">
            {columns.map((col) => {
              const columnOrders = getFilteredStatusOrders(col.id);
              const config = statusConfig[col.id];
              return (
                <div key={col.id} className="flex flex-col min-w-0 h-full text-left">
                  <div className={cn("mb-5 rounded-[20px] border border-slate-100 p-4 transition-all shadow-sm", config.bg)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", config.dot)} />
                        <h2 className="text-base font-black text-slate-900 tracking-wider">{config.label}</h2>
                      </div>
                      <div className="bg-[#1e293b] text-white font-black px-2 py-0.5 text-[11px] rounded-md shadow-sm">
                        {columnOrders.length}
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 pl-[22px]">{config.subLabel}</p>
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

          {/* Activity & Stats Sidebar - Fixed 25% width */}
          <aside className="xl:col-span-1 sticky top-[88px] self-start text-left h-fit">
            <div className="space-y-6">
              
              {longestWait > 600000 && ( // 10 minutes wait alert
                <div className="rounded-[32px] bg-rose-50 p-6 shadow-sm border border-rose-100 text-left animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200/50">
                      <AlertCircle className="h-6 w-6 text-rose-600" />
                    </div>
                    <div className="space-y-1.5 text-left">
                       <p className="text-sm font-black text-rose-900 leading-none">Critical Wait Alert</p>
                       <p className="text-[11px] leading-relaxed text-rose-700 font-bold">
                         One or more orders have exceeded the 10-minute preparation threshold. Immediate attention required.
                       </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Log - Command Center UI */}
              <Card className="border-0 shadow-2xl bg-white overflow-hidden flex flex-col rounded-[32px] h-[600px]">
                <CardHeader className="bg-[#18B4A6] text-white p-6 pb-8 shrink-0 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
                     <Activity className="h-48 w-48 text-white" />
                   </div>
                  <div className="relative z-10 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl font-black tracking-tight uppercase">
                        Activity Log
                      </CardTitle>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 font-black px-3 py-1 rounded-full text-xs">
                      {recentExits.length}
                    </Badge>
                  </div>
                  <p className="relative z-10 text-white/80 text-[11px] font-bold uppercase tracking-wider pl-1">
                    Live Feed Tracker
                  </p>
                </CardHeader>
                
                <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
                  {/* Vertical Axis Line */}
                  <div className="absolute left-10 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-100 z-0" />

                  <ScrollArea className="flex-1">
                    <div className="p-6 pt-4 space-y-8 relative z-10">
                      {recentExits.length > 0 ? recentExits.map((event) => {
                        const config = exitConfig[event.type];
                        return (
                          <div 
                            key={event.id} 
                            className={cn(
                              "relative transition-all duration-500 rounded-2xl p-4 border border-transparent",
                              event.isNew && cn("animate-status-blink z-20 shadow-xl text-white px-6 scale-[1.02]", config.bg)
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "h-2.5 w-2.5 rounded-full mt-2 shrink-0 shadow-sm relative z-10 border-2 border-white", 
                                event.isNew ? "bg-white" : config.dot
                              )} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                   <span className={cn("text-base font-black tracking-tight", event.isNew ? "text-white" : "text-slate-900")}>
                                     Order {event.orderNumber}
                                   </span>
                                   <span className={cn("text-[9px] font-black uppercase tracking-widest", event.isNew ? "text-white/60" : "text-slate-400")}>
                                     JUST NOW
                                   </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                   <div className={cn(
                                     "px-3 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border border-transparent shadow-sm",
                                     event.isNew ? "bg-white text-slate-900" : cn(config.bg, "text-white")
                                   )}>
                                      {event.type}
                                    </div>
                                   <span className={cn("text-xs font-bold", event.isNew ? "text-white/80" : "text-slate-500")}>
                                     By Staff {event.server}
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
                  
                  {/* End Footer of Scroll */}
                  <div className="p-5 bg-slate-50/50 border-t flex items-center justify-center shrink-0">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">End of Feed</p>
                  </div>
                </div>
              </Card>

              {/* Operational Notice */}
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
