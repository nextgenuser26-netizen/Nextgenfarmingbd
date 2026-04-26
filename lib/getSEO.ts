import mongoose from 'mongoose';
import PageSEO from '@/lib/models/PageSEO';

export async function getSEOForPage(pagePath: string) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const seoData = await PageSEO.findOne({ 
      pagePath, 
      status: 'active' 
    });
    
    return seoData;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return null;
  }
}

export function generateMetadataFromSEO(seoData: any) {
  if (!seoData) {
    return {};
  }

  const metadata: any = {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    keywords: seoData.metaKeywords,
  };

  // Open Graph
  if (seoData.ogTitle || seoData.metaTitle) {
    metadata.openGraph = {
      title: seoData.ogTitle || seoData.metaTitle,
      description: seoData.ogDescription || seoData.metaDescription,
      images: seoData.ogImage ? [{ url: seoData.ogImage }] : [],
    };
  }

  // Twitter Card
  if (seoData.twitterCard) {
    metadata.twitter = {
      card: seoData.twitterCard,
      title: seoData.ogTitle || seoData.metaTitle,
      description: seoData.ogDescription || seoData.metaDescription,
      images: seoData.ogImage ? [seoData.ogImage] : [],
    };
  }

  // Robots
  if (seoData.robots) {
    metadata.robots = {
      index: seoData.robots.includes('index'),
      follow: seoData.robots.includes('follow'),
    };
  }

  // Canonical URL
  if (seoData.canonicalUrl) {
    metadata.alternates = {
      canonical: seoData.canonicalUrl,
    };
  }

  return metadata;
}
