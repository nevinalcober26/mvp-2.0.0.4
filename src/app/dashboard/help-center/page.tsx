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
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CircleHelp,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CONTACT_CHANNELS = [
  {
    title: 'Technical Onboarding',
    description: 'Direct assistance for technical setup and configuration.',
    info: 'NDOnboarding@network.global',
    icon: Mail,
    actionLabel: 'Send Email',
    href: 'mailto:NDOnboarding@network.global',
  },
  {
    title: 'Relationship Management',
    description: 'Personalized support for your enterprise account strategy.',
    info: 'Dedicated Account Manager',
    icon: Users,
    actionLabel: 'Contact Manager',
    href: '#',
  },
  {
    title: '24/7 Support Centre',
    description: 'Immediate assistance for urgent operational matters.',
    info: '8004448',
    icon: PhoneCall,
    actionLabel: 'Call Center',
    href: 'tel:8004448',
  },
  {
    title: 'WhatsApp Business',
    description: 'Fast chat support for quick operational queries.',
    info: 'Instant Messenger',
    icon: MessageCircle,
    actionLabel: 'Chat Now',
    href: '#',
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <DashboardHeader />
      
      <main className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12 text-left">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#f0fdfa] text-[#18B4A6] w-fit border border-[#ccfbf1]">
            <HelpCircle className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Merchant Support Hub</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0f172a] tracking-tight">How can we help you today?</h1>
          <p className="text-[#64748b] text-base font-medium max-w-2xl leading-relaxed">
            Our specialized Network International support teams are available around the clock to ensure your digital menu operations run at peak performance.
          </p>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONTACT_CHANNELS.map((channel) => (
            <Card key={channel.title} className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-5">
                  <div className="h-12 w-12 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center shrink-0">
                    <channel.icon className="h-6 w-6 text-[#18B4A6]" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-lg font-bold text-[#0f172a]">{channel.title}</h3>
                    <p className="text-sm text-[#64748b] font-medium">{channel.description}</p>
                    <div className="pt-4">
                      <span className="bg-[#f8fafc] border border-[#f1f5f9] px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#334155] font-mono">
                        {channel.info}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[#f1f5f9] flex justify-end">
                  <Button variant="ghost" className="text-xs font-bold text-[#18B4A6] hover:text-[#149d94] hover:bg-[#f0fdfa] gap-2 h-auto p-0" asChild>
                    <a href={channel.href}>
                      {channel.actionLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Section: Reliability & Documentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* Reliability Card */}
          <Card className="lg:col-span-8 border-0 shadow-sm rounded-[32px] bg-[#0f172a] text-white overflow-hidden relative">
            <div className="absolute right-0 bottom-0 p-8 opacity-10 pointer-events-none rotate-12">
              <ShieldCheck className="h-48 w-48 text-white" />
            </div>
            <CardContent className="p-10 flex flex-col justify-between h-full relative z-10">
              <div className="space-y-6">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">System Reliability Guarantee</h3>
                  <p className="text-[#94a3b8] text-sm font-medium leading-relaxed max-w-md">
                    Your digital infrastructure is monitored by Network International engineers 24 hours a day to ensure uninterrupted service for your guests and staff.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12 mt-12 pt-8 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-4xl font-bold tracking-tight">99.9%</p>
                  <p className="text-[10px] font-bold text-[#18B4A6] uppercase tracking-widest">System Uptime</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="space-y-1">
                  <p className="text-4xl font-bold tracking-tight">&lt; 1hr</p>
                  <p className="text-[10px] font-bold text-[#18B4A6] uppercase tracking-widest">Average Response</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Self-Service Card */}
          <Card className="lg:col-span-4 border-0 shadow-sm rounded-[32px] bg-[#18B4A6] text-white overflow-hidden group">
            <CardContent className="p-10 flex flex-col justify-between h-full relative">
              <div className="absolute top-8 right-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <CircleHelp className="h-32 w-32" />
              </div>
              <div className="space-y-6 relative z-10">
                <h3 className="text-2xl font-bold tracking-tight">Self-Service Documentation</h3>
                <p className="text-white/80 text-sm font-medium leading-relaxed">
                  Access our comprehensive library of operational guides, from POS integration to menu design best practices.
                </p>
              </div>
              <div className="pt-12 relative z-10">
                <Button className="w-full bg-white text-[#18B4A6] hover:bg-slate-50 font-bold rounded-xl h-14 px-8 shadow-lg border-0 group" asChild>
                  <NextLink href="/dashboard/help-center/guides">
                    Browse Guides
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NextLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Support Ticket Bar */}
        <div className="relative p-5 rounded-2xl border border-transparent bg-gradient-to-r from-[#fdfdea] via-white to-[#fff1f2] text-center shadow-sm overflow-hidden">
           <div className="absolute inset-0 border border-transparent before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-indigo-200 before:via-teal-200 before:to-pink-200 before:rounded-2xl before:content-[''] [mask-image:linear-gradient(white,white)] before:[mask-image:none]" />
           <p className="text-sm font-medium text-slate-500 relative z-10">
            Not finding what you need? <span className="text-[#18B4A6] font-semibold cursor-pointer hover:underline">Submit a technical ticket</span> and we&apos;ll get back to you shortly.
          </p>
        </div>

      </main>
    </div>
  );
}
