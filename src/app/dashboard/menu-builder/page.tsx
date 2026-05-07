'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MenuBuilderPreloader } from '@/components/dashboard/menu-builder/preloader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  List, 
  X, 
  Plus, 
  Palette, 
  Database, 
  CheckCircle2, 
  Loader2, 
  GripVertical, 
  Home, 
  Receipt, 
  ArrowLeft, 
  ChevronDown, 
  Wand, 
  RefreshCw, 
  Lock, 
  MoreHorizontal, 
  Trash2, 
  PlusCircle, 
  Plug, 
  Leaf, 
  Package, 
  Rocket, 
  Tag, 
  AlertTriangle, 
  Wheat, 
  Milk, 
  Sprout, 
  Sparkles, 
  Minus, 
  ArrowRight, 
  Check, 
  Flame, 
  ChevronRight, 
  ShoppingCart, 
  Edit, 
  ImageIcon, 
  GalleryHorizontal, 
  Upload, 
  QrCode, 
  ExternalLink, 
  Eye, 
  HelpCircle,
  Search,
  LayoutGrid,
  LayoutDashboard,
  AlignJustify
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader as AlertDialogTitleComponent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { DndContext, closestCenter, useSensor, useSensors, DragEndEvent, PointerSensor, KeyboardSensor, sortableKeyboardCoordinates } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { MenuItemCard, type MenuItem as BaseMenuItem } from '@/app/mobile/menu/menu-item-card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetDescription, SheetFooter, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { PosConnection } from '@/app/dashboard/integration/pos/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import NextLink from 'next/link';
import type { VariationGroup, ProductVariationGroup } from '@/app/dashboard/catalog/variations/types';
import { mockCategories, mockVariationGroups, mockComboGroupNames } from '@/lib/mock-data-store';
import { getCategoryNameOptions } from '@/app/dashboard/categories/utils';
import { generateProductDescription } from '@/ai/flows/generate-product-description-flow';

const BuilderSidebar = ({ onCreateMenuClick }: { onCreateMenuClick: () => void }) => {
    return (
        <aside className="w-80 bg-white border-r flex flex-col">
            <div className="h-16 border-b flex items-center px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#18B4A6] rounded-md flex items-center justify-center">
                        <List className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-base font-bold tracking-wider">MENU BUILDER</h2>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
                 <Button 
                    className="w-full justify-start p-3 h-auto bg-teal-100/50 hover:bg-teal-100/80 text-teal-600 font-bold rounded-lg"
                    onClick={onCreateMenuClick}
                >
                    <List className="h-5 w-5 mr-3" />
                    Create a Menu
                </Button>

                <div className="px-2 pt-4">
                    <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
                        Customization
                    </h3>
                </div>

                <Button variant="ghost" className="w-full justify-start p-3 h-auto font-bold text-gray-600 hover:text-gray-800">
                    <Palette className="h-5 w-5 mr-3 text-gray-500" />
                    Brand Management
                </Button>
            </div>
        </aside>
    );
};

const TemplateCard = ({ name, imageHint, isLocked, status, onDelete, onEdit, onPreview }: {
    name: string;
    imageHint: string;
    isLocked?: boolean;
    status?: 'Offline' | 'Online' | 'Draft',
    onDelete?: () => void;
    onEdit?: () => void;
    onPreview?: () => void;
}) => {
    const image = PlaceHolderImages.find(img => img.id === imageHint);
    const isOnline = status === 'Online';
    const isDraft = status === 'Draft';

    const dotColor = isOnline ? 'bg-green-500' : 'bg-red-500';

    return (
        <Card
            onClick={() => {
                if (!isLocked && onEdit) {
                    onEdit();
                }
            }}
            className={cn("overflow-hidden shadow-sm transition-shadow group", isLocked ? "cursor-not-allowed" : "hover:shadow-lg cursor-pointer")}
        >
            <CardHeader className="p-3 border-b flex-row justify-between items-center text-left">
                <div className="text-xs font-semibold flex items-center gap-1.5 min-w-0">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", dotColor)} />
                    {isLocked && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
                    <span className="truncate">{name}</span>
                    {isDraft && <Badge variant="secondary" className="font-bold text-xs px-1.5 py-0.5 h-4 ml-auto">DRAFT</Badge>}
                </div>
                {!isLocked && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="h-8 w-8 rounded-full bg-black/5 text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); onPreview && window.open('/mobile/menu', '_blank'); }}>
                                <Eye className="mr-2 h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={onEdit}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>Set as Offline</DropdownMenuItem>
                            <DropdownMenuItem disabled>Deactivate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    if (onDelete) onDelete();
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </CardHeader>
            <CardContent className="p-3">
                <div className={cn("relative aspect-[4/3] w-full bg-muted rounded-md overflow-hidden", isLocked && "filter grayscale opacity-70")}>
                    {image && <Image src={image.imageUrl} alt={name} width={600} height={400} className="object-cover h-full w-full transition-transform group-hover:scale-105" data-ai-hint={image.imageHint} />}
                    {!isLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <Button size="icon" variant="outline" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm rounded-full h-12 w-12 border-white/30" onClick={(e) => { e.stopPropagation(); onPreview && window.open('/mobile/menu', '_blank'); }}>
                                <Eye className="h-6 w-6" />
                            </Button>
                             <Button size="icon" variant="outline" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm rounded-full h-12 w-12 border-white/30" onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(); }}>
                                <Edit className="h-6 w-6" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const getImageUrl = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return image?.imageUrl || 'https://picsum.photos/seed/placeholder/400/400';
};

interface MenuItem extends BaseMenuItem {
  available?: boolean;
  nutrition?: Record<string, number>;
  variationGroups?: ProductVariationGroup[];
  properties?: string[];
}

const mapGroupToProductVariation = (group: VariationGroup): ProductVariationGroup => {
  return {
    ...group,
    options: group.options.map(opt => ({
        id: opt.id,
        value: opt.value,
        priceMode: 'add',
        priceValue: opt.regularPrice || 0,
        hidden: false,
    }))
  };
};

const mockMenuItems: MenuItem[] = [
    {
        id: 'pizza-margherita-12',
        name: 'Pizza Margherita - 12 inches',
        description: 'Homemade dough, homemade pizza sauce, shredded mozzarella cheese, and shredded cheddar cheese.',
        price: 36.00,
        category: 'Bestsellers',
        image: getImageUrl('margherita-pizza'),
        isCustomisable: true,
        properties: ['Vegetarian', 'Gluten', 'Dairy'],
        variationGroups: [
            mapGroupToProductVariation(mockVariationGroups.find(g => g.id === 'group_1')!),
        ],
        nutrition: {
            protein: 32,
            fat: 38,
            carbs: 98,
        }
    },
    {
        id: 'chicken-alfredo-pizza-12',
        name: 'Chicken Alfredo Pizza - 12 inches',
        description: 'Homemade dough, white sauce base, marinated...',
        price: 48.00,
        category: 'Bestsellers',
        isCustomisable: true,
        image: getImageUrl('alfredo-pizza'),
        properties: ['Halal'],
        nutrition: {
            protein: 45,
            fat: 30,
            carbs: 75,
            sugar: 8
        }
    },
    {
        id: 'pizza-margherita-10',
        name: 'Pizza Margherita - 10 inches',
        description: 'Homemade dough, homemade pizza sauce,...',
        price: 27.00,
        category: 'Pizza',
        image: getImageUrl('margherita-pizza'),
        isCustomisable: false,
        properties: ['Vegetarian', 'Gluten', 'Dairy'],
        nutrition: {
            protein: 18,
            fat: 15,
            carbs: 60,
            sugar: 7
        }
    },
    {
        id: 'hawaiian-pizza-10',
        name: 'Hawaiian Pizza - 10 inches',
        description: 'Homemade dough, pizza sauce, mozzarella, ham,...',
        price: 32.00,
        category: 'Pizza',
        isCustomisable: true,
        image: getImageUrl('hawaiian-pizza'),
        properties: ['Gluten', 'Dairy'],
        nutrition: {
            protein: 22,
            fat: 18,
            carbs: 70,
            sugar: 25
        }
    },
    {
        id: 'soft-drink',
        name: 'Soft Drink',
        description: 'Choose your favorite flavor.',
        price: 3.00,
        category: 'Drinks',
        isCustomisable: true,
        image: getImageUrl('soft-drink'),
        properties: [],
        variationGroups: [
            mapGroupToProductVariation(mockVariationGroups.find(g => g.id === 'group_2')!),
        ],
        nutrition: {
            protein: 0,
            fat: 0,
            carbs: 39,
            sugar: 39
        }
    },
    {
        id: 'bottled-water',
        name: 'Bottled Water',
        description: 'Still or sparkling water.',
        price: 2.50,
        category: 'Drinks',
        isCustomisable: false,
        image: getImageUrl('bottled-water'),
        properties: [],
        nutrition: {
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0
        }
    }
];

const mockMenuData = [
    { id: 'bestsellers', name: 'Bestsellers', items: mockMenuItems.filter(i => i.category === 'Bestsellers') },
    { id: 'pizza', name: 'Pizza', items: mockMenuItems.filter(i => i.category === 'Pizza') },
    { id: 'drinks', name: 'Drinks', items: mockMenuItems.filter(i => i.category === 'Drinks') },
];

const initialNutritionItems: { id: string; name: string; unit: 'g' | 'mg' | 'kcal'; enabled: boolean; }[] = [
  { id: '2', name: 'Protein', unit: 'g', enabled: true },
  { id: '3', name: 'Fat', unit: 'g', enabled: true },
  { id: '4', name: 'Carbohydrates', unit: 'g', enabled: true },
  { id: '5', name: 'Sugar', unit: 'g', enabled: true },
];

const mockProperties = ['Spicy', 'Vegetarian', 'Gluten-Free', 'New', 'Halal', 'Organic', 'Gluten', 'Dairy'];

const SortableSectionItem = ({ id, name, onEditClick, itemCount, onEditDetails, onDelete, isDeletable }: { id: string; name: string; onEditClick: () => void; itemCount: number; onEditDetails: () => void; onDelete: () => void; isDeletable: boolean; }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none group">
      <Card className="p-3 flex items-center justify-between cursor-pointer bg-white hover:bg-muted/50 transition-colors" onClick={onEditClick}>
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab p-1" onClick={(e) => e.stopPropagation()}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="font-semibold text-sm truncate max-w-[120px]">{name}</span>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn("transition-opacity", isDeletable && "group-hover:opacity-0")}>{itemCount} items</Badge>
            {isDeletable && (
                <div className="absolute right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); onEditDetails(); }}>
                        <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

const ItemEditor = ({ item, onUpdate, onImageUpload, onAvailabilityChange }: {
    item: MenuItem | null;
    onUpdate: (itemId: string, field: keyof MenuItem, value: any) => void;
    onImageUpload: (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    onAvailabilityChange: (itemId: string, available: boolean) => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localVariationGroups, setLocalVariationGroups] = useState<ProductVariationGroup[]>([]);
    const [localNutrition, setLocalNutrition] = useState<Record<string, number>>({});
    const [isNutritionEnabled, setIsNutritionEnabled] = useState(false);
    const [isGenerating, setIsGenerating] = useState<'short' | 'long' | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (item) {
            setLocalVariationGroups(item.variationGroups || []);
            setLocalNutrition(item.nutrition || {});
            setIsNutritionEnabled(item.nutrition !== undefined);
        } else {
            setLocalVariationGroups([]);
            setLocalNutrition({});
            setIsNutritionEnabled(false);
        }
    }, [item]);

    const handleUpdate = (field: keyof MenuItem, value: any) => {
        if (item) onUpdate(item.id, field, value);
    };

    const handleGenerateDescription = async (type: 'short' | 'long') => {
        if (!item?.name || !item?.category) return;
        setIsGenerating(type);
        try {
            const result = await generateProductDescription({
                productName: item.name,
                productCategory: item.category,
                descriptionType: type,
            });
            if (type === 'short') handleUpdate('description', result.description);
            else handleUpdate('description', result.description);
            toast({ title: 'AI Description Generated' });
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(null);
        }
    };

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <Edit className="h-12 w-12 mb-4" />
                <h3 className="font-semibold">Select an Item</h3>
                <p className="text-sm">Click on an item from the list to see and edit its details here.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 text-left">
            <div>
                <Label>Product Image</Label>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => onImageUpload(item.id, e)} />
                <div className="relative group mt-2" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center border overflow-hidden cursor-pointer">
                        {item.image ? (
                            <Image src={item.image} alt={item.name} width={240} height={135} className="object-cover w-full h-full" />
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-xs">Click to upload</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <FormLabel>Product Name</FormLabel>
                <Input value={item.name} onChange={(e) => handleUpdate('name', e.target.value)} />
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <FormLabel>Description</FormLabel>
                    <Button variant="ghost" size="sm" onClick={() => handleGenerateDescription('short')} disabled={!!isGenerating}>
                        {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin mr-2"/> : <Wand className="h-4 w-4 mr-2"/>}
                        AI Gen
                    </Button>
                </div>
                <Textarea value={item.description} onChange={(e) => handleUpdate('description', e.target.value)} rows={3} />
            </div>
            <div>
                <FormLabel>Price (AED)</FormLabel>
                <Input type="number" value={item.price} onChange={(e) => handleUpdate('price', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                <Label className="font-medium">Available for Purchase</Label>
                <Switch checked={item.available ?? true} onCheckedChange={(checked) => onAvailabilityChange(item.id, checked)} />
            </div>
        </div>
    );
};

const ItemPreviewer = ({ item }: { item: MenuItem | null }) => {
    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 w-full max-w-sm">
                <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
                <h3 className="font-semibold">Live Preview</h3>
                <p className="text-sm">Click an item to see it in action.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[340px] h-[720px] bg-gray-100 rounded-[32px] shadow-2xl p-3 border-[6px] border-black overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto bg-white rounded-t-[20px]">
                <div className="relative h-52">
                    <Image src={item.image || ''} alt={item.name} fill className="object-cover rounded-t-[20px]" />
                    <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 flex items-center justify-center text-white cursor-pointer"><X size={18} /></div>
                </div>
                <div className="p-4 space-y-4 text-left">
                    <h2 className="text-2xl font-bold">{item.name}</h2>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-xl font-bold">AED {item.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="sticky bottom-0 bg-white p-3 border-t rounded-b-[20px] flex items-center gap-3">
                <Button className="flex-1 h-12 text-white font-bold text-base bg-teal-500 hover:bg-teal-600">Add • AED {item.price.toFixed(2)}</Button>
            </div>
        </div>
    );
};

const CategoryItemsSheet = ({ category, isOpen, onOpenChange, onSave, onOpenEditDialog }: any) => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const sensors = useSensors(useSensor(PointerSensor));
    const { toast } = useToast();

    useEffect(() => {
        if (category && isOpen) {
          setItems(category.items.map((item: any) => ({ ...item, available: item.available ?? true })));
          setSelectedItem(category.items.length > 0 ? category.items[0] : null);
        }
    }, [category, isOpen]);

    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;
        return items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [items, searchQuery]);

    const handleItemUpdate = (itemId: string, field: keyof MenuItem, value: any) => {
        setItems(prev => prev.map(item => (item.id === itemId ? { ...item, [field]: value } : item)));
        if (selectedItem?.id === itemId) setSelectedItem(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSave = () => {
        if (category) {
            onSave(category.id, items);
            onOpenChange(false);
            toast({ title: "Changes Saved" });
        }
    };

    if (!isOpen) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[90vw] w-[90vw] p-0 flex flex-col">
                <SheetHeader className="p-6 border-b shrink-0 text-left">
                    <div className="flex items-center gap-2">
                        <SheetTitle>Manage: {category?.name} ({items.length} items)</SheetTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenEditDialog(category)}><Edit className="h-4 w-4"/></Button>
                    </div>
                </SheetHeader>
                <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
                    <Panel defaultSize={33} minSize={25} className="flex flex-col border-r bg-muted/30">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            <Table>
                                <TableBody>
                                    {filteredItems.map(item => (
                                        <TableRow key={item.id} onClick={() => setSelectedItem(item)} className={cn("cursor-pointer", selectedItem?.id === item.id && "bg-muted")}>
                                            <TableCell className="w-16"><Image src={item.image} alt="" width={48} height={48} className="rounded object-cover" /></TableCell>
                                            <TableCell className="text-left font-semibold">{item.name}</TableCell>
                                            <TableCell className="text-right">AED {item.price.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </Panel>
                    <PanelResizeHandle className="w-1.5 bg-muted hover:bg-border transition-colors" />
                    <Panel defaultSize={42} minSize={30} className="flex flex-col overflow-hidden border-r">
                        <ScrollArea className="flex-1">
                            <ItemEditor item={selectedItem} onUpdate={handleItemUpdate} onImageUpload={(id, e) => {}} onAvailabilityChange={(id, v) => handleItemUpdate(id, 'available', v)} />
                        </ScrollArea>
                    </Panel>
                    <PanelResizeHandle className="w-1.5 bg-muted hover:bg-border transition-colors" />
                    <Panel defaultSize={25} minSize={20} className="bg-muted/30 flex items-center justify-center p-4">
                        <ItemPreviewer item={selectedItem} />
                    </Panel>
                </PanelGroup>
                <SheetFooter className="p-6 border-t shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

const addSectionSchema = z.object({
    name: z.string().min(1, 'Section name is required'),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    enableSpecial: z.boolean().default(false),
});
type AddSectionFormValues = z.infer<typeof addSectionSchema>;

const AddSectionDetailsDialog = ({ isOpen, onOpenChange, onConfirm }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onConfirm: (data: AddSectionFormValues) => void; }) => {
  const form = useForm<AddSectionFormValues>({
    resolver: zodResolver(addSectionSchema),
    defaultValues: { name: '', description: '', imageUrl: '', enableSpecial: false },
  });

  const onSubmit = (data: AddSectionFormValues) => {
    onConfirm(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Create New Menu Section</DialogTitle>
          <DialogDescription>Basic details for your new section.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-section-details-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 text-left">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                    <FormLabel>Section Name*</FormLabel>
                    <FormControl><Input placeholder="e.g., Summer Specials" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Short description..." rows={2} {...field} /></FormControl>
                </FormItem>
            )}/>
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="add-section-details-form">Create Section</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditSectionDetailsDialog = ({ isOpen, onOpenChange, onConfirm, section }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onConfirm: (data: any) => void; section: any | null; }) => {
  const form = useForm<any>({
    defaultValues: { id: '', name: '', description: '', enableSpecial: false },
  });

  useEffect(() => {
    if (isOpen && section) form.reset({ ...section });
  }, [isOpen, section, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Edit Menu Section</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="edit-section-details-form" onSubmit={form.handleSubmit(onConfirm)} className="space-y-4 py-4 text-left">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                    <FormLabel>Section Name*</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                </FormItem>
            )}/>
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea rows={2} {...field} /></FormControl>
                </FormItem>
            )}/>
          </form>
        </Form>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="edit-section-details-form">Update Section</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function MenuBuilderPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [posFlowStep, setPosFlowStep] = useState<'customize' | ''>('');
  const [menuSections, setMenuSections] = useState<any[]>(mockMenuData);
  const [editingMenuName, setEditingMenuName] = useState('Untitled Menu');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isAddSectionDetailsModalOpen, setIsAddSectionDetailsModalOpen] = useState(false);
  const [isEditSectionDetailsModalOpen, setIsEditSectionDetailsModalOpen] = useState(false);
  const [editingSectionDetails, setEditingSectionDetails] = useState<any | null>(null);
  const [userMenus, setUserMenus] = useState<any[]>([]);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleAddSection = (data: AddSectionFormValues) => {
    const newSection = { id: `section_${Date.now()}`, items: [], ...data };
    setMenuSections(prev => [...prev, newSection]);
    setIsAddSectionDetailsModalOpen(false);
    toast({ title: "Section Created" });
  };

  const handleUpdateSectionDetails = (data: any) => {
    setMenuSections(prev => prev.map(s => s.id === data.id ? { ...s, ...data } : s));
    setIsEditSectionDetailsModalOpen(false);
  };

  const handleDeleteSection = (id: string) => {
    setMenuSections(prev => prev.filter(s => s.id !== id));
    toast({ title: "Section Removed", variant: "destructive" });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setMenuSections(items => {
        const oldIndex = items.findIndex(s => s.id === active.id);
        const newIndex = items.findIndex(s => s.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handlePublish = () => {
    const newMenu = { name: editingMenuName, status: 'Online', sections: menuSections, imageHint: 'template-2' };
    setUserMenus(prev => [...prev, newMenu]);
    setPosFlowStep('');
    toast({ title: "Menu Published!" });
  };

  if (!showBuilder) return <MenuBuilderPreloader onLoaded={() => setShowBuilder(true)} />;

  return (
    <div className="fixed inset-0 z-40 bg-background flex animate-in fade-in duration-500">
      <BuilderSidebar onCreateMenuClick={() => setIsAddMenuModalOpen(true)} />
      <div className="flex-1 flex flex-col bg-muted/40">
        <div className="h-16 border-b flex items-center px-6 justify-between bg-card shrink-0">
          <h1 className="font-bold text-lg">My Menus</h1>
          <Button onClick={() => setIsAddMenuModalOpen(true)}><Plus className="h-4 w-4 mr-2"/> Add Menu</Button>
        </div>
        <ScrollArea className="flex-1 p-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userMenus.map((m, i) => (
                <TemplateCard key={i} name={m.name} status={m.status} imageHint={m.imageHint} />
              ))}
              <Card className="border-2 border-dashed flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/50" onClick={() => setIsAddMenuModalOpen(true)}>
                <PlusCircle className="h-12 w-12 text-muted-foreground mb-2"/>
                <p className="font-semibold text-muted-foreground">Create New Menu</p>
              </Card>
           </div>
        </ScrollArea>
      </div>

      {/* Connection Selection */}
      <Dialog open={isAddMenuModalOpen} onOpenChange={setIsAddMenuModalOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-left">
                <DialogTitle>Create New Menu</DialogTitle>
                <DialogDescription>Start fresh or duplicate an existing template.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Button className="h-14 font-bold" onClick={() => { setPosFlowStep('customize'); setIsAddMenuModalOpen(false); }}>Start from Scratch</Button>
                <Button variant="outline" className="h-14 font-bold" disabled>Duplicate Template</Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* Full Screen Customizer */}
      <Dialog open={posFlowStep === 'customize'} onOpenChange={(open) => !open && setPosFlowStep('')}>
        <DialogContent className="max-w-full w-screen h-screen m-0 p-0 rounded-none border-none flex flex-col bg-muted/30">
          <DialogTitle className="sr-only">Customize Menu</DialogTitle>
          <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" onClick={() => setPosFlowStep('')}><ArrowLeft className="h-5 w-5"/></Button>
                <Input value={editingMenuName} onChange={e => setEditingMenuName(e.target.value)} className="font-bold border-none text-xl shadow-none focus-visible:ring-0 p-0 h-auto w-fit"/>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button onClick={handlePublish}><Rocket className="h-4 w-4 mr-2"/> Publish Menu</Button>
            </div>
          </header>
          <div className="flex-1 flex overflow-hidden">
             <aside className="w-80 bg-white border-r p-6 flex flex-col gap-6 shrink-0 text-left">
                <div>
                    <h3 className="font-bold text-lg mb-2">Menu Structure</h3>
                    <p className="text-xs text-muted-foreground">Drag to reorder sections. Use the edit button to manage items within a section.</p>
                </div>
                <ScrollArea className="flex-1 -mx-2 px-2">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={menuSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {menuSections.map(section => (
                                    <SortableSectionItem 
                                        key={section.id} 
                                        id={section.id} 
                                        name={section.name} 
                                        itemCount={section.items.length}
                                        onEditClick={() => { setEditingCategory(section); setIsCategorySheetOpen(true); }}
                                        onEditDetails={() => { setEditingSectionDetails(section); setIsEditSectionDetailsModalOpen(true); }}
                                        onDelete={() => handleDeleteSection(section.id)}
                                        isDeletable={section.id.toString().startsWith('section_')}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </ScrollArea>
                <Button variant="outline" className="w-full" onClick={() => setIsAddSectionDetailsModalOpen(true)}><Plus className="h-4 w-4 mr-2"/> Add Section</Button>
             </aside>
             <main className="flex-1 overflow-y-auto p-10 flex flex-col items-center">
                <h2 className="text-xl font-bold mb-6">Live Menu Preview</h2>
                <div className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl p-4 border-[6px] border-black overflow-hidden aspect-[9/19]">
                    <div className="h-full flex flex-col overflow-hidden bg-[#F7F9FB]">
                        <header className="p-4 bg-white border-b shrink-0 text-left">
                            <h4 className="font-bold text-teal-600">PREVIEW</h4>
                            <h2 className="text-2xl font-bold">{editingMenuName}</h2>
                        </header>
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-8">
                                {menuSections.map(s => (
                                    <div key={s.id} className="text-left">
                                        <h3 className="text-xl font-bold mb-4">{s.name}</h3>
                                        <div className="space-y-4">
                                            {s.items.length > 0 ? s.items.map((item: any) => (
                                                <MenuItemCard key={item.id} item={item} quantity={0} onAdd={()=>{}} onDecrement={()=>{}} onIncrement={()=>{}} isPurchasingEnabled={true} />
                                            )) : <p className="text-xs text-muted-foreground italic">No items in this section.</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <footer className="h-20 bg-white border-t flex items-center justify-around shrink-0">
                            <div className="flex flex-col items-center text-teal-500"><Home className="h-6 w-6"/><span className="text-[10px] font-bold">Menu</span></div>
                            <div className="flex flex-col items-center text-gray-400"><Receipt className="h-6 w-6"/><span className="text-[10px] font-bold">Orders</span></div>
                        </footer>
                    </div>
                </div>
             </main>
          </div>
        </DialogContent>
      </Dialog>

      <CategoryItemsSheet 
        isOpen={isCategorySheetOpen} 
        onOpenChange={setIsCategorySheetOpen} 
        category={editingCategory} 
        onSave={(id: string, items: any[]) => setMenuSections(prev => prev.map(s => s.id === id ? { ...s, items } : s))}
        onOpenEditDialog={setEditingSectionDetails}
      />
      <AddSectionDetailsDialog isOpen={isAddSectionDetailsModalOpen} onOpenChange={setIsAddSectionDetailsModalOpen} onConfirm={handleAddSection} />
      <EditSectionDetailsDialog isOpen={isEditSectionDetailsModalOpen} onOpenChange={setIsEditSectionDetailsModalOpen} section={editingSectionDetails} onConfirm={handleUpdateSectionDetails} />
    </div>
  );
}
