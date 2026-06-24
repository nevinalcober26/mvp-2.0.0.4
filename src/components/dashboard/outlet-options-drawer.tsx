
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  QrCode, 
  CalendarCheck, 
  Sparkles, 
  Hotel,
  Check,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface OutletOptionsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedOptions: string[], includeFees: boolean) => void;
}

export function OutletOptionsDrawer({ open, onOpenChange, onConfirm }: OutletOptionsDrawerProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [includeFees, setIncludeFees] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const toggleOption = (id: string) => {
    if (id === 'loyalty' || id === 'hotels') return; // Coming soon
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowCloseConfirm(true);
    } else {
      onOpenChange(true);
    }
  };

  const confirmClose = () => {
    setShowCloseConfirm(false);
    onOpenChange(false);
    setSelectedOptions([]); // Reset for next time
  };

  const options = [
    {
      id: 'app-to-app',
      title: 'App to App',
      description: 'Order via Mobile Terminal device',
      icon: Smartphone,
    },
    {
      id: 'qr-web',
      title: 'Qr Web',
      description: 'Scan, Order and Pay directly from mobile',
      icon: QrCode,
    },
    {
      id: 'reservations',
      title: 'Reservations',
      description: 'Manage table bookings.',
      icon: CalendarCheck,
    },
    {
      id: 'loyalty',
      title: 'Emenu Loyalty',
      description: 'Rewards program for guests.',
      icon: Sparkles,
      comingSoon: true,
    },
    {
      id: 'hotels',
      title: 'Hotels',
      description: 'Room service integration.',
      icon: Hotel,
      comingSoon: true,
    },
  ];

  const isButtonEnabled = selectedOptions.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl bg-white rounded-3xl text-left">
          <DialogHeader className="p-8 bg-slate-50/50 border-b">
            <DialogTitle className="text-2xl font-bold text-slate-900 leading-tight">
              Activate Digital Services
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-slate-500 mt-2">
              Choose the digital features for this outlet. Your license allows you to enable these services instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-3 bg-white max-h-[60vh] overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              const Icon = option.icon;
              
              return (
                <div key={option.id} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => toggleOption(option.id)}
                    disabled={option.comingSoon}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group relative",
                      isSelected 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-slate-100 hover:border-primary/20 bg-white",
                      option.comingSoon && "opacity-50 grayscale bg-slate-50 cursor-not-allowed border-transparent shadow-none"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                      isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 tracking-tight">{option.title}</h4>
                        {option.comingSoon && (
                          <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wider px-1.5 h-4 bg-white border-slate-200 text-slate-400">Soon</Badge>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 leading-snug truncate">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-sm animate-in zoom-in duration-300 shrink-0">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>

                  {/* Sub-option for App to App */}
                  {option.id === 'app-to-app' && isSelected && (
                    <div className="mx-2 p-4 rounded-xl bg-white border border-primary/10 space-y-3 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5 text-left">
                          <Label htmlFor="fees-toggle-modal" className="text-xs font-bold text-slate-700">Include Convenience Fees?</Label>
                          <p className="text-[10px] font-medium text-slate-400">Apply fees to app orders.</p>
                        </div>
                        <Switch 
                          id="fees-toggle-modal" 
                          checked={includeFees} 
                          onCheckedChange={setIncludeFees}
                          className="data-[state=checked]:bg-primary scale-90"
                        />
                      </div>
                      {includeFees && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <Info className="h-3 w-3 text-primary shrink-0"/>
                          <p className="text-[9px] font-bold text-primary uppercase tracking-widest text-left leading-none">
                            FEE CALCULATION ENABLED
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter className="p-8 bg-slate-50 shrink-0 flex sm:justify-center">
            <Button 
              onClick={() => onConfirm(selectedOptions, includeFees)}
              disabled={!isButtonEnabled}
              className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group disabled:opacity-50 disabled:grayscale"
            >
              Confirm & Activate Services
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-xl font-bold text-slate-900">Finish Setup?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-500 leading-relaxed">
              You haven't activated any digital services for this outlet yet. Are you sure you want to cancel the activation process?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-bold h-11 border-slate-200" onClick={() => setShowCloseConfirm(false)}>
              Continue Setup
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90 rounded-xl font-bold h-11 px-6 shadow-lg"
              onClick={confirmClose}
            >
              Discard & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
