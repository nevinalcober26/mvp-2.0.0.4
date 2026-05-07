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
  WalletCards, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Building2,
  Search,
  Trash2,
  Tag,
  Key,
  Globe,
  Cog,
  ChevronDown,
  Loader2,
  ChevronRight,
  CreditCard,
  Network,
  ListChecks,
  Smartphone,
  Info as InfoIcon,
  X,
  PlusCircle,
  Hash,
  Monitor,
  Maximize2,
  Minimize2
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  apiKey?: string;
}

const SUPPORTED_PROVIDERS = [
  { id: 'dpo', name: 'DPO Payment Gateway', icon: CreditCard, color: 'text-blue-600' },
  { id: 'network-international', name: 'Network International', icon: Network, color: 'text-orange-600' },
];

const COUNTRIES = [
  "United Arab Emirates (AE)",
  "United States (US)",
  "United Kingdom (GB)",
  "Saudi Arabia (SA)",
  "Qatar (QA)",
  "Kuwait (KW)",
  "Oman (OM)",
  "Bahrain (BH)",
  "India (IN)",
  "Germany (DE)",
  "France (FR)",
  "Singapore (SG)"
];

const CURRENCIES = ["AED", "USD", "EUR", "GBP", "SAR", "QAR", "INR"];

export default function PaymentGatewayPage() {
  const { toast } = useToast();
  
  const [connection, setConnection] = useState<GatewayConnection | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isWhitelistOpen, setIsWhitelistOpen] = useState(false);
  const [isWhitelistExpanded, setIsWhitelistExpanded] = useState(false);
  const [isAddTerminalModalOpen, setIsAddTerminalModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<GatewayConnection | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [regionSearch, setRegionSearch] = useState('');
  const [isRegionPopoverOpen, setIsRegionPopoverOpen] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [terminals, setTerminals] = useState([
    { id: '1', tid: 'TID-44281', device: 'Verifone P400', imei: '358291039485712' },
    { id: '2', tid: 'TID-44282', device: 'Ingenico Move/5000', imei: '358291039485713' },
    { id: '3', tid: 'TID-44283', device: 'Pax A920', imei: '358291039485714' },
  ]);

  const [newTerminal, setNewTerminal] = useState({
    tid: '',
    device: '',
    imei: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('activePaymentGateway');
    if (stored) {
      try {
        setConnection(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse payment gateway from local storage", e);
      }
    }
  }, []);

  const updateActiveConnection = (newConnection: GatewayConnection | null) => {
    setConnection(newConnection);
    if (newConnection) {
      localStorage.setItem('activePaymentGateway', JSON.stringify(newConnection));
    } else {
      localStorage.removeItem('activePaymentGateway');
    }
  };
  
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

  const handleAddGateway = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const provider = SUPPORTED_PROVIDERS.find(p => p.id === newGateway.providerId);
    const conn: GatewayConnection = {
      id: Date.now().toString(),
      brand: provider?.name || 'Unknown Gateway',
      status: 'active',
      lastSync: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      merchantId: newGateway.merchantId,
      environment: 'live',
      isEnabled: true,
      providerId: newGateway.providerId,
      currency: newGateway.currency,
      region: newGateway.region || undefined,
      outletReference: newGateway.outletReference || undefined,
      apiKey: newGateway.apiKey || undefined
    };

    updateActiveConnection(conn);
    setIsAddModalOpen(false);
    resetForm();
    setShowSuccess(false);
    
    toast({
      title: "Gateway Connected",
      description: `${conn.brand} has been added and saved successfully.`
    });
  };

  const handleOpenSettings = () => {
    if (!connection) return;
    setEditingGateway({ ...connection });
    setIsSettingsSheetOpen(true);
    setRegionSearch('');
  };

  const handleUpdateGateway = () => {
    if (!editingGateway) return;
    const provider = SUPPORTED_PROVIDERS.find(p => p.id === editingGateway.providerId);
    const updatedConn: GatewayConnection = {
        ...editingGateway,
        brand: provider?.name || editingGateway.brand
    };

    updateActiveConnection(updatedConn);
    setIsSettingsSheetOpen(false);
    toast({
      title: "Settings Saved",
      description: "Gateway configuration has been updated."
    });
  };

  const handleAddTerminal = () => {
    if (!newTerminal.tid || !newTerminal.device) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter both Terminal ID and Device Model."
      });
      return;
    }

    const terminalToAdd = {
      id: Date.now().toString(),
      ...newTerminal
    };

    setTerminals(prev => [...prev, terminalToAdd]);
    setNewTerminal({ tid: '', device: '', imei: '' });
    setIsAddTerminalModalOpen(false);
    toast({
      title: "Terminal Authorized",
      description: `Terminal ${terminalToAdd.tid} has been whitelisted.`
    });
  };

  const handleDeleteTerminal = (id: string) => {
    setTerminals(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Terminal Removed",
      description: "The hardware authorization has been revoked."
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setIsProcessing(false);
    setShowSuccess(false);
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

  const handleDelete = () => {
    updateActiveConnection(null);
    setIsDeleteDialogOpen(false);
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

  const isNavigationDisabled = isProcessing || showSuccess;

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-10 bg-muted/20 min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto space-y-8 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Payment Gateway</h1>
              <p className="text-muted-foreground text-sm font-medium">Configure your payment integration for secure digital transactions.</p>
            </div>
          </div>

          {!connection ? (
            <div className="flex flex-col items-center justify-center py-32 bg-background rounded-3xl border-2 border-dashed border-muted-foreground/20 space-y-8 animate-in fade-in zoom-in duration-500 w-full text-center px-6">
               <div className="h-24 w-24 rounded-[2rem] bg-muted/50 flex items-center justify-center">
                  <WalletCards className="h-12 w-12 text-muted-foreground opacity-30" />
               </div>
               <div className="space-y-3 max-w-md">
                  <h3 className="text-2xl font-bold tracking-tight">No Gateway Connected</h3>
                  <p className="text-muted-foreground text-base font-medium leading-relaxed">
                    Connect a payment gateway to start accepting digital payments from your guests securely.
                  </p>
               </div>
               <Button 
                  className="gap-2 font-bold bg-primary hover:bg-primary/90 shadow-xl px-10 h-14 rounded-2xl text-base"
                  onClick={() => setIsAddModalOpen(true)}
               >
                  <Plus className="h-5 w-5" />
                  Connect Gateway
               </Button>
            </div>
          ) : (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className={cn(
                "overflow-hidden border-2 transition-all hover:shadow-xl rounded-3xl border-border w-full max-w-xl",
                !connection.isEnabled && "opacity-75 grayscale-[0.5] border-muted bg-muted/5"
              )}>
                <CardHeader className="pb-4 bg-muted/10 border-b text-left">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white shadow-md border flex items-center justify-center text-primary">
                        <WalletCards className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-xl font-bold truncate">{connection.brand}</CardTitle>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">Active Provider</p>
                      </div>
                    </div>
                    {getStatusBadge(connection.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="p-4 rounded-2xl bg-muted/30 border space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Operational</p>
                      <p className="text-sm font-bold capitalize">{connection.status}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Connected Since</p>
                      <p className="text-sm font-bold">{connection.lastSync}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-6 px-1">
                    <span className="font-semibold uppercase tracking-wider">Merchant ID</span>
                    <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">{connection.merchantId}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t p-4 flex items-center justify-between gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-10 text-xs font-bold uppercase tracking-wide px-4 gap-2 border-primary/20 text-primary hover:bg-primary/5 rounded-xl bg-background shadow-sm"
                    onClick={() => setIsWhitelistOpen(true)}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Whitelisting
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl"
                      onClick={handleOpenSettings}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-xl"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Whitelisting Dialog */}
      <Dialog open={isWhitelistOpen} onOpenChange={setIsWhitelistOpen}>
        <DialogContent className={cn(
            "p-0 overflow-hidden bg-white shadow-2xl text-left transition-all duration-300 flex flex-col",
            isWhitelistExpanded ? "sm:max-w-[95vw] w-[95vw] h-[90vh]" : "sm:max-w-4xl h-[80vh]"
        )}>
          <div className="bg-muted/30 p-8 border-b shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                <ListChecks className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <DialogTitle className="text-2xl font-bold text-foreground">Manage White Listed Terminals</DialogTitle>
                <DialogDescription className="font-medium text-muted-foreground">Authorize specific hardware devices for this outlet.</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-xl hidden sm:flex"
                onClick={() => setIsWhitelistExpanded(!isWhitelistExpanded)}
              >
                {isWhitelistExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                className="font-bold rounded-xl gap-2 shadow-lg h-11 px-6 bg-primary hover:bg-primary/90"
                onClick={() => setIsAddTerminalModalOpen(true)}
              >
                <Plus className="h-4 w-4" /> Add Terminal
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
             <ScrollArea className="h-full">
               <Table>
                 <TableHeader className="bg-muted/10 sticky top-0 z-10 shadow-sm border-b">
                   <TableRow className="hover:bg-transparent h-14 border-0 text-left">
                     <TableHead className="text-[11px] font-bold uppercase tracking-widest pl-8">Terminal ID(TID)</TableHead>
                     <TableHead className="text-[11px] font-bold uppercase tracking-widest">Device</TableHead>
                     <TableHead className="text-[11px] font-bold uppercase tracking-widest">IMEI</TableHead>
                     <TableHead className="text-[11px] font-bold uppercase tracking-widest text-right pr-8">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {terminals.map((t) => (
                     <TableRow key={t.id} className="group transition-colors h-16 text-left">
                       <TableCell className="pl-8 font-bold font-mono text-sm text-foreground">{t.tid}</TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2">
                           <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                           <span className="font-semibold text-sm">{t.device}</span>
                         </div>
                       </TableCell>
                       <TableCell className="font-mono text-xs text-muted-foreground">{t.imei || 'Not Set'}</TableCell>
                       <TableCell className="text-right pr-8">
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg"
                           onClick={() => handleDeleteTerminal(t.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
               {terminals.length === 0 && (
                 <div className="py-20 text-center space-y-4">
                   <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
                     <Smartphone className="h-8 w-8 text-muted-foreground opacity-20" />
                   </div>
                   <p className="text-sm font-medium text-muted-foreground">No terminals whitelisted for this gateway.</p>
                 </div>
               )}
             </ScrollArea>
          </div>

          <div className="p-6 bg-muted/30 border-t flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
               <InfoIcon className="h-4 w-4 text-primary" />
               Only authorized terminals can process transactions.
            </div>
            <DialogClose asChild>
              <Button variant="ghost" className="font-bold px-8 h-10 rounded-xl">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Terminal Modal */}
      <Dialog open={isAddTerminalModalOpen} onOpenChange={setIsAddTerminalModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl shadow-2xl text-left">
          <div className="bg-primary/5 p-8 border-b">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <DialogTitle className="text-xl font-bold text-foreground">Authorize Terminal</DialogTitle>
                <DialogDescription className="font-medium text-muted-foreground">Register new hardware for secure transactions.</DialogDescription>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Hash className="h-3 w-3" /> Terminal ID (TID)
              </Label>
              <Input 
                placeholder="e.g. TID-552910" 
                value={newTerminal.tid}
                onChange={(e) => setNewTerminal(prev => ({ ...prev, tid: e.target.value }))}
                className="h-12 rounded-xl bg-muted/10 border-muted-foreground/20 font-mono font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Monitor className="h-3 w-3" /> Device Model
              </Label>
              <Input 
                placeholder="e.g. Verifone V200c" 
                value={newTerminal.device}
                onChange={(e) => setNewTerminal(prev => ({ ...prev, device: e.target.value }))}
                className="h-12 rounded-xl bg-muted/10 border-muted-foreground/20 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Smartphone className="h-3 w-3" /> IMEI / Serial Number
              </Label>
              <Input 
                placeholder="Enter hardware identifier..." 
                value={newTerminal.imei}
                onChange={(e) => setNewTerminal(prev => ({ ...prev, imei: e.target.value }))}
                className="h-12 rounded-xl bg-muted/10 border-muted-foreground/20 font-mono"
              />
            </div>
          </div>

          <div className="p-6 bg-muted/30 border-t flex flex-row items-center justify-end gap-3">
             <Button variant="ghost" className="font-bold rounded-xl h-11 px-6" onClick={() => setIsAddTerminalModalOpen(false)}>Cancel</Button>
             <Button className="font-bold bg-primary hover:bg-primary/90 rounded-xl h-11 px-10 shadow-lg" onClick={handleAddTerminal}>
               Add Terminal
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Onboarding Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => { if(!open) resetForm(); setIsAddModalOpen(open); }}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden flex flex-col border-0 shadow-2xl bg-white text-left rounded-3xl">
          <div className="bg-muted/30 p-8 border-b shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <DialogHeader className="text-left p-0">
                <DialogTitle className="text-2xl font-bold text-foreground">Connect Gateway</DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  {!isNavigationDisabled && (
                    <>
                      {currentStep === 1 && "Step 1: Region & Provider Selection"}
                      {currentStep === 2 && "Step 2: Identity & Currency"}
                      {currentStep === 3 && "Step 3: Outlet & Security Credentials"}
                    </>
                  )}
                  {isProcessing && "Verifying your details..."}
                  {showSuccess && "Setup complete!"}
                </DialogDescription>
              </DialogHeader>
            </div>
            
            {!isNavigationDisabled && (
              <div className="mt-6 flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", currentStep >= s ? "bg-primary" : "bg-muted")} />
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[350px] flex flex-col">
            {isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 animate-in fade-in duration-500">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="font-bold text-lg text-foreground">Verifying with Gateway...</p>
              </div>
            ) : showSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-6 animate-in zoom-in duration-500">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-500/20">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-bold text-2xl text-foreground">Connected Successfully!</p>
                  <p className="text-muted-foreground font-medium">Saving configuration to workspace...</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 max-h-[60vh]">
                <div className="p-8 space-y-8">
                  {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                      <div className="space-y-4">
                        <Label className="text-sm font-bold flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Business Region (Optional)
                        </Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input 
                            placeholder="Search countries..." 
                            className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={regionSearch}
                            onChange={(e) => setRegionSearch(e.target.value)}
                          />
                        </div>
                        <ScrollArea className="h-[140px] border rounded-xl bg-muted/10 p-2">
                          <div className="space-y-1">
                            {filteredCountries.map(country => (
                              <button
                                key={country}
                                type="button"
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

                      <div className="space-y-4">
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
                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-white shadow-sm transition-transform group-hover:scale-110")}>
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
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                      <div className="space-y-6">
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

                  {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
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
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>

          {!isNavigationDisabled && (
            <DialogFooter className="p-6 bg-muted/30 border-t shrink-0 flex flex-row items-center justify-end gap-4">
              <Button variant="ghost" className="font-bold px-8 h-12 rounded-xl" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              {currentStep === 1 && (
                <Button 
                  className="font-bold bg-primary text-primary-foreground px-10 h-12 shadow-lg gap-2 rounded-xl" 
                  disabled={!newGateway.providerId}
                  onClick={() => setCurrentStep(2)}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              {currentStep === 2 && (
                <Button 
                  className="font-bold bg-primary text-primary-foreground px-10 h-12 shadow-lg gap-2 rounded-xl" 
                  disabled={!newGateway.merchantId}
                  onClick={() => setCurrentStep(3)}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              {currentStep === 3 && (
                <Button 
                  className="font-bold bg-primary text-primary-foreground px-12 h-12 shadow-lg rounded-xl" 
                  onClick={handleAddGateway}
                  disabled={!newGateway.apiKey || !newGateway.outletReference}
                >
                  Add Payment Gateway
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Sheet */}
      <Sheet open={isSettingsSheetOpen} onOpenChange={setIsSettingsSheetOpen}>
        <SheetContent className="sm:max-w-xl p-0 overflow-hidden flex flex-col border-l shadow-2xl bg-white text-left">
          <div className="bg-muted/30 p-8 border-b shrink-0 text-left">
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
            <div className="p-8 space-y-10 text-left">
              {editingGateway && (
                <>
                  <section className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Identity & Label</h3>
                    </div>
                    
                    <div className="space-y-2">
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
                      <div className="space-y-2">
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
                      <div className="space-y-2">
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
                      <div className="space-y-2">
                        <Label className="text-sm font-bold flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Business Region
                        </Label>
                        <Popover open={isRegionPopoverOpen} onOpenChange={setIsRegionPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="h-11 w-full justify-between bg-background font-medium px-4">
                              {editingGateway.region || "Select region"}
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <div className="p-3 border-b bg-muted/20">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input 
                                  placeholder="Search countries..." 
                                  className="flex h-9 w-full rounded-md border bg-background pl-8 pr-3 py-1 text-sm focus-visible:outline-none"
                                  value={regionSearch}
                                  onChange={(e) => setRegionSearch(e.target.value)}
                                />
                              </div>
                            </div>
                            <ScrollArea className="h-[200px]">
                              <div className="p-1">
                                {filteredCountries.map(country => (
                                  <button
                                    key={country}
                                    type="button"
                                    onClick={() => {
                                      setEditingGateway({ ...editingGateway, region: country });
                                      setIsRegionPopoverOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                                      editingGateway.region === country && "bg-primary/10 text-primary"
                                    )}
                                  >
                                    {country}
                                  </button>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
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

                  <section className="space-y-6 pt-4 border-t border-muted">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Security Credentials</h3>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <Key className="h-3.5 w-3.5 text-muted-foreground" /> Service Account API Key
                      </Label>
                      <Input 
                        type="password"
                        placeholder="sk_live_••••••••••••••••••••" 
                        value={editingGateway.apiKey || ""} 
                        onChange={(e) => setEditingGateway({ ...editingGateway, apiKey: e.target.value })}
                        className="h-11 bg-background font-mono"
                      />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl text-left">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Disconnect Gateway?</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium text-muted-foreground">
              This action will immediately stop your ability to process digital payments for this outlet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold h-12 px-6">Keep Connected</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-xl font-bold h-12 px-6 shadow-lg"
            >
              Confirm Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
