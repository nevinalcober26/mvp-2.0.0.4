'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Upload,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Info,
  Clock,
  HandCoins,
  CheckCircle2,
  ChevronRight,
  Palette,
  RotateCcw,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { OutletOptionsModal } from '@/components/dashboard/outlet-options-modal';
import { cn } from '@/lib/utils';
import type { Outlet } from '@/lib/mock-data-store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const cuisines = ['Italian', 'Boutique Café', 'Signature Store', 'Japanese', 'Mexican', 'Indian', 'French', 'Middle Eastern', 'American'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_OPTIONS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
];

const outletFormSchema = z.object({
  name: z.string().min(1, 'Outlet name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and contain only letters, numbers, and hyphens'),
  description: z.string().optional(),
  address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  phonePrefix: z.string().default('+971'),
  phoneNumber: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  cuisine: z.string().min(1, 'Cuisine type is required'),
  country: z.string().default('United Arab Emirates'),
  state: z.string().min(1, 'State is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  zip: z.string().min(1, 'Zip code is required'),
});

type OutletFormValues = z.infer<typeof outletFormSchema>;

export default function AddNewOutletPage() {
  const router = useRouter();
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [isCreated, setIsCreated] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#18B4A6');
  const [showLogo, setShowLogo] = useState(true);
  
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const [regularHours, setRegularHours] = useState(
    DAYS.map(day => ({
      day,
      open: '09:00 AM',
      close: '11:00 PM',
      closed: false
    }))
  );

  const [maxRate, setMaxRate] = useState('100');
  const [customEntryEnabled, setCustomEntryEnabled] = useState(true);

  const form = useForm<OutletFormValues>({
    resolver: zodResolver(outletFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      address: '',
      city: '',
      phonePrefix: '+971',
      phoneNumber: '',
      email: '',
      cuisine: '',
      country: 'United Arab Emirates',
      state: '',
      timezone: 'Asia/Dubai (GMT+04:00)',
      zip: '',
    }
  });

  const { isDirty } = form.formState;
  const watchName = form.watch('name');

  useEffect(() => {
    if (!isCreated && watchName) {
      const generatedSlug = watchName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [watchName, isCreated, form]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
        toast({ title: "Banner Uploaded", description: "Your featured image has been updated." });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveOutletData = (data: OutletFormValues) => {
    const outletId = data.slug || `outlet_${Date.now()}`;
    const newOutlet: Outlet = {
      id: outletId,
      name: data.name,
      image: logoImage || "",
      status: 'Open',
      rating: 0,
      type: data.cuisine || "Boutique Café",
      location: data.city,
      address: data.address,
      menuItems: 0,
      scansToday: 0
    };

    const existing = JSON.parse(localStorage.getItem('customOutlets') || '[]');
    const updatedList = existing.filter((o: Outlet) => o.id !== outletId);
    updatedList.push(newOutlet);
    localStorage.setItem('customOutlets', JSON.stringify(updatedList));
    return outletId;
  };

  const onSubmit = (data: OutletFormValues) => {
    if (!isCreated) {
      setIsOptionsModalOpen(true);
    } else {
      saveOutletData(data);
      toast({
        title: "Changes Saved",
        description: "Outlet configuration has been updated successfully.",
      });
    }
  };

  const handleFinalConfirm = (selectedOptions: string[], includeFees: boolean) => {
    const data = form.getValues();
    const outletId = saveOutletData(data);
    
    localStorage.setItem(`outletServices_${outletId}`, JSON.stringify({
      selectedOptions,
      includeFees
    }));

    setIsOptionsModalOpen(false);
    setIsSuccessDialogOpen(true);
  };

  const handleUpdateRegularHour = (index: number, field: string, value: any) => {
    const updated = [...regularHours];
    updated[index] = { ...updated[index], [field]: value };
    setRegularHours(updated);
  };

  const handleCopyToAllDays = () => {
    const firstDay = regularHours[0];
    const synced = regularHours.map(h => ({
      ...h,
      open: firstDay.open,
      close: firstDay.close,
      closed: firstDay.closed
    }));
    setRegularHours(synced);
    toast({ title: "Schedule Synced", description: "Monday's schedule has been applied to all days." });
  };

  const breadcrumbItems = [
    { label: 'Manage Outlets', href: '/dashboard/categories' },
    { label: isCreated ? `Configure ${form.watch('name') || 'Outlet'}` : 'Add New Outlet' }
  ];

  const isSaveDisabled = !isDirty && !logoImage;

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-muted/30 min-h-[calc(100vh-4rem)] text-left">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4 text-left">
                  <Button variant="ghost" size="icon" type="button" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {isCreated ? "Configure Outlet" : "Add New Outlet"}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        {isCreated ? `Setup details for ${form.watch('name')}` : "Configure your license-based outlet details"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" type="button" className="gap-2 font-semibold" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button 
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg" 
                    type="submit"
                    disabled={isSaveDisabled}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>

              <Card className="shadow-smooth border-0 overflow-hidden bg-background p-0">
                {isCreated ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-3 rounded-none border-b bg-background p-0 h-14 sticky top-0 z-20">
                      <TabsTrigger value="basic" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none h-full gap-2 text-sm font-bold uppercase tracking-wider">
                        <Info className="h-4 w-4" /> Basic Information
                      </TabsTrigger>
                      <TabsTrigger value="hours" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none h-full gap-2 text-sm font-bold uppercase tracking-wider">
                        <Clock className="h-4 w-4" /> Opening Hours
                      </TabsTrigger>
                      <TabsTrigger value="tip-fee" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none h-full gap-2 text-sm font-bold uppercase tracking-wider">
                        <HandCoins className="h-4 w-4" /> Tip Fee
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="p-8 focus-visible:ring-0 mt-0 bg-background space-y-12">
                        <section className="space-y-6 text-left">
                          <h3 className="text-lg font-bold">Outlet Identity</h3>
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center gap-3 shrink-0">
                              <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed overflow-hidden relative">
                                {logoImage ? (
                                  <Image src={logoImage} alt="Logo preview" fill className="object-cover" />
                                ) : (
                                  <ImageIcon className="h-8 w-8 text-muted-foreground opacity-40" />
                                )}
                              </div>
                              <div className="flex flex-col items-center gap-1.5 text-center">
                                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                <Button variant="outline" type="button" className="gap-2 h-9 px-4 text-xs font-bold" size="sm" onClick={() => logoInputRef.current?.click()}>
                                  <Upload className="h-3.5 w-3.5" />
                                  {logoImage ? 'Change Logo' : 'Upload Logo'}
                                </Button>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">PNG, JPG up to 1MB</p>
                              </div>
                            </div>
                            
                            <div className="flex-1 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField 
                                  control={form.control} 
                                  name="name" 
                                  render={({ field }) => (
                                    <FormItem className="text-left">
                                      <FormLabel className="text-sm font-semibold">Outlet name <span className="text-red-500">*</span></FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter outlet name" {...field} className="h-11 bg-background" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField 
                                  control={form.control} 
                                  name="slug" 
                                  render={({ field }) => (
                                    <FormItem className="text-left">
                                      <FormLabel className="text-sm font-semibold">Outlet slug <span className="text-red-500">*</span></FormLabel>
                                      <FormControl>
                                          <Input placeholder="outlet-slug" {...field} className="h-11 bg-background" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField 
                                control={form.control} 
                                name="description" 
                                render={({ field }) => (
                                  <FormItem className="text-left">
                                    <FormLabel className="text-sm font-semibold">Description</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Enter outlet description..." className="min-h-[100px] resize-none bg-background" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </section>

                        <section className="space-y-6 pt-8 border-t text-left">
                            <h3 className="text-lg font-bold">Branding & Identity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-7 space-y-4">
                                    <Label className="text-sm font-semibold">Featured Image (Banner)</Label>
                                    <div className="relative aspect-[21/9] w-full rounded-xl bg-muted/30 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors group" onClick={() => bannerInputRef.current?.click()}>
                                        {featuredImage ? (
                                        <Image src={featuredImage} alt="Banner" fill className="object-cover" />
                                        ) : (
                                        <div className="flex flex-col items-center gap-2 text-center p-4">
                                            <ImageIcon className="h-10 w-10 text-gray-300 mb-1" />
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">WIDESCREEN HEADER IMAGE</p>
                                        </div>
                                        )}
                                        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
                                    </div>
                                </div>
                                <div className="md:col-span-5 space-y-6 text-left">
                                    <div className="space-y-3 text-left">
                                        <div className="flex items-center gap-2">
                                            <Palette className="h-4 w-4 text-teal-500" />
                                            <Label className="text-sm font-semibold">Primary Brand Color</Label>
                                        </div>
                                        <Card className="shadow-none border-gray-100 bg-white">
                                            <CardContent className="p-5 space-y-4">
                                                <div className="flex items-center gap-4">
                                                  <div className="relative h-14 w-14 shrink-0">
                                                      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer rounded-lg border-2 border-white shadow-sm p-0 overflow-hidden" />
                                                  </div>
                                                  <div className="flex-1 space-y-1.5 text-left">
                                                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">BRAND HEX CODE</Label>
                                                      <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-11 bg-background font-mono font-bold uppercase rounded-lg text-sm border-gray-100" />
                                                  </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <Card className="shadow-none border-gray-100 bg-gradient-to-br from-yellow-50/50 via-white to-teal-50/50">
                                        <CardContent className="p-5 flex items-center justify-between">
                                            <div className="space-y-0.5 text-left">
                                                <p className="text-sm font-bold text-gray-900">Display Logo</p>
                                                <p className="text-xs text-gray-500 font-medium">Show your outlet logo on the home screen.</p>
                                            </div>
                                            <Switch checked={showLogo} onCheckedChange={setShowLogo} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6 pt-8 border-t text-left">
                          <h3 className="text-lg font-bold">Address & Contact</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField 
                              control={form.control} 
                              name="address" 
                              render={({ field }) => (
                                <FormItem className="text-left">
                                  <FormLabel className="text-sm font-semibold">Street address <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="Street name and number" className="h-11 bg-background" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField 
                              control={form.control} 
                              name="city" 
                              render={({ field }) => (
                                <FormItem className="text-left">
                                  <FormLabel className="text-sm font-semibold">City <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Dubai" className="h-11 bg-background" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField 
                              control={form.control} 
                              name="state" 
                              render={({ field }) => (
                                <FormItem className="text-left">
                                  <FormLabel className="text-sm font-semibold">State <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Dubai" className="h-11 bg-background" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField 
                              control={form.control} 
                              name="zip" 
                              render={({ field }) => (
                                <FormItem className="text-left">
                                  <FormLabel className="text-sm font-semibold">Zip <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 00000" className="h-11 bg-background" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField 
                              control={form.control} 
                              name="country" 
                              render={({ field }) => (
                                <FormItem className="text-left">
                                  <FormLabel className="text-sm font-semibold">Country <span className="text-red-500">*</span></FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-11 bg-background">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2 text-left">
                              <Label className="text-sm font-semibold text-left block">Phone number <span className="text-red-500">*</span></Label>
                              <div className="flex gap-2">
                                <Select value={form.watch('phonePrefix')} onValueChange={(val) => form.setValue('phonePrefix', val)}>
                                  <SelectTrigger className="w-24 h-11 bg-background font-medium">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="+971">+971</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormField 
                                  control={form.control} 
                                  name="phoneNumber" 
                                  render={({ field }) => (
                                    <FormItem className="flex-1 space-y-0 text-left">
                                      <FormControl>
                                        <Input placeholder="581111111" className="h-11 bg-background font-medium" {...field} />
                                      </FormControl>
                                      <FormMessage className="mt-1" />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            <FormField 
                              control={form.control} 
                              name="email" 
                              render={({ field }) => (
                                <FormItem className="text-left">
                                  <FormLabel className="text-sm font-semibold">Email address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="email@example.com" type="email" className="h-11 bg-background font-medium" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </section>
                    </TabsContent>

                    <TabsContent value="hours" className="p-8 space-y-12 focus-visible:ring-0 mt-0 bg-background text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
                        <div className="space-y-1.5 max-w-2xl text-left">
                          <h3 className="text-xl font-bold tracking-tight">Operating Schedule</h3>
                          <p className="text-sm text-muted-foreground font-medium">Define when your outlet is open.</p>
                        </div>
                        <Button variant="outline" type="button" size="sm" className="gap-2 font-bold text-xs h-10 px-4 rounded-xl shadow-sm" onClick={handleCopyToAllDays}>
                          <RotateCcw className="h-3.5 w-3.5" /> Apply Monday to All Days
                        </Button>
                      </div>
                      <div className="space-y-6">
                        <Card className="border shadow-none overflow-hidden bg-muted/10 rounded-2xl">
                          <CardHeader className="bg-white border-b py-4 px-8 text-left">
                            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">Standard Hours</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0 divide-y bg-white">
                            {regularHours.map((hour, index) => (
                              <div key={hour.day} className={cn("flex flex-col sm:flex-row sm:items-center gap-6 py-5 px-8 transition-colors", hour.closed ? "bg-muted/20 opacity-60" : "hover:bg-muted/5")}>
                                <div className="w-32 shrink-0 text-left">
                                  <span className="font-bold text-base text-foreground">{hour.day}</span>
                                </div>
                                <div className="flex-1 flex flex-wrap items-center gap-4 text-left">
                                  <div className={cn("flex items-center gap-3 transition-opacity", hour.closed && "pointer-events-none")}>
                                    <div className="space-y-1.5 text-left">
                                      <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase text-left block">Open</Label>
                                      <Select value={hour.open} onValueChange={(val) => handleUpdateRegularHour(index, 'open', val)}>
                                        <SelectTrigger className="w-36 h-10 bg-background font-bold text-sm rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                      </Select>
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground mt-6">to</span>
                                    <div className="space-y-1.5 text-left">
                                      <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase text-left block">Close</Label>
                                      <Select value={hour.close} onValueChange={(val) => handleUpdateRegularHour(index, 'close', val)}>
                                        <SelectTrigger className="w-36 h-10 bg-background font-bold text-sm rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>{TIME_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-center">
                                  <div className={cn("flex items-center gap-3 px-4 py-2 rounded-xl border", hour.closed ? "bg-destructive/5 border-destructive/20" : "bg-green-50/50 border-green-100")}>
                                    <Checkbox id={`closed-${hour.day}`} checked={hour.closed} onCheckedChange={(checked) => handleUpdateRegularHour(index, 'closed', !!checked)} />
                                    <label htmlFor={`closed-${hour.day}`} className={cn("text-xs font-bold cursor-pointer", hour.closed ? "text-destructive" : "text-green-700")}>{hour.closed ? 'Closed' : 'Open'}</label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="tip-fee" className="p-8 space-y-10 focus-visible:ring-0 mt-0 bg-background text-left">
                      <section className="space-y-8">
                        <div className="text-left border-b pb-6">
                            <h3 className="text-xl font-bold text-slate-900">Gratuity Settings</h3>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Configure customer tipping options.</p>
                        </div>
                        <Card className="rounded-2xl border shadow-sm">
                          <CardHeader className="text-left">
                            <CardTitle className="text-lg font-bold">Options</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6 pt-2 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left">
                              <div className="space-y-2 text-left">
                                <Label className="text-sm font-bold text-slate-700 text-left block">Max Tip Amount (%)</Label>
                                <Input value={maxRate} onChange={(e) => setMaxRate(e.target.value)} placeholder="e.g. 100" className="h-12 bg-background font-bold text-base rounded-xl" />
                              </div>
                              <div className="space-y-2 text-left">
                                <Label className="text-sm font-bold text-slate-700 text-left block">Allow Custom Tip</Label>
                                <div className="flex items-center justify-between rounded-xl border p-4 h-[64px] bg-background text-left">
                                  <p className="text-xs text-muted-foreground font-medium text-left">Guests enter custom amount.</p>
                                  <Switch id="custom-tip-enabled" checked={customEntryEnabled} onCheckedChange={setCustomEntryEnabled} />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </section>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="p-8 space-y-12 text-left">
                    <section className="space-y-6 text-left">
                      <h3 className="text-lg font-bold">Outlet Identity</h3>
                      <div className="flex flex-col md:flex-row gap-8 text-left">
                        <div className="flex flex-col items-center gap-3 shrink-0">
                          <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed overflow-hidden relative">
                            {logoImage ? (
                              <Image src={logoImage} alt="Logo" fill className="object-cover" />
                            ) : (
                              <ImageIcon className="h-8 w-8 text-muted-foreground opacity-40" />
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-1.5 text-center">
                            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            <Button variant="outline" type="button" className="gap-2 h-9 px-4 text-xs font-bold" size="sm" onClick={() => logoInputRef.current?.click()}>
                              <Upload className="h-3.5 w-3.5" />
                              {logoImage ? 'Change Logo' : 'Upload Logo'}
                            </Button>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">PNG, JPG up to 1MB</p>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-6 text-left">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <FormField 
                              control={form.control} 
                              name="name" 
                              render={({ field }) => (
                                <FormItem className="text-left">
                                  <FormLabel className="text-sm font-semibold">Outlet name <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter outlet name" {...field} className="h-11 bg-background" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField 
                              control={form.control} 
                              name="slug" 
                              render={({ field }) => (
                                <FormItem className="text-left">
                                  <FormLabel className="text-sm font-semibold">Outlet slug <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="outlet-slug" {...field} className="h-11 bg-background pr-10" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField 
                            control={form.control} 
                            name="description" 
                            render={({ field }) => (
                              <FormItem className="text-left">
                                <FormLabel className="text-sm font-semibold">Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter outlet description..." className="min-h-[100px] resize-none bg-background" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6 pt-8 border-t text-left">
                      <h3 className="text-lg font-bold">Address & Location</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <FormField 
                          control={form.control} 
                          name="address" 
                          render={({ field }) => (
                            <FormItem className="text-left">
                              <FormLabel className="text-sm font-semibold">Street address <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Street name and number" className="h-11 bg-background" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField 
                          control={form.control} 
                          name="city" 
                          render={({ field }) => (
                            <FormItem className="text-left">
                              <FormLabel className="text-sm font-semibold">City <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Dubai" className="h-11 bg-background" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <FormField 
                          control={form.control} 
                          name="state" 
                          render={({ field }) => (
                            <FormItem className="text-left">
                              <FormLabel className="text-sm font-semibold">State <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Dubai" className="h-11 bg-background" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField 
                          control={form.control} 
                          name="zip" 
                          render={({ field }) => (
                            <FormItem className="text-left">
                              <FormLabel className="text-sm font-semibold">Zip <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 00000" className="h-11 bg-background" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField 
                          control={form.control} 
                          name="country" 
                          render={({ field }) => (
                            <FormItem className="text-left">
                              <FormLabel className="text-sm font-semibold">Country <span className="text-red-500">*</span></FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 bg-background">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="space-y-2 text-left">
                          <Label className="text-sm font-semibold text-left block">Phone <span className="text-red-500">*</span></Label>
                          <div className="flex gap-2">
                            <Select value={form.watch('phonePrefix')} onValueChange={(val) => form.setValue('phonePrefix', val)}>
                              <SelectTrigger className="w-24 h-11 bg-background font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+971">+971</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormField 
                              control={form.control} 
                              name="phoneNumber" 
                              render={({ field }) => (
                                <FormItem className="flex-1 space-y-0 text-left">
                                  <FormControl>
                                    <Input placeholder="581111111" className="h-11 bg-background" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <FormField 
                          control={form.control} 
                          name="email" 
                          render={({ field }) => (
                            <FormItem className="text-left">
                              <FormLabel className="text-sm font-semibold text-left block">Email address</FormLabel>
                              <FormControl>
                                <Input placeholder="email@example.com" type="email" className="h-11 bg-background font-medium" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </section>
                    <section className="space-y-6 pt-8 border-t text-left">
                      <h3 className="text-lg font-bold">Operational Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <FormField 
                          control={form.control} 
                          name="cuisine" 
                          render={({ field }) => (
                            <FormItem className="text-left">
                              <FormLabel className="text-sm font-semibold">Cuisine <span className="text-red-500">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 bg-background">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {cuisines.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField 
                          control={form.control} 
                          name="timezone" 
                          render={({ field }) => (
                            <FormItem className="text-left">
                              <FormLabel className="text-sm font-semibold">Timezone <span className="text-red-500">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 bg-background">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Asia/Dubai (GMT+04:00)">Asia/Dubai (GMT+04:00)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </section>
                  </div>
                )}
              </Card>
            </form>
          </Form>

          <div className="mt-8 flex justify-end gap-3 pb-12">
            <Button variant="outline" className="px-8 h-12 font-bold rounded-xl" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button className="px-10 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 rounded-xl shadow-lg" onClick={form.handleSubmit(onSubmit)} disabled={isSaveDisabled}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
      </main>

      <OutletOptionsModal open={isOptionsModalOpen} onOpenChange={setIsOptionsModalOpen} onConfirm={handleFinalConfirm} />

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md p-10 border-0 shadow-2xl bg-white text-center rounded-3xl">
          <div className="absolute -top-10 -right-10 p-8 opacity-10 rotate-12 pointer-events-none"><CheckCircle2 className="h-48 w-48 text-primary" /></div>
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20"><CheckCircle2 className="h-10 w-10 text-primary" /></div>
            <div className="space-y-3 text-center">
              <DialogTitle className="text-3xl font-bold tracking-tight text-foreground leading-tight">Activation Successful</DialogTitle>
              <DialogDescription className="text-muted-foreground text-base font-medium max-w-[340px] mx-auto leading-relaxed">
                Your digital services are now active. You can now proceed to configure the remaining details, including operating hours and tip settings.
              </DialogDescription>
            </div>
            <Button className="w-full h-12 font-bold uppercase tracking-widest bg-primary text-white hover:bg-primary/90 rounded-xl gap-2" onClick={() => { setIsSuccessDialogOpen(false); setIsCreated(true); }}>
              Continue to Configuration <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
