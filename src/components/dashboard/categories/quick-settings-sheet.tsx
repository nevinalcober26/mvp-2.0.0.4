
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
  CalendarCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: {
    id: string;
    name: string;
    status: 'Open' | 'Closed';
  } | null;
}

export function QuickSettingsSheet({
  open,
  onOpenChange,
  restaurant,
}: QuickSettingsSheetProps) {
  const { toast } = useToast();
  const [isBranchOpen, setIsBranchOpen] = useState(restaurant?.status === 'Open');
  const [isOnlineOrderingEnabled, setIsOnlineOrderingEnabled] = useState(true);
  
  // States for specific activated services
  const [activatedServices, setActivatedServices] = useState<string[]>([]);
  const [serviceStates, setServiceStates] = useState<Record<string, boolean>>({});

  const [isConfirmingToggle, setIsConfirmingToggle] = useState(false);
  const [pendingOnlineState, setPendingOnlineState] = useState(false);


  useEffect(() => {
    if (open && restaurant) {
      setIsBranchOpen(restaurant.status === 'Open');
      
      // Load general ordering toggle
      const onlineEnabled = localStorage.getItem(`onlineOrderingEnabled_${restaurant.id}`);
      setIsOnlineOrderingEnabled(onlineEnabled === null ? true : onlineEnabled === 'true');

      // Load specific activated services from onboarding
      const servicesData = localStorage.getItem(`outletServices_${restaurant.id}`);
      if (servicesData) {
        const parsed = JSON.parse(servicesData);
        const options = parsed.selectedOptions || [];
        setActivatedServices(options);
        
        // Initialize local switch states for these services (enabled by default)
        const initialStates: Record<string, boolean> = {};
        options.forEach((opt: string) => {
            initialStates[opt] = true;
        });
        setServiceStates(initialStates);
      } else {
        // Fallback for mock outlets that haven't gone through onboarding
        setActivatedServices(['qr-web']);
        setServiceStates({ 'qr-web': true });
      }
    }
  }, [open, restaurant]);

  if (!restaurant) return null;

  const handleSave = () => {
    if(restaurant) {
      const oldValue = localStorage.getItem(`onlineOrderingEnabled_${restaurant.id}`);
      const newValue = String(isOnlineOrderingEnabled);
      localStorage.setItem(`onlineOrderingEnabled_${restaurant.id}`, newValue);
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: `onlineOrderingEnabled_${restaurant.id}`,
        newValue: newValue,
        oldValue: oldValue,
        storageArea: localStorage,
      }));
    }

    toast({
      title: "Settings Updated",
      description: `Quick settings for ${restaurant.name} have been saved successfully.`,
    });
    onOpenChange(false);
  };
  
  const handleToggleConfirmation = (checked: boolean) => {
    setPendingOnlineState(checked);
    setIsConfirmingToggle(true);
  };
  
  const handleConfirmToggle = () => {
    setIsOnlineOrderingEnabled(pendingOnlineState);
    setIsConfirmingToggle(false);
  };

  const toggleService = (id: string, checked: boolean) => {
    setServiceStates(prev => ({ ...prev, [id]: checked }));
  };

  const getServiceLabel = (id: string) => {
      switch(id) {
          case 'app-to-app': return 'App to App';
          case 'qr-web': return 'Qr Web';
          case 'reservations': return 'Reservations';
          default: return id;
      }
  };

  const getServiceIcon = (id: string) => {
    switch(id) {
        case 'app-to-app': return Smartphone;
        case 'qr-web': return QrCode;
        case 'reservations': return CalendarCheck;
        default: return ShoppingBag;
    }
};

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={!isConfirmingToggle}>
        <SheetContent className="sm:max-w-md w-full p-0 border-l shadow-2xl bg-white">
          <div className="flex flex-col h-full">
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

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Operational Status</h3>
                
                <Card className="border-2 border-slate-100 shadow-none">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <Store className="h-4 w-4" />
                        </div>
                        <div className="grid gap-0.5 text-left">
                          <Label htmlFor="status" className="font-bold text-sm text-slate-900">Outlet Open</Label>
                          <p className="text-[11px] text-muted-foreground font-medium">Set if this outlet is currently taking orders.</p>
                        </div>
                      </div>
                      <Switch id="status" checked={isBranchOpen} onCheckedChange={setIsBranchOpen} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Order Channels</h3>
                
                <div className="grid gap-3">
                  {/* General Master Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-card text-left">
                    <div className="flex items-center gap-3 text-left">
                      <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div className="grid gap-0.5">
                        <Label htmlFor="online-orders" className="font-bold text-sm text-slate-900">Online Ordering</Label>
                        <p className="text-[11px] text-muted-foreground font-medium">Enable web & mobile app ordering.</p>
                      </div>
                    </div>
                    <Switch 
                      id="online-orders" 
                      checked={isOnlineOrderingEnabled} 
                      onCheckedChange={handleToggleConfirmation}
                    />
                  </div>

                  {/* Dynamically Activated Services */}
                  {activatedServices.map(serviceId => {
                      const Icon = getServiceIcon(serviceId);
                      return (
                        <div key={serviceId} className="flex items-center justify-between p-4 rounded-xl border bg-slate-50/30 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="grid gap-0.5">
                                    <Label htmlFor={`service-${serviceId}`} className="font-bold text-sm text-slate-900">{getServiceLabel(serviceId)}</Label>
                                    <p className="text-[10px] text-muted-foreground font-medium">Manage this specific channel.</p>
                                </div>
                            </div>
                            <Switch 
                                id={`service-${serviceId}`}
                                checked={serviceStates[serviceId] ?? true}
                                onCheckedChange={(checked) => toggleService(serviceId, checked)}
                                className="data-[state=checked]:bg-primary"
                            />
                        </div>
                      )
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-start gap-3">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-bold text-orange-900">Auto-Close Warning</p>
                  <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                    This outlet is set to automatically close orders at 11:30 PM. You can change this in full settings.
                  </p>
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
        </SheetContent>
      </Sheet>
      
      <AlertDialog open={isConfirmingToggle} onOpenChange={setIsConfirmingToggle}>
          <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
              <AlertDialogHeader className="text-left">
                  <AlertDialogTitle className="text-xl font-bold text-slate-900">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium text-slate-500">
                      {pendingOnlineState 
                        ? "This will enable online ordering for this outlet. Customers will be able to place orders from the mobile menu."
                        : "This will disable online ordering for this outlet. Customers will only be able to view the menu, not purchase items."}
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4 gap-2">
                  <AlertDialogCancel className="rounded-xl font-bold h-11 border-slate-200">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-xl px-6"
                    onClick={handleConfirmToggle}
                  >
                      {pendingOnlineState ? 'Enable' : 'Disable'}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

