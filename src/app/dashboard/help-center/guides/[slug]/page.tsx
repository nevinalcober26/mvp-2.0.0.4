'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  MessageCircle, 
  Share2,
  Bookmark,
  ChevronRight,
  Monitor,
  Info,
  ExternalLink,
  BookOpen,
  Printer,
  Hash,
  ArrowRight,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for demonstration - in a real app, this would be fetched based on slug
const GUIDE_CONTENT = {
  'setup-business-profile': {
    title: 'Setting up your business profile',
    category: 'Getting Started',
    duration: '5 min',
    lastUpdated: 'May 12, 2024',
    description: 'Learn how to configure your corporate identity, branding, and legal identifiers for your eMenu Digital Hub account.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sections: [
      {
        title: 'Accessing Profile Settings',
        content: 'Navigate to the Settings tab in your main dashboard sidebar. Select "Business Profile" from the sub-menu to access your core corporate identity settings.',
        image: 'https://picsum.photos/seed/setup1/800/450'
      },
      {
        title: 'Defining Brand Visuals',
        content: 'Upload your high-resolution PNG logo and select your primary brand hex color. This color will be applied across your digital menu to buttons, links, and highlights.',
        image: 'https://picsum.photos/seed/setup2/800/450'
      },
      {
        title: 'Legal & Regional Identifiers',
        content: 'Ensure your Trade License number and local VAT identifiers are correct. Select your base currency and timezone to ensure accurate reporting and operations.',
        image: 'https://picsum.photos/seed/setup3/800/450'
      }
    ]
  },
  'connect-pos': {
    title: 'Connecting your POS machine',
    category: 'Integrations',
    duration: '15 min',
    lastUpdated: 'June 02, 2024',
    description: 'A comprehensive guide to linking your Oracle Micros Simphony or Toast terminal for real-time automated menu synchronization.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sections: [
      {
        title: 'Provider Authentication',
        content: 'Select your POS provider from the Integration hub. Enter your OIDC and Client ID credentials provided by your POS administrator.',
        image: 'https://picsum.photos/seed/pos1/800/450'
      },
      {
        title: 'Terminal Mapping',
        content: 'Map your physical hardware to specific outlets in your eMenu dashboard. Ensure each terminal is assigned a unique Revenue Center identifier.',
        image: 'https://picsum.photos/seed/pos2/800/450'
      }
    ]
  }
};

export default function GuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const guide = GUIDE_CONTENT[slug as keyof typeof GUIDE_CONTENT] || GUIDE_CONTENT['setup-business-profile'];

  const breadcrumbItems = [
    { label: 'Help Center', href: '/dashboard/help-center' },
    { label: 'Knowledge Base', href: '/dashboard/help-center/guides' },
    { label: guide.title }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <main className="p-6 md:p-10 pb-32">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl gap-2 font-semibold text-slate-600 border-slate-200 bg-white">
                    <Bookmark className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 text-slate-600 bg-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Badge className="bg-teal-50 text-teal-600 border-teal-100 font-bold text-[10px] uppercase tracking-wider rounded-md px-2.5 py-1">
                    {guide.category}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    {guide.duration} READ
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{guide.title}</h1>
                <p className="text-slate-500 text-base font-medium leading-relaxed max-w-3xl">
                  {guide.description}
                </p>
              </div>
            </div>

            {/* Video Tutorial Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Visual Walkthrough</h2>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Optional Module</span>
              </div>
              
              <div className="aspect-video w-full rounded-[32px] bg-slate-900 overflow-hidden shadow-2xl relative border-[8px] border-white ring-1 ring-slate-200">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={guide.videoUrl} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="opacity-95"
                ></iframe>
              </div>
            </section>

            {/* Content Steps */}
            <div className="space-y-16">
              {guide.sections.map((section, idx) => (
                <section key={idx} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-xl font-black text-[#18B4A6]">{idx + 1}</span>
                    </div>
                    <div className="space-y-4 pt-1">
                      <h3 className="text-2xl font-bold text-slate-900">{section.title}</h3>
                      <p className="text-slate-600 text-base leading-relaxed font-medium">
                        {section.content}
                      </p>
                    </div>
                  </div>
                  
                  <div className="ml-0 sm:ml-18">
                    <Card className="border-slate-100 overflow-hidden rounded-[32px] shadow-sm bg-white p-2">
                      <div className="relative aspect-[16/9] w-full rounded-[24px] overflow-hidden">
                        <Image 
                          src={section.image} 
                          alt={section.title} 
                          fill 
                          className="object-cover transition-transform hover:scale-105 duration-1000" 
                          data-ai-hint="technical dashboard"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-40" />
                        <div className="absolute bottom-6 left-8 flex items-center gap-3">
                          <Badge className="bg-white/95 text-slate-900 border-0 font-bold text-[10px] backdrop-blur-md px-3 py-1 rounded-lg">
                            STEP REFERENCE
                          </Badge>
                          <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em] drop-shadow-md">Technical Proof</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </section>
              ))}
            </div>

            {/* Conclusion */}
            <div className="p-10 rounded-[40px] bg-teal-50 border border-teal-100 flex items-start gap-8 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none rotate-12">
                <CheckCircle2 className="h-32 w-32 text-teal-600" />
              </div>
              <div className="h-14 w-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-xl shadow-teal-500/20 relative z-10">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-3 relative z-10">
                <h4 className="text-xl font-bold text-teal-900">Module AccomplISHED</h4>
                <p className="text-sm text-teal-700/80 font-medium leading-relaxed max-w-xl">
                  You have successfully configured this module. The updates are now live across your digital channels. If you encounter any unexpected behaviors, please sync your POS or reach out to support.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-10 px-6" onClick={() => router.push('/dashboard')}>
                    Return to Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" className="text-teal-700 font-bold hover:bg-teal-100/50 h-10 px-4 rounded-xl">
                    View Other Modules
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              
              {/* Table of Contents */}
              <Card className="border-slate-100 rounded-[32px] shadow-sm bg-white overflow-hidden text-left">
                <CardHeader className="bg-slate-50/50 border-b p-6">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    On this page
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-1">
                    {guide.sections.map((section, idx) => (
                      <button key={idx} className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-all flex items-center gap-3 group">
                        <span className="text-[10px] h-5 w-5 rounded-lg border border-slate-200 flex items-center justify-center group-hover:border-teal-200 group-hover:bg-teal-50">{idx + 1}</span>
                        {section.title}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Technical Context */}
              <Card className="border-slate-100 rounded-[32px] shadow-sm bg-white overflow-hidden text-left">
                <CardHeader className="bg-slate-50/50 border-b p-6">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5" />
                    Operational Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100/50">
                      <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Info className="h-4 w-4 text-teal-500" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">
                        Requires <span className="text-slate-900 underline decoration-teal-500/30">Workspace Admin</span> permissions.
                      </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100/50">
                      <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Hash className="h-4 w-4 text-slate-400" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">
                        Syncs with <span className="text-slate-900">Oracle Micros Simphony</span>.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full rounded-2xl h-12 font-bold text-xs gap-2 border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all">
                    <Printer className="h-4 w-4" />
                    Export as PDF
                  </Button>
                </CardContent>
              </Card>

              {/* Related Section */}
              <div className="space-y-4 text-left px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Related Modules</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Defining tax & service fees', duration: '3 MIN' },
                    { title: 'Branding your mobile menu', duration: '5 MIN' },
                    { title: 'Whitelisting hardware IDs', duration: '7 MIN' }
                  ].map((item, i) => (
                    <button key={i} className="w-full group text-left p-5 rounded-[28px] bg-white border border-slate-100 hover:border-teal-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-between shadow-sm">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{item.title}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.duration} READ</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-all">
                         <ArrowRight className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expert Support Callout */}
              <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden text-left shadow-2xl ring-4 ring-slate-900/5">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 pointer-events-none">
                  <MessageCircle className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-5">
                  <div className="h-12 w-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                     <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold tracking-tight">Need expert help?</h4>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                      Our onboarding engineers can walk you through this process via a scheduled screen-share session.
                    </p>
                  </div>
                  <Button className="w-full bg-white text-slate-900 hover:bg-teal-50 font-bold rounded-2xl h-12 shadow-lg shadow-black/20 transition-all active:scale-[0.98]">
                    Request Consultation
                  </Button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
