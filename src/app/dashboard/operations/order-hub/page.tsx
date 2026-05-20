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
  RefreshCw,
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

const statusConfig: Record<HubStatus, { label: string; icon: any; color: string; dot: string; bg: string; accent: string }> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-blue-600',
    dot: 'bg-blue-500',
    bg: 'bg-white',
    accent: 'bg-blue-500',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    color: 'text-indigo-600',
    dot: 'bg-indigo-500',
    bg: 'bg-white',
    accent: 'bg-indigo-500',
  },
  in_progress: {
    label: 'Preparing',
    icon: Play,
    color: 'text-teal-600',
    dot: 'bg-teal-500',
    bg: 'bg-white',
    accent: 'bg-teal-500',
  },
  exiting: {
    label: 'Processing...',
    icon: RefreshCw,
    color: 'text-white',
    dot: 'bg-white',
    bg: 'bg-slate-900',
    accent: 'bg-white',
  }
};

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
        "group relative transition-all duration-300 border-0 shadow-sm hover:shadow-md rounded-2xl overflow-hidden h-fit",
        isExiting ? cn(config.bg, "scale-105 z-20 shadow-2xl animate-status-blink text-white") : "bg-white",
        isDelayed && !isExiting && "ring-1 ring-rose-200 bg-rose-50/10"
      )}
    >
      <CardContent className="p-0 flex flex-col h-full relative z-10">
        {/* Subtle Side Accent */}
        {!isExiting && (
          <div className={cn("absolute left-0 top-0 bottom-0 w-1", (config as any).accent)} />
        )}

        {/* Large background icon for exiting state */}
        {isExiting && (
          <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
             <Icon className="w-24 h-24" />
          </div>
        )}

        <div className={cn(
          "px-4 py-3 flex items-center justify-between",
          isExiting ? "bg-black/10" : "border-b border-slate-50"
        )}>
          <div className="flex flex-col gap-0.5">
            <span className={cn(
              "text-[10px] font-bold tracking-tight", 
              isExiting ? "text-white/60" : "text-slate-400"
            )}>
                {isExiting ? 'FINAL STATUS' : 'ID'}
            </span>
            <h3 className={cn("text-sm font-semibold tracking-tight", isExiting ? "text-white" : "text-slate-900")}>
              {order.orderNumber}
            </h3>
          </div>
          
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm",
            isExiting ? "bg-white/20 text-white" : "bg-slate-50 text-slate-600"
          )}>
            <Icon className="h-3 w-3" />
            {isExiting && order.exitType ? exitConfig[order.exitType].text : (config as any).label}
          </div>
        </div>

        <div className="p-4 space-y-3.5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div className={cn("flex items-center gap-2", isExiting ? "text-white/80" : "text-slate-500")}>
                <MapPin className="h-3.5 w-3.5 opacity-60" />
                <span className="font-medium">{order.floor}</span>
              </div>
              <div className={cn("flex items-center gap-1.5 font-bold", isExiting ? "text-white/90" : isDelayed ? "text-rose-600" : "text-slate-400")}>
                 <Timer className="h-3 w-3" />
                 {order.timeOpenMinutes}m
              </div>
            </div>
            <div className={cn("flex items-center gap-2 text-xs", isExiting ? "text-white/80" : "text-slate-500")}>
              <User className="h-3.5 w-3.5 opacity-60" />
              <span className="font-medium">{order.server}</span>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl",
            isExiting ? "bg-white/10" : "bg-slate-50/50"
          )}>
             <Package className={cn("h-4 w-4", isExiting ? "text-white/70" : "text-teal-500")} />
             <span className={cn("text-xs font-semibold", isExiting ? "text-white" : "text-slate-700")}>{order.itemsCount} Food Items</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrderHubPage() {
  const [orders, setOrders] = useState<HubOrder[]>([]);
  const [recentExits, setRecentExits] = useState<EventLog[]>([]);
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
    }, 5000);

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
    { id: 'pending', label: 'Pending', dot: 'bg-blue-500', bg: 'bg-blue-50/40' },
    { id: 'accepted', label: 'Accepted', dot: 'bg-indigo-500', bg: 'bg-indigo-50/40' },
    { id: 'in_progress', label: 'Preparing', dot: 'bg-teal-500', bg: 'bg-teal-50/40' },
  ];

  return (
    <div className={cn("min-h-screen bg-[#F8FAFC] flex flex-col", inter.className)}>
      <DashboardHeader />
      
      {/* Refined Header */}
      <div className="bg-white border-b px-8 py-6 shrink-0">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Live Order Hub</h1>
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
               <span className="flex items-center gap-1.5"><Activity className="h-4 w-4 text-emerald-500" /> Live Kitchen Pulse</span>
               <span className="h-1 w-1 rounded-full bg-slate-300" />
               <span>{orders.length} orders active</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="relative w-64 text-left">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Order or server..." 
                  className="pl-9 h-10 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-slate-200 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-transparent rounded-xl text-xs font-semibold">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <SelectValue placeholder="All Floors" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map(f => <SelectItem key={f} value={f}>{f} Floor</SelectItem>)}
                </SelectContent>
             </Select>
             <div className="h-8 w-px bg-slate-100 mx-1" />
             <Button variant="outline" className="h-10 rounded-xl font-bold border-slate-200 hover:bg-slate-50 gap-2 text-xs">
                <History className="h-3.5 w-3.5" /> History
             </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-6 lg:p-8 flex gap-8">
        <div className="flex-1 flex gap-6 min-w-0">
          {columns.map((col) => {
            const columnOrders = getFilteredStatusOrders(col.id);
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[300px] h-full">
                <div className={cn("flex items-center justify-between mb-4 px-4 py-3 rounded-2xl border-0 shadow-sm", col.bg)}>
                  <div className="flex items-center gap-3">
                    <div className={cn("h-2 w-2 rounded-full", col.dot)} />
                    <h2 className="text-xs font-bold text-slate-700 tracking-wider uppercase">{col.label}</h2>
                  </div>
                  <Badge variant="outline" className="bg-white/80 text-slate-900 border-slate-100 font-bold px-2.5 py-0.5 rounded-full shadow-sm text-[10px]">
                    {columnOrders.length}
                  </Badge>
                </div>
                
                <ScrollArea className="flex-1 rounded-3xl bg-slate-100/30 border border-slate-200/20 p-4">
                  <div className="flex flex-col gap-4 pb-10">
                    {columnOrders.length > 0 ? columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    )) : (
                      <div className="py-24 text-center">
                        <ClipboardList className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section Clear</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>

        {/* Professional Audit Sidebar */}
        <aside className="w-80 hidden xl:flex flex-col gap-6 shrink-0">
          <Card className="flex-1 border-0 shadow-xl bg-white overflow-hidden flex flex-col rounded-[32px]">
            <CardHeader className="bg-slate-900 text-white p-6 shrink-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <CardTitle className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-teal-400" /> Event Stream
                </CardTitle>
                <Badge className="bg-white/10 text-white border-0 text-[10px] font-bold">{recentExits.length}</Badge>
              </div>
              <CardDescription className="text-white/40 text-[10px] font-medium leading-relaxed">
                Live operational log for finalized tickets.
              </CardDescription>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-6">
                {recentExits.length > 0 ? recentExits.map((event) => {
                  const config = exitConfig[event.type];
                  return (
                    <div key={event.id} className="relative pl-6 pb-6 border-l border-slate-100 last:border-0 last:pb-0 text-left">
                      <div className={cn("absolute -left-1 top-0.5 h-2 w-2 rounded-full border-2 border-white shadow-sm", config.bg)} />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-slate-800">Order {event.orderNumber}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge className={cn("text-[8px] font-black h-4 px-1.5 border-0 rounded-md", config.bg, "text-white")}>
                              {event.type}
                           </Badge>
                           <span className="text-[10px] text-slate-500 font-medium italic">by {event.server}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-24 text-center opacity-40">
                    <Activity className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-xs font-medium">Awaiting events...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-slate-50/50">
              <Button variant="ghost" className="w-full h-9 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary rounded-xl">
                View Full Audit History
              </Button>
            </div>
          </Card>

          <Card className="bg-teal-50/50 border-0 p-5 rounded-[28px] text-left">
             <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-teal-600 shrink-0" />
                <div className="space-y-1">
                   <p className="text-xs font-bold text-slate-900">Dashboard Focus</p>
                   <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                     Processing tickets will <span className="text-teal-700 font-bold underline decoration-teal-200">pulse</span> for 3 seconds before clearing to the history log.
                   </p>
                </div>
             </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
