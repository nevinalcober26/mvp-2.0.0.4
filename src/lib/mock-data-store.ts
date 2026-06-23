'use client';

import type { Product, ProductVariationGroup } from '@/app/dashboard/products/types';
import type { Customer, Visit, Payment as CustomerPayment } from '@/app/dashboard/customer/list/types';
import type { Order, OrderItem, Payment as OrderPayment, StaffReference } from '@/app/dashboard/orders/types';
import { format, subDays, subHours, endOfDay, setHours, setMinutes, subMinutes, formatDistanceToNow } from 'date-fns';
import type { Column, Item } from '@/app/dashboard/categories/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { VariationGroup } from '@/app/dashboard/catalog/variations/types';
import type { ComboGroup } from '@/app/dashboard/catalog/combo-groups/types';

export const mockComboGroupNames = ['Lunch Special', 'Family Deal', 'Dinner for Two', 'Breakfast Combo'];

const categories = ['Bestsellers', 'Pizza', 'Sides', 'Desserts', 'Drinks', 'Main Courses'];
const productNames = [
  'Classic Cheeseburger', 'Truffle Fries', 'Seasonal Berry Crumble', 'Artisanal Pizza',
  'Fresh Garden Salad', 'Spicy Chicken Wings', 'Avocado Toast', 'Margherita Pizza',
  'Ribeye Steak', 'Lava Cake', 'Classic Pancakes', 'Orange Juice', 'Espresso',
  'Latte', 'Cheesecake', 'Mushroom Swiss Burger', 'Onion Rings', 'Calamari Fritti',
  'Chicken Caesar Salad', 'Pepperoni Pizza', 'Four Cheese Pizza', 'Fettuccine Alfredo',
  'Lobster Ravioli', 'Grilled Salmon', 'Filet Mignon', 'Apple Pie', 'Brownie Sundae',
  'Iced Tea', 'Mojito (Non-alcoholic)', 'Strawberry Smoothie'
];
const productStatuses: Product['status'][] = ['Active', 'Draft', 'Archived', 'Out of Stock'];

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const staffNames = ['Alex', 'Maria', 'John', 'Sarah', 'Emma', 'Lisa', 'David', 'James', 'Sophie', 'Michael'];
const comments = [
  'Extra napkins please.', 'No onions on the burger.', 'Easy on the ice in the drink.',
  'Well done steak.', 'Birthday celebration!', 'Allergies: peanuts.', 'Please serve dessert later.',
  'Window seat requested.', 'Dressing on the side.', ''
];

const createSeededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

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

export const mockVariationGroups: VariationGroup[] = [
  {
    id: 'group_1',
    name: 'Size',
    sortOrder: 0,
    multiple: false,
    required: true,
    maxChoices: 1,
    options: [
      { id: 'opt_1_1', value: 'Small', sortOrder: 0, regularPrice: 0 },
      { id: 'opt_1_2', value: 'Medium', sortOrder: 1, regularPrice: 3.00 },
      { id: 'opt_1_3', value: 'Large', sortOrder: 2, regularPrice: 5.00 },
    ],
  },
  {
    id: 'group_2',
    name: 'Color',
    sortOrder: 1,
    multiple: true,
    required: false,
    maxChoices: 2,
    options: [
      { id: 'opt_2_1', value: 'Red', sortOrder: 0 },
      { id: 'opt_2_2', value: 'Green', sortOrder: 1 },
      { id: 'opt_2_3', value: 'Blue', sortOrder: 2 },
      { id: 'opt_2_4', value: 'Black', sortOrder: 3 },
      { id: 'opt_2_5', value: 'White', sortOrder: 4 },
    ],
  },
  {
    id: 'group_3',
    name: 'Steak Doneness',
    sortOrder: 2,
    multiple: false,
    required: true,
    maxChoices: 1,
    options: [
      { id: 'opt_3_1', value: 'Rare', sortOrder: 0 },
      { id: 'opt_3_2', value: 'Medium Rare', sortOrder: 1 },
      { id: 'opt_3_3', value: 'Medium', sortOrder: 2 },
      { id: 'opt_3_4', value: 'Medium Well', sortOrder: 3 },
      { id: 'opt_3_5', value: 'Well Done', sortOrder: 4 },
    ],
  },
  {
    id: 'group_4',
    name: 'Spice Level',
    sortOrder: 3,
    multiple: false,
    required: false,
    maxChoices: 1,
    options: [
        { id: 'opt_4_1', value: 'Mild', sortOrder: 0 },
        { id: 'opt_4_2', value: 'Medium', sortOrder: 1 },
        { id: 'opt_4_3', value: 'Hot', sortOrder: 2 },
        { id: 'opt_4_4', value: 'Extra Hot', sortOrder: 3 },
    ]
  },
  {
    id: 'group_5',
    name: 'Burger Toppings',
    sortOrder: 4,
    multiple: true,
    required: false,
    options: [
        { id: 'opt_5_1', value: 'Extra Cheese', sortOrder: 0, regularPrice: 2.00 },
        { id: 'opt_5_2', value: 'Bacon', sortOrder: 1, regularPrice: 3.50 },
        { id: 'opt_5_3', value: 'Sautéed Mushrooms', sortOrder: 2, regularPrice: 1.50 },
        { id: 'opt_5_4', value: 'Caramelized Onions', sortOrder: 3, regularPrice: 1.00 },
    ]
  },
  {
    id: 'group_6',
    name: 'Salad Dressing',
    sortOrder: 5,
    multiple: false,
    required: true,
    options: [
        { id: 'opt_6_1', value: 'Ranch', sortOrder: 0 },
        { id: 'opt_6_2', value: 'Italian Vinaigrette', sortOrder: 1 },
        { id: 'opt_6_3', value: 'Caesar', sortOrder: 2 },
        { id: 'opt_6_4', value: 'Balsamic', sortOrder: 3 },
    ]
  }
];

// --- Outlet Source of Truth ---
export interface Outlet {
  id: string;
  name: string;
  image: string;
  status: 'Open' | 'Closed';
  rating: number;
  type: string;
  location: string;
  address: string;
  menuItems: number;
  scansToday: number;
}

const DEFAULT_OUTLET_IMAGE = 'https://picsum.photos/seed/bloomsbury/600/400';

export const mockOutlets: Outlet[] = [
  {
    id: '1',
    name: "Bloomsbury's - Ras Al Khaimah",
    image: PlaceHolderImages.find(img => img.id === 'restaurant-1')?.imageUrl || DEFAULT_OUTLET_IMAGE,
    status: 'Open',
    rating: 4.9,
    type: 'Boutique Café',
    location: 'RAK Mall',
    address: 'Level 1, RAK Mall, Ras Al Khaimah',
    menuItems: 142,
    scansToday: 284,
  },
  {
    id: '2',
    name: "Bloomsbury's - Dubai Mall",
    image: PlaceHolderImages.find(img => img.id === 'restaurant-2')?.imageUrl || DEFAULT_OUTLET_IMAGE,
    status: 'Open',
    rating: 4.8,
    type: 'Signature Store',
    location: 'Downtown',
    address: 'Lower Ground, Dubai Mall, Dubai',
    menuItems: 156,
    scansToday: 1240,
  },
  {
    id: '3',
    name: "Bloomsbury's - Al Ain",
    image: PlaceHolderImages.find(img => img.id === 'restaurant-3')?.imageUrl || DEFAULT_OUTLET_IMAGE,
    status: 'Open',
    rating: 4.7,
    type: 'Boutique Café',
    location: 'Al Ain Mall',
    address: 'Ground Floor, Al Ain Mall, Al Ain',
    menuItems: 98,
    scansToday: 412,
  },
  {
    id: '4',
    name: "Bloomsbury's - Abu Dhabi",
    image: PlaceHolderImages.find(img => img.id === 'restaurant-4')?.imageUrl || DEFAULT_OUTLET_IMAGE,
    status: 'Open',
    rating: 4.8,
    type: 'Boutique Café',
    location: 'Al Mushrif',
    address: 'Al Mushrif Mall, Abu Dhabi',
    menuItems: 110,
    scansToday: 650,
  },
  {
    id: '5',
    name: "Bloomsbury's - Sharjah",
    image: PlaceHolderImages.find(img => img.id === 'restaurant-5')?.imageUrl || DEFAULT_OUTLET_IMAGE,
    status: 'Open',
    rating: 4.6,
    type: 'Boutique Café',
    location: 'Zero 6 Mall',
    address: 'Zero 6 Mall, Sharjah',
    menuItems: 85,
    scansToday: 320,
  },
  {
    id: '6',
    name: "Bloomsbury's - Ajman",
    image: PlaceHolderImages.find(img => img.id === 'restaurant-6')?.imageUrl || DEFAULT_OUTLET_IMAGE,
    status: 'Closed',
    rating: 4.5,
    type: 'Boutique Café',
    location: 'City Centre',
    address: 'City Centre Ajman, Ajman',
    menuItems: 72,
    scansToday: 180,
  },
];

export const mockBranches = mockOutlets; // Backward compatibility for renaming

const productDescriptions: Record<string, { description: string; smallDescription: string }> = {
    'Classic Cheeseburger': {
        description: 'A succulent beef patty topped with melted cheddar, crisp lettuce, ripe tomatoes, and our signature sauce, all nestled in a toasted brioche bun.',
        smallDescription: 'Juicy, cheesy, classic perfection.'
    },
    'Truffle Fries': {
        description: 'Crispy golden fries tossed in aromatic truffle oil, generously sprinkled with grated Parmesan and fresh parsley.',
        smallDescription: 'Crispy fries with a truffle twist.'
    },
    'Seasonal Berry Crumble': {
        description: 'A warm and comforting dessert featuring a medley of seasonal berries baked under a sweet, crunchy oat topping.',
        smallDescription: 'Warm, fruity, and comforting.'
    },
    'Artisanal Pizza': {
        description: 'Hand-stretched dough with a rich tomato base, creamy mozzarella, fresh basil, and a drizzle of extra-virgin olive oil.',
        smallDescription: 'Authentic Italian pizza simplicity.'
    },
    'Fresh Garden Salad': {
        description: 'A refreshing mix of crisp lettuce, cherry tomatoes, cucumbers, and bell peppers, tossed in a light vinaigrette dressing.',
        smallDescription: 'Crisp, fresh, and healthy.'
    },
    'Spicy Chicken Wings': {
        description: 'Crispy, juicy chicken wings coated in a fiery and tangy buffalo sauce, served with a cool blue cheese dip.',
        smallDescription: 'Fiery, tangy, and addictive.'
    },
    'Avocado Toast': {
        description: 'Creamy mashed avocado on a thick slice of toasted sourdough, topped with chili flakes and a squeeze of lime.',
        smallDescription: 'Creamy avocado on toasted sourdough.'
    },
    'Margherita Pizza': {
        description: 'The classic pizza with a simple yet delicious combination of San Marzano tomatoes, fresh mozzarella, basil, and olive oil.',
        smallDescription: 'The timeless Italian classic.'
    },
    'Ribeye Steak': {
        description: 'A perfectly seared 10oz Ribeye steak, cooked to your liking and served with a side of roasted garlic mashed potatoes.',
        smallDescription: 'Juicy, tender, and full of flavor.'
    },
    'Lava Cake': {
        description: 'A decadent chocolate cake with a molten chocolate center, served warm with a scoop of vanilla ice cream.',
        smallDescription: 'A chocolate lover\'s dream.'
    },
    'Classic Pancakes': {
        description: 'A stack of fluffy buttermilk pancakes served with a pat of butter and a generous drizzle of maple syrup.',
        smallDescription: 'Fluffy pancakes with maple syrup.'
    },
    'Orange Juice': {
        description: 'Freshly squeezed orange juice, packed with vitamins and a burst of citrus flavor.',
        smallDescription: 'Freshly squeezed sunshine.'
    },
    'Espresso': {
        description: 'A rich and intense shot of freshly brewed espresso, the perfect pick-me-up.',
        smallDescription: 'A rich and intense coffee shot.'
    },
    'Latte': {
        description: 'A smooth and creamy coffee made with a shot of espresso and steamed milk, topped with a light layer of foam.',
        smallDescription: 'Smooth, creamy, and satisfying.'
    },
    'Cheesecake': {
        description: 'A rich and creamy New York-style cheesecake with a graham cracker crust, served plain or with a berry coulis.',
        smallDescription: 'Rich, creamy, and decadent.'
    }
};

const generateMockProducts = (count: number): Product[] => {
    const products: Product[] = [];
    const outletNames = mockOutlets.map(b => b.name);
    for (let i = 0; i < count; i++) {
        const name = productNames[i % productNames.length];
        const status = productStatuses[i % productStatuses.length];
        const price = parseFloat((10 + (i * 1.75 % 25)).toFixed(2));
        const stock = status === 'Out of Stock' ? 0 : 10 + (i * 7 % 90);

        let variationGroups: ProductVariationGroup[] | undefined = undefined;

        if (name === 'Classic Cheeseburger' || name === 'Mushroom Swiss Burger' || name === 'Ribeye Steak' || name === 'Filet Mignon') {
            const group = mockVariationGroups.find(g => g.id === 'group_3');
            if (group) variationGroups = [mapGroupToProductVariation(group)];
        }
        if (name.includes('Pizza')) {
            const group = mockVariationGroups.find(g => g.id === 'group_1');
            if (group) variationGroups = [mapGroupToProductVariation(group)];
        }
         if (name.includes('Salad')) {
            const group = mockVariationGroups.find(g => g.id === 'group_6');
            if (group) variationGroups = [mapGroupToProductVariation(group)];
        }

        const imageId = name.toLowerCase().replace(/ /g, '-');
        const image = PlaceHolderImages.find(p => p.id === imageId);

        const descriptionDetails = productDescriptions[name] || {
            description: 'A delicious dish prepared with the finest ingredients by our expert chefs.',
            smallDescription: 'A true delight for your taste buds.'
        };

        products.push({
            id: `prod_${i}`,
            name: `${name} ${i < productNames.length ? '' : `#${Math.floor(i / productNames.length)}`}`.trim(),
            category: categories[i % categories.length],
            branch: outletNames[i % outletNames.length],
            price,
            stock,
            status,
            mainImage: image?.imageUrl || `https://picsum.photos/seed/${name.replace(/\s+/g, '-').toLowerCase()}/400/400`,
            description: descriptionDetails.description,
            smallDescription: descriptionDetails.smallDescription,
            discountedPrice: status === 'Active' && i % 4 === 0 ? parseFloat((price * 0.8).toFixed(2)) : undefined,
            variationGroups
        });
    }
    return products;
};

export const mockProducts: Product[] = generateMockProducts(100);

const generateRelatedMockData = (customerCount: number, orderCount: number, products: Product[]) => {
    const customers: Customer[] = [];
    const orders: Order[] = [];
    const outletNames = mockOutlets.map(b => b.name);
    
    const seed = 12345;
    const random = createSeededRandom(seed);
    const baseDate = new Date();

    for (let i = 0; i < customerCount; i++) {
        const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
        customers.push({
            id: `cust_${i}`,
            name,
            email: `${name.replace(' ', '.').toLowerCase()}@example.com`,
            phone: `555-01${String(i).padStart(2, '0')}`,
            lastVisit: '',
            totalVisits: 0,
            totalSpent: 0,
            avgBillValue: 0,
            visits: [],
        });
    }

    for (let i = 0; i < orderCount; i++) {
        const hasCustomer = i % 4 !== 0;
        const customer = hasCustomer ? customers[i % customers.length] : undefined;

        const orderItemsCount = Math.floor(random() * 4) + 2;
        const currentItems: OrderItem[] = Array.from({ length: orderItemsCount }, (_, k) => {
            const item = products[Math.floor(random() * products.length)];
            return {
                id: `${item.id}-${i}-${k}`,
                name: item.name,
                quantity: Math.floor(random() * 2) + 1,
                price: item.price,
                category: item.category,
            };
        });

        const totalAmount = parseFloat(currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
        
        let orderTimestamp: number;
        let branch: string;
        let paymentState: Order['paymentState'];
        let orderStatus: Order['orderStatus'];
        let paidAmount: number;
        let isSplit = false;
        let hasTip = false;

        if (i < 150) {
            branch = outletNames[i % outletNames.length];
            orderTimestamp = subDays(endOfDay(baseDate), Math.floor(random() * 28)).getTime();
            
            if (i % 3 === 0) {
                branch = "Bloomsbury's - Ras Al Khaimah";
            }
            
            isSplit = i % 4 === 0;
            hasTip = random() > 0.3;
            paymentState = 'Fully Paid';
            orderStatus = 'Completed';
            paidAmount = totalAmount;

            if (i % 7 === 0) {
                orderStatus = 'Open';
                if (random() > 0.4) {
                    paymentState = 'Partial';
                    paidAmount = parseFloat((totalAmount * (random() * 0.6 + 0.1)).toFixed(2));
                } else {
                    paymentState = 'Unpaid';
                    paidAmount = 0;
                }
                isSplit = false;
                hasTip = false;
            }

        } else {
            branch = outletNames[i % outletNames.length];
            orderTimestamp = subDays(endOfDay(baseDate), Math.floor(random() * 365) + 30).getTime();
            
            const finalStatuses: Order['orderStatus'][] = ['Completed', 'Cancelled', 'Refunded'];
            orderStatus = finalStatuses[Math.floor(random() * finalStatuses.length)];

            if (orderStatus === 'Cancelled') {
                paymentState = 'Voided';
                paidAmount = 0;
            } else if (orderStatus === 'Refunded') {
                paymentState = 'Returned';
                paidAmount = totalAmount;
            } else {
                paymentState = 'Fully Paid';
                paidAmount = totalAmount;
            }

            isSplit = paidAmount > 0.01 && i % 10 === 0;
            hasTip = random() > 0.6;
        }

        const randomDate = new Date(orderTimestamp);
        const customerPayments: CustomerPayment[] = [];
        let splitType: 'byItem' | 'equally' | undefined = undefined;
        
        if (isSplit && paymentState === 'Fully Paid') {
            splitType = i % 8 === 0 ? 'byItem' : 'equally';
            paidAmount = totalAmount;
            orderStatus = 'Completed';

            if (splitType === 'byItem') {
                let itemsToPay = [...currentItems];
                let guestIndex = 0;
                let payersCount = Math.min(itemsToPay.length, Math.floor(random() * 4) + 2);
                if (payersCount < 2 && itemsToPay.length > 1) payersCount = 2;

                while(itemsToPay.length > 0 && guestIndex < payersCount) {
                    const isLastPayer = guestIndex === payersCount - 1;
                    let itemsForThisPayer: OrderItem[] = [];

                    if (isLastPayer) {
                        itemsForThisPayer = [...itemsToPay];
                        itemsToPay = [];
                    } else {
                        const itemsCountForPayer = Math.max(1, Math.floor(random() * (itemsToPay.length - (payersCount - guestIndex - 1))));
                        if(itemsToPay.length > itemsCountForPayer) {
                          itemsForThisPayer = itemsToPay.splice(0, itemsCountForPayer);
                        } else {
                           itemsForThisPayer = [...itemsToPay];
                           itemsToPay = [];
                        }
                    }

                    if(itemsForThisPayer.length === 0) continue;
                    const paymentAmount = itemsForThisPayer.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const tip = parseFloat((paymentAmount * (random() * 0.1 + 0.05)).toFixed(2));

                    customerPayments.push({
                        id: `txn_${12345 + i}_${guestIndex}`,
                        amount: paymentAmount,
                        tip: tip,
                        method: 'Credit Card',
                        status: 'Paid',
                        date: format(subMinutes(randomDate, Math.floor(random() * 5)), 'PPpp'),
                        items: itemsForThisPayer.map(it => ({ name: it.name, quantity: it.quantity })),
                    });
                    guestIndex++;
                }
            } else {
                const numPayers = Math.floor(random() * 4) + 2;
                const totalTip = parseFloat((totalAmount * (random() * 0.1 + 0.1)).toFixed(2));
                let remainingAmount = totalAmount;
                let remainingTip = totalTip;
                
                for (let j = 0; j < numPayers; j++) {
                    const isLastPayer = j === numPayers - 1;
                    let paymentAmount = isLastPayer ? remainingAmount : parseFloat((totalAmount / numPayers).toFixed(2));
                    let tipAmount = isLastPayer ? remainingTip : parseFloat((totalTip / numPayers).toFixed(2));
                    remainingAmount -= paymentAmount;
                    remainingTip -= tipAmount;

                    customerPayments.push({
                        id: `txn_${12345 + i}_${j}`,
                        amount: paymentAmount,
                        tip: tipAmount,
                        method: j % 2 === 0 ? 'Credit Card' : 'Online',
                        status: 'Paid',
                        date: format(subMinutes(randomDate, Math.floor(random() * 5)), 'PPpp'),
                    });
                }
            }
        } else if (paidAmount > 0) {
            const tip = hasTip ? parseFloat((paidAmount * (random() > 0.5 ? 0.1 : 0.15)).toFixed(2)) : 0;
            customerPayments.push({
                id: `txn_${12345 + i}`,
                amount: paidAmount,
                tip,
                method: i % 3 === 0 ? 'Cash' : 'Credit Card',
                status: 'Paid',
                date: format(subHours(randomDate, random() > 0.5 ? 0 : 1), 'PPpp'),
            });
        }
        
        const orderPayments: OrderPayment[] = customerPayments.map((p, index) => ({
            method: p.method,
            amount: p.amount.toFixed(2),
            date: p.date,
            transactionId: p.id,
            guestName: customer?.name || `Guest ${index + 1}`,
            tip: p.tip,
            items: p.items,
        }));
        
        const order: Order = {
            orderId: `#${3210 + i}`,
            branch,
            table: `T${(i % 24) + 1}`,
            orderType: i % 2 === 0 ? 'Post-Paid' : 'Prepaid',
            orderStatus,
            paymentState,
            totalAmount,
            paidAmount,
            items: currentItems,
            orderDate: randomDate.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
            orderTimestamp: randomDate.getTime(),
            payments: orderPayments,
            splitType: splitType,
            customer: customer ? { name: customer.name, email: customer.email, phone: customer.phone } : undefined,
            staffName: staffNames[i % staffNames.length],
            orderComments: comments[i % comments.length] || undefined,
            source: i % 3 === 0 ? 'POS' : 'App to App',
            staffReference: {
                employee_reference_code: `EMP-${staffNames[i % staffNames.length].replace(/[^A-Z]/g, '')}${100 + i}`,
                total_sale_amount: random() * 5000 + 1000,
                order_count: Math.floor(random() * 50) + 10,
                total_tip_amount: random() * 500,
                currency: 'AED',
                start_date: format(subDays(baseDate, 7), 'yyyy-MM-dd'),
                end_date: format(baseDate, 'yyyy-MM-dd'),
            },
        };
        orders.push(order);

        if (customer) {
            customer.totalVisits += 1;
            customer.totalSpent += totalAmount;
            
            const visit: Visit = {
              orderId: order.orderId,
              date: format(randomDate, 'PP'),
              type: i % 2 === 0 ? 'Dine-in' : 'Takeaway',
              paymentStatus: order.paymentState === 'Fully Paid' ? 'Paid' : order.paymentState === 'Partial' ? 'Partial' : 'Unpaid',
              tip: customerPayments.reduce((acc, p) => acc + (p.tip || 0), 0),
              isSplit: order.splitType !== undefined,
              total: order.totalAmount,
              payments: customerPayments,
            };
            customer.visits.push(visit);
        }
    }
    
    for (const customer of customers) {
        if (customer.totalVisits > 0) {
            customer.avgBillValue = customer.totalSpent / customer.totalVisits;
            customer.visits.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            customer.lastVisit = customer.visits.length > 0 ? customer.visits[0].date : 'N/A';
        }
    }

    return { customers, orders };
};

const relatedData = generateRelatedMockData(200, 800, mockProducts);
export const mockCustomers: Customer[] = relatedData.customers;
export const mockOrders: Order[] = relatedData.orders;
