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
  ArrowLeft, 
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
  BookOpen
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
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    sections: [
      {
        title: '1. Accessing Profile Settings',
        content: 'Navigate to the Settings tab in your main dashboard sidebar. Select "Business Profile" from the sub-menu to access your core corporate identity settings.',
        image: 'https://picsum.photos/seed/setup1/800/450'
      },
      {
        title: '2. Defining Brand Visuals',
        content: 'Upload your high-resolution PNG logo and select your primary brand hex color. This color will be applied across your digital menu to buttons, links, and highlights.',
        image: 'https://picsum.photos/seed/setup2/800/450'
      },
      {
        title: '3. Legal & Regional Identifiers',
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
        title: '1. Provider Authentication',
        content: 'Select your POS provider from the Integration hub. Enter your OIDC and Client ID credentials provided by your POS administrator.',
        image: 'https://picsum.photos/seed/pos1/800/450'
      },
      {
        title: '2. Terminal Mapping',
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
  
  // Find guide data or use default for demonstration
  const guide = GUIDE_CONTENT[slug as keyof typeof GUIDE_CONTENT] || GUIDE_CONTENT['setup-business-profile'];

  const breadcrumbItems = [
    { label: 'Help Center', href: '/dashboard/help-center' },
    { label: 'Knowledge Base', href: '/dashboard/help-center/guides' },
    { label: guide.title }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <DashboardHeader />
      
      <main className="p-8 pb-32">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl gap-2 font-semibold text-slate-600 border-slate-200">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 text-slate-600">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10 text-left">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <Badge className="bg-teal-50 text-teal-600 border-teal-100 font-bold text-[10px] uppercase tracking-wider rounded-md">
                    {guide.category}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    {guide.duration} Read
                  </div>
                </div>
                <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">{guide.title}</h1>
                <p className="text-slate-500 text-base font-medium leading-relaxed max-w-2xl">
                  {guide.description}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</span>
                <span className="text-sm font-semibold text-slate-600">{guide.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Content Column */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Video Tutorial Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Video Tutorial</h2>
                </div>
                
                <div className="aspect-video w-full rounded-[24px] bg-slate-900 overflow-hidden shadow-2xl relative group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={guide.videoUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="opacity-90"
                  ></iframe>
                </div>
              </section>

              {/* Step by Step Sections */}
              {guide.sections.map((section, idx) => (
                <section key={idx} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-900">{section.title}</h3>
                    <p className="text-slate-600 text-base leading-relaxed font-medium">
                      {section.content}
                    </p>
                  </div>
                  
                  <Card className="border-slate-100 overflow-hidden rounded-[24px] shadow-sm bg-white">
                    <div className="relative aspect-[16/9] w-full">
                      <Image 
                        src={section.image} 
                        alt={section.title} 
                        fill 
                        className="object-cover" 
                        data-ai-hint="technical dashboard"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-40" />
                      <div className="absolute bottom-4 left-6 flex items-center gap-2">
                        <Badge className="bg-white/90 text-slate-900 border-0 font-bold text-[9px] backdrop-blur-md">
                          FIG 1.{idx + 1}
                        </Badge>
                        <span className="text-[10px] text-white font-bold uppercase tracking-wider drop-shadow-sm">Interface Reference</span>
                      </div>
                    </div>
                  </Card>
                </section>
              ))}

              {/* Conclusion Section */}
              <div className="p-8 rounded-[32px] bg-teal-50 border border-teal-100 flex items-start gap-6 text-left">
                <div className="h-12 w-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-teal-500/20">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-teal-900">Module Complete</h4>
                  <p className="text-sm text-teal-700/80 font-medium leading-relaxed">
                    You have successfully configured this module. If you encounter any unexpected behaviors, please reach out to our Relationship Management team via the Help Center.
                  </p>
                </div>
              </div>

            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                
                <Card className="border-slate-100 rounded-[24px] shadow-sm bg-white overflow-hidden text-left">
                  <CardHeader className="bg-slate-50 border-b p-6">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-slate-400" />
                      Technical Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          This configuration requires <span className="font-bold text-slate-900">Administrator</span> level permissions within the eMenu workspace.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <ExternalLink className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          External identifiers must match your <span className="font-bold text-slate-900">Network International</span> merchant onboarding documents.
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl h-11 font-semibold text-xs gap-2 border-slate-200">
                      Print Documentation
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4 text-left">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Related Articles</h4>
                  <div className="space-y-3">
                    {[
                      { title: 'Defining tax & service fees', duration: '3 min' },
                      { title: 'Branding your mobile menu', duration: '5 min' },
                      { title: 'Whitelisting hardware IDs', duration: '7 min' }
                    ].map((item, i) => (
                      <button key={i} className="w-full group text-left p-4 rounded-2xl bg-white border border-slate-100 hover:border-teal-500/30 hover:shadow-md transition-all flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">{item.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{item.duration} READ</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-all group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[32px] text-white relative overflow-hidden text-left shadow-2xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageCircle className="h-24 w-24" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <h4 className="text-lg font-semibold tracking-tight">Need expert help?</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Our onboarding engineers can walk you through this process via a scheduled screen-share session.
                    </p>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl h-11 shadow-lg shadow-teal-500/20">
                      Request Consultation
                    </Button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
