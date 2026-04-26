import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import PageSEO from '@/lib/models/PageSEO';
import Product from '@/lib/models/Product';
import Banner from '@/lib/models/Banner';
import Blog from '@/lib/models/Blog';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Fetch all SEO configurations
    const seoConfigs = await PageSEO.find({});

    // Fetch products for image alt tag analysis
    const products = await Product.find({});
    const banners = await Banner.find({});
    const blogs = await Blog.find({});

    // Calculate SEO scores and issues
    const report = {
      overallScore: 0,
      totalPages: seoConfigs.length,
      pagesAnalyzed: seoConfigs.filter((s: any) => s.isActive).length,
      issues: [] as any[],
      recommendations: [] as string[],
      pageAnalysis: [] as any[],
      imageAnalysis: {
        totalImages: 0,
        imagesWithAlt: 0,
        imagesWithoutAlt: 0,
        altTagPercentage: 0
      }
    };

    // Analyze each page
    let totalScore = 0;
    seoConfigs.forEach((seo: any) => {
      if (!seo.isActive) return;

      const pageScore = calculatePageScore(seo);
      totalScore += pageScore.score;

      const pageIssues = [];
      const pageRecommendations = [];

      // Check title length
      if (!seo.metaTitle) {
        pageIssues.push('Missing meta title');
        pageRecommendations.push('Add a meta title (recommended: 50-60 characters)');
      } else if (seo.metaTitle.length < 30) {
        pageIssues.push('Meta title too short');
        pageRecommendations.push('Increase meta title length to 50-60 characters');
      } else if (seo.metaTitle.length > 60) {
        pageIssues.push('Meta title too long');
        pageRecommendations.push('Reduce meta title length to 50-60 characters');
      }

      // Check description length
      if (!seo.metaDescription) {
        pageIssues.push('Missing meta description');
        pageRecommendations.push('Add a meta description (recommended: 150-160 characters)');
      } else if (seo.metaDescription.length < 120) {
        pageIssues.push('Meta description too short');
        pageRecommendations.push('Increase meta description length to 150-160 characters');
      } else if (seo.metaDescription.length > 160) {
        pageIssues.push('Meta description too long');
        pageRecommendations.push('Reduce meta description length to 150-160 characters');
      }

      // Check keywords
      if (!seo.metaKeywords || seo.metaKeywords.length === 0) {
        pageIssues.push('Missing meta keywords');
        pageRecommendations.push('Add relevant meta keywords');
      }

      // Check Open Graph tags
      if (!seo.ogTitle) {
        pageIssues.push('Missing Open Graph title');
        pageRecommendations.push('Add Open Graph title for better social media sharing');
      }
      if (!seo.ogDescription) {
        pageIssues.push('Missing Open Graph description');
        pageRecommendations.push('Add Open Graph description for better social media sharing');
      }
      if (!seo.ogImage) {
        pageIssues.push('Missing Open Graph image');
        pageRecommendations.push('Add Open Graph image for better social media sharing');
      }

      // Check canonical URL
      if (!seo.canonicalUrl) {
        pageIssues.push('Missing canonical URL');
        pageRecommendations.push('Add canonical URL to prevent duplicate content issues');
      }

      // Check structured data
      if (!seo.structuredData || Object.keys(seo.structuredData).length === 0) {
        pageIssues.push('Missing structured data (JSON-LD)');
        pageRecommendations.push('Add structured data for rich snippets in search results');
      }

      report.pageAnalysis.push({
        pagePath: seo.pagePath,
        pageName: seo.pageName,
        score: pageScore.score,
        status: pageScore.status,
        issues: pageIssues,
        recommendations: pageRecommendations
      });

      report.issues.push(...pageIssues.map(issue => ({ page: seo.pageName, issue })));
      report.recommendations.push(...pageRecommendations);
    });

    // Calculate overall score
    report.overallScore = report.pagesAnalyzed > 0 ? Math.round(totalScore / report.pagesAnalyzed) : 0;

    // Analyze image alt tags
    let totalImages = 0;
    let imagesWithAlt = 0;

    products.forEach((product: any) => {
      totalImages += product.images?.length || 0;
      if (product.imageAlt) imagesWithAlt++;
      if (product.imageAlts) {
        imagesWithAlt += product.imageAlts.filter((alt: string) => alt && alt.length > 0).length;
      }
    });

    banners.forEach((banner: any) => {
      totalImages += 1;
      if (banner.imageAlt) imagesWithAlt++;
      if (banner.mobileImage) {
        totalImages += 1;
        if (banner.mobileImageAlt) imagesWithAlt++;
      }
    });

    blogs.forEach((blog: any) => {
      if (blog.featuredImage) {
        totalImages += 1;
        if (blog.featuredImageAlt) imagesWithAlt++;
      }
    });

    report.imageAnalysis = {
      totalImages,
      imagesWithAlt,
      imagesWithoutAlt: totalImages - imagesWithAlt,
      altTagPercentage: totalImages > 0 ? Math.round((imagesWithAlt / totalImages) * 100) : 0
    };

    // Add image-related recommendations
    if (report.imageAnalysis.altTagPercentage < 80) {
      report.recommendations.push(`Improve image alt tags: Currently ${report.imageAnalysis.altTagPercentage}% of images have alt text. Aim for 100%.`);
    }

    // Remove duplicate recommendations
    report.recommendations = [...new Set(report.recommendations)];

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating SEO report:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO report' },
      { status: 500 }
    );
  }
}

function calculatePageScore(seo: any) {
  let score = 100;
  const issues = [];

  if (!seo.metaTitle) {
    score -= 20;
    issues.push('No meta title');
  } else if (seo.metaTitle.length < 30 || seo.metaTitle.length > 60) {
    score -= 10;
    issues.push('Meta title length issue');
  }

  if (!seo.metaDescription) {
    score -= 20;
    issues.push('No meta description');
  } else if (seo.metaDescription.length < 120 || seo.metaDescription.length > 160) {
    score -= 10;
    issues.push('Meta description length issue');
  }

  if (!seo.metaKeywords || seo.metaKeywords.length === 0) {
    score -= 10;
    issues.push('No meta keywords');
  }

  if (!seo.ogTitle || !seo.ogDescription || !seo.ogImage) {
    score -= 15;
    issues.push('Missing Open Graph tags');
  }

  if (!seo.canonicalUrl) {
    score -= 10;
    issues.push('No canonical URL');
  }

  if (!seo.structuredData || Object.keys(seo.structuredData).length === 0) {
    score -= 15;
    issues.push('No structured data');
  }

  let status = 'excellent';
  if (score < 50) status = 'poor';
  else if (score < 70) status = 'fair';
  else if (score < 90) status = 'good';

  return { score, status, issues };
}
