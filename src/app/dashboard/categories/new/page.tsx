'use client';

import React, { useState, useRef, useMemo } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import {
  Upload,
  Save,
  ArrowLeft,
  HelpCircle,
  Image as ImageIcon,
  Palette,
  Edit,
  Globe,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import { OutletOptionsDrawer } from '@/components/dashboard/outlet-options-drawer';

const cuisines = ['Italian', 'Boutique Café', 'Signature Store', 'Japanese', 'Mexican', 'Indian', 'French', 'Middle Eastern', 'American'];

const initialFormData = {
  name: '',
  slug: '',
  description: '',
  primaryColor: '#18B4A6',
  showLogo: true,
  address: '',
  city: '',
  menuUrl: '',
  phonePrefix: '+971',
  phoneNumber: '',
  email: '',
  cuisine: '',
  country: 'United Arab Emirates',
  state: '',
  timezone: 'Asia/Dubai (GMT+04:00)',
  zip: '',
  showMap: false,
};

export default function AddNewOutletPage() {
  const router = useRouter();
  const { toast } = useToast();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // States for media
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If updating name, also update slug in parallel
      if (field === 'name') {
        newData.slug = value
          .toLowerCase()
          .replace(/\s+/g, '-')       // Replace spaces with -
          .replace(/[^\w-]+/g, '')     // Remove all non-word chars
          .replace(/--+/g, '-')       // Replace multiple - with single -
          .replace(/^-+/, '')         // Trim - from start of text
          .replace(/-+$/, '');        // Trim - from end of text
      }
      
      return newData;
    });
  };

  const hasEnteredData = useMemo(() => {
    // Check if any significant textual or toggle data has been touched from initial state
    return (
      formData.name.trim() !== '' ||
      formData.slug.trim() !== '' ||
      formData.description.trim() !== '' ||
      formData.address.trim() !== '' ||
      formData.city.trim() !== '' ||
      formData.phoneNumber.trim() !== '' ||
      formData.email.trim() !== '' ||
      featuredImage !== null ||
      logoImage !== null
    );
  }, [formData, featuredImage, logoImage]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
        toast({ title: "Banner Uploaded", description: "Your featured image has been set." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
        toast({ title: "Logo Uploaded", description: "Your outlet logo has been set." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsOptionsDrawerOpen(true);
  };

  const handleFinalConfirm = () => {
    setIsOptionsDrawerOpen(false);
    toast({
      title: "Outlet Created",
      description: "Outlet details and services have been activated.",
    });
    router.push('/dashboard/categories');
  };

  const breadcrumbItems = [
    { label: 'Manage Outlets', href: '/dashboard/categories' },
    { label: 'Add New Outlet' }
  ];

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-muted/30 min-h-[calc(100vh-4rem)]">
        <div className="max-w-5xl mx-auto text-left">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Outlet</h1>
                <p className="text-muted-foreground mt-1">Configure your new outlet details and basic settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 font-semibold" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button 
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold" 
                onClick={handleSave}
                disabled={!hasEnteredData}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <Card className="shadow-smooth border-0 overflow-hidden text-left bg-background p-8 space-y-12">
            
            {/* Outlet Details Section */}
            <section className="space-y-6">
              <h3 className="text-lg font-bold">Outlet Details</h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed overflow-hidden relative">
                    {logoImage ? (
                      <Image src={logoImage} alt="Logo preview" fill className="object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground opacity-40" />
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                    />
                    <Button 
                      variant="outline" 
                      className="gap-2 h-9 px-4 text-xs font-bold" 
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {logoImage ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    {logoImage && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[10px] font-bold text-destructive uppercase tracking-wider"
                        onClick={() => setLogoImage(null)}
                      >
                        <X className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">PNG, JPG up to 1MB</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Outlet name <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="Enter outlet name" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-background h-11" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Outlet slug <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input 
                          placeholder="outlet-slug" 
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          className="bg-background h-11 pr-10" 
                        />
                        <MoreHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <Label className="text-sm font-semibold">Description</Label>
                    <Textarea 
                      placeholder="Enter outlet description..." 
                      className="min-h-[120px] resize-none bg-background"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Branding & Identity Section */}
            <section className="space-y-6 pt-8 border-t">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Branding & Identity</h3>
                <p className="text-sm text-muted-foreground">Manage the visual personality of your outlet&apos;s digital menu.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold">Featured Image (Banner)</Label>
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] bg-gray-900 text-white text-xs p-2 rounded-lg">
                          <p>This header appears as the header background on your mobile menu home page.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div 
                    className="relative aspect-[21/9] w-full rounded-xl bg-muted/30 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors group"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    {featuredImage ? (
                      <Image src={featuredImage} alt="Banner" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center p-4">
                        <ImageIcon className="h-10 w-10 text-gray-300 mb-1" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">WIDESCREEN HEADER IMAGE</p>
                        <p className="text-xs text-gray-400">Recommended: 1200 × 400px</p>
                      </div>
                    )}
                    <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
                  </div>
                </div>

                <div className="md:col-span-5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-teal-500" />
                      <Label className="text-sm font-semibold">Primary Brand Color</Label>
                    </div>
                    
                    <Card className="shadow-none border-gray-100 bg-white">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 shrink-0">
                            <input 
                              type="color" 
                              value={formData.primaryColor} 
                              onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                              className="absolute inset-0 h-full w-full cursor-pointer rounded-lg border-2 border-white shadow-sm p-0 overflow-hidden"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BRAND HEX CODE</Label>
                            <div className="relative">
                              <Input 
                                value={formData.primaryColor} 
                                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                                className="h-11 bg-background font-mono font-bold uppercase pr-10 rounded-lg text-sm border-gray-100"
                              />
                              <Edit className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="shadow-none border-gray-100 bg-gradient-to-br from-yellow-50/50 via-white to-teal-50/50">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-gray-900">Display Logo</p>
                        <p className="text-xs text-gray-500 font-medium">Show your outlet logo on the home screen.</p>
                      </div>
                      <Switch checked={formData.showLogo} onCheckedChange={(val) => handleInputChange('showLogo', val)} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Address & Location Section */}
            <section className="space-y-6 pt-8 border-t text-left">
              <h3 className="text-lg font-bold">Address & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Street address <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Street name and number" 
                    className="bg-background h-11" 
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">City <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="e.g. Dubai" 
                    className="bg-background h-11" 
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-left">
                <Label className="text-sm font-semibold">Menu url</Label>
                <div className="relative">
                  <Input 
                    placeholder="Enter URL for your online menu (optional)" 
                    className="bg-background h-11 pr-10" 
                    value={formData.menuUrl}
                    onChange={(e) => handleInputChange('menuUrl', e.target.value)}
                  />
                  <MoreHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Phone number <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Select value={formData.phonePrefix} onValueChange={(val) => handleInputChange('phonePrefix', val)}>
                      <SelectTrigger className="w-24 h-11 bg-background font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+971">+971</SelectItem>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="581111111" 
                      className="flex-1 bg-background h-11" 
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Email address</Label>
                  <Input 
                    placeholder="raffi.uae7@gmail.com" 
                    type="email" 
                    className="bg-background h-11" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Additional Settings Section */}
            <section className="space-y-6 pt-8 border-t text-left">
              <h3 className="text-lg font-bold">Additional Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Cuisine type</Label>
                  <Select value={formData.cuisine} onValueChange={(val) => handleInputChange('cuisine', val)}>
                    <SelectTrigger className="bg-background h-11">
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Country <span className="text-red-500">*</span></Label>
                  <Select value={formData.country} onValueChange={(val) => handleInputChange('country', val)}>
                    <SelectTrigger className="bg-background h-11">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">State <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="e.g. Dubai" 
                    className="bg-background h-11" 
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Timezone <span className="text-red-500">*</span></Label>
                  <Select value={formData.timezone} onValueChange={(val) => handleInputChange('timezone', val)}>
                    <SelectTrigger className="bg-background h-11">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dubai (GMT+04:00)">Asia/Dubai (GMT+04:00)</SelectItem>
                      <SelectItem value="Europe/London (GMT+00:00)">Europe/London (GMT+00:00)</SelectItem>
                      <SelectItem value="America/New_York (GMT-05:00)">America/New_York (GMT-05:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Zip code <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="e.g. 99999" 
                    className="bg-background h-11" 
                    value={formData.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 text-left">
                <Checkbox 
                  id="show-maps-new" 
                  checked={formData.showMap}
                  onCheckedChange={(val) => handleInputChange('showMap', !!val)}
                />
                <label htmlFor="show-maps-new" className="text-sm font-medium leading-none cursor-pointer">
                  Show map on outlet page
                </label>
              </div>
            </section>
          </Card>

          <div className="mt-8 flex justify-end gap-3 text-right pb-12">
            <Button variant="outline" className="px-8 h-12 font-bold rounded-xl" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button 
              className="px-10 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 rounded-xl shadow-xl shadow-primary/20" 
              onClick={handleSave}
              disabled={!hasEnteredData}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </main>

      <OutletOptionsDrawer 
        open={isOptionsDrawerOpen}
        onOpenChange={setIsOptionsDrawerOpen}
        onConfirm={handleFinalConfirm}
      />
    </>
  );
}
