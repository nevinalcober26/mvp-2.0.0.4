'use client';

import React, { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import NextLink from 'next/link';
import { 
  Search, 
  Rocket, 
  Palette, 
  Monitor, 
  Plug, 
  ChevronRight,
  Clock,
  ArrowRight,
  LayoutGrid,
  FileSearch,
  BarChart,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const GUIDE_CATEGORIES = [
  {
    id: 'dashboard-tutorials',
    title: 'Dashboard Tutorials',
    icon: Rocket,
    guides: [
      { 
        title: 'Dashboard Overview', 
        excerpt: 'Learn the basics of your new dashboard interface, navigation, and key metrics...',
        slug: 'setup-business-profile', 
        duration: '5 min', 
        isPopular: true, 
        thumbnailId: 'dashboard-1' 
      },
      { 
        title: 'Setting up User Roles', 
        excerpt: 'Configure permissions and access levels for your team members across different...',
        slug: 'invite-staff', 
        duration: '8 min', 
        thumbnailId: 'dashboard-2' 
      },
      { 
        title: 'Customizing Analytics Views', 
        excerpt: 'Create personalized data charts and pin important metrics to your primary dashboard',
        slug: 'sales-performance', 
        duration: '6 min', 
        thumbnailId: 'dashboard-3' 
      },
      { 
        title: 'Managing Data Tables', 
        excerpt: 'Filter, sort, and export complex datasets directly from the dashboard table...',
        slug: 'real-time-stock', 
        duration: '4 min', 
        thumbnailId: 'dashboard-1' 
      },
      { 
        title: 'Widget Configuration', 
        excerpt: 'Drag, drop, and resize widgets to build a custom workspace tailored to your daily...',
        slug: 'live-order-hub', 
        duration: '7 min', 
        thumbnailId: 'dashboard-2' 
      },
      { 
        title: 'Theme Customization', 
        excerpt: 'Personalize your dashboard appearance with custom themes, color schemes, and layout...',
        slug: 'setup-business-profile', 
        duration: '5 min', 
        thumbnailId: 'dashboard-3' 
      },
      { 
        title: 'Real-Time Notifications', 
        excerpt: 'Configure alerts, webhooks, and notification preferences for critical dashboard events.',
        slug: 'live-order-hub', 
        duration: '6 min', 
        thumbnailId: 'dashboard-1' 
      },
      { 
        title: 'Data Export & Scheduling', 
        excerpt: 'Set up automated reports and scheduled data exports in multiple formats from your...',
        slug: 'export-reports', 
        duration: '9 min', 
        thumbnailId: 'dashboard-2' 
      },
      { 
        title: 'Collaboration Features', 
        excerpt: 'Share dashboards, create team workspaces, and collaborate in real-time with your...',
        slug: 'invite-staff', 
        duration: '7 min', 
        thumbnailId: 'dashboard-3' 
      },
    ]
  }
];

const NAV_ITEMS = [
  { id: 'all', label: 'All Categories', icon: null },
  { id: 'getting-started', label: 'Getting Started', icon: Rocket },
  { id: 'menu-studio', label: 'Menu Studio', icon: Palette },
  { id: 'operations', label: 'Operations', icon: Monitor },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'analytics', label: 'Analytics & Reports', icon: BarChart },
];

export default function BrowseGuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const breadcrumbItems = [
    { label: 'Help Center', href: '/dashboard/help-center' },
    { label: 'Knowledge Base' }
  ];

  const getThumbnail = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <DashboardHeader />
      
      {/* 1. Header Section */}
      <div className="bg-gradient-to-br from-[#18B4A6] via-[#18B4A6] to-[#A7F3D0] px-8 py-16 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-white/80 text-xs font-bold mb-2">
              <NextLink href="/dashboard" className="hover:text-white transition-colors">Home</NextLink>
              <ChevronRight className="h-3 w-3" />
              <NextLink href="/dashboard/help-center" className="hover:text-white transition-colors">Help Center</NextLink>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">Knowledge Base</span>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/20 text-white border border-white/30 backdrop-blur-md">
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Merchant Knowledge Base</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Documentation & Guides</h1>
              <p className="text-white/80 text-base font-medium leading-relaxed max-w-xl">
                Comprehensive technical documentation and operational walkthroughs for your digital infrastructure.
              </p>
            </div>
          </div>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search technical guides..." 
              className="pl-12 h-14 bg-white border-0 rounded-2xl text-sm font-medium shadow-2xl focus-visible:ring-4 focus-visible:ring-primary/20 transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. Sticky Category Navigation */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-100 py-4 px-8 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <React.Fragment key={item.id}>
              <Button
                variant={activeFilter === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(item.id)}
                className={cn(
                  "rounded-lg h-10 px-4 text-xs font-bold whitespace-nowrap gap-2 transition-all",
                  activeFilter === item.id 
                    ? "bg-[#0f172a] text-white hover:bg-[#0f172a]" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Button>
              {item.id === 'all' && <div className="h-6 w-px bg-slate-200 mx-2" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <main className="p-8 pb-32">
        <div className="max-w-7xl mx-auto space-y-20">
          {GUIDE_CATEGORIES.map((category) => (
            <section key={category.id} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm shrink-0">
                  <category.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{category.title}</h2>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    {category.guides.length} Articles
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.guides.map((guide, idx) => {
                  const thumb = getThumbnail(guide.thumbnailId);
                  return (
                    <NextLink key={idx} href={`/dashboard/help-center/guides/${guide.slug}`} className="group">
                      <Card className="h-full border-slate-100 bg-white hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] overflow-hidden shadow-sm flex flex-col">
                        <div className="relative aspect-[1.8/1] w-full bg-slate-50 p-4 pb-0 overflow-hidden">
                          <div className="relative w-full h-full rounded-t-xl overflow-hidden bg-white border-x border-t border-slate-100 shadow-sm transition-transform group-hover:scale-[1.02] duration-500">
                            {thumb && (
                              <Image 
                                src={thumb.imageUrl} 
                                alt={guide.title} 
                                fill 
                                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                data-ai-hint={thumb.imageHint}
                              />
                            )}
                            {guide.isPopular && (
                              <div className="absolute top-3 right-3 z-10">
                                <Badge className="bg-white/95 backdrop-blur-md text-slate-900 border-0 font-bold text-[9px] px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">POPULAR</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <CardContent className="p-6 text-left flex flex-col flex-1">
                          <div className="space-y-3 mb-6">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {guide.title}
                            </h3>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed line-clamp-2">
                              {guide.excerpt}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50">
                             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                               <Clock className="h-3.5 w-3.5" />
                               {guide.duration}
                             </div>
                             <div className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                                <ArrowRight className="h-4 w-4" />
                             </div>
                          </div>
                        </CardContent>
                      </Card>
                    </NextLink>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
