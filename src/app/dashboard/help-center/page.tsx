'use client';

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { 
  Mail, 
  Users, 
  PhoneCall, 
  MessageCircle, 
  ChevronRight,
  ShieldCheck,
  Clock,
  CircleHelp,
  ArrowUpRight,
  BookOpen,
  Search,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Input } from '@/components/ui/input';

const CONTACT_CHANNELS = [
  {
    title: 'Technical Onboarding',
    description: 'Direct assistance for technical setup and configuration.',
    info: 'NDOnboarding@network.global',
    icon: Mail,
    actionLabel: 'Send Email',
    href: 'mailto:NDOnboarding@network.global',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    hover: 'hover:border-blue-200'
  },
  {
    title: 'Relationship Management',
    description: 'Personalized support for your enterprise account strategy.',
    info: 'Dedicated Account Manager',
    icon: Users,
    actionLabel: 'Contact Manager',
    href: '#',
    color: 'text-teal-600 bg-teal-50 border-teal-100',
    hover: 'hover:border-teal-200'
  },
  {
    title: '24/7 Support Centre',
    description: 'Immediate assistance for urgent operational matters.',
    info: '8004448',
    icon: PhoneCall,
    actionLabel: 'Call Center',
    href: 'tel:8004448',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    hover: 'hover:border-indigo-200'
  },
  {
    title: 'WhatsApp Business',
    description: 'Fast chat support for quick operational queries.',
    info: 'Instant Messenger',
    icon: MessageCircle,
    actionLabel: 'Chat Now',
    href: '#',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    hover: 'hover:border-emerald-200'
  },
];

export default function HelpCenterPage() {
  const breadcrumbItems = [{ label: 'Help Center' }];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-12 shrink-0 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none text-teal-600">
          <CircleHelp className="h-64 w-64" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 text-teal-600 border border-teal-100 mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase">Network International Support</span>
                </div>
                <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">Merchant Support Hub</h1>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">
                  Our specialized engineering and relationship teams are available 24/7 to ensure your digital operations run at peak performance.
                </p>
              </div>
            </div>
            
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search support channels..." 
                className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all shadow-none"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="p-8 pb-32">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Main Channels Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Support Channels</h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEMS OPERATIONAL
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONTACT_CHANNELS.map((channel) => (
                <Card key={channel.title} className={cn("group border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300", channel.hover)}>
                  <CardContent className="p-0">
                    <div className="p-6 flex items-start gap-5">
                      <div className={cn("h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", channel.color)}>
                        <channel.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-1.5 text-left">
                        <h3 className="text-base font-semibold text-slate-900">{channel.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{channel.description}</p>
                        <div className="pt-3">
                          <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-700 font-mono">
                            {channel.info}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                      <Button variant="ghost" className="text-xs font-semibold text-slate-600 hover:text-teal-600 gap-2 h-8 px-3 rounded-lg group/btn" asChild>
                        <a href={channel.href}>
                          {channel.actionLabel}
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Resources & Status Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* Self Service Section */}
            <div className="lg:col-span-8 space-y-6">
               <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Resources</h2>
               <Card className="border-0 shadow-lg rounded-[32px] bg-[#18B4A6] text-white overflow-hidden group">
                  <CardContent className="p-10 h-full flex flex-col md:flex-row items-center justify-between text-left relative">
                      <div className="absolute top-4 right-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                        <BookOpen className="h-32 w-32" />
                      </div>
                      <div className="space-y-4 max-w-xl relative z-10">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md mb-2">
                          <Search className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight">Documentation & Guides</h3>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                          Access our comprehensive library of operational guides, from POS integration to menu design best practices.
                        </p>
                      </div>
                      <Button className="w-full md:w-auto bg-white text-teal-600 hover:bg-slate-50 font-bold rounded-xl h-14 px-8 mt-10 md:mt-0 gap-2 border-0 shadow-lg relative z-10" asChild>
                        <NextLink href="/dashboard/help-center/guides">
                          Browse Knowledge Base
                          <ChevronRight className="h-4 w-4" />
                        </NextLink>
                      </Button>
                  </CardContent>
               </Card>
            </div>

            {/* System Integrity Sidebar */}
            <div className="lg:col-span-4 space-y-6">
               <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">System Health</h2>
               <Card className="border-0 shadow-xl rounded-[32px] bg-slate-900 text-white overflow-hidden relative h-full min-h-[300px]">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <ShieldCheck className="h-48 w-48 text-white" />
                </div>
                <CardContent className="p-10 relative z-10 text-left flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">Reliability Guarantee</h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">
                      Your digital infrastructure is monitored 24/7 to ensure uninterrupted service.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
                      <div className="flex flex-col">
                          <span className="text-3xl font-semibold text-white tracking-tight">99.9%</span>
                          <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mt-1">Uptime</span>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div className="flex flex-col items-end">
                          <span className="text-3xl font-semibold text-white tracking-tight">&lt; 1hr</span>
                          <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mt-1">Avg Response</span>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

          <div className="py-8 px-6 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
            <p className="text-[13px] font-medium text-slate-500">
              Not finding what you need? <span className="text-teal-600 font-semibold cursor-pointer hover:underline">Submit a technical ticket</span> and we&apos;ll get back to you shortly.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

