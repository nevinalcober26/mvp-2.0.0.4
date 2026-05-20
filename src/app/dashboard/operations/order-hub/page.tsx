'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  History,
  ClipboardList,
  MapPin,
  ChevronRight,
  Search,
  Activity,
  Timer,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { formatDistanceToNow } from 'date-fns';

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
  floor: string;
  timestamp: number;
  originalStatus?: HubStatus;
}

interface EventLog {
  id: string;
  orderNumber: string;
  type: ExitType;
  timestamp: Date;
  server: string;
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
    label: 'Processing...',
    icon: Clock,
    color: 'text-white',
    accent: 'bg-gray-400',
    bg: 'bg-gray-100',
  }
};

const exitConfig: Record<ExitType, { color: string; bg: string; text: string; icon: any }> = {
  COMPLETED: { color: 'text-white', bg: 'bg-green-600', text: 'COMPLETED', icon: CheckCircle2 },
  CANCELLED: { color: 'text-white', bg: 'bg-red-600', text: 'CANCELLED', icon: XCircle },
  REJECTED: { color: 'text-white', bg: 'bg-red-600', text: 'REJECTED', icon: XCircle },
  FAILED: { color: 'text-white', bg: 'bg-red-700', text: 'FAILED', icon: AlertCircle },
};

const servers = ['Alex', 'Maria', 'John', 'Sarah', 'Emma', 'Lisa', 'David', 'James', 'Sophie', 'Michael'];
const floors = ['Ground', 'First', 'Terrace', 'Lounge'];
const statuses: HubStatus[] = ['pending', 'accepted', 'in_progress'];

const generateMockOrders = (count: number): HubOrder[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    orderNumber: `#${4420 + i}`,
    status: statuses[i % 3],
    itemsCount: Math.floor(Math.random() * 8) + 1,
    server: servers[Math.floor(Math.random() * servers.length)],
    timeOpenMinutes: Math.floor(Math.random() * 25) + 1,
    floor: floors[Math.floor(Math.random() * floors.length)],
    timestamp: Date.now() - Math.floor(Math.random() * 1000000),
  }));
};

const OrderCard = ({ order }: { order: HubOrder }) => {
  const isExiting = order.status === 'exiting';
  const config = isExiting && order.exitType ? exitConfig[order.exitType] : statusConfig[order.status];
  const Icon = isExiting ? exitConfig[order.exitType!].icon : config.icon;
  const isSlow = order.timeOpenMinutes > 15 && order.status === 'pending';

  return (
    <Card 
      className={cn(
        "group relative transition-all duration-300 border-0 overflow-hidden shadow-sm hover:shadow-md h-fit",
        isExiting ? cn(config.bg, "scale-105 z-20 shadow-2xl animate-status-blink ring-4 ring-white/50") : "bg-white",
        isSlow && !isExiting && "ring-1 ring-red-200"
      )}
    >
      {isExiting && (
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
           <Icon className="h-16 w-16 text-white" />
        </div>
      )}

      {!isExiting && (
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.accent)} />
      )}

      <CardContent className="p-0 flex flex-col h-full text-left relative z-10">
        <div className={cn(
          "p-3 flex items-center justify-between border-b border-slate-50",
          isExiting ? "border-white/10 bg-black/5" : "bg-white"
        )}>
          <div className="space-y-0.5">
            <span className={cn("text-[8px] font-bold uppercase tracking-wider", isExiting ? "text-white/80" : "text-slate-400")}>
                {isExiting ? 'FINAL STATUS' : isSlow ? 'DELAYED' : 'ORDER ID'}
            </span>
            <h3 className={cn("text-sm font-bold", isExiting ? "text-white" : "text-slate-900")}>
              {order.orderNumber}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                isExiting ? "bg-white text-slate-900 shadow-sm" : cn(config.bg, config.color)
              )}>
                <Icon className="h-2.5 w-2.5" />
                {isExiting && order.exitType ? exitConfig[order.exitType].text : config.label}
             </div>
             {!isExiting && (
                <div className={cn("flex items-center gap-1 text-[9px] font-medium text-slate-400")}>
                  {isSlow && <Timer className="h-2.5 w-2.5 text-red-500 animate-pulse" />}
                  {order.timeOpenMinutes}m
                </div>
             )}
          </div>
        </div>

        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="space-y-0.5">
              <p className={cn("text-[8px] font-bold uppercase tracking-widest", isExiting ? "text-white/60" : "text-slate-400")}>Floor</p>
              <div className={cn("flex items-center gap-1 text-[11px] font-semibold", isExiting ? "text-white" : "text-slate-700")}>
                {order.floor}
              </div>
            </div>
            <div className="space-y-0.5">
              <p className={cn("text-[8px] font-bold uppercase tracking-widest", isExiting ? "text-white/60" : "text-slate-400")}>Staff</p>
              <div className={cn("flex items-center gap-1 text-[11px] font-semibold", isExiting ? "text-white" : "text-slate-700")}>
                {order.server}
              </div>
            </div>
          </div>

          <div className={cn(
            "flex items-center justify-between p-2 rounded-lg border border-dashed",
            isExiting ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200"
          )}>
            <div className="flex items-center gap-2">
               <Package className={cn("h-3 w-3", isExiting ? "text-white" : "text-slate-400")} />
               <span className={cn("text-[11px] font-bold", isExiting ? "text-white" : "text-slate-700")}>{order.itemsCount} Items</span>
            </div>
            <ChevronRight className={cn("h-3 w-3", isExiting ? "text-white" : "text-slate-300")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrderHubPage() {
  const [orders, setOrders] = useState<HubOrder[]>([]);
  const [recentExits, setRecentExits] = useState<EventLog[]>([]);
  const [lookbackDays, setLookbackDays] = useState('1');
  const [search, setSearch] = useState('');
  const [floorFilter, setFloorFilter] = useState('all');

  useEffect(() => {
    setOrders(generateMockOrders(48));
  }, []);

  // Simulator for live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const candidates = prev.filter(o => o.status !== 'exiting');
        if (candidates.length === 0) return prev;

        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const exitTypes: ExitType[] = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'];
        const rand = Math.random();
        const exitTypeIndex = rand > 0.3 ? 0 : Math.floor(Math.random() * (exitTypes.length - 1)) + 1;
        const randomExit = exitTypes[exitTypeIndex];

        const updated = prev.map(o => {
          if (o.id === target.id) {
            return { 
              ...o, 
              status: 'exiting' as HubStatus, 
              exitType: randomExit,
              originalStatus: o.status 
            };
          }
          return o;
        });

        setRecentExits(prevExits => [{
          id: Math.random().toString(),
          orderNumber: target.orderNumber,
          type: randomExit,
          timestamp: new Date(),
          server: target.server
        }, ...prevExits].slice(0, 15));

        setTimeout(() => {
          setOrders(current => current.filter(o => o.id !== target.id));
        }, 4000);

        return updated;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const getFilteredStatusOrders = (status: HubStatus) => {
    return orders.filter(o => {
      const activeStatus = o.status === 'exiting' ? o.originalStatus : o.status;
      if (activeStatus !== status) return false;

      const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.server.toLowerCase().includes(search.toLowerCase());
      const matchesFloor = floorFilter === 'all' || o.floor === floorFilter;
      return matchesSearch && matchesFloor;
    }).sort((a, b) => b.timeOpenMinutes - a.timeOpenMinutes);
  };

  const columns: { id: HubStatus; label: string; accent: string }[] = [
    { id: 'pending', label: 'Pending', accent: 'bg-blue-500' },
    { id: 'accepted', label: 'Accepted', accent: 'bg-amber-500' },
    { id: 'in_progress', label: 'In Progress', accent: 'bg-teal-500' },
  ];

  return (
    <div className={cn("min-h-screen bg-[#F1F5F9] flex flex-col", inter.className)}>
      <DashboardHeader />
      
      {/* Dynamic Sub-Header */}
      <div className="bg-white border-b px-4 sm:px-6 lg:px-10 py-4 shrink-0">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order Hub</h1>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
               <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-teal-500" /> Live Feed</span>
               <span className="h-1 w-1 rounded-full bg-slate-300" />
               <span>{orders.length} Active Tickets</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="relative w-64 text-left">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Find Order or Server..." 
                  className="pl-9 h-10 bg-slate-50 border-slate-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-slate-200">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map(f => <SelectItem key={f} value={f}>{f} Floor</SelectItem>)}
                </SelectContent>
             </Select>
             <div className="h-6 w-px bg-slate-200 mx-1" />
             <Select value={lookbackDays} onValueChange={setLookbackDays}>
                <SelectTrigger className="w-[160px] h-10 bg-slate-50 border-slate-200">
                  <History className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <SelectValue placeholder="History View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 Hours</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-10 flex gap-8">
        <div className="flex-1 flex gap-6 min-w-0">
          {columns.map((col) => {
            const columnOrders = getFilteredStatusOrders(col.id);
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[300px] h-full">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", col.accent)} />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{col.label}</h2>
                  </div>
                  <Badge variant="secondary" className="bg-slate-200 text-slate-600 font-bold px-2 py-0.5 text-[10px]">
                    {columnOrders.length}
                  </Badge>
                </div>
                
                <ScrollArea className="flex-1 rounded-2xl bg-slate-200/40 border border-slate-200/60 p-3">
                  <div className="flex flex-col gap-3">
                    {columnOrders.length > 0 ? columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    )) : (
                      <div className="py-20 text-center opacity-40">
                        <ClipboardList className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">No {col.label} tickets</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>

        {/* Live Pulse Sidebar */}
        <aside className="w-80 hidden 2xl:flex flex-col gap-6 shrink-0">
          <Card className="flex-1 border-0 shadow-sm bg-white overflow-hidden flex flex-col rounded-3xl">
            <CardHeader className="bg-[#142424] text-white p-6 shrink-0 text-left">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                  <History className="h-4 w-4 text-[#18B4A6]" /> Recent Events
                </CardTitle>
                <Badge className="bg-teal-500/20 text-teal-400 border-0">{recentExits.length}</Badge>
              </div>
              <CardDescription className="text-white/40 text-xs mt-1 font-medium">Live audit trail for finalized tickets.</CardDescription>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {recentExits.length > 0 ? recentExits.map((event) => {
                  const config = exitConfig[event.type];
                  return (
                    <div key={event.id} className="relative pl-6 pb-4 border-l border-slate-100 last:border-0 last:pb-0 text-left">
                      <div className={cn("absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-white", config.bg)} />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-slate-900">Order {event.orderNumber}</span>
                           <span className="text-[9px] font-medium text-slate-400 uppercase">{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge className={cn("text-[9px] font-black h-4 px-1.5 border-0", config.bg, config.color)}>
                              {event.type}
                           </Badge>
                           <span className="text-[10px] text-slate-500 font-medium">by {event.server}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-20 text-center space-y-3">
                    <Activity className="h-8 w-8 text-slate-200 mx-auto" />
                    <p className="text-xs font-medium text-slate-400">Waiting for activity...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-slate-50/50">
              <Button variant="ghost" className="w-full h-10 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900" asChild>
                <a href="/dashboard/reports/payments">View Full Audit Trail</a>
              </Button>
            </div>
          </Card>

          <Card className="bg-[#18B4A6]/10 border-0 p-5 rounded-3xl text-left">
             <div className="flex items-start gap-4">
                <HelpCircle className="h-5 w-5 text-[#18B4A6] shrink-0" />
                <div className="space-y-1">
                   <p className="text-xs font-bold text-slate-900">Operational Tip</p>
                   <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                     Tickets blinking <span className="font-bold text-green-600">Green</span> or <span className="font-bold text-red-600">Red</span> have just been processed and will be cleared shortly.
                   </p>
                </div>
             </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
