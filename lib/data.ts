export const categories = [
  { 
    id: '1', 
    name: 'নিত্যপ্রয়োজনীয় ও মুদি পণ্য', 
    name_en: 'Groceries & Daily Needs', 
    icon: '🛒',
    subcategories: ['Snacks', 'Staples', 'Beverages', 'Household']
  },
  { 
    id: '2', 
    name: 'ইলেক্ট্রনিক্স ও গ্যাজেট', 
    name_en: 'Electronics & Gadgets', 
    icon: '📱',
    subcategories: ['Smartphones', 'Laptops', 'Audio', 'Smart Home']
  },
  { 
    id: '3', 
    name: 'হোম ও লিভিং', 
    name_en: 'Home & Living', 
    icon: '🏠',
    subcategories: ['Furniture', 'Decor', 'Kitchenware', 'Bedding']
  },
  { 
    id: '4', 
    name: 'বিউটি ও পার্সোনাল কেয়ার', 
    name_en: 'Beauty & Personal Care', 
    icon: '💄',
    subcategories: ['Skincare', 'Haircare', 'Makeup', 'Fragrances']
  },
  { 
    id: '5', 
    name: 'বেবি ও কিডস', 
    name_en: 'Baby & Kids', 
    icon: '👶',
    subcategories: ['Toys', 'Clothing', 'Diapers', 'Gear']
  },
  { 
    id: '6', 
    name: 'ফ্যাশন ও পোশাক', 
    name_en: 'Fashion & Clothing', 
    icon: '👕',
    subcategories: ['Men\'s Wear', 'Women\'s Wear', 'Kids\' Wear', 'Accessories']
  },
  { 
    id: '7', 
    name: 'স্বাস্থ্য ও সুস্থতা', 
    name_en: 'Health & Wellness', 
    icon: '💊',
    subcategories: ['Supplements', 'Fitness Gear', 'Personal Health']
  },
  { 
    id: '8', 
    name: 'স্পোর্টস ও ফিটনেস', 
    name_en: 'Sports & Fitness', 
    icon: '⚽',
    subcategories: ['Gym Equipment', 'Outdoor Sports', 'Apparel']
  },
  { 
    id: '9', 
    name: 'অটোমোবাইল ও মোটরসাইকেল', 
    name_en: 'Automotive & Motorbike', 
    icon: '🚗',
    subcategories: ['Car Parts', 'Bike Gear', 'Accessories']
  },
  { 
    id: '10', 
    name: 'বই ও স্টেশনারি', 
    name_en: 'Books & Stationery', 
    icon: '📚',
    subcategories: ['Fiction', 'Education', 'Office Supplies']
  },
];

export const products = [
  {
    id: '1',
    name: 'প্রিমিয়াম কটন পোলো শার্ট',
    name_en: 'Premium Cotton Polo Shirt',
    price: 1250,
    oldPrice: 1500,
    image: 'https://picsum.photos/seed/polo/400/400',
    category: 'Fashion & Clothing',
    rating: 4.8,
    reviews: 124,
    weight: 'Regular',
  },
  {
    id: '2',
    name: 'স্মার্ট নয়েজ ক্যানসেলিং হেডফোন',
    name_en: 'Smart Noise Cancelling Headphones',
    price: 3500,
    oldPrice: 4500,
    image: 'https://picsum.photos/seed/headphone/400/400',
    category: 'Electronics & Gadgets',
    rating: 4.9,
    reviews: 210,
    weight: 'Light',
  },
  {
    id: '3',
    name: 'অর্গানিক ফেস সিরাম',
    name_en: 'Organic Face Serum',
    price: 850,
    oldPrice: 1200,
    image: 'https://picsum.photos/seed/serum/400/400',
    category: 'Beauty & Personal Care',
    rating: 5.0,
    reviews: 86,
    weight: '50ml',
  },
  {
    id: '4',
    name: 'প্রিমিয়াম বাসমতি চাল (৫ কেজি)',
    name_en: 'Premium Basmati Rice (5kg)',
    price: 850,
    oldPrice: 950,
    image: 'https://picsum.photos/seed/rice/400/400',
    category: 'Groceries & Daily Needs',
    rating: 4.7,
    reviews: 156,
    weight: '5kg',
  },
  {
    id: '5',
    name: 'বেবি সফট টয় সেট',
    name_en: 'Baby Soft Toy Set',
    price: 650,
    oldPrice: 850,
    image: 'https://picsum.photos/seed/toys/400/400',
    category: 'Baby & Kids',
    rating: 4.6,
    reviews: 94,
    weight: 'Mixed',
  },
  {
    id: '6',
    name: 'যোগা ম্যাট (প্রিমিয়াম)',
    name_en: 'Premium Yoga Mat',
    price: 1800,
    oldPrice: 2200,
    image: 'https://picsum.photos/seed/yoga/400/400',
    category: 'Sports & Fitness',
    rating: 4.5,
    reviews: 45,
    weight: 'Light',
  },
  {
    id: '7',
    name: 'মোটরসাইকেল সেফটি হেলমেট',
    name_en: 'Motorbike Safety Helmet',
    price: 4500,
    oldPrice: 5500,
    image: 'https://picsum.photos/seed/helmet/400/400',
    category: 'Automotive & Motorbike',
    rating: 4.9,
    reviews: 32,
    weight: '1.2kg',
  },
  {
    id: '8',
    name: 'বিখ্যাত বাংলা উপন্যাস সংগ্রহ',
    name_en: 'Famous Bengali Novel Collection',
    price: 450,
    oldPrice: 600,
    image: 'https://picsum.photos/seed/books/400/400',
    category: 'Books & Stationery',
    rating: 4.8,
    reviews: 78,
    weight: 'Book',
  },
  {
    id: '9',
    name: 'মডার্ন কটন টি-শার্ট',
    name_en: 'Modern Cotton T-shirt',
    price: 750,
    oldPrice: 950,
    image: 'https://picsum.photos/seed/tshirt/400/400',
    category: 'Fashion & Clothing',
    rating: 4.7,
    reviews: 88,
    weight: 'Regular',
  },
  {
    id: '10',
    name: 'লেদার বেলট ও ওয়ালেট সেট',
    name_en: 'Leather Belt & Wallet Set',
    price: 1800,
    oldPrice: 2200,
    image: 'https://picsum.photos/seed/leather/400/400',
    category: 'Fashion & Clothing',
    rating: 4.9,
    reviews: 120,
    weight: 'Set',
  },
  {
    id: '11',
    name: 'স্মার্ট ওয়াচ আল্ট্রা',
    name_en: 'Smart Watch Ultra',
    price: 4500,
    oldPrice: 5500,
    image: 'https://picsum.photos/seed/watch/400/400',
    category: 'Electronics & Gadgets',
    rating: 4.8,
    reviews: 65,
    weight: 'Light',
  },
  {
    id: '12',
    name: 'বেতার স্পিকার (ব্লুটুথ)',
    name_en: 'Wireless Bluetooth Speaker',
    price: 2200,
    oldPrice: 2800,
    image: 'https://picsum.photos/seed/speaker/400/400',
    category: 'Electronics & Gadgets',
    rating: 4.7,
    reviews: 45,
    weight: 'Light',
  },
  {
    id: '13',
    name: 'মডার্ন সোফা কুশন সেট',
    name_en: 'Modern Sofa Cushion Set',
    price: 1200,
    oldPrice: 1500,
    image: 'https://picsum.photos/seed/cushion/400/400',
    category: 'Home & Living',
    rating: 4.6,
    reviews: 32,
    weight: 'Set',
  },
  {
    id: '14',
    name: 'অ্যারোমাটিক ক্যান্ডেল প্যাক',
    name_en: 'Aromatic Candle Pack',
    price: 550,
    oldPrice: 750,
    image: 'https://picsum.photos/seed/candle/400/400',
    category: 'Home & Living',
    rating: 4.8,
    reviews: 18,
    weight: 'Pack',
  },
  {
    id: '15',
    name: 'ময়েশ্চারাইজিং লোশন',
    name_en: 'Moisturizing Lotion',
    price: 650,
    oldPrice: 850,
    image: 'https://picsum.photos/seed/lotion/400/400',
    category: 'Beauty & Personal Care',
    rating: 4.9,
    reviews: 110,
    weight: '200ml',
  },
  {
    id: '16',
    name: 'হেয়ার কেয়ার কম্বো',
    name_en: 'Hair Care Combo',
    price: 1500,
    oldPrice: 2000,
    image: 'https://picsum.photos/seed/haircare/400/400',
    category: 'Beauty & Personal Care',
    rating: 4.7,
    reviews: 94,
    weight: 'Set',
  },
];

export const blogPosts = [
  {
    id: '1',
    title: 'মধুর উপকারিতা এবং খাঁটি মধু চেনার উপায়',
    excerpt: 'প্রাকৃতিক মধুর গুণাগুণ বলে শেষ করা সম্ভব নয়। কিন্তু বাজারে আসল মধুর ভিড়ে ভেজাল মধু চেনা বেশ দায়। খাঁটি মধু চেনার কিছু বিশেষ বৈজ্ঞানিক ও ঘরোয়া পদ্ধতি আছে যা সবার জানা আবশ্যিক...',
    content: `
      মধুর উপকারিতা অতুলনীয়। এটি কেবল একটি মিষ্টি খাবার নয়, বরং এটি একটি মহাঔষধ। প্রাচীনকাল থেকেই মধু বিভিন্ন রোগ নিরাময়ে ব্যবহৃত হয়ে আসছে। 
      
      খাঁটি মধু চেনার উপায়:
      ১. পানিতে পরীক্ষা: এক গ্লাস পানিতে এক চামচ মধু নিন। খাঁটি মধু সহজে পানির সাথে মিশে যাবে না, এটি গ্লাসের নিচে থিতিয়ে পড়বে।
      ২. আগুনের পরীক্ষা: মধুর একটি তুলার সলতে ভিজিয়ে তাতে আগুন ধরিয়ে দিন। যদি আগুন ঠিকমতো জ্বলে, তবে বুঝবেন মধু খাঁটি।
      ৩. কাপড়ের পরীক্ষা: সাদা কাপড়ে এক ফোঁটা মধু দিন। যদি কাপড় ভিজে না যায় এবং মধু গড়িয়ে পড়ে, তবে তা খাঁটি মধু।
    `,
    date: '২০ এপ্রিল, ২০২৬',
    author: 'রকিবুল হাসান',
    image: 'https://picsum.photos/seed/honey-blog/1200/800',
    category: 'স্বাস্থ্যের কথা',
    readTime: '৫ মিনিট'
  },
  {
    id: '2',
    title: 'সরিষার তেলের কিছু অবিশ্বাস্য গুণাগুণ',
    excerpt: 'রান্নায় স্বাদ বাড়ানো ছাড়াও সরিষার তেল আমাদের ত্বকের যত্নে এবং বিভিন্ন রোগ নিরাময়ে কতটুকু কার্যকর জানলে অবাক হবেন। ত্বক ও চুলের যত্নে এটি যুগ যুগ ধরে ব্যবহৃত হয়ে আসছে...',
    content: `
      খাঁটি কাঠের ঘানি ভাঙা সরিষার তেল স্বাস্থ্যের জন্য খুবই উপকারী। এতে রয়েছে ওমেগা-৩ এবং ওমেগা-৬ ফ্যাটি এসিড যা হার্ট ভালো রাখতে সাহায্য করে। 
      
      সরিষার তেলের উপকারিতা:
      - ত্বককে উজ্জ্বল করতে সাহায্য করে।
      - চুলের গোড়া মজবুত করে এবং খুশকি দূর করে।
      - ঠাণ্ডা ও কাশি নিরাময়ে মালিশ হিসেবে দারুণ কাজ করে।
    `,
    date: '১৮ এপ্রিল, ২০২৬',
    author: 'সায়েম আহমেদ',
    image: 'https://picsum.photos/seed/oil-blog/800/500',
    category: 'রান্না ঘর',
    readTime: '৪ মিনিট'
  },
  {
    id: '3',
    title: 'বাদাম কেন আমাদের প্রতিদিনের খাদ্য তালিকায় থাকা জরুরী?',
    excerpt: 'হৃদপিণ্ড সুস্থ রাখতে এবং ব্রেইন পাওয়ার বৃদ্ধিতে বাদামের ভূমিকা অপরিসীম। জেনে নিন কোন বাদাম সবথেকে বেশি পুষ্টিকর এবং খাওয়ার সঠিক সময় কোনটি...',
    content: `
      বাদাম একটি সুপার ফুড। এতে রয়েছে প্রচুর পরিমাণে প্রোটিন, ভিটামিন এবং ফাইবার। নিয়মিত এক মুঠো বাদাম খেলে তা দীর্ঘমেয়াদী রোগের ঝুঁকি কমায়।
      
      কোন বাদামের কী গুণ:
      - কাঠবাদাম: ব্রেইন পাওয়ার বাড়াতে এবং হাড় মজবুত করতে।
      - কাজুবাদাম: এনার্জি বুস্টার হিসেবে এবং চোখের স্বাস্থ্য রক্ষায়।
      - পেস্তা বাদাম: রক্তশূন্যতা দূর করতে এবং ইমিউনিটি বাড়াতে।
    `,
    date: '১৫ এপ্রিল, ২০২৬',
    author: 'ডা. সুমাইয়া ইসলাম',
    image: 'https://picsum.photos/seed/nuts-blog/800/500',
    category: 'জীবন ধারা',
    readTime: '৬ মিনিট'
  },
  {
    id: '4',
    title: 'গাওয়া ঘিয়ের স্বাস্থ্য উপকারিতা: কেন এটি অমৃত?',
    excerpt: 'আয়ুর্বেদশাস্ত্রে ঘিয়েকে মনে করা হয় সঞ্জীবনী শক্তি। খাঁটি গাওয়া ঘি পরিমিত পরিমাণে খেলে তা আমাদের হার্ট এবং পচনতন্ত্রের জন্য দারুণ কাজ করে...',
    content: `
      গাওয়া ঘি কেবল রান্নার স্বাদ বাড়ায় না, এটি শরীরের অভ্যন্তরীণ অনেক জটিলতা দূর করে। বিশেষ করে কড়া পাকের গাওয়া ঘি স্মৃতিশক্তি বৃদ্ধিতে এবং চোখের জ্যোতি বাড়াতে সাহায্য করে।
      
      ঘি খাওয়ার সেরা সময়: সকালে খালি পেটে এক চামচ হালকা গরম পানিতে ঘি মিশিয়ে খেলে তা লিভার পরিষ্কার রাখতে সাহায্য করে।
    `,
    date: '১০ এপ্রিল, ২০২৬',
    author: 'রকিবুল হাসান',
    image: 'https://picsum.photos/seed/ghee-blog/800/500',
    category: 'স্বাস্থ্যের কথা',
    readTime: '৩ মিনিট'
  },
  {
    id: '5',
    title: 'শীতকালে ত্বকের যত্নে প্রাকৃতিক উপাদানের ব্যবহার',
    excerpt: 'শীতের শুষ্কতা থেকে বাঁচতে বাজারজাত লোশন নয়, বরং আপনার ঘরে থাকা নারিকেল তেল, গ্লিসারিন ও লেবুর রস হতে পারে জাদুকরী সমাধান...',
    content: `
      শীতকালে ত্বকের স্বাভাবিক আর্দ্রতা হারিয়ে যায়। তাই কেমিক্যালযুক্ত প্রসাধনী ব্যবহার না করে প্রাকৃতিক ময়েশ্চারাইজার ব্যবহার করা উত্তম। নারিকেল তেল এবং তিলের তেল ত্বকের গভীরে গিয়ে আর্দ্রতা ধরে রাখে।
    `,
    date: '০৫ এপ্রিল, ২০২৬',
    author: 'সায়েম আহমেদ',
    image: 'https://picsum.photos/seed/skin-blog/800/500',
    category: 'জীবন ধারা',
    readTime: '৪ মিনিট'
  }
];

export const blogCategories = [
  { name: 'স্বাস্থ্যের কথা', count: 12 },
  { name: 'রান্না ঘর', count: 8 },
  { name: 'জীবন ধারা', count: 15 },
  { name: 'খাদ্য ও পুষ্টি', count: 10 },
  { name: 'কৃষি সংবাদ', count: 5 }
];
