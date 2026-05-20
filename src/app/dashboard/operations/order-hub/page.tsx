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
  User,
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

const statusConfig: Record<HubStatus, { label: string; icon: any; color: string; dot: string; bg: string }> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-blue-600',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50/40',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    color: 'text-indigo-600',
    dot: 'bg-indigo-500',
    bg: 'bg-indigo-50/40',
  },
  in_progress: {
    label: 'Preparing',
    icon: Play,
    color: 'text-teal-600',
    dot: 'bg-teal-500',
    bg: 'bg-teal-50/40',
  },
  exiting: {
    label: 'Processing...',
    icon: RefreshCwIcon,
    color: 'text-white',
    dot: 'bg-white',
    bg: 'bg-slate-900',
  }
};

function RefreshCwIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

const exitConfig: Record<ExitType, { bg: string; text: string; icon: any }> = {
  COMPLETED: { bg: 'bg-emerald-600', text: 'COMPLETED', icon: CheckCircle2 },
  CANCELLED: { bg: 'bg-rose-600', text: 'CANCELLED', icon: XCircle },
  REJECTED: { bg: 'bg-rose-700', text: 'REJECTED', icon: XCircle },
  FAILED: { bg: 'bg-rose-900', text: 'FAILED', icon: AlertCircle },
};

const servers = ['Alex', 'Maria', 'John', 'Sarah', 'Emma', 'Lisa', 'David', 'James', 'Sophie', 'Michael'];
const floors = ['Ground', 'First', 'Terrace', 'Lounge'];
const statuses: HubStatus[] = ['pending', 'accepted', 'in_progress'];

const generateMockOrders = (count: number): HubOrder[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    orderNumber: `#${4420 + i}`,
    status: statuses[i % 3],
    itemsCount: Math.floor(Math.random() * 6) + 1,
    server: servers[Math.floor(Math.random() * servers.length)],
    timeOpenMinutes: Math.floor(Math.random() * 20) + 1,
    floor: floors[Math.floor(Math.random() * floors.length)],
    timestamp: Date.now() - Math.floor(Math.random() * 600000),
  }));
};

const OrderCard = ({ order }: { order: HubOrder }) => {
  const isExiting = order.status === 'exiting';
  const config = isExiting && order.exitType ? exitConfig[order.exitType] : statusConfig[order.status];
  const Icon = isExiting ? exitConfig[order.exitType!].icon : config.icon;
  const isDelayed = order.timeOpenMinutes > 15 && order.status === 'pending';

  return (
    <Card 
      className={cn(
        "group relative transition-all duration-300 border shadow-sm hover:shadow-md rounded-2xl overflow-hidden h-fit",
        isExiting ? cn(config.bg, "scale-105 z-20 shadow-2xl animate-status-blink border-transparent") : "bg-white border-slate-100",
        isDelayed && !isExiting && "border-rose-200 bg-rose-50/30"
      )}
    >
      <CardContent className="p-0 flex flex-col h-full relative z-10">
        {/* Header */}
        <div className={cn(
          "px-4 py-3 flex items-center justify-between border-b",
          isExiting ? "border-white/10 bg-black/10" : "border-slate-50 bg-white"
        )}>
          <div className="flex flex-col">
            <span className={cn(
              "text-[10px] font-bold tracking-tight mb-0.5", 
              isExiting ? "text-white/60" : "text-slate-400"
            )}>
                {isExiting ? 'FINAL STATUS' : 'ORDER NUMBER'}
            </span>
            <h3 className={cn("text-sm font-bold tracking-tight", isExiting ? "text-white" : "text-slate-900")}>
              {order.orderNumber}
            </h3>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold",
                isExiting ? "bg-white/20 text-white" : cn(config.bg, config.color)
              )}>
                <Icon className="h-3 w-3" />
                {isExiting && order.exitType ? exitConfig[order.exitType].text : config.label}
             </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className={cn("text-[10px] font-semibold tracking-tight", isExiting ? "text-white/50" : "text-slate-400")}>Floor / Location</p>
              <div className={cn("flex items-center gap-1.5 text-xs font-medium", isExiting ? "text-white" : "text-slate-700")}>
                <MapPin className="h-3 w-3 opacity-50" />
                {order.floor}
              </div>
            </div>
            <div className="space-y-1">
              <p className={cn("text-[10px] font-semibold tracking-tight", isExiting ? "text-white/50" : "text-slate-400")}>Assigned Staff</p>
              <div className={cn("flex items-center gap-1.5 text-xs font-medium", isExiting ? "text-white" : "text-slate-700")}>
                <User className="h-3 w-3 opacity-50" />
                {order.server}
              </div>
            </div>
          </div>

          <div className={cn(
            "flex items-center justify-between px-3 py-2.5 rounded-xl border",
            isExiting ? "bg-white/10 border-white/20" : "bg-slate-50/50 border-slate-100"
          )}>
            <div className="flex items-center gap-2">
               <Package className={cn("h-3.5 w-3.5", isExiting ? "text-white" : "text-slate-400")} />
               <span className={cn("text-xs font-semibold", isExiting ? "text-white" : "text-slate-700")}>{order.itemsCount} Food Items</span>
            </div>
            <div className={cn("flex items-center gap-1 text-[11px] font-bold", isExiting ? "text-white/80" : isDelayed ? "text-rose-600" : "text-slate-400")}>
               <Timer className="h-3 w-3" />
               {order.timeOpenMinutes}m
            </div>
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

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const candidates = prev.filter(o => o.status !== 'exiting');
        if (candidates.length === 0) return prev;

        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const exitTypes: ExitType[] = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'];
        const rand = Math.random();
        const exitTypeIndex = rand > 0.4 ? 0 : Math.floor(Math.random() * (exitTypes.length - 1)) + 1;
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
        }, 3500);

        return updated;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const getFilteredStatusOrders = (status: HubStatus) => {
    return orders.filter(o => {
      const activeStatus = o.status === 'exiting' ? o.originalStatus : o.status;
      if (activeStatus !== status) return false;

      const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                           o.server.toLowerCase().includes(search.toLowerCase());
      const matchesFloor = floorFilter === 'all' || o.floor === floorFilter;
      return matchesSearch && matchesFloor;
    }).sort((a, b) => b.timeOpenMinutes - a.timeOpenMinutes);
  };

  const columns: { id: HubStatus; label: string; dot: string; bg: string }[] = [
    { id: 'pending', label: 'Pending', dot: 'bg-blue-500', bg: 'bg-blue-50/50' },
    { id: 'accepted', label: 'Accepted', dot: 'bg-indigo-500', bg: 'bg-indigo-50/50' },
    { id: 'in_progress', label: 'Preparing', dot: 'bg-teal-500', bg: 'bg-teal-50/50' },
  ];

  return (
    <div className={cn("min-h-screen bg-[#F8FAFC] flex flex-col", inter.className)}>
      <DashboardHeader />
      
      {/* Sub-Header */}
      <div className="bg-white border-b px-6 py-5 shrink-0">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Order Hub</h1>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
               <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-500" /> Live Kitchen Feed</span>
               <span className="h-1 w-1 rounded-full bg-slate-300" />
               <span>{orders.length} Active Tickets</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative w-72 text-left">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Find Order or Staff..." 
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-primary/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[160px] h-11 bg-slate-50/50 border-slate-200 rounded-xl font-semibold">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="All Floors" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  <SelectItem value="all" className="font-medium">All Floors</SelectItem>
                  {floors.map(f => <SelectItem key={f} value={f} className="font-medium">{f} Floor</SelectItem>)}
                </SelectContent>
             </Select>
             <div className="h-8 w-px bg-slate-200 mx-1" />
             <Button variant="outline" className="h-11 rounded-xl font-bold border-slate-200 bg-white shadow-sm hover:bg-slate-50 gap-2">
                <History className="h-4 w-4" />
                History
             </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-6 lg:p-10 flex gap-10">
        <div className="flex-1 flex gap-8 min-w-0">
          {columns.map((col) => {
            const columnOrders = getFilteredStatusOrders(col.id);
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[320px] h-full">
                <div className={cn("flex items-center justify-between mb-5 px-4 py-3 rounded-2xl border border-slate-100", col.bg)}>
                  <div className="flex items-center gap-3">
                    <div className={cn("h-2.5 w-2.5 rounded-full", col.dot)} />
                    <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">{col.label}</h2>
                  </div>
                  <Badge className="bg-white text-slate-900 border-slate-200 font-bold px-3 py-0.5 rounded-full shadow-sm">
                    {columnOrders.length}
                  </Badge>
                </div>
                
                <ScrollArea className="flex-1 rounded-3xl bg-slate-100/30 border border-slate-200/40 p-4">
                  <div className="flex flex-col gap-4 pb-10">
                    {columnOrders.length > 0 ? columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    )) : (
                      <div className="py-24 text-center opacity-40">
                        <ClipboardList className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Empty Section</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>

        {/* Audit Sidebar */}
        <aside className="w-80 hidden xl:flex flex-col gap-8 shrink-0">
          <Card className="flex-1 border border-slate-200 shadow-xl bg-white overflow-hidden flex flex-col rounded-[32px]">
            <CardHeader className="bg-slate-900 text-white p-7 shrink-0 text-left">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold tracking-tight uppercase flex items-center gap-2.5">
                  <History className="h-4 w-4 text-emerald-400" /> Recent Events
                </CardTitle>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 font-bold">{recentExits.length}</Badge>
              </div>
              <CardDescription className="text-white/40 text-xs mt-1.5 font-medium leading-relaxed">
                Live operational audit trail for finalized food orders.
              </CardDescription>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {recentExits.length > 0 ? recentExits.map((event) => {
                  const config = exitConfig[event.type];
                  return (
                    <div key={event.id} className="relative pl-7 pb-6 border-l border-slate-100 last:border-0 last:pb-0 text-left">
                      <div className={cn("absolute -left-1.5 top-0.5 h-3 w-3 rounded-full border-2 border-white shadow-sm", config.bg)} />
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                           <span className="text-[13px] font-bold text-slate-900 tracking-tight">Order {event.orderNumber}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge className={cn("text-[9px] font-black h-4 px-2 border-0 rounded-md", config.bg, "text-white")}>
                              {event.type}
                           </Badge>
                           <span className="text-[11px] text-slate-500 font-medium italic">by {event.server}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-24 text-center space-y-4">
                    <Activity className="h-10 w-10 text-slate-100 mx-auto" />
                    <p className="text-sm font-medium text-slate-400">Awaiting kitchen activity...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-5 border-t bg-slate-50/50">
              <Button variant="ghost" className="w-full h-11 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 rounded-2xl" asChild>
                <a href="/dashboard/reports/payments">View Full Audit History</a>
              </Button>
            </div>
          </Card>

          <Card className="bg-emerald-50 border border-emerald-100/50 p-6 rounded-[28px] text-left shadow-sm">
             <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-emerald-100 shrink-0">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-slate-900">Dashboard Focus</p>
                   <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                     Processing tickets will <span className="font-bold text-emerald-700 underline decoration-emerald-200">pulse</span> for 3 seconds before clearing to allow staff verification.
                   </p>
                </div>
             </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
