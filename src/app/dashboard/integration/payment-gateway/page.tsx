'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DashboardHeader } from "@/components/dashboard/header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Plus, 
  ShieldCheck, 
  Zap, 
  WalletCards, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  ChevronRight,
  Building2,
  Network,
  Search,
  Trash2,
  Tag,
  Key,
  Globe,
  CreditCard,
  X,
  Save,
  Cog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type GatewayStatus = 'active' | 'error' | 'disabled';

interface GatewayConnection {
  id: string;
  brand: string;
  status: GatewayStatus;
  lastSync: string;
  merchantId: string;
  environment: 'live' | 'sandbox';
  isEnabled: boolean;
  providerId: string;
  currency: string;
  region?: string;
  outletReference?: string;
}

const SUPPORTED_PROVIDERS = [
  { id: 'stripe', name: 'Stripe', icon: Zap, color: 'text-blue-600' },
  { id: 'adyen', name: 'Adyen', icon: Building2, color: 'text-green-600' },
  { id: 'network-international', name: 'Network International', icon: Network, color: 'text-orange-600' },
  { id: 'checkout', name: 'Checkout.com', icon: CreditCard, color: 'text-purple-600' },
];

const COUNTRIES = [
  "United Arab Emirates", "United States", "United Kingdom", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain", "India", "Germany", "France", "Singapore"
];

const CURRENCIES = ["AED", "USD", "EUR", "GBP", "SAR", "QAR", "INR"];

export default function PaymentGatewayPage() {
  const { toast } = useToast();
  
  const [connections, setConnections] = useState<GatewayConnection[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<GatewayConnection | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [regionSearch, setRegionSearch] = useState('');

  // Load from Local Storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('paymentGateways');
    if (stored) {
      try {
        setConnections(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse payment gateways from local storage", e);
      }
    }
  }, []);

  // Helper to update state and storage
  const updateConnections = (newConnections: GatewayConnection[]) => {
    setConnections(newConnections);
    localStorage.setItem('paymentGateways', JSON.stringify(newConnections));
  };
  
  // New Gateway Form State
  const [newGateway, setNewGateway] = useState({
    merchantId: '',
    region: '',
    providerId: '',
    currency: 'AED',
    outletReference: '',
    apiKey: ''
  });

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => c.toLowerCase().includes(regionSearch.toLowerCase()));
  }, [regionSearch]);

  const handleAddGateway = () => {
    const provider = SUPPORTED_PROVIDERS.find(p => p.id === newGateway.providerId);
    const connection: GatewayConnection = {
      id: Date.now().toString(),
      brand: provider?.name || 'Unknown Gateway',
      status: 'active',
      lastSync: 'just now',
      merchantId: newGateway.merchantId,
      environment: 'live',
      isEnabled: true,
      providerId: newGateway.providerId,
      currency: newGateway.currency,
      region: newGateway.region || undefined,
      outletReference: newGateway.outletReference || undefined
    };

    const updated = [connection, ...connections];
    updateConnections(updated);
    setIsAddModalOpen(false);
    resetForm();
    toast({
      title: "Gateway Connected",
      description: `${connection.brand} has been added and saved successfully.`
    });
  };

  const handleOpenSettings = (conn: GatewayConnection) => {
    setEditingGateway({ ...conn });
    setIsSettingsSheetOpen(true);
  };

  const handleUpdateGateway = () => {
    if (!editingGateway) return;
    const provider = SUPPORTED_PROVIDERS.find(p => p.id === editingGateway.providerId);
    const updatedConn: GatewayConnection = {
        ...editingGateway,
        brand: provider?.name || editingGateway.brand
    };

    const updated = connections.map(c => c.id === updatedConn.id ? updatedConn : c);
    updateConnections(updated);
    setIsSettingsSheetOpen(false);
    toast({
      title: "Settings Saved",
      description: "Gateway configuration has been updated."
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setNewGateway({
      merchantId: '',
      region: '',
      providerId: '',
      currency: 'AED',
      outletReference: '',
      apiKey: ''
    });
    setRegionSearch('');
  };

  const handleDelete = (id: string) => {
    const updated = connections.filter(c => c.id !== id);
    updateConnections(updated);
    toast({
      variant: 'destructive',
      title: "Gateway Removed",
      description: "The connection has been removed from your account."
    });
  };

  const getStatusBadge = (status: GatewayStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none gap-1.5 font-bold"><CheckCircle2 className="h-3 w-3" /> Live</Badge>;
      case 'error':
        return <Badge variant="destructive" className="gap-1.5 font-bold"><AlertCircle className="h-3 w-3" /> Error</Badge>;
      default:
        return <Badge variant="secondary" className="font-bold">Disabled</Badge>;
    }
  };

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-10 bg-muted/20 min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground text-left">Payment Gateways</h1>
              <p className="text-muted-foreground text-sm font-medium text-left">Link your gateway to automate your digital payments.</p>
            </div>
            {connections.length > 0 && (
              <Button 
                className="gap-2 font-bold bg-primary hover:bg-primary/90 shadow-sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Connect New Gateway
              </Button>
            )}
          </div>

          {connections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-background rounded-3xl border-2 border-dashed border-muted-foreground/20 space-y-8 animate-in fade-in zoom-in duration-500 w-full text-center px-6">
               <div className="h-24 w-24 rounded-[2rem] bg-muted/50 flex items-center justify-center">
                  <WalletCards className="h-12 w-12 text-muted-foreground opacity-30" />
               </div>
               <div className="space-y-3 max-w-md">
                  <h3 className="text-2xl font-bold tracking-tight">No Gateways Connected</h3>
                  <p className="text-muted-foreground text-base font-medium leading-relaxed">
                    Connect a payment gateway to start accepting digital payments from your guests securely.
                  </p>
               </div>
               <Button 
                  className="gap-2 font-bold bg-primary hover:bg-primary/90 shadow-xl px-10 h-14 rounded-2xl text-base"
                  onClick={() => setIsAddModalOpen(true)}
               >
                  <Plus className="h-5 w-5" />
                  Connect New Gateway
               </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {connections.map((conn) => (
                <Card key={conn.id} className={cn(
                  "overflow-hidden border-2 transition-all hover:shadow-xl rounded-3xl border-border",
                  !conn.isEnabled && "opacity-75 grayscale-[0.5] border-muted bg-muted/5"
                )}>
                  <CardHeader className="pb-4 bg-muted/10 border-b text-left">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white shadow-md border flex items-center justify-center text-primary">
                          <WalletCards className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-xl font-bold truncate">{conn.brand}</CardTitle>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">Payment Provider</p>
                        </div>
                      </div>
                      {getStatusBadge(conn.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="p-4 rounded-2xl bg-muted/30 border space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Operational</p>
                        <p className="text-sm font-bold capitalize">{conn.status}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Last Sync</p>
                        <p className="text-sm font-bold">{conn.lastSync}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-6 px-1">
                      <span className="font-semibold uppercase tracking-wider">Merchant ID</span>
                      <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">{conn.merchantId}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/20 border-t p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl"
                        onClick={() => handleOpenSettings(conn)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-xl"
                        onClick={() => handleDelete(conn.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Onboarding Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => { if(!open) resetForm(); setIsAddModalOpen(open); }}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden flex flex-col border-0 shadow-2xl bg-white text-left rounded-3xl">
          <div className="bg-muted/30 p-8 border-b shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <DialogHeader className="text-left p-0">
                <DialogTitle className="text-2xl font-bold text-foreground">Connect Gateway</DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  {currentStep === 1 && "Step 1: Identity Information"}
                  {currentStep === 2 && "Step 2: Regional Configuration"}
                  {currentStep === 3 && "Step 3: Provider Selection"}
                  {currentStep === 4 && "Step 4: API & Credentials"}
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="mt-6 flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", currentStep >= s ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-8 space-y-8">
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Merchant Identifier
                    </Label>
                    <Input 
                      placeholder="e.g. MID_9428105" 
                      value={newGateway.merchantId}
                      onChange={(e) => setNewGateway(prev => ({ ...prev, merchantId: e.target.value }))}
                      className="h-12 bg-background font-medium rounded-xl"
                    />
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Your unique merchant ID from the gateway provider.</p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Business Region (Optional)
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search countries..." 
                        value={regionSearch}
                        onChange={(e) => setRegionSearch(e.target.value)}
                        className="h-12 pl-10 bg-background font-medium rounded-xl"
                      />
                    </div>
                    <ScrollArea className="h-[200px] border rounded-xl bg-muted/10 p-2">
                      <div className="space-y-1">
                        {filteredCountries.map(country => (
                          <button
                            key={country}
                            onClick={() => setNewGateway(prev => ({ ...prev, region: country }))}
                            className={cn(
                              "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                              newGateway.region === country ? "bg-primary text-white" : "hover:bg-muted"
                            )}
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Select Gateway Provider</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SUPPORTED_PROVIDERS.map((provider) => (
                          <div
                            key={provider.id}
                            onClick={() => setNewGateway(prev => ({ ...prev, providerId: provider.id }))}
                            className={cn(
                              "cursor-pointer flex flex-col p-5 rounded-2xl border-2 transition-all duration-300 group",
                              newGateway.providerId === provider.id
                                ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                : "border-muted hover:border-accent-foreground/20 bg-background"
                            )}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-110 bg-white")}>
                                <provider.icon className={cn("h-5 w-5", provider.color)} />
                              </div>
                              {newGateway.providerId === provider.id && (
                                <CheckCircle2 className="h-6 w-6 text-primary animate-in zoom-in duration-300" />
                              )}
                            </div>
                            <p className="font-bold text-base text-foreground">{provider.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Base Currency</Label>
                      <Select 
                        value={newGateway.currency} 
                        onValueChange={(val) => setNewGateway(prev => ({ ...prev, currency: val }))}
                      >
                        <SelectTrigger className="h-12 bg-background font-medium rounded-xl">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Outlet Reference
                      </Label>
                      <Input 
                        placeholder="e.g. STORE_RAK_01" 
                        value={newGateway.outletReference}
                        onChange={(e) => setNewGateway(prev => ({ ...prev, outletReference: e.target.value }))}
                        className="h-12 bg-background font-medium rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <Key className="h-3.5 w-3.5 text-muted-foreground" /> Service Account API Key
                      </Label>
                      <Input 
                        type="password"
                        placeholder="sk_live_••••••••••••••••••••" 
                        value={newGateway.apiKey}
                        onChange={(e) => setNewGateway(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="h-12 bg-background font-mono rounded-xl"
                      />
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Your secret production key. Keep this private.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 bg-muted/30 border-t shrink-0 flex flex-row items-center justify-between gap-4">
            {currentStep === 1 && (
              <>
                <Button variant="ghost" className="font-bold px-8 h-12 rounded-xl" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button 
                  className="font-bold bg-primary text-primary-foreground px-10 h-12 shadow-lg gap-2 rounded-xl" 
                  disabled={!newGateway.merchantId}
                  onClick={() => setCurrentStep(2)}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            {currentStep === 2 && (
              <>
                <Button variant="outline" className="font-bold px-8 h-12 gap-2 rounded-xl" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" className="font-bold px-8 h-12 rounded-xl" onClick={() => setCurrentStep(3)}>Skip</Button>
                  <Button 
                    className="font-bold bg-primary text-primary-foreground px-10 h-12 shadow-lg gap-2 rounded-xl" 
                    onClick={() => setCurrentStep(3)}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <Button variant="outline" className="font-bold px-8 h-12 gap-2 rounded-xl" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button 
                  className="font-bold bg-primary text-primary-foreground px-10 h-12 shadow-lg gap-2 rounded-xl" 
                  disabled={!newGateway.providerId}
                  onClick={() => setCurrentStep(4)}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            {currentStep === 4 && (
              <>
                <Button variant="outline" className="font-bold px-8 h-12 gap-2 rounded-xl" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button 
                  className="font-bold bg-primary text-primary-foreground px-12 h-12 shadow-lg rounded-xl" 
                  onClick={handleAddGateway}
                  disabled={!newGateway.apiKey || !newGateway.outletReference}
                >
                  Add Payment Gateway
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Sheet (Slide Drawer) */}
      <Sheet open={isSettingsSheetOpen} onOpenChange={setIsSettingsSheetOpen}>
        <SheetContent className="sm:max-w-xl p-0 overflow-hidden flex flex-col border-l shadow-2xl bg-white text-left">
          <div className="bg-muted/30 p-8 border-b shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Cog className="h-5 w-5 text-primary" />
              </div>
              <SheetHeader className="text-left p-0">
                <SheetTitle className="text-2xl font-bold text-foreground">Edit Gateway Settings</SheetTitle>
                <SheetDescription className="text-muted-foreground font-medium">Update credentials and regional mappings for this connection.</SheetDescription>
              </SheetHeader>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-8 space-y-10">
              {editingGateway && (
                <>
                  <section className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Identity & Label</h3>
                    </div>
                    
                    <div className="space-y-2 text-left">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Merchant Identifier
                      </Label>
                      <Input 
                        value={editingGateway.merchantId} 
                        onChange={(e) => setEditingGateway({ ...editingGateway, merchantId: e.target.value })}
                        className="h-11 bg-background font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2 text-left">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gateway Provider</Label>
                        <Select 
                            value={editingGateway.providerId} 
                            onValueChange={(val) => setEditingGateway({ ...editingGateway, providerId: val })}
                        >
                            <SelectTrigger className="h-11 bg-background font-bold text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SUPPORTED_PROVIDERS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 text-left">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Currency</Label>
                        <Select 
                            value={editingGateway.currency} 
                            onValueChange={(val) => setEditingGateway({ ...editingGateway, currency: val })}
                        >
                            <SelectTrigger className="h-11 bg-background font-bold text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6 pt-4 border-t border-muted">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Regional Configuration</h3>
                    </div>

                    <div className="grid gap-6">
                      <div className="space-y-2 text-left">
                        <Label className="text-sm font-bold flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Business Region
                        </Label>
                        <Select 
                            value={editingGateway.region || ""} 
                            onValueChange={(val) => setEditingGateway({ ...editingGateway, region: val })}
                        >
                            <SelectTrigger className="h-11 bg-background font-medium">
                                <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 text-left">
                        <Label className="text-sm font-bold flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Outlet Reference
                        </Label>
                        <Input 
                            value={editingGateway.outletReference || ""} 
                            onChange={(e) => setEditingGateway({ ...editingGateway, outletReference: e.target.value })}
                            className="h-11 bg-background font-medium"
                        />
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className="p-6 bg-muted/30 border-t shrink-0 flex flex-row items-center justify-end gap-3">
            <SheetClose asChild><Button variant="ghost" className="font-bold px-8 h-11">Cancel</Button></SheetClose>
            <Button className="font-bold bg-primary text-primary-foreground px-10 h-11 shadow-lg" onClick={handleUpdateGateway}>
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
