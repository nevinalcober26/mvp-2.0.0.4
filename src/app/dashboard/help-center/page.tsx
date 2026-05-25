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
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const URGENT_CHANNELS = [
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

const STRATEGIC_CHANNELS = [
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
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-14 shrink-0 text-left">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 border border-teal-100 mb-4">
             <CircleHelp className="h-3.5 w-3.5" />
             <span className="text-[10px] font-semibold uppercase">Help Center</span>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Merchant Support Hub</h1>
          <p className="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed font-medium">
            Our specialized Network International support teams are available around the clock to ensure your digital menu operations run at peak performance.
          </p>
        </div>
      </div>

      <main className="p-8 pb-32">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Tier 1: Self Service */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Phase 1: Self-Service Resources</h2>
            </div>
            <Card className="border-0 shadow-lg rounded-[32px] bg-[#18B4A6] text-white overflow-hidden group">
               <CardContent className="p-10 h-full flex flex-col md:flex-row items-center justify-between text-left relative">
                  <div className="absolute top-4 right-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                    <BookOpen className="h-32 w-32" />
                  </div>
                  <div className="space-y-4 max-w-xl relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md mb-2">
                       <Search className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight">Browse Documentation & Guides</h3>
                    <p className="text-white/80 text-sm font-medium leading-relaxed">
                      Access our comprehensive library of operational guides, from POS integration to menu design best practices. Most technical questions can be answered here instantly.
                    </p>
                  </div>
                  <Button className="w-full md:w-auto bg-white text-teal-600 hover:bg-slate-50 font-semibold rounded-xl h-14 px-8 mt-10 md:mt-0 gap-2 border-0 shadow-lg relative z-10" asChild>
                    <NextLink href="/dashboard/help-center/guides">
                      Explore Knowledge Base
                      <ChevronRight className="h-4 w-4" />
                    </NextLink>
                  </Button>
               </CardContent>
            </Card>
          </section>

          {/* Tier 2: Urgent Human Support */}
          <section className="space-y-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Phase 2: Immediate Assistance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {URGENT_CHANNELS.map((channel) => (
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

          {/* Tier 3: Operational Support */}
          <section className="space-y-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Phase 3: Technical & Strategic Inquiries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STRATEGIC_CHANNELS.map((channel) => (
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

          {/* System Integrity */}
          <Card className="border-0 shadow-xl rounded-[24px] bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <ShieldCheck className="h-48 w-48 text-white" />
            </div>
            <CardContent className="p-10 relative z-10 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-2">
                     <Clock className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">System Reliability Guarantee</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-medium">
                    Your digital infrastructure is monitored by Network International engineers 24 hours a day to ensure uninterrupted service for your guests and staff.
                  </p>
                </div>
                <div className="flex items-center gap-12 shrink-0">
                   <div className="flex flex-col">
                      <span className="text-3xl font-semibold text-white tracking-tight">99.9%</span>
                      <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest mt-1">System Uptime</span>
                   </div>
                   <div className="h-10 w-px bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-3xl font-semibold text-white tracking-tight">&lt; 1hr</span>
                      <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest mt-1">Avg Response</span>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
