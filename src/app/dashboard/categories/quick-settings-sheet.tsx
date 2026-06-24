'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Store, 
  ShoppingBag, 
  Clock,
  ShieldCheck,
  Smartphone,
  QrCode,
  CalendarCheck,
  Sparkles,
  Hotel,
  Check,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface QuickSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: {
    id: string;
    name: string;
    status: 'Open' | 'Closed';
  } | null;
}

const servingOptions = [
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

export function QuickSettingsSheet({
  open,
  onOpenChange,
  restaurant,
}: QuickSettingsSheetProps) {
  const { toast } = useToast();
  const [isBranchOpen, setIsBranchOpen] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [includeFees, setIncludeFees] = useState(false);

  // Warning Dialog State
  const [showWarning, setShowWarning] = useState(false);
  const [warningConfig, setWarningConfig] = useState<{ 
    title: string; 
    desc: string; 
    confirmText: string;
    isDestructive?: boolean;
    onConfirm: () => void; 
  } | null>(null);

  useEffect(() => {
    if (open && restaurant) {
      setIsBranchOpen(restaurant.status === 'Open');
      
      // Load saved services for this specific outlet
      const savedServices = localStorage.getItem(`outletServices_${restaurant.id}`);
      if (savedServices) {
        try {
          const parsed = JSON.parse(savedServices);
          setSelectedOptions(parsed.selectedOptions || []);
          setIncludeFees(parsed.includeFees || false);
        } catch (e) {
          console.error("Failed to parse saved services", e);
        }
      } else {
        // Default for mock data if not set
        setSelectedOptions(['qr-web']);
        setIncludeFees(false);
      }
    }
  }, [open, restaurant]);

  if (!restaurant) return null;

  const toggleOption = (id: string) => {
    if (id === 'loyalty' || id === 'hotels') return;
    
    const isSelected = selectedOptions.includes(id);
    const option = servingOptions.find(o => o.id === id);

    if (isSelected) {
      // Show warning when disabling
      setWarningConfig({
        title: `Disable ${option?.title}?`,
        desc: `This will immediately stop service for this channel. Customers will no longer be able to use ${option?.title} for ${restaurant.name}.`,
        confirmText: "Confirm Deactivation",
        isDestructive: true,
        onConfirm: () => {
          setSelectedOptions(prev => prev.filter(o => o !== id));
          setShowWarning(false);
        }
      });
      setShowWarning(true);
    } else {
      // Show confirmation when enabling
      setWarningConfig({
        title: `Enable ${option?.title}?`,
        desc: `Activating this channel will allow customers to use ${option?.title} for ${restaurant.name}. This action may affect your monthly operational quota.`,
        confirmText: "Activate Channel",
        isDestructive: false,
        onConfirm: () => {
          setSelectedOptions(prev => [...prev, id]);
          setShowWarning(false);
        }
      });
      setShowWarning(true);
    }
  };

  const handleSave = () => {
    // Persist services
    localStorage.setItem(`outletServices_${restaurant.id}`, JSON.stringify({
        selectedOptions,
        includeFees
    }));

    toast({
      title: "Settings Updated",
      description: `Configuration for ${restaurant.name} has been saved successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md w-full p-0 border-l shadow-2xl bg-white">
          <div className="flex flex-col h-full text-left">
            <SheetHeader className="p-6 border-b bg-muted/20 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <SheetTitle className="text-xl font-bold text-slate-900">Quick Settings</SheetTitle>
              </div>
              <SheetDescription className="text-sm font-medium text-slate-500">
                {restaurant.name}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-grow overflow-y-auto p-6 space-y-8">
              {/* Operational Status */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Operational Status</h3>
                <Card className="border-2 border-slate-100 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-left">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Store className="h-4 w-4" />
                        </div>
                        <div className="grid gap-0.5">
                          <Label htmlFor="status" className="font-bold text-sm text-slate-900">Outlet Open</Label>
                          <p className="text-[11px] text-muted-foreground font-medium">Accepting orders currently.</p>
                        </div>
                      </div>
                      <Switch 
                        id="status" 
                        checked={isBranchOpen} 
                        onCheckedChange={(checked) => {
                          if (!checked) {
                            setWarningConfig({
                              title: "Close Outlet?",
                              desc: "This will stop all incoming orders immediately across all channels. You can reopen the outlet at any time.",
                              confirmText: "Confirm Deactivation",
                              isDestructive: true,
                              onConfirm: () => {
                                setIsBranchOpen(false);
                                setShowWarning(false);
                              }
                            });
                            setShowWarning(true);
                          } else {
                            setIsBranchOpen(true);
                          }
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Licensed Channels */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Licensed Channels</h3>
                  <Badge variant="outline" className="text-[9px] font-bold border-primary/20 text-primary uppercase h-5">Active License</Badge>
                </div>

                {/* License Warning Notification */}
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
                  <div className="text-left space-y-1">
                    <p className="text-xs font-bold text-orange-900 leading-none">Subscription Warning</p>
                    <p className="text-[11px] text-orange-800/80 leading-relaxed font-medium">
                      These channels are provisioned via your Digital eMenu license. Changing these settings reflects in your monthly operational quota.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  {servingOptions.map((option) => {
                    const isSelected = selectedOptions.includes(option.id);
                    const Icon = option.icon;
                    
                    return (
                      <div key={option.id} className="space-y-2">
                        <button
                          onClick={() => toggleOption(option.id)}
                          disabled={option.comingSoon}
                          className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group relative",
                            isSelected 
                              ? "border-primary bg-primary/[0.03] shadow-sm" 
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
                              <h4 className="font-bold text-[13px] text-slate-900 tracking-tight">{option.title}</h4>
                              {option.comingSoon && (
                                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest px-1.5 h-4 bg-white border-slate-200 text-slate-400">Soon</Badge>
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

                        {option.id === 'app-to-app' && isSelected && (
                          <div className="mx-2 p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-3 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5 text-left">
                                <Label htmlFor="fees-toggle-qs" className="text-[11px] font-bold text-slate-700">Include Convenience Fees?</Label>
                                <p className="text-[10px] font-medium text-slate-400">Apply to app orders.</p>
                              </div>
                              <Switch 
                                id="fees-toggle-qs" 
                                checked={includeFees} 
                                onCheckedChange={(checked) => {
                                  if (!checked) {
                                    setWarningConfig({
                                      title: "Disable Fees?",
                                      desc: "Removing convenience fees may affect your revenue mapping for app-based transactions.",
                                      confirmText: "Confirm Deactivation",
                                      isDestructive: true,
                                      onConfirm: () => {
                                        setIncludeFees(false);
                                        setShowWarning(false);
                                      }
                                    });
                                    setShowWarning(true);
                                  } else {
                                    setIncludeFees(true);
                                  }
                                }}
                                className="scale-90 data-[state=checked]:bg-primary"
                              />
                            </div>
                            {includeFees && (
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                                <Info className="h-3 w-3 text-primary shrink-0"/>
                                <p className="text-[9px] font-bold text-primary uppercase tracking-widest text-left leading-none">
                                  FEES ENABLED AT CHECKOUT
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <SheetFooter className="p-6 border-t bg-slate-50 shrink-0">
              <div className="flex gap-3 w-full">
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1 rounded-xl font-bold h-11 border-slate-200">Cancel</Button>
                </SheetClose>
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-xl shadow-lg shadow-primary/20">
                  Save Changes
                </Button>
              </div>
            </SheetFooter>
          </div>

          {/* Warning Popup (Nested inside SheetContent for stable focus management) */}
          <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
            <AlertDialogContent className="rounded-3xl border-0 shadow-2xl">
              <AlertDialogHeader className="text-left">
                <AlertDialogTitle className="text-xl font-bold text-slate-900">{warningConfig?.title}</AlertDialogTitle>
                <AlertDialogDescription className="text-sm font-medium text-slate-500 leading-relaxed">
                  {warningConfig?.desc}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4 gap-2">
                <AlertDialogCancel className="rounded-xl font-bold h-11 border-slate-200">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={warningConfig?.onConfirm}
                  className={cn(
                    "text-white font-bold h-11 rounded-xl px-6 transition-colors",
                    warningConfig?.isDestructive 
                      ? "bg-destructive hover:bg-destructive/90" 
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {warningConfig?.confirmText || "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetContent>
      </Sheet>
    </>
  );
}
