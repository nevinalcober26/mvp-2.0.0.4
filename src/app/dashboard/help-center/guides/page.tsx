'use client';

import React, { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Rocket, 
  Palette, 
  Monitor, 
  Plug, 
  ChevronRight,
  FileText,
  Clock
} from 'lucide-react';

const GUIDE_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    guides: [
      { title: 'Setting up your business profile', duration: '5 min' },
      { title: 'Adding your first restaurant branch', duration: '8 min' },
      { title: 'Inviting staff members to the dashboard', duration: '3 min' },
    ]
  },
  {
    id: 'menu-studio',
    title: 'Menu Studio',
    icon: Palette,
    guides: [
      { title: 'Creating product categories', duration: '4 min' },
      { title: 'Adding products with variations', duration: '10 min' },
      { title: 'Setting up dietary & allergen tags', duration: '5 min' },
      { title: 'Using AI to generate descriptions', duration: '2 min' },
    ]
  },
  {
    id: 'operations',
    title: 'Operations',
    icon: Monitor,
    guides: [
      { title: 'Managing the Live Order Hub', duration: '6 min' },
      { title: 'Branding and printing QR codes', duration: '5 min' },
      { title: 'Updating stock in real-time', duration: '3 min' },
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Plug,
    guides: [
      { title: 'Connecting your POS machine', duration: '15 min' },
      { title: 'Configuring payment gateways', duration: '12 min' },
      { title: 'Whitelisting hardware terminals', duration: '7 min' },
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    icon: FileText,
    guides: [
      { title: 'Understanding sales performance', duration: '6 min' },
      { title: 'Exporting transaction reports', duration: '4 min' },
      { title: 'Analyzing waiter performance', duration: '5 min' },
    ]
  }
];

export default function BrowseGuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return GUIDE_CATEGORIES;
    
    return GUIDE_CATEGORIES.map(cat => ({
      ...cat,
      guides: cat.guides.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.guides.length > 0);
  }, [searchQuery]);

  const breadcrumbItems = [
    { label: 'Help Center', href: '/dashboard/help-center' },
    { label: 'Knowledge Base' }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-10 shrink-0 text-left">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-slate-900">Knowledge Base</h1>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">
                  Comprehensive step-by-step guides to help you master the eMenu Digital Hub and optimize your restaurant operations.
                </p>
              </div>
            </div>
            
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search for a specific guide..." 
                className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {filteredCategories.length > 0 ? filteredCategories.map((category) => (
              <section key={category.id} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100">
                    <category.icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{category.title}</h2>
                  <Badge variant="outline" className="ml-auto bg-white text-slate-500 border-slate-100 font-semibold text-[10px]">
                    {category.guides.length} ARTICLES
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.guides.map((guide, idx) => (
                    <Card key={idx} className="group hover:border-teal-500/30 hover:shadow-md transition-all border-slate-100 bg-white cursor-pointer rounded-xl overflow-hidden">
                      <CardContent className="p-5 text-left flex flex-col h-full">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-teal-600 transition-colors leading-snug mb-4 flex-1">
                          {guide.title}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                           <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                              <Clock className="h-3.5 w-3.5" />
                              {guide.duration} read
                           </div>
                           <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] font-semibold text-teal-600 group-hover:bg-teal-50 rounded-lg">
                              READ GUIDE
                              <ChevronRight className="h-3 w-3 ml-1" />
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )) : (
              <div className="py-32 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No guides found matching your search.</p>
                <Button variant="outline" onClick={() => setSearchQuery('')} className="rounded-xl h-10 px-6 font-semibold text-xs">Clear Search</Button>
              </div>
            )}
          </div>

          <div className="mt-20 py-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-semibold text-slate-900">Still have questions?</p>
              <p className="text-xs text-slate-500 font-medium">Our support team is available 24/7 to help you with technical setup.</p>
            </div>
            <Button variant="outline" className="rounded-xl h-11 px-8 font-semibold text-xs border-slate-200" asChild>
               <NextLink href="/dashboard/help-center">
                 Contact Support
               </NextLink>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
