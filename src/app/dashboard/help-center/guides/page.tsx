
'use client';

import React, { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NextLink from 'next/link';
import { 
  Search, 
  Rocket, 
  Palette, 
  Monitor, 
  Plug, 
  ChevronRight,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

const GUIDE_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    accent: 'border-blue-200',
    guides: [
      { title: 'Setting up your business profile', slug: 'setup-business-profile', duration: '5 min', isPopular: true },
      { title: 'Adding your first restaurant branch', slug: 'add-first-branch', duration: '8 min' },
      { title: 'Inviting staff members to the dashboard', slug: 'invite-staff', duration: '3 min' },
    ]
  },
  {
    id: 'menu-studio',
    title: 'Menu Studio',
    icon: Palette,
    color: 'text-teal-600 bg-teal-50 border-teal-100',
    accent: 'border-teal-200',
    guides: [
      { title: 'Creating product categories', slug: 'create-categories', duration: '4 min' },
      { title: 'Adding products with variations', slug: 'add-products-variations', duration: '10 min', isPopular: true },
      { title: 'Setting up dietary & allergen tags', slug: 'setup-tags', duration: '5 min' },
      { title: 'Using AI to generate descriptions', slug: 'ai-descriptions', duration: '2 min' },
    ]
  },
  {
    id: 'operations',
    title: 'Operations',
    icon: Monitor,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    accent: 'border-indigo-200',
    guides: [
      { title: 'Managing the Live Order Hub', slug: 'live-order-hub', duration: '6 min', isPopular: true },
      { title: 'Branding and printing QR codes', slug: 'qr-codes-printing', duration: '5 min' },
      { title: 'Updating stock in real-time', slug: 'real-time-stock', duration: '3 min' },
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Plug,
    color: 'text-orange-600 bg-orange-50 border-orange-100',
    accent: 'border-orange-200',
    guides: [
      { title: 'Connecting your POS machine', slug: 'connect-pos', duration: '15 min', isPopular: true },
      { title: 'Configuring payment gateways', slug: 'configure-payment-gateways', duration: '12 min' },
      { title: 'Whitelisting hardware terminals', slug: 'whitelist-terminals', duration: '7 min' },
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    icon: FileText,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    accent: 'border-emerald-200',
    guides: [
      { title: 'Understanding sales performance', slug: 'sales-performance', duration: '6 min' },
      { title: 'Exporting transaction reports', slug: 'export-reports', duration: '4 min' },
      { title: 'Analyzing waiter performance', slug: 'waiter-performance', duration: '5 min' },
    ]
  }
];

export default function BrowseGuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCategories = useMemo(() => {
    let result = GUIDE_CATEGORIES;
    
    if (activeFilter !== 'all') {
      result = result.filter(cat => cat.id === activeFilter);
    }

    if (searchQuery) {
      result = result.map(cat => ({
        ...cat,
        guides: cat.guides.filter(g => 
          g.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.guides.length > 0);
    }

    return result;
  }, [searchQuery, activeFilter]);

  const breadcrumbItems = [
    { label: 'Help Center', href: '/dashboard/help-center' },
    { label: 'Knowledge Base' }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-12 shrink-0 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
          <LayoutGrid className="h-64 w-64" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 text-teal-600 border border-teal-100 mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase">Merchant Knowledge Base</span>
                </div>
                <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">Documentation & Guides</h1>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">
                  Step-by-step technical guides and operational best practices for your eMenu Digital Hub.
                </p>
              </div>
            </div>
            
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search technical documentation..." 
                className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setActiveFilter('all')}
            className={cn(
              "rounded-xl h-9 px-4 text-xs font-semibold whitespace-nowrap",
              activeFilter === 'all' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            All Categories
          </Button>
          <div className="h-4 w-px bg-slate-200 mx-2" />
          {GUIDE_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={activeFilter === cat.id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter(cat.id)}
              className={cn(
                "rounded-xl h-9 px-4 text-xs font-semibold whitespace-nowrap gap-2",
                activeFilter === cat.id ? "bg-teal-50 text-teal-700 border border-teal-100" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.title}
            </Button>
          ))}
        </div>
      </div>

      <main className="p-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {filteredCategories.length > 0 ? filteredCategories.map((category) => (
              <section key={category.id} id={`section-${category.id}`} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-4">
                  <div className={cn("h-11 w-11 rounded-xl border flex items-center justify-center shadow-sm shrink-0", category.color)}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h2 className="text-xl font-semibold text-slate-900">{category.title}</h2>
                    <Badge variant="outline" className="bg-white text-slate-500 border-slate-100 font-semibold text-[10px]">
                      {category.guides.length} ARTICLES
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.guides.map((guide, idx) => (
                    <NextLink key={idx} href={`/dashboard/help-center/guides/${guide.slug}`} className="block group">
                      <Card className="h-full hover:border-teal-500/30 hover:shadow-xl hover:-translate-y-1 transition-all border-slate-100 bg-white cursor-pointer rounded-2xl overflow-hidden shadow-sm">
                        <CardContent className="p-6 text-left flex flex-col h-full relative">
                          {guide.isPopular && (
                            <div className="absolute top-4 right-4">
                               <Badge className="bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-50 font-bold text-[9px] px-2 py-0.5 rounded-md">POPULAR</Badge>
                            </div>
                          )}
                          <h3 className="text-base font-semibold text-slate-900 group-hover:text-teal-600 transition-colors leading-relaxed mb-6 flex-1 pr-10">
                            {guide.title}
                          </h3>
                          <div className="flex items-center justify-between mt-auto">
                             <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                  <Clock className="h-3.5 w-3.5" />
                                  {guide.duration}
                                </div>
                             </div>
                             <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                <ArrowRight className="h-4 w-4" />
                             </div>
                          </div>
                        </CardContent>
                      </Card>
                    </NextLink>
                  ))}
                </div>
              </section>
            )) : (
              <div className="py-40 text-center space-y-5">
                <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-inner">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-semibold text-lg">No documentation found</p>
                  <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or searching for something else.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchQuery(''); setActiveFilter('all'); }} 
                  className="rounded-xl h-11 px-8 font-semibold text-xs border-slate-200 mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          <div className="mt-32 p-10 rounded-[32px] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div className="space-y-2 text-center md:text-left relative z-10">
              <h4 className="text-xl font-semibold">Can&apos;t find what you&apos;re looking for?</h4>
              <p className="text-sm text-slate-400 font-medium max-w-md">Our technical team is on standby to help with your complex integration or operational setup.</p>
            </div>
            <div className="flex gap-4 relative z-10 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none rounded-xl h-12 px-8 font-semibold text-xs border-white/20 text-black hover:bg-white/10" asChild>
                <NextLink href="/dashboard/help-center">
                  Get Human Help
                </NextLink>
              </Button>
              <Button className="flex-1 md:flex-none rounded-xl h-12 px-8 font-bold text-xs bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20">
                Submit Support Ticket
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
