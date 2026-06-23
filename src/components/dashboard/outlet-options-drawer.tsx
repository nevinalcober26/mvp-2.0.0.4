'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  QrCode, 
  CalendarCheck, 
  Sparkles, 
  Hotel,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface OutletOptionsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function OutletOptionsDrawer({ open, onOpenChange, onConfirm }: OutletOptionsDrawerProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [includeFees, setIncludeFees] = useState(false);

  const toggleOption = (id: string) => {
    if (id === 'loyalty' || id === 'hotels') return; // Coming soon
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const options = [
    {
      id: 'app-to-app',
      title: 'App to App',
      description: 'Order through the official mobile app.',
      icon: Smartphone,
    },
    {
      id: 'qr-web',
      title: 'Qr Web',
      description: 'Scan and order directly from a browser.',
      icon: QrCode,
    },
    {
      id: 'reservations',
      title: 'Reservations',
      description: 'Book tables and manage guest visits.',
      icon: CalendarCheck,
    },
    {
      id: 'loyalty',
      title: 'Emenu Loyalty',
      description: 'Rewards program for regular guests.',
      icon: Sparkles,
      comingSoon: true,
    },
    {
      id: 'hotels',
      title: 'Hotels',
      description: 'Room service and guest stay integration.',
      icon: Hotel,
      comingSoon: true,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full border-l-0 shadow-2xl bg-white">
        <SheetHeader className="p-8 bg-slate-50 border-b text-left">
          <SheetTitle className="text-3xl font-black text-slate-900 leading-tight">
            How will you serve?
          </SheetTitle>
          <SheetDescription className="text-base font-bold text-slate-500 mt-2">
            Select the options to activate for this outlet.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const Icon = option.icon;
            
            return (
              <div key={option.id} className="space-y-3">
                <button
                  onClick={() => toggleOption(option.id)}
                  disabled={option.comingSoon}
                  className={cn(
                    "w-full flex items-center gap-5 p-5 rounded-[24px] border-2 transition-all text-left group relative",
                    isSelected 
                      ? "border-teal-500 bg-teal-50 shadow-md" 
                      : "border-slate-100 hover:border-teal-200 bg-white",
                    option.comingSoon && "opacity-50 grayscale bg-slate-50 cursor-not-allowed border-transparent shadow-none"
                  )}
                >
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm",
                    isSelected ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    <Icon className="h-7 w-7" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg text-slate-900 tracking-tight">{option.title}</h4>
                      {option.comingSoon && (
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0 h-5 bg-white border-slate-200 text-slate-400">Coming Soon</Badge>
                      )}
                    </div>
                    <p className="text-[13px] font-bold text-slate-400 leading-snug mt-0.5">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="h-7 w-7 rounded-full bg-teal-500 flex items-center justify-center shadow-lg animate-in zoom-in duration-300 shrink-0">
                      <Check className="h-4 w-4 text-white" strokeWidth={4} />
                    </div>
                  )}
                </button>

                {/* Sub-option for App to App */}
                {option.id === 'app-to-app' && isSelected && (
                  <div className="mx-4 p-5 rounded-[20px] bg-white border-2 border-teal-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 text-left pr-4">
                        <Label htmlFor="fees-toggle" className="text-sm font-black text-slate-700">Include Convenience Fees?</Label>
                        <p className="text-[11px] font-bold text-slate-400">Apply fees to mobile app orders.</p>
                      </div>
                      <Switch 
                        id="fees-toggle" 
                        checked={includeFees} 
                        onCheckedChange={setIncludeFees}
                        className="data-[state=checked]:bg-teal-500"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100">
                      <div className="h-7 w-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                        <Info className="h-4 w-4" strokeWidth={3}/>
                      </div>
                      <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                        {includeFees ? "FEES WILL BE APPLIED" : "NO FEES FOR THIS OUTLET"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <SheetFooter className="p-8 border-t bg-slate-50 shrink-0">
          <Button 
            onClick={onConfirm}
            className="w-full h-16 rounded-[24px] text-lg font-black uppercase tracking-widest bg-[#142424] hover:bg-slate-900 text-white shadow-2xl shadow-black/20 transition-all active:scale-[0.95] group"
          >
            Launch Outlet
            <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
