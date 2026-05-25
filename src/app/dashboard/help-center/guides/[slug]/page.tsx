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
  Users,
  X,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Real content steps for eMenu Tutorial
 */
const GUIDE_CONTENT = {
  'setup-business-profile': {
    title: 'Setting up your business profile',
    category: 'Getting Started',
    duration: '5 min',
    lastUpdated: 'Jan 15, 2025',
    description: 'Learn how to configure your corporate identity, branding, and legal identifiers for your eMenu Digital Hub account.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sections: [
      {
        title: 'Define your Corporate Identity',
        content: 'Navigate to the Settings tab in your main dashboard sidebar. Select "Manage Branches" and click "Edit" on your primary location. Upload your high-resolution PNG logo and select your primary brand hex color. This color will be applied across your digital menu to buttons, links, and highlights.',
        image: 'https://picsum.photos/seed/setup1/800/450'
      },
      {
        title: 'Configure Regional & Tax Settings',
        content: 'Under the "Basic Information" tab, ensure your base currency (e.g., AED) and local timezone are correctly assigned. This ensures your sales reports and order timestamps are accurate. Enter your local VAT or Trade License number in the legal identifiers section to ensure correct tax calculations on digital receipts.',
        image: 'https://picsum.photos/seed/setup2/800/450'
      },
      {
        title: 'Verify Outlet Mapping',
        content: 'Assign a unique "Outlet Slug" which will form the base of your public menu URL (e.g., yourbrand.menu/dubai-mall). Once saved, these details are pushed instantly to the mobile ordering interface for your guests.',
        image: 'https://picsum.photos/seed/setup3/800/450'
      }
    ]
  },
  'connect-pos': {
    title: 'Connecting your POS machine',
    category: 'Integrations',
    duration: '15 min',
    lastUpdated: 'Jan 20, 2025',
    description: 'A comprehensive guide to linking your Oracle Micros Simphony or Toast terminal for real-time automated menu synchronization.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sections: [
      {
        title: 'Provider Authentication',
        content: 'Navigate to "Integrations > POS" and select your provider. For Oracle Simphony, you will need your OIDC URL, Client ID, and service account credentials. These are typically provided by your POS technical administrator.',
        image: 'https://picsum.photos/seed/pos1/800/450'
      },
      {
        title: 'Terminal & Revenue Center Mapping',
        content: 'Select the specific Revenue Center you wish to sync (e.g., Dine-in Food or Bar). Map your eMenu outlet to the corresponding Revenue Center ID in your POS. This ensures that orders placed via the digital menu are correctly routed to the proper kitchen or bar printer.',
        image: 'https://picsum.photos/seed/pos2/800/450'
      },
      {
        title: 'Initial Data Ingestion',
        content: 'Once authenticated, click "Verify & Ingest". eMenu will read your POS database and import all active menu items, prices, and stock levels. You can then review these items in the "Manage Sync Menu" view to toggle visibility.',
        image: 'https://picsum.photos/seed/pos3/800/450'
      }
    ]
  },
  'create-categories': {
    title: 'Creating product categories',
    category: 'Menu Studio',
    duration: '6 min',
    lastUpdated: 'Jan 18, 2025',
    description: 'Organize your menu logically using hierarchical categories and dynamic columns.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sections: [
      {
        title: 'Add Category Columns',
        content: 'In "Catalog > Categories", click "Add Category Column". These serve as the top-level headers in your mobile menu. You can add descriptions and specific display formatting, such as "Grid with Images" or "List Only".',
        image: 'https://picsum.photos/seed/cat1/800/450'
      },
      {
        title: 'Nesting and Reordering',
        content: 'Drag and drop categories to create sub-menus (e.g., Pizza > Vegan Pizza). The hierarchical structure is automatically reflected in the mobile sidebar for easy guest navigation.',
        image: 'https://picsum.photos/seed/cat2/800/450'
      },
      {
        title: 'Applying Scheduling Rules',
        content: 'Use the "Schedule" action on any category to restrict availability. For example, you can set the "Breakfast" category to be visible only between 08:00 AM and 11:30 AM. Outside of these hours, the category is either hidden or marked as "Not Orderable".',
        image: 'https://picsum.photos/seed/cat3/800/450'
      }
    ]
  },
  'add-products-variations': {
    title: 'Adding products with variations',
    category: 'Menu Studio',
    duration: '10 min',
    lastUpdated: 'Jan 22, 2025',
    description: 'Set up complex items with modifiers, options, and custom pricing logic.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sections: [
      {
        title: 'Basic Product Entry',
        content: 'Add a new product and provide a base price. Use the "AI Operational Pulse" button to generate a mouth-watering description based on your ingredients.',
        image: 'https://picsum.photos/seed/prod1/800/450'
      },
      {
        title: 'Assigning Variation Groups',
        content: 'Navigate to the "Variations" tab. You can link pre-defined groups like "Size" or "Extra Toppings". Each option can be set to "Override" the base price, or "Add/Subtract" from it.',
        image: 'https://picsum.photos/seed/prod2/800/450'
      },
      {
        title: 'Setting Nutritional Facts',
        content: 'Enable the "Nutrition" toggle to provide transparency for your health-conscious guests. Assign values for Protein, Fat, Carbs, and Calories per serving.',
        image: 'https://picsum.photos/seed/prod3/800/450'
      }
    ]
  },
  'qr-codes-printing': {
    title: 'Branding and printing QR codes',
    category: 'Operations',
    duration: '4 min',
    lastUpdated: 'Jan 25, 2025',
    description: 'Generate high-resolution branded QR assets for your tables and marketing materials.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sections: [
      {
        title: 'Visual Branding',
        content: 'In "Operations > QR Code", select your brand color. Enable the "Add Branding" toggle to overlay your restaurant logo in the center of the code.',
        image: 'https://picsum.photos/seed/qr1/800/450'
      },
      {
        title: 'Configure Scannability',
        content: 'Enable "High Error Correction" for codes that will be printed on physical stickers or cards. This ensures the code remains scannable even if the sticker is slightly scratched or damaged.',
        image: 'https://picsum.photos/seed/qr2/800/450'
      },
      {
        title: 'Exporting Assets',
        content: 'Download your QR code in "SVG" format for professional printing, or "PNG" for digital use. You can also generate "Table-Specific" codes that automatically assign a table number to the guest\'s session.',
        image: 'https://picsum.photos/seed/qr3/800/450'
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
    <div className="min-h-screen bg-[#fafbfc] font-sans">
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
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">{guide.title}</h1>
                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-3xl">
                  {guide.description}
                </p>
              </div>
            </div>

            {/* Video Tutorial Section - Refined */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#18B4A6] flex items-center justify-center text-white shadow-lg shadow-[#18B4A6]/20">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Visual Walkthrough</h2>
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

            {/* Content Steps - High Fidelity Redesign */}
            <div className="space-y-20">
              {guide.sections.map((section, idx) => (
                <section key={idx} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                  <div className="flex items-start gap-8">
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-2xl font-black text-[#18B4A6]">{idx + 1}</span>
                    </div>
                    <div className="space-y-4 pt-1">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{section.title}</h3>
                      <p className="text-slate-600 text-base leading-relaxed font-medium">
                        {section.content}
                      </p>
                    </div>
                  </div>
                  
                  <div className="ml-0 md:ml-22 px-4 md:px-0">
                    <Card className="border-slate-100 overflow-hidden rounded-[40px] shadow-2xl bg-white p-2.5">
                      <div className="relative aspect-[16/9] w-full rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100">
                        <Image 
                          src={section.image} 
                          alt={section.title} 
                          fill 
                          className="object-cover transition-transform hover:scale-[1.03] duration-1000" 
                          data-ai-hint="technical dashboard interface"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-40" />
                        <div className="absolute bottom-8 left-8 flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 border-0 font-bold text-[10px] backdrop-blur-md shadow-sm">
                             <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                             UI REFERENCE
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </section>
              ))}
            </div>

            {/* Accomplishment Footer */}
            <div className="p-12 rounded-[48px] bg-gradient-to-br from-[#18B4A6] to-[#149d94] flex flex-col md:flex-row items-center gap-10 text-left relative overflow-hidden shadow-2xl shadow-teal-900/20">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none rotate-12">
                <ShieldCheck className="h-64 w-64 text-white" />
              </div>
              <div className="h-20 w-20 rounded-3xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-2xl relative z-10">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-4 relative z-10 flex-1">
                <h4 className="text-2xl font-bold text-white tracking-tight">Configuration Accomplished</h4>
                <p className="text-white/80 text-base font-medium leading-relaxed max-w-xl">
                  You have successfully completed this module. The updates are pushed live to your digital channels instantly. For further optimization, consider exploring our analytics module.
                </p>
                <div className="pt-4 flex items-center gap-4 flex-wrap">
                  <Button className="bg-white text-teal-600 hover:bg-slate-50 font-bold rounded-2xl h-14 px-10 shadow-xl" onClick={() => router.push('/dashboard')}>
                    Return to Dashboard
                  </Button>
                  <Button variant="ghost" className="text-white font-bold hover:bg-white/10 h-14 px-6 rounded-2xl border border-white/20">
                    Explore Next Module
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column - Technical Workspace */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              
              {/* Navigation Index */}
              <Card className="border-slate-100 rounded-[32px] shadow-sm bg-white overflow-hidden text-left">
                <CardHeader className="bg-slate-50/50 border-b px-8 py-6">
                  <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-teal-500" />
                    Module Index
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-4">
                  <div className="space-y-1">
                    {guide.sections.map((section, idx) => (
                      <button key={idx} className="w-full text-left px-5 py-4 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-all flex items-center gap-4 group">
                        <span className="text-[10px] h-6 w-6 rounded-xl border border-slate-200 flex items-center justify-center group-hover:border-teal-200 group-hover:bg-teal-50 shrink-0">{idx + 1}</span>
                        <span className="truncate">{section.title}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Technical Specifications */}
              <Card className="border-slate-100 rounded-[32px] shadow-sm bg-white overflow-hidden text-left">
                <CardHeader className="bg-slate-50/50 border-b px-8 py-6">
                  <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-teal-500" />
                    Technical Specs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                        <ShieldCheck className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Access Level</p>
                        <p className="text-sm font-bold text-slate-700">Workspace Administrator</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <Hash className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Integrations</p>
                        <p className="text-sm font-bold text-slate-700">POS Core Sync API</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full rounded-2xl h-14 font-bold text-[13px] gap-3 border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all">
                    <Printer className="h-4 w-4" />
                    Download PDF Manual
                  </Button>
                </CardContent>
              </Card>

              {/* Expert Consulting Sidebar */}
              <div className="bg-[#142424] p-10 rounded-[40px] text-white relative overflow-hidden text-left shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 pointer-events-none">
                  <MessageCircle className="h-48 w-48" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-[#18B4A6] flex items-center justify-center shadow-2xl shadow-teal-500/30">
                       <Users className="h-7 w-7 text-white" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xl font-bold tracking-tight">Expert Help</h4>
                      <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Available Now</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Our onboarding engineers can provide a direct walkthrough of this configuration via a secure screen-share session.
                  </p>
                  <Button className="w-full bg-white text-slate-900 hover:bg-teal-50 font-bold rounded-2xl h-14 shadow-xl shadow-black/20 transition-all active:scale-[0.98]">
                    Request Live Walkthrough
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
