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
    subLabel: 'New orders waiting',
    icon: Clock,
    color: 'text-blue-600',
    dot: 'bg-blue-500',
    bg: 'bg-white',
    accent: 'bg-blue-500',
  },
  accepted: {
    label: 'Accepted',
    subLabel: 'Confirmed by staff',
    icon: CheckCircle2,
    color: 'text-indigo-600',
    dot: 'bg-indigo-500',
    bg: 'bg-white',
    accent: 'bg-indigo-500',
  },
  in_progress: {
    label: 'In Progress',
    subLabel: 'Food is being prepared',
    icon: Play,
    color: 'text-teal-600',
    dot: 'bg-teal-500',
    bg: 'bg-white',
    accent: 'bg-teal-500',
  },
  exiting: {
    label: 'Processing...',
    subLabel: 'Finishing up',
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
        "group relative transition-all duration-300 border shadow-sm hover:shadow-lg rounded-2xl overflow-hidden",
        isExiting ? cn(config.bg, "scale-105 z-20 shadow-2xl animate-status-blink text-white") : "bg-white",
        isDelayed && !isExiting && "ring-2 ring-rose-500 bg-rose-50"
      )}
    >
      <CardContent className="p-0 flex flex-col h-full relative z-10 text-left">
        {!isExiting && (
          <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", (config as any).accent)} />
        )}

        {isExiting && (
          <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
             <Icon className="w-32 h-32" />
          </div>
        )}

        <div className={cn(
          "px-5 py-4 flex items-center justify-between",
          isExiting ? "bg-black/20" : "border-b bg-slate-50/30"
        )}>
          <div className="flex flex-col">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest", 
              isExiting ? "text-white/60" : "text-slate-400"
            )}>
                {isExiting ? 'Ticket Status' : 'Order ID'}
            </span>
            <h3 className={cn("text-xl font-black leading-tight", isExiting ? "text-white" : "text-slate-900")}>
              {order.orderNumber}
            </h3>
          </div>
          
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black shadow-sm",
            isExiting ? "bg-white text-slate-900" : cn((config as any).accent, "text-white")
          )}>
            <Icon className="h-3.5 w-3.5" />
            {isExiting && order.exitType ? exitConfig[order.exitType].text : (config as any).label.toUpperCase()}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={cn("flex items-center gap-2", isExiting ? "text-white/90" : "text-slate-600")}>
                <MapPin className="h-4 w-4 opacity-70" />
                <span className="font-bold text-sm">{order.floor}</span>
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-sm",
                isExiting ? "bg-white/10" : isDelayed ? "bg-rose-100 text-rose-700 animate-pulse" : "bg-slate-100 text-slate-500"
              )}>
                 <Timer className="h-4 w-4" />
                 {order.timeOpenMinutes}m <span className="text-[10px] opacity-60">WAIT</span>
              </div>
            </div>
            
            <div className={cn("flex items-center gap-2", isExiting ? "text-white/90" : "text-slate-600")}>
              <User className="h-4 w-4 opacity-70" />
              <span className="font-bold text-sm">Server: {order.server}</span>
            </div>
          </div>

          <div className={cn(
            "flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-dashed",
            isExiting ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200"
          )}>
             <Package className={cn("h-5 w-5", isExiting ? "text-white" : "text-primary")} />
             <span className={cn("text-base font-black", isExiting ? "text-white" : "text-slate-900")}>
               {order.itemsCount} Food Items
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
    { id: 'pending', label: 'New Orders', subLabel: 'Waiting to be accepted', dot: 'bg-blue-500', bg: 'bg-blue-50/50' },
    { id: 'accepted', label: 'Accepted', subLabel: 'Kitchen has received', dot: 'bg-indigo-500', bg: 'bg-indigo-50/50' },
    { id: 'in_progress', label: 'Preparing', subLabel: 'Chef is cooking', dot: 'bg-teal-500', bg: 'bg-teal-50/50' },
  ];

  return (
    <div className={cn("min-h-screen bg-slate-50 flex flex-col", inter.className)}>
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-8 shrink-0 shadow-sm">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Live Order Monitor</h1>
            <div className="flex items-center gap-3">
               <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1.5 px-3 py-1 font-bold">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 LIVE SYSTEM PULSE
               </Badge>
               <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{orders.length} ACTIVE TICKETS</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative w-80 text-left">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Search order # or server name..." 
                  className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl text-base font-bold focus:bg-white transition-all shadow-inner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[180px] h-12 bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all">All Venue Areas</SelectItem>
                  {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
             </Select>
             <Button variant="outline" className="h-12 rounded-2xl font-black border-slate-200 hover:bg-slate-50 gap-2 text-xs uppercase tracking-widest px-6 shadow-sm">
                <History className="h-4 w-4" /> Full History
             </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-6 lg:p-10 flex gap-8">
        <div className="flex-1 flex gap-8 min-w-0">
          {columns.map((col) => {
            const columnOrders = getFilteredStatusOrders(col.id);
            const config = statusConfig[col.id];
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[320px] h-full">
                <div className={cn("flex flex-col gap-1 mb-6 px-6 py-4 rounded-3xl border-b-4 border-slate-200 shadow-sm transition-all", col.bg)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-3 w-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", col.dot)} />
                      <h2 className="text-lg font-black text-slate-800 tracking-tight">{col.label.toUpperCase()}</h2>
                    </div>
                    <Badge className="bg-slate-900 text-white font-black px-3 py-1 rounded-xl text-sm">
                      {columnOrders.length}
                    </Badge>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-6">{col.subLabel}</p>
                </div>
                
                <ScrollArea className="flex-1 rounded-[40px] bg-slate-200/20 border border-white/50 p-5 shadow-inner">
                  <div className="flex flex-col gap-6 pb-20">
                    {columnOrders.length > 0 ? columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    )) : (
                      <div className="py-32 text-center opacity-30">
                        <ClipboardList className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Everything Cleared</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>

        <aside className="w-96 hidden xl:flex flex-col gap-6 shrink-0">
          <Card className="flex-1 border-0 shadow-2xl bg-white overflow-hidden flex flex-col rounded-[40px]">
            <CardHeader className="bg-slate-900 text-white p-8 shrink-0 text-left">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-sm font-black tracking-[0.2em] uppercase flex items-center gap-3">
                  <Activity className="h-5 w-5 text-teal-400" /> Activity Log
                </CardTitle>
                <Badge className="bg-white/10 text-white border-0 text-xs font-bold px-3 py-1 rounded-lg">{recentExits.length}</Badge>
              </div>
              <CardDescription className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
                Summary of recently finished tickets.
              </CardDescription>
            </CardHeader>
            
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-8">
                {recentExits.length > 0 ? recentExits.map((event) => {
                  const config = exitConfig[event.type];
                  return (
                    <div key={event.id} className="relative pl-8 pb-8 border-l-2 border-slate-100 last:border-0 last:pb-0 text-left">
                      <div className={cn("absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white shadow-md", config.bg)} />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <span className="text-base font-black text-slate-900">Order {event.orderNumber}</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Badge className={cn("text-[10px] font-black h-5 px-2 border-0 rounded-lg", config.bg, "text-white")}>
                              {event.type}
                           </Badge>
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-tight italic">By {event.server}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-32 text-center opacity-30">
                    <Activity className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">Watching for events...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-6 border-t bg-slate-50/50">
              <Button variant="ghost" className="w-full h-11 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary rounded-2xl">
                View All Activity
              </Button>
            </div>
          </Card>

          <Card className="bg-indigo-50/50 border-2 border-dashed border-indigo-100 p-6 rounded-[32px] text-left">
             <div className="flex items-start gap-4">
                <HelpCircle className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                <div className="space-y-2">
                   <p className="text-sm font-black text-slate-900 uppercase tracking-wide">Manager Support</p>
                   <p className="text-xs leading-relaxed text-slate-600 font-bold">
                     Tickets will <span className="text-indigo-700 underline decoration-indigo-200">flash bright</span> for 3 seconds when they are finished or cancelled. This allows you to confirm the final status before they clear from the main screen.
                   </p>
                </div>
             </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
