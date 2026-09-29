import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title = "Andrew's Taxi - Reliable Taxi Service in Lebanon | 24/7 Airport Transfers & City Rides",
  description = "Professional taxi service in Beirut, Lebanon. Book reliable airport transfers, city rides, and 24/7 transportation. Fixed pricing, clean vehicles, experienced drivers. Call +961 3 301 019.",
  image = "https://www.andrewstaxi.com/featured.jpeg",
  url = "https://www.andrewstaxi.com"
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:url': url,
      'og:type': 'website',
      'og:site_name': "Andrew's Taxi Lebanon"
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Update Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Add JSON-LD structured data for LocalBusiness
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "name": "Andrew's Taxi",
      "description": "Professional taxi and transportation service in Beirut, Lebanon offering 24/7 airport transfers, city rides, and reliable transportation with fixed transparent pricing.",
      "url": "https://www.andrewstaxi.com",
      "logo": "https://www.andrewstaxi.com/logo.png",
      "image": "https://www.andrewstaxi.com/featured.jpeg",
      "telephone": "+9613301019",
      "email": "andrewstaxilb@gmail.com",
      "priceRange": "$$",
      "openingHours": "Mo-Su 00:00-23:59",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Beirut",
        "addressCountry": "LB"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Beirut"
        },
        {
          "@type": "City",
          "name": "Jounieh"
        },
        {
          "@type": "City",
          "name": "Byblos"
        }
      ],
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "33.8938",
        "longitude": "35.5018"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "50"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Taxi Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Airport Transfers",
              "description": "Reliable pickups and drop-offs at Beirut-Rafic Hariri International Airport with flight tracking"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "City Rides",
              "description": "Comfortable transportation anywhere in Lebanon for daily commutes, shopping, and personal trips"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Professional Service",
              "description": "Experienced drivers for business meetings, full-day bookings, and special events"
            }
          }
        ]
      },
      "sameAs": [
        "https://www.facebook.com/andrwesTaxi/",
        "https://www.instagram.com/andrewtaxi6/"
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

  }, [title, description, image, url]);

  return null;
};
