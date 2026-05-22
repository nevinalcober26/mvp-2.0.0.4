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
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  CircleHelp
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
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    title: 'Relationship Management',
    description: 'Personalized support for your enterprise account strategy.',
    info: 'Dedicated Account Manager',
    icon: Users,
    actionLabel: 'Contact Manager',
    href: '#',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    title: '24/7 Support Centre',
    description: 'Immediate assistance for urgent operational matters.',
    info: '8004448',
    icon: PhoneCall,
    actionLabel: 'Call Center',
    href: 'tel:8004448',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  {
    title: 'WhatsApp Business',
    description: 'Fast chat support for quick operational queries.',
    info: 'Instant Messenger',
    icon: MessageCircle,
    actionLabel: 'Chat Now',
    href: '#',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-12 shrink-0 text-left">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-teal-600 mb-2">
             <CircleHelp className="h-5 w-5" />
             <span className="text-xs font-semibold uppercase">Merchant Support</span>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">How can we help you?</h1>
          <p className="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed font-medium">
            Our specialized Network International support teams are available around the clock to ensure your digital menu operations run at peak performance.
          </p>
        </div>
      </div>

      <main className="p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPORT_CHANNELS.map((channel) => (
              <Card key={channel.title} className="group border border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-md transition-all">
                <CardContent className="p-0">
                  <div className="p-6 flex items-start gap-4">
                    <div className={cn("h-10 w-10 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", channel.color)}>
                      <channel.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1.5 text-left">
                      <h3 className="text-base font-semibold text-slate-900">{channel.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{channel.description}</p>
                      <div className="pt-2">
                        <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-700 font-mono">
                          {channel.info}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <Button variant="ghost" className="text-xs font-semibold text-slate-600 hover:text-primary gap-2 h-7 px-2 rounded-md" asChild>
                      <a href={channel.href}>
                        {channel.actionLabel}
                        <ChevronRight className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <ShieldCheck className="h-48 w-48 text-white" />
              </div>
              <CardContent className="p-10 relative z-10 text-left">
                <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                   <Clock className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">System Reliability Guarantee</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg mb-8 font-medium">
                  Your digital infrastructure is monitored by Network International engineers 24 hours a day to ensure uninterrupted service for your guests.
                </p>
                <div className="flex items-center gap-8">
                   <div className="flex flex-col">
                      <span className="text-2xl font-semibold text-white">99.9%</span>
                      <span className="text-[10px] font-semibold text-teal-400 uppercase">System Uptime</span>
                   </div>
                   <div className="h-8 w-px bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-2xl font-semibold text-white">&lt; 1hr</span>
                      <span className="text-[10px] font-semibold text-teal-400 uppercase">Response Time</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl bg-teal-600 text-white overflow-hidden">
               <CardContent className="p-8 h-full flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Self-Service Documentation</h4>
                    <p className="text-white/80 text-xs font-medium leading-relaxed">
                      Access our comprehensive library of operational guides, from POS integration to menu design best practices.
                    </p>
                  </div>
                  <Button className="w-full bg-white text-teal-600 hover:bg-slate-50 font-semibold rounded-xl h-11 mt-8 gap-2 border-0" asChild>
                    <NextLink href="/dashboard/help-center/guides">
                      Browse Guides
                      <ChevronRight className="h-4 w-4" />
                    </NextLink>
                  </Button>
               </CardContent>
            </Card>
          </div>

          <div className="py-6 px-4 bg-white border border-slate-100 rounded-xl text-center shadow-sm">
            <p className="text-[13px] font-medium text-slate-500">
              Not finding what you need? <span className="text-teal-600 font-semibold cursor-pointer hover:underline">Submit a technical ticket</span> and we'll get back to you shortly.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
