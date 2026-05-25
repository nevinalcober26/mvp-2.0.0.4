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
      
      {/* Hero Section with Teal Gradient */}
      <section className="relative bg-gradient-to-br from-[#18B4A6] via-[#18B4A6] to-[#A7F3D0] px-6 py-16 md:px-12 lg:px-20 text-left overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white w-fit border border-white/30 backdrop-blur-md">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Merchant Support Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">How can we help you today?</h1>
          <p className="text-white/80 text-lg font-medium max-w-2xl leading-relaxed">
            Our specialized Network International support teams are available around the clock to ensure your digital menu operations run at peak performance.
          </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
      </section>

      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 -mt-10 pb-20 space-y-10">
        
        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
          {CONTACT_CHANNELS.map((channel) => (
            <Card key={channel.title} className="border-0 shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center shrink-0">
                    <channel.icon className="h-6 w-6 text-[#18B4A6]" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold text-[#0f172a]">{channel.title}</h3>
                    <p className="text-sm text-[#64748b] font-medium leading-relaxed">{channel.description}</p>
                    <div className="pt-3">
                      <span className="bg-[#f8fafc] border border-[#f1f5f9] px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#475569] font-mono">
                        {channel.info}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-dashed border-[#f1f5f9] flex justify-end">
                  <Button variant="ghost" className="text-[13px] font-bold text-[#18B4A6] hover:text-[#149d94] hover:bg-[#f0fdfa] gap-2 h-auto p-0 group" asChild>
                    <a href={channel.href}>
                      {channel.actionLabel}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reliability & Documentation Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Reliability Card */}
          <Card className="lg:col-span-8 border-0 shadow-2xl rounded-[32px] bg-[#0f172a] text-white overflow-hidden relative min-h-[380px]">
            <div className="absolute right-0 bottom-0 p-12 opacity-5 pointer-events-none rotate-12">
              <ShieldCheck className="h-64 w-64 text-white" />
            </div>
            <CardContent className="p-12 flex flex-col justify-between h-full relative z-10 text-left">
              <div className="space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight">System Reliability Guarantee</h3>
                  <p className="text-slate-400 text-base font-medium leading-relaxed max-w-md">
                    Your digital infrastructure is monitored by Network International engineers 24 hours a day to ensure uninterrupted service for your guests and staff.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-16 mt-12 pt-8 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-5xl font-bold tracking-tighter">99.9%</p>
                  <p className="text-[10px] font-black text-[#18B4A6] uppercase tracking-[0.2em]">System Uptime</p>
                </div>
                <div className="h-16 w-px bg-white/5" />
                <div className="space-y-1">
                  <p className="text-5xl font-bold tracking-tighter">&lt; 1hr</p>
                  <p className="text-[10px] font-black text-[#18B4A6] uppercase tracking-[0.2em]">Average Response</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Self-Service Card */}
          <Card className="lg:col-span-4 border-0 shadow-2xl rounded-[32px] bg-[#18B4A6] text-white overflow-hidden group min-h-[380px]">
            <CardContent className="p-12 flex flex-col justify-between h-full relative text-left">
              <div className="absolute top-12 right-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <HelpCircle className="h-40 w-40" />
              </div>
              <div className="space-y-6 relative z-10">
                <h3 className="text-3xl font-bold tracking-tight leading-tight">Self-Service Documentation</h3>
                <p className="text-white/80 text-base font-medium leading-relaxed">
                  Access our comprehensive library of operational guides, from POS integration to menu design best practices.
                </p>
              </div>
              <div className="pt-12 relative z-10">
                <Button className="w-full bg-white text-[#18B4A6] hover:bg-slate-50 font-black text-sm uppercase tracking-wider rounded-2xl h-16 px-8 shadow-xl border-0 group shadow-black/10" asChild>
                  <NextLink href="/dashboard/help-center/guides">
                    Browse Guides
                    <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NextLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Support Ticket Bar with Gradient Border */}
        <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-r from-[#fdfdea] via-white to-[#fff1f2] text-center shadow-sm">
           {/* Precision Gradient Border Effect */}
           <div className="absolute inset-0 border border-transparent before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-indigo-100 before:via-teal-100 before:to-pink-100 before:rounded-2xl before:content-[''] [mask-image:linear-gradient(white,white)] before:[mask-image:none]" />
           
           <p className="text-[15px] font-medium text-slate-500 relative z-10 leading-none">
            Not finding what you need? <span className="text-[#18B4A6] font-bold cursor-pointer hover:underline">Submit a technical ticket</span> and we&apos;ll get back to you shortly.
          </p>
        </div>

      </main>
    </div>
  );
}
