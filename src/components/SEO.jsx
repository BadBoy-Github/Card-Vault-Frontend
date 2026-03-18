import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SEO Component - Dynamic SEO Meta Tags Manager
 * Optimized for: card vault, card-vault, card vaults, card-vaults
 *
 * Usage:
 * <SEO
 *   title="Page Title"
 *   description="Page description"
 *   keywords="keyword1, keyword2, keyword3"
 *   image="/image.jpg"
 *   type="website"
 *   schema="Product"
 *   schemaData={productSchemaData}
 * />
 */

const DEFAULT_SEO = {
  title: "Card Vault | Buy Digital Gift Cards Online - Instant Delivery",
  description:
    "Card Vault (card-vault, card vaults, card-vaults) - Your #1 destination for digital gift cards in India. Buy gaming, entertainment & shopping gift cards online with instant email delivery. Secure payments via UPI, Cards & More. 100+ brands available at Card Vault.",
  keywords:
    "card vault, card-vault, card vaults, card-vaults, gift cards, digital gift cards, buy gift card online, gaming gift cards, prepaid cards, online gift cards, digital vouchers, instant gift card delivery, steam gift card, playstation gift card, xbox gift card, itunes gift card, google play gift card, amazon gift card, shopping gift cards, gift card India",
  image: "/logo.webp",
  url: "https://card-vaults.vercel.app",
  siteName: "Card Vault",
  type: "website",
  twitterCard: "summary_large_image",
  twitterSite: "@cardvault",
};

// Helper function to update or create meta tags
const updateMetaTag = (name, content) => {
  // Handle both meta names and Open Graph/Twitter names
  let element;
  const isOgOrTwitter = name.includes("og:") || name.includes("twitter:");

  if (isOgOrTwitter) {
    element = document.querySelector(`meta[property="${name}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("property", name);
      document.head.appendChild(element);
    }
  } else {
    // For standard meta tags (description, keywords, etc.)
    element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
  }
  element.content = content;
};

// Helper function to update schema.org data
const updateSchema = (schemaType, data) => {
  // Remove existing schema (keep organization and faq schemas)
  const existingSchemas = document.querySelectorAll(
    'script[type="application/ld+json"]',
  );
  existingSchemas.forEach((script) => {
    if (
      !script.id ||
      (script.id !== "organization-schema" && script.id !== "faq-schema")
    ) {
      script.remove();
    }
  });

  if (!schemaType || !data) return;

  const schemaScript = document.createElement("script");
  schemaScript.type = "application/ld+json";

  let schemaObject;

  switch (schemaType) {
    case "Product":
      schemaObject = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: data.name,
        description: data.description,
        image: data.image,
        offers: {
          "@type": "Offer",
          priceCurrency: data.currency || "INR",
          price: data.price,
          availability: data.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
        brand: {
          "@type": "Brand",
          name: data.brand,
        },
        seller: {
          "@type": "Organization",
          name: "Card Vault",
        },
      };
      break;
    case "BreadcrumbList":
      schemaObject = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };
      break;
    case "Article":
      schemaObject = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          "@type": "Organization",
          name: "Card Vault",
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified,
      };
      break;
    default:
      schemaObject = data;
  }

  schemaScript.textContent = JSON.stringify(schemaObject);
  document.head.appendChild(schemaScript);
};

// Add organization schema (always on homepage)
const addOrganizationSchema = (baseUrl) => {
  if (document.getElementById("organization-schema")) return;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Card Vault",
    alternateName: ["card-vault", "card vaults", "card-vaults"],
    url: baseUrl,
    logo: `${baseUrl}/logo.webp`,
    description: DEFAULT_SEO.description,
    sameAs: [
      "https://twitter.com/cardvault",
      "https://instagram.com/cardvault",
      "https://facebook.com/cardvault",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "organization-schema";
  script.textContent = JSON.stringify(orgSchema);
  document.head.appendChild(script);
};

export default function SEO({
  title,
  description,
  keywords,
  image,
  type = "website",
  schema,
  schemaData,
  noIndex = false,
}) {
  const location = useLocation();
  const baseUrl = DEFAULT_SEO.url;

  // Build complete SEO data with target keywords
  const seo = {
    title: title ? `${title} | Card Vault` : DEFAULT_SEO.title,
    description: description || DEFAULT_SEO.description,
    keywords: keywords
      ? `${keywords}, ${DEFAULT_SEO.keywords}`
      : DEFAULT_SEO.keywords,
    image: image
      ? image.startsWith("http")
        ? image
        : `${baseUrl}${image}`
      : `${baseUrl}${DEFAULT_SEO.image}`,
    url: `${baseUrl}${location.pathname}`,
    canonicalUrl: `${baseUrl}${location.pathname}`,
  };

  useEffect(() => {
    // Update Document Title
    document.title = seo.title;

    // Update Meta Tags
    updateMetaTag("description", seo.description);
    updateMetaTag("keywords", seo.keywords);
    updateMetaTag("author", "Card Vault");
    updateMetaTag("robots", noIndex ? "noindex, nofollow" : "index, follow");
    updateMetaTag("googlebot", noIndex ? "noindex, nofollow" : "index, follow");

    // Update Open Graph
    updateMetaTag("og:title", seo.title);
    updateMetaTag("og:description", seo.description);
    updateMetaTag("og:image", seo.image);
    updateMetaTag("og:url", seo.url);
    updateMetaTag("og:type", type);
    updateMetaTag("og:site_name", DEFAULT_SEO.siteName);
    updateMetaTag("og:locale", "en_US");

    // Update Twitter Card
    updateMetaTag("twitter:card", DEFAULT_SEO.twitterCard);
    updateMetaTag("twitter:title", seo.title);
    updateMetaTag("twitter:description", seo.description);
    updateMetaTag("twitter:image", seo.image);
    updateMetaTag("twitter:url", seo.url);
    updateMetaTag("twitter:site", DEFAULT_SEO.twitterSite);

    // Update Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = seo.canonicalUrl;

    // Update Schema.org JSON-LD
    updateSchema(schema, schemaData);

    // Update JSON-LD for Organization (always present on homepage)
    if (location.pathname === "/") {
      addOrganizationSchema(baseUrl);
    }
  }, [
    title,
    description,
    keywords,
    image,
    type,
    schema,
    schemaData,
    noIndex,
    location.pathname,
  ]);

  return null;
}

// Export schema generators
export const generateProductSchema = (product) => ({
  "@context": "https://schema.org/",
  "@type": "Product",
  name: product.name,
  description:
    product.description || `Buy ${product.name} gift card on Card Vault`,
  image: product.image,
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    price: product.price,
    availability:
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
  },
  brand: {
    "@type": "Brand",
    name: product.brand || product.category,
  },
  aggregateRating: product.rating
    ? {
        "@type": "AggregateRating",
        ratingValue: product.rating.value,
        reviewCount: product.rating.count,
      }
    : undefined,
});

export const generateBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// Generate localized breadcrumb schema with proper card vault keywords
export const generateCardVaultBreadcrumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name.replace("Card Vault", "Card Vault"),
    item: item.url,
  })),
});
