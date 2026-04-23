# Next.js Deployment Guide for zhostbd.com

## প্রয়োজনীয় হোস্টিং রিকোয়ারমেন্ট

zhostbd.com থেকে নিচের ফিচারগুলো সহ হোস্টিং নিন:
- ✅ Node.js v18+ সাপোর্ট
- ✅ MongoDB সাপোর্ট (অথবা MongoDB Atlas ব্যবহার করতে পারবেন)
- ✅ SSH Access
- ✅ Nginx বা Apache রিভার্স প্রক্সি
- ✅ PM2 বা অনুরূপ প্রসেস ম্যানেজার
- ✅ SSL Certificate (HTTPS)

## স্টেপ ১: লোকাল প্রোজেক্ট বিল্ড করা

### 1.1 এনভায়রনমেন্ট ভেরিয়েবল সেটআপ

`.env` ফাইল তৈরি করুন:
```env
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="https://your-domain.com"
MONGODB_URI="mongodb+srv://mkrabbanicse_db_user:nobinislam420%40%23%24@cluster0.g2korqj.mongodb.net/nextgenfarming?retryWrites=true&w=majority&appName=Cluster0"
```

### 1.2 প্রোজেক্ট বিল্ড

```bash
npm install
npm run build
```

বিল্ড সফল হলে `.next` ফোল্ডার তৈরি হবে।

## স্টেপ ২: ফাইল আপলোড করা

### 2.1 ফাইলগুলো প্রস্তুত করা

আপলোডের জন্য নিচের ফাইল ও ফোল্ডারগুলো প্রয়োজন:
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `next.config.ts`
- ✅ `tsconfig.json`
- ✅ `.next/` (বিল্ড ফোল্ডার)
- ✅ `public/` (স্ট্যাটিক ফাইল)
- ✅ `app/` (অ্যাপ ফোল্ডার)
- ✅ `components/` (কম্পোনেন্ট)
- ✅ `lib/` (লাইব্রেরি)
- ✅ `.env` (এনভায়রনমেন্ট ফাইল)

যেগুলো আপলোড করবেন না:
- ❌ `node_modules/`
- ❌ `.git/`
- ❌ `scripts/` (seed ফাইলগুলো)

### 2.2 আপলোড পদ্ধতি

**অপশন A: FTP/SFTP দিয়ে আপলোড**
1. FileZilla বা WinSCP দিয়ে সার্ভারে কানেক্ট করুন
2. `public_html` বা হোস্টিং রুট ফোল্ডারে ফাইলগুলো আপলোড করুন

**অপশন B: Git দিয়ে আপলোড**
```bash
git clone your-repo-url
cd your-project-folder
npm install --production
npm run build
```

## স্টেপ ৩: সার্ভারে সেটআপ

### 3.1 SSH দিয়ে সার্ভারে কানেক্ট করুন

```bash
ssh username@your-server-ip
```

### 3.2 Node.js ভার্সন চেক করুন

```bash
node --version  # v18 বা উচ্চতর হতে হবে
npm --version
```

### 3.3 প্রোজেক্ট ফোল্ডারে যান

```bash
cd /path/to/your/project
```

### 3.4 ডিপেনডেন্সি ইনস্টল করুন

```bash
npm install --production
```

### 3.5 PM2 ইনস্টল করুন (যদি না থাকে)

```bash
npm install -g pm2
```

### 3.6 PM2 দিয়ে অ্যাপ চালু করুন

```bash
pm2 start npm --name "nextgenfarming" -- start
pm2 save
pm2 startup
```

## স্টেপ ৪: Nginx কনফিগারেশন

### 4.1 Nginx কনফিগ ফাইল তৈরি করুন

```bash
sudo nano /etc/nginx/sites-available/nextgenfarming
```

### 4.2 কনফিগারেশন যোগ করুন

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    location /static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4.3 সাইট এনেবল করুন

```bash
sudo ln -s /etc/nginx/sites-available/nextgenfarming /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## স্টেপ ৫: SSL সার্টিফিকেট সেটআপ (HTTPS)

### 5.1 Certbot ইনস্টল করুন

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 5.2 SSL সার্টিফিকেট পান

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 5.3 Auto-renewal সেটআপ করুন

```bash
sudo certbot renew --dry-run
```

## স্টেপ ৬: MongoDB সেটআপ (যদি লোকাল MongoDB ব্যবহার করেন)

আপনি যদি MongoDB Atlas ব্যবহার করেন তবে এই স্টেপ প্রয়োজন নেই।

### 6.1 MongoDB ইনস্টল করুন

```bash
sudo apt install -y mongodb
```

### 6.2 MongoDB চালু করুন

```bash
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## স্টেপ ৭: ফায়ারওয়াল কনফিগারেশন

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## স্টেপ ৮: টেস্ট করুন

1. ব্রাউজারে আপনার ডোমেইন খুলুন: `https://your-domain.com`
2. সব পেজ চেক করুন
3. API এন্ডপয়েন্ট টেস্ট করুন
4. অ্যাডমিন প্যানেল টেস্ট করুন

## স্টেপ ৯: মনিটরিং

### PM2 মনিটরিং

```bash
pm2 monit
pm2 logs nextgenfarming
```

### লগ চেক

```bash
pm2 logs nextgenfarming --lines 100
```

## ট্রাবলশুটিং

### সমস্যা: পোর্ট 3000 ব্যস্ত
```bash
pm2 stop all
pm2 delete all
pm2 start npm --name "nextgenfarming" -- start
```

### সমস্যা: Nginx এরর
```bash
sudo nginx -t
sudo systemctl status nginx
```

### সমস্যা: MongoDB কানেকশন
- `.env` ফাইলে MONGODB_URI চেক করুন
- MongoDB Atlas IP whitelist চেক করুন

## বিকল্প ডিপ্লয়মেন্ট অপশন

যদি zhostbd.com এ Node.js সাপোর্ট না থাকে, তবে:

### অপশন ১: Vercel (সবচেয়ে সহজ)
1. Vercel.com এ অ্যাকাউন্ট তৈরি করুন
2. GitHub এ প্রোজেক্ট পুশ করুন
3. Vercel এ ইম্পোর্ট করুন
4. ডোমেইন যোগ করুন
5. DNS সেটআপ করুন

### অপশন ২: Railway / Render
1. Railway.app বা Render.com এ অ্যাকাউন্ট তৈরি করুন
2. GitHub রেপো কানেক্ট করুন
3. Environment variables সেট করুন
4. ডিপ্লয় করুন
5. কাস্টম ডোমেইন যোগ করুন

## গুরুত্বপূর্ণ নোট

- সবসময় `.env` ফাইলের নিরাপত্তা নিশ্চিত করুন
- ডাটাবেস ব্যাকআপ নিয়মিত নিন
- SSL সার্টিফিকেট রিনিউ হয়েছে কিনা চেক করুন
- PM2 logs রেগুলারলি মনিটর করুন
- নিরাপত্তার জন্য ফায়ারওয়াল ব্যবহার করুন
