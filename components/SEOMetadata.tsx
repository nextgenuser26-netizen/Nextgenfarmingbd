'use client';

import { useEffect } from 'react';

interface SEOMetadataProps {
  seoData: any;
}

export default function SEOMetadata({ seoData }: SEOMetadataProps) {
  useEffect(() => {
    if (!seoData) return;

    // Set document title
    if (seoData.metaTitle) {
      document.title = seoData.metaTitle;
    }

    // Update or create meta description
    updateMetaTag('name', 'description', seoData.metaDescription);
    
    // Update or create meta keywords
    if (seoData.metaKeywords) {
      updateMetaTag('name', 'keywords', seoData.metaKeywords);
    }

    // Update robots
    if (seoData.robots) {
      updateMetaTag('name', 'robots', seoData.robots);
    }

    // Update canonical URL
    if (seoData.canonicalUrl) {
      updateLinkTag('canonical', seoData.canonicalUrl);
    }

    // Update Open Graph tags
    const ogTitle = seoData.ogTitle || seoData.metaTitle;
    const ogDescription = seoData.ogDescription || seoData.metaDescription;
    
    if (ogTitle) {
      updateMetaTag('property', 'og:title', ogTitle);
    }
    if (ogDescription) {
      updateMetaTag('property', 'og:description', ogDescription);
    }
    if (seoData.ogImage) {
      updateMetaTag('property', 'og:image', seoData.ogImage);
    }

    // Update Twitter Card tags
    if (seoData.twitterCard) {
      updateMetaTag('name', 'twitter:card', seoData.twitterCard);
    }
    if (ogTitle) {
      updateMetaTag('name', 'twitter:title', ogTitle);
    }
    if (ogDescription) {
      updateMetaTag('name', 'twitter:description', ogDescription);
    }
    if (seoData.ogImage) {
      updateMetaTag('name', 'twitter:image', seoData.ogImage);
    }

    // Add structured data
    if (seoData.structuredData) {
      addStructuredData(seoData.structuredData);
    }

    // Add custom head tags
    if (seoData.customHeadTags) {
      addCustomHeadTags(seoData.customHeadTags);
    }
  }, [seoData]);

  return null;
}

function updateMetaTag(attribute: string, key: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function addStructuredData(jsonString: string) {
  // Remove existing structured data script if any
  const existingScript = document.getElementById('structured-data');
  if (existingScript) {
    existingScript.remove();
  }

  try {
    const data = JSON.parse(jsonString);
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error parsing structured data:', error);
  }
}

function addCustomHeadTags(htmlString: string) {
  // Remove existing custom head tags if any
  const existingContainer = document.getElementById('custom-head-tags');
  if (existingContainer) {
    existingContainer.remove();
  }

  const container = document.createElement('div');
  container.id = 'custom-head-tags';
  container.innerHTML = htmlString;
  
  // Move all children to head
  while (container.firstChild) {
    document.head.appendChild(container.firstChild);
  }
}
