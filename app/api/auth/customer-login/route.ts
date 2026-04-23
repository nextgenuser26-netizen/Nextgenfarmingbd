import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function POST(request: NextRequest) {
  console.log('[customer-login] API called');
  let normalizedPhone = '';
  let phone = '';

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[customer-login] MongoDB connected');

    const body = await request.json();
    const { name } = body;
    phone = body.phone || '';

    if (!phone) {
      console.log('[customer-login] Missing phone, returning 400');
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Normalize phone number (remove spaces, dashes, parentheses)
    normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Remove country code if present (e.g., +88017 -> 017, 88017 -> 017)
    if (normalizedPhone.startsWith('+880')) {
      normalizedPhone = '0' + normalizedPhone.substring(4);
    } else if (normalizedPhone.startsWith('880') && normalizedPhone.length === 13) {
      normalizedPhone = '0' + normalizedPhone.substring(3);
    }
    
    // Search across all phone formats in a single query
    const searchConditions: any[] = [{ phone: normalizedPhone }];
    if (phone !== normalizedPhone) searchConditions.push({ phone: phone });
    if (normalizedPhone.startsWith('0')) {
      searchConditions.push({ phone: '+880' + normalizedPhone.substring(1) });
      searchConditions.push({ phone: '880' + normalizedPhone.substring(1) });
      searchConditions.push({ phone: normalizedPhone.substring(1) });
    }

    console.log('[customer-login] Searching with $or conditions:', searchConditions.map(c => c.phone));
    let user = await User.findOne({ $or: searchConditions });
    console.log('[customer-login] findOne result:', user ? user.phone : 'null');

    if (!user) {
      if (!name) {
        console.log('[customer-login] Name required for new user, returning 400');
        return NextResponse.json({ error: 'Name is required for new users' }, { status: 400 });
      }

      // Create new user
      console.log('[customer-login] No user found. Creating new user with phone:', normalizedPhone);
      user = new User({
        name,
        phone: normalizedPhone,
        role: 'user',
        isActive: true,
      });

      await user.save();
      console.log('[customer-login] User saved successfully:', user._id.toString());
    }
    
    // Return user data without sensitive information
    const userData = {
      id: user._id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };

    console.log('[customer-login] Returning success response:', userData);
    return NextResponse.json(userData);
  } catch (error: any) {
    // Log everything for debugging
    console.error('Customer login error:', {
      code: error.code,
      name: error.name,
      message: error.message,
      keyValue: error.keyValue,
      keyPattern: error.keyPattern,
      normalizedPhone,
      rawPhone: phone,
    });

    // Handle duplicate key error — treat as "find existing user" regardless of which field
    // triggered it, because the phone unique index is what we care about.
    if (error.code === 11000) {
      // Exhaustive search across every format we support
      const searchQueries: any[] = [
        { phone: normalizedPhone },
        { phone: phone },
        { phone: normalizedPhone.replace(/^0/, '+880') },
        { phone: normalizedPhone.replace(/^0/, '880') },
        { phone: normalizedPhone.replace(/^0/, '') },
        { phone: '88' + normalizedPhone },
      ];

      for (const query of searchQueries) {
        const user = await User.findOne(query);
        if (user) {
          const userData = {
            id: user._id.toString(),
            name: user.name,
            phone: user.phone,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          };
          console.log('[customer-login] Found user via format search, returning success');
          return NextResponse.json(userData);
        }
      }

      // Fallback: regex search on last 10 digits to catch records with unexpected spacing
      const last10 = normalizedPhone.slice(-10);
      const regexUser = await User.findOne({ phone: { $regex: last10 } });
      if (regexUser) {
        console.error('[customer-login] Found user via regex fallback:', regexUser.phone);
        const userData = {
          id: regexUser._id.toString(),
          name: regexUser.name,
          phone: regexUser.phone,
          email: regexUser.email,
          avatar: regexUser.avatar,
          role: regexUser.role,
        };
        console.log('[customer-login] Returning success via regex fallback');
        return NextResponse.json(userData);
      }

      // Ultimate fallback: fetch all users and compare after stripping ALL non-digits
      const allUsers = await User.find({}, { phone: 1, name: 1, email: 1, avatar: 1, role: 1 }).lean();
      const cleanInput = normalizedPhone.replace(/\D/g, '');
      const jsMatch = allUsers.find((u: any) => (u.phone || '').replace(/\D/g, '') === cleanInput);
      if (jsMatch) {
        console.error('[customer-login] Found user via JS comparison:', jsMatch.phone);
        const userData = {
          id: jsMatch._id.toString(),
          name: jsMatch.name,
          phone: jsMatch.phone,
          email: jsMatch.email,
          avatar: jsMatch.avatar,
          role: jsMatch.role,
        };
        console.log('[customer-login] Returning success via JS comparison');
        return NextResponse.json(userData);
      }

      // Log every phone in the collection for debugging (dev only, limited fields)
      console.error('[customer-login] All user phones in DB:', allUsers.map((u: any) => u.phone));

      // If we still can't find the user, the duplicate is likely on another field
      const errorResponse = {
        error: 'Account creation failed',
        details: error.message || 'A database constraint was violated. Please contact support.',
        debug: process.env.NODE_ENV === 'development'
          ? { keyValue: error.keyValue, keyPattern: error.keyPattern, message: error.message, normalizedPhone }
          : undefined,
      };
      console.log('[customer-login] Returning 400 error:', errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errorResponse = {
        error: 'Validation failed',
        details: error.message,
      };
      console.log('[customer-login] Returning 400 validation error:', errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse = {
      error: 'Login failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
    console.log('[customer-login] Returning 500 error:', errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
