'use client';

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    title: 'Email Support',
    description: 'Direct line to our onboarding and technical team.',
    info: 'NDOnboarding@network.global',
    icon: Mail,
    actionLabel: 'Send Email',
    href: 'mailto:NDOnboarding@network.global',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    title: 'Relationship Manager',
    description: 'Personalized support for your enterprise account.',
    info: 'Dedicated Account Management',
    icon: Users,
    actionLabel: 'Contact RM',
    href: '#',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    title: '24/7 Contact Centre',
    description: 'Round-the-clock assistance for urgent issues.',
    info: '8004448',
    icon: PhoneCall,
    actionLabel: 'Call Now',
    href: 'tel:8004448',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  {
    title: 'WhatsApp Contact',
    description: 'Quick chat for operational queries.',
    info: 'Instant Messaging Support',
    icon: MessageCircle,
    actionLabel: 'Open WhatsApp',
    href: '#',
    color: 'bg-green-50 text-green-600 border-green-100',
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <div className="bg-white border-b px-8 py-10 shrink-0 text-left">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="flex items-center gap-3 text-[#18B4A6] mb-1">
             <CircleHelp className="h-6 w-6" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Operational Support</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">How can we help you?</h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Our specialized Network International support teams are available to ensure your digital operations run smoothly.
          </p>
        </div>
      </div>

      <main className="p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPORT_CHANNELS.map((channel) => (
              <Card key={channel.title} className="group border shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all">
                <CardContent className="p-0">
                  <div className="p-6 flex items-start gap-5">
                    <div className={cn("h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", channel.color)}>
                      <channel.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-1 text-left">
                      <h3 className="text-lg font-bold text-slate-900">{channel.title}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{channel.description}</p>
                      <div className="pt-3">
                        <code className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-700 font-mono">
                          {channel.info}
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
                    <Button variant="ghost" className="text-xs font-bold text-slate-600 hover:text-primary gap-2 h-8 px-3 rounded-lg" asChild>
                      <a href={channel.href}>
                        {channel.actionLabel}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-0 shadow-xl rounded-[32px] bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
                <ShieldCheck className="h-48 w-48 text-white" />
              </div>
              <CardContent className="p-10 relative z-10 text-left">
                <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 backdrop-blur-md">
                   <Clock className="h-6 w-6 text-[#18B4A6]" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">System Reliability Guarantee</h3>
                <p className="text-slate-400 font-medium leading-relaxed max-w-lg mb-8">
                  Your digital eMenu is hosted on a high-availability infrastructure monitored by Network International engineers 24 hours a day.
                </p>
                <div className="flex items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">99.9%</span>
                      <span className="text-[10px] font-bold text-[#18B4A6] uppercase tracking-widest">Uptime</span>
                   </div>
                   <div className="h-10 w-px bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">&lt; 1hr</span>
                      <span className="text-[10px] font-bold text-[#18B4A6] uppercase tracking-widest">Response</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-[32px] bg-[#18B4A6] text-white overflow-hidden">
               <CardContent className="p-8 h-full flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold">Documentation</h4>
                    <p className="text-white/80 text-sm font-medium leading-relaxed">
                      Access complete operational guides for POS integration, QR management, and menu design.
                    </p>
                  </div>
                  <Button className="w-full bg-white text-[#18B4A6] hover:bg-white/90 font-bold rounded-2xl h-14 mt-8 gap-2 shadow-xl shadow-black/10">
                    Browse Knowledge Base
                    <ExternalLink className="h-4 w-4" />
                  </Button>
               </CardContent>
            </Card>
          </div>

          <div className="p-6 bg-slate-50 border rounded-2xl text-center">
            <p className="text-sm font-medium text-slate-500">
              Not finding what you need? Request a callback from our technical onboarding team. 
              <span className="text-[#18B4A6] font-bold cursor-pointer hover:underline ml-1">Submit Ticket</span>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
