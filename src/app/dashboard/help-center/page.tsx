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
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SUPPORT_CHANNELS = [
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
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-14 shrink-0 text-left">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 border border-teal-100 mb-4">
             <CircleHelp className="h-3.5 w-3.5" />
             <span className="text-[10px] font-bold uppercase">Merchant Support Hub</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">How can we help you today?</h1>
          <p className="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed font-medium">
            Our specialized Network International support teams are available around the clock to ensure your digital menu operations run at peak performance.
          </p>
        </div>
      </div>

      <main className="p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPORT_CHANNELS.map((channel) => (
              <Card key={channel.title} className={cn("group border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300", channel.hover)}>
                <CardContent className="p-0">
                  <div className="p-6 flex items-start gap-5">
                    <div className={cn("h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", channel.color)}>
                      <channel.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-1.5 text-left">
                      <h3 className="text-base font-bold text-slate-900">{channel.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{channel.description}</p>
                      <div className="pt-3">
                        <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-700 font-mono shadow-inner">
                          {channel.info}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <Button variant="ghost" className="text-xs font-bold text-slate-600 hover:text-teal-600 gap-2 h-8 px-3 rounded-lg group/btn" asChild>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-0 shadow-xl rounded-[24px] bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <ShieldCheck className="h-48 w-48 text-white" />
              </div>
              <CardContent className="p-10 relative z-10 text-left">
                <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
                   <Clock className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">System Reliability Guarantee</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg mb-10 font-medium">
                  Your digital infrastructure is monitored by Network International engineers 24 hours a day to ensure uninterrupted service for your guests and staff.
                </p>
                <div className="flex items-center gap-12">
                   <div className="flex flex-col">
                      <span className="text-3xl font-bold text-white tracking-tight">99.9%</span>
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mt-1">System Uptime</span>
                   </div>
                   <div className="h-10 w-px bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-3xl font-bold text-white tracking-tight">&lt; 1hr</span>
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mt-1">Average Response</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-[24px] bg-[#18B4A6] text-white overflow-hidden group">
               <CardContent className="p-8 h-full flex flex-col justify-between text-left relative">
                  <div className="absolute top-4 right-4 opacity-20 group-hover:rotate-12 transition-transform duration-500">
                    <CircleHelp className="h-16 w-16" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold tracking-tight">Self-Service Documentation</h4>
                    <p className="text-white/80 text-xs font-medium leading-relaxed">
                      Access our comprehensive library of operational guides, from POS integration to menu design best practices.
                    </p>
                  </div>
                  <Button className="w-full bg-white text-teal-600 hover:bg-slate-50 font-bold rounded-xl h-12 mt-10 gap-2 border-0 shadow-lg shadow-black/5" asChild>
                    <NextLink href="/dashboard/help-center/guides">
                      Browse Guides
                      <ChevronRight className="h-4 w-4" />
                    </NextLink>
                  </Button>
               </CardContent>
            </Card>
          </div>

          <div className="py-8 px-6 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
            <p className="text-[13px] font-medium text-slate-500">
              Not finding what you need? <span className="text-teal-600 font-bold cursor-pointer hover:underline">Submit a technical ticket</span> and we&apos;ll get back to you shortly.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
