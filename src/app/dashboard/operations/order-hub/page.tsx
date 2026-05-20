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
  Search,
  Activity,
  Timer,
  HelpCircle,
  User,
  RefreshCw,
  MoreVertical,
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

const statusConfig: Record<HubStatus, { label: string; subLabel: string; icon: any; color: string; dot: string; bg: string; accent: string }> = {
  pending: {
    label: 'Pending',
    subLabel: 'New orders',
    icon: Clock,
    color: 'text-blue-600',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50/50',
    accent: 'bg-blue-500',
  },
  accepted: {
    label: 'Accepted',
    subLabel: 'Confirmed',
    icon: CheckCircle2,
    color: 'text-indigo-600',
    dot: 'bg-indigo-500',
    bg: 'bg-indigo-50/50',
    accent: 'bg-indigo-500',
  },
  in_progress: {
    label: 'Preparing',
    subLabel: 'In kitchen',
    icon: Play,
    color: 'text-teal-600',
    dot: 'bg-teal-500',
    bg: 'bg-teal-50/50',
    accent: 'bg-teal-500',
  },
  exiting: {
    label: 'Processing',
    subLabel: 'Updating...',
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
  FAILED: { bg: 'bg-slate-900', text: 'FAILED', icon: AlertCircle },
};

const servers = ['Alex', 'Maria', 'John', 'Sarah', 'Emma', 'Lisa', 'David', 'James', 'Sophie', 'Michael'];
const floors = ['Ground Floor', 'First Floor', 'Terrace', 'VIP Lounge'];
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
  const Icon = isExiting ? exitConfig[order.exitType!].icon : (config as any).icon;
  const isDelayed = order.timeOpenMinutes > 15 && order.status === 'pending';

  return (
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
                {isExiting ? 'Status' : 'Order ID'}
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
                <MapPin className="h-3.5 w-3.5 opacity-70" />
                <span className="font-medium text-xs">{order.floor}</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-xs",
                isExiting ? "bg-white/10" : isDelayed ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
              )}>
                 <Timer className="h-3 w-3" />
                 {order.timeOpenMinutes}m
              </div>
            </div>
            
            <div className={cn("flex items-center gap-1.5", isExiting ? "text-white/80" : "text-slate-500")}>
              <User className="h-3.5 w-3.5 opacity-70" />
              <span className="font-medium text-xs">Waiter: {order.server}</span>
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
        const exitTypeIndex = rand > 0.6 ? 0 : Math.floor(Math.random() * (exitTypes.length - 1)) + 1;
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
        }, 3000);

        return updated;
      });
    }, 6000);

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

  const columns: { id: HubStatus; label: string; subLabel: string; dot: string; bg: string }[] = [
    { id: 'pending', label: 'Pending', subLabel: 'Unseen orders', dot: 'bg-blue-500', bg: 'bg-blue-50/50' },
    { id: 'accepted', label: 'Accepted', subLabel: 'Kitchen received', dot: 'bg-indigo-500', bg: 'bg-indigo-50/50' },
    { id: 'in_progress', label: 'In Progress', subLabel: 'Being prepared', dot: 'bg-teal-500', bg: 'bg-teal-50/50' },
  ];

  return (
    <div className={cn("min-h-screen bg-slate-50 flex flex-col", inter.className)}>
      <DashboardHeader />
      
      <div className="bg-white border-b px-6 py-6 shrink-0">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Live Order Monitor</h1>
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 gap-1.5 px-2 py-0.5 font-bold text-[10px]">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 SYSTEM LIVE
               </Badge>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{orders.length} ACTIVE TICKETS</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="relative w-64 text-left">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search order or server..." 
                  className="pl-10 h-10 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium focus:bg-white transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[160px] h-10 bg-slate-50 border-slate-200 rounded-lg text-xs font-bold">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Areas</SelectItem>
                  {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
             </Select>
             <Button variant="outline" className="h-10 rounded-lg font-bold border-slate-200 hover:bg-slate-50 gap-2 text-xs px-4">
                <History className="h-3.5 w-3.5 text-slate-400" /> History
             </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-6 flex gap-6">
        <div className="flex-1 flex gap-6 min-w-0">
          {columns.map((col) => {
            const columnOrders = getFilteredStatusOrders(col.id);
            const config = statusConfig[col.id];
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[280px] h-full">
                <div className={cn("flex flex-col gap-0.5 mb-4 px-4 py-3 rounded-xl border transition-all", col.bg)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", col.dot)} />
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{col.label}</h2>
                    </div>
                    <Badge className="bg-slate-900 text-white font-bold px-2 py-0 h-5 text-[10px]">
                      {columnOrders.length}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 pl-4">{col.subLabel}</p>
                </div>
                
                <ScrollArea className="flex-1 rounded-2xl bg-slate-200/20 border border-white/50 p-4">
                  <div className="flex flex-col gap-4 pb-20">
                    {columnOrders.length > 0 ? columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    )) : (
                      <div className="py-20 text-center opacity-30">
                        <ClipboardList className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Clear</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>

        <aside className="w-80 hidden xl:flex flex-col gap-6 shrink-0">
          <Card className="flex-1 border shadow-sm bg-white overflow-hidden flex flex-col rounded-2xl">
            <CardHeader className="bg-slate-900 text-white p-6 shrink-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <CardTitle className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-400" /> Activity Log
                </CardTitle>
                <Badge className="bg-white/10 text-white border-0 text-[10px] font-bold px-2 py-0">{recentExits.length}</Badge>
              </div>
              <CardDescription className="text-white/40 text-[10px] font-medium uppercase tracking-wider">
                Finalized tickets.
              </CardDescription>
            </CardHeader>
            
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {recentExits.length > 0 ? recentExits.map((event) => {
                  const config = exitConfig[event.type];
                  return (
                    <div key={event.id} className="relative pl-6 pb-6 border-l last:border-0 last:pb-0 text-left">
                      <div className={cn("absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-white shadow-sm", config.bg)} />
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

          <Card className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl text-left">
             <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-indigo-600 shrink-0" />
                <div className="space-y-1">
                   <p className="text-xs font-bold text-slate-900">Dashboard Control</p>
                   <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                     Tickets will <span className="text-indigo-700 font-bold">blink</span> for 3s when they are finished or cancelled to confirm status before clearing.
                   </p>
                </div>
             </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
