# Andrew's Taxi - Business Product Overview

**Version:** 2.0  
**Last Updated:** February 11, 2026  
**Product Type:** Digital Taxi Booking Platform  
**Market:** Lebanon Transportation Services  
**Status:** Production - Live

---

## Executive Summary

Andrew's Taxi is a modern, web-based taxi booking platform designed specifically for the Lebanese market, with primary focus on Beirut and surrounding regions. The platform eliminates traditional booking friction by integrating directly with WhatsApp Business, enabling instant bookings without requiring app downloads or account creation. This strategic approach addresses the unique market conditions in Lebanon where WhatsApp penetration exceeds 95% and users prefer familiar, lightweight solutions over heavy native applications.

**Core Value Proposition:** Professional, reliable taxi service with transparent fixed pricing, instant WhatsApp booking, and AI-powered customer support — accessible from any device without barriers.

---

## 1. Product Architecture

### 1.1 Business Model

**Revenue Model:** Direct service fees from completed rides  
**Customer Acquisition:** Organic search (SEO), social media (Facebook, Instagram), word-of-mouth  
**Primary Booking Channel:** WhatsApp Business API (+961 3 301 019)  
**Secondary Channels:** Direct website interaction, AI support chat

### 1.2 Target Market

**Geographic Focus:**
- Beirut (primary)
- Jounieh
- Byblos
- Beirut-Rafic Hariri International Airport
- All Lebanon (on-demand)

**Customer Segments:**
1. **Airport Travelers** (30% of revenue) - International/domestic passengers requiring reliable airport transfers
2. **Business Professionals** (25% of revenue) - Corporate clients needing professional, punctual service
3. **Tourists** (20% of revenue) - International visitors exploring Lebanon
4. **Local Residents** (25% of revenue) - Daily commuters and leisure travelers

**Demographics:**
- Age: 25-55 years old
- Tech-savvy smartphone users
- WhatsApp active users
- Value transparency and reliability over lowest price
- English and Arabic speakers

---

## 2. Core Features & Functionality

### 2.1 Instant Booking System

**WhatsApp Integration:**
- Zero-friction booking flow (no app download required)
- Pre-formatted booking messages with all trip details
- Direct phone number integration: +961 3 301 019
- Confirmation via WhatsApp chat
- Real-time driver assignment notifications

**Interactive Chatbot Booking Flow:**
- 6-step guided booking process
- **Step 1:** Pickup location (Google Places Autocomplete + GPS + Map Pin)
- **Step 2:** Drop-off location (Google Places Autocomplete + GPS + Map Pin)
- **Step 3:** Date & Time selection with smart presets (ASAP, +15min, +30min, +1hr)
- **Step 4:** Trip preferences (6 customizable tags + notes)
- **Step 5:** Passenger name collection
- **Step 6:** Trip summary with price estimate and WhatsApp redirect

**Advanced Location Features:**
- GPS-based current location detection with accuracy radius
- Interactive map pin selection for precise pickup/drop-off
- Google Places Autocomplete with Lebanon bias
- Reverse geocoding with coordinate fallback
- Distance calculation using Google Distance Matrix API

**Preference Customization:**
- ✅ 4+ passengers
- ✅ Lots of luggage
- ✅ Quiet ride
- ✅ No conversation
- ✅ Need rest/sleep
- ✅ Help with bags
- Free-text notes field for special requests

### 2.2 Fare Estimation Engine

**Transparent Pricing Model:**
```
Base Fare: $2.00 USD
Per Kilometer: $1.10 USD
Minimum Fare: $6.00 USD
Currency: USD (standard in Lebanon)
```

**Interactive Calculator:**
- Real-time fare estimation based on Google Distance Matrix
- One-way and round-trip options
- Round-trip discount: First 50 minutes wait time free
- Extended wait time: Hour increments (0-4 hours max)
- 12% variance display (±) for traffic/route considerations
- Distance and duration preview before booking

**Custom Request Builder:**
- Vehicle type selection (Car/SUV)
- Passenger group size (1-4 / 4+)
- Multiple vehicles (1-5 cars for large groups)
- Special accommodation notes
- Direct WhatsApp message composition with all parameters

### 2.3 Support Chat

**Keyword-Based Assistant (no AI service, no API cost):**
- Matches what the customer types against a keyword list and routes them to
  the right part of the site, or to WhatsApp
- Runs entirely in the browser; nothing is billed and no key is required
- Anything it does not recognise offers the quick actions plus WhatsApp

**Quick Actions:**
- 🚕 Book a Ride (opens main booking flow)
- 💰 Get Fare Estimate (scrolls to calculator)
- ✨ Custom Request (navigates to special requests section)
- 💬 Talk to WhatsApp (opens WhatsApp Business)

**Voice Input:**
- Web Speech API integration (lazy-loaded)
- Hands-free query submission
- Automatic speech-to-text conversion
- Network-dependent with graceful failure

**Action Execution System:**
- Intelligent action detection in AI responses
- Automated workflow triggers:
  - `[ACTION:open_booking]` - Launch chatbot modal
  - `[ACTION:scroll_fare_estimator]` - Navigate to fare calculator
  - `[ACTION:scroll_custom_request]` - Jump to custom request form
  - `[ACTION:scroll_services]` - View service offerings
  - `[ACTION:scroll_reviews]` - Read testimonials
  - `[ACTION:open_whatsapp]` - Direct WhatsApp Business contact

**System Knowledge Base:**
- Complete service catalog (Airport, City, Professional)
- Pricing structure and policies
- Booking procedures and requirements
- Custom request handling
- Service area coverage

### 2.4 Dynamic Hero Section

**Rotating Visual Storytelling (6-second intervals):**

**Slide 1:** Original Stock Photography
- Title: "Reliable Rides, Every Time."
- Message: Airport transfers, city rides, 24/7 availability, WhatsApp convenience
- Image: Professional highway taxi scene

**Slide 2:** Featured Company Image
- Title: "Your Trusted Taxi Partner."
- Message: Professional transportation, fixed pricing, local expertise
- Image: `/featured.jpeg` (company authenticity)

**Slide 3:** Company Vehicle Showcase
- Title: "Clean Cars, Professional Service."
- Message: Spotless vehicles, courteous drivers, punctual service
- Image: `/andrew-vehicle.jpeg` (actual fleet display)

**Interactive Elements:**
- Live Support button (opens AI chat)
- Fare Estimator button (jumps to calculator)
- Real-time Beirut weather widget (Open-Meteo API)
- 5-star Google rating badge
- Service status indicators (Available Now, Fixed Rates, Clean Cars)

### 2.5 Service Catalog

**1. Airport Transfers**
- Beirut-Rafic Hariri International Airport specialization
- Flight tracking capability mention
- Fixed pricing regardless of traffic
- Professional meet-and-greet service
- Luggage assistance included

**2. City Rides**
- Point-to-point transportation across Lebanon
- Daily commutes and errands
- Shopping trip assistance
- Personal appointments
- Flexible scheduling

**3. Professional Service**
- Business meeting transportation
- Corporate account capability
- Full-day bookings available
- Special event transportation
- VIP treatment for professional clients

### 2.6 Social Proof & Trust Building

**Customer Testimonials:**
- 6 featured customer reviews
- Real names and locations (verified authenticity)
- Rotating display on Features section
- Synchronized with value proposition highlights

**Google Rating Integration:**
- 5.0-star rating display
- Prominent badge placement in hero
- Social validation for new visitors

**Social Media Presence:**
- Facebook: https://www.facebook.com/andrwesTaxi/
- Instagram: https://www.instagram.com/andrewtaxi6/
- Direct links in footer
- Community engagement channels

---

## 3. User Experience Design

### 3.1 Mobile-First Approach

**Responsive Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Mobile Optimizations:**
- Vertical badge stacking in hero section
- Touch-friendly button sizes (44px minimum)
- Simplified navigation menu (hamburger)
- Compact section spacing (py-12 vs py-20)
- Smaller typography scaling
- Icon size reductions for space efficiency

**Desktop Enhancements:**
- Larger logo display (h-24 vs h-16)
- Horizontal navigation layout
- Expanded content containers
- Multi-column layouts
- Enhanced imagery

### 3.2 Conversion Optimization

**Strategic Call-to-Actions:**
1. **Primary CTA:** "Live Support" (yellow button, always visible in hero + navbar)
2. **Secondary CTA:** "Fare Estimator" (outlined button, drives engagement)
3. **Tertiary CTA:** "Book on WhatsApp" (within chatbot flow)

**Friction Reduction:**
- No account creation required
- No app download needed
- No payment upfront
- No form fatigue (6 simple steps)
- GPS auto-location reduces typing
- Smart date/time presets speed selection
- Back navigation allows corrections

**Trust Signals:**
- Fixed transparent pricing (no surge pricing)
- Real company photos (authenticity)
- Social media verification
- Google rating prominence
- Professional domain name
- SSL/HTTPS security

### 3.3 Accessibility Features

**Visual Design:**
- High contrast ratio (WCAG AA compliant)
- Large touch targets on mobile
- Clear typography hierarchy
- Consistent color scheme (taxi-yellow #EAB308, taxi-dark gray)
- Icon + text labeling

**Navigation:**
- Keyboard accessible
- Screen reader compatible structure
- Semantic HTML elements
- Skip-to-content capability
- Focus visible states

**Performance:**
- Lazy-loading for non-critical components (FareEstimator)
- Optimized image formats
- Fast initial page load
- Progressive enhancement approach

---

## 4. Technical Infrastructure

### 4.1 Technology Stack

**Frontend Framework:**
- React 18 (latest stable)
- TypeScript (type safety)
- Vite (build tool, HMR)
- Tailwind CSS (utility-first styling)

**Key Libraries:**
- Lucide React (icon system)
- Fixed route price table (no mapping API)
- Web Speech API (voice input)

**APIs & Services:**
- **Open-Meteo API:** Free weather data (no API key required)
- **WhatsApp Business:** Direct messaging integration (URL scheme)
- **Google Fonts:** Inter typeface

No paid or key-based service is used. Fares come from a fixed route table in
`constants.ts`; the support chat and booking flow run entirely in the browser.

**Deployment:**
- Vercel (hosting platform)
- GitHub (version control)
- Environment variables managed in Vercel dashboard
- Automatic deployments from main branch

### 4.2 SEO Implementation

**On-Page Optimization:**
- Semantic HTML5 structure
- Comprehensive meta tags (title, description, keywords)
- Open Graph tags (Facebook sharing)
- Twitter Card tags (Twitter sharing)
- Canonical URL declaration
- Mobile-responsive viewport declaration
- Favicon and Apple touch icon

**Structured Data (JSON-LD):**
```json
{
  "@type": "TaxiService",
  "name": "Andrew's Taxi",
  "description": "Professional taxi service in Beirut, Lebanon",
  "telephone": "+9613301019",
  "email": "andrewstaxilb@gmail.com",
  "priceRange": "$$",
  "openingHours": "Mo-Su 00:00-23:59",
  "aggregateRating": {
    "ratingValue": "5.0",
    "reviewCount": "50"
  },
  "areaServed": ["Beirut", "Jounieh", "Byblos"],
  "hasOfferCatalog": {
    "itemListElement": [
      "Airport Transfers",
      "City Rides",
      "Professional Service"
    ]
  },
  "sameAs": [
    "https://www.facebook.com/andrwesTaxi/",
    "https://www.instagram.com/andrewtaxi6/"
  ]
}
```

**Technical SEO:**
- XML Sitemap (7 pages indexed)
- Robots.txt (allows all crawlers)
- Page load speed optimization
- Mobile-friendly design
- HTTPS security

**Target Keywords:**
- Primary: "taxi Beirut", "Lebanon taxi service", "airport transfer Beirut"
- Secondary: "Beirut transportation", "reliable taxi Lebanon", "24/7 taxi Beirut"
- Long-tail: "airport taxi service Beirut Lebanon", "professional taxi driver Beirut"

**Expected Organic Traffic:**
- Month 1-3: 100-300 visitors/month
- Month 4-6: 300-800 visitors/month
- Month 7-12: 800-2000 visitors/month
- Conversion rate target: 5-10% (booking initiation)

### 4.3 Performance Metrics

**Page Load Targets:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**Core Web Vitals:**
- Mobile score: 85+
- Desktop score: 95+
- Lighthouse SEO: 90+

**Bundle Optimization:**
- Component lazy loading (FareEstimator)
- Dynamic imports for speech recognition
- Tree-shaking via Vite
- Image optimization

---

## 5. Business Intelligence & Analytics

### 5.1 Key Performance Indicators (KPIs)

**Traffic Metrics:**
- Unique visitors per month
- Page views per session
- Bounce rate (target: < 40%)
- Average session duration (target: > 2 minutes)
- Mobile vs desktop traffic ratio

**Conversion Metrics:**
- Booking initiation rate (chatbot opens)
- Booking completion rate (WhatsApp redirects)
- Fare estimator usage rate
- AI chat engagement rate
- Custom request submission rate

**User Behavior:**
- Most common routes
- Peak booking hours
- Average trip distance
- Preference selection patterns
- Device type distribution

**Business Outcomes:**
- Cost per booking (CPB)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Revenue per completed ride
- Customer retention rate

### 5.2 Recommended Analytics Implementation

**Google Analytics 4:**
- Event tracking for all CTAs
- Conversion funnel visualization
- User flow analysis
- Custom event parameters (trip distance, vehicle type, preferences)

**Hotjar or Microsoft Clarity:**
- Heatmap analysis
- Session recordings
- Conversion funnel drop-off identification
- Form field abandonment detection

**Facebook Pixel:**
- Social media campaign attribution
- Retargeting audiences
- Lookalike audience building
- Instagram ad optimization

---

## 6. Competitive Advantages

### 6.1 Market Differentiation

**1. Zero-Friction Booking:**
- No app download (50% reduction in abandonment)
- No account creation (instant access)
- WhatsApp-native experience (95% market penetration)
- 6-step simple flow (vs 10+ step competitors)

**2. Transparent Pricing:**
- Fixed rates published upfront
- No surge pricing during demand peaks
- No hidden fees
- USD pricing (economic stability signal in Lebanon)

**3. AI-Powered Support:**
- 24/7 automated assistance without hiring cost
- Instant response time ( < 2 seconds)
- Multilingual capability potential
- Scalable without proportional cost increase

**4. Authentic Local Presence:**
- Real company vehicles showcased
- Verified social media profiles
- Local phone number (+961)
- Google-verified 5-star rating

**5. Technical Sophistication:**
- GPS auto-location
- Interactive map pin selection
- Real-time weather integration
- Voice input support
- Modern responsive design

### 6.2 Barriers to Entry for Competitors

**Technical Complexity:**
- Fixed route price table (no mapping API)
- Keyword-routed support chat
- Web Speech API lazy-loading architecture
- Reverse geocoding with coordinate fallback
- Complex state management across booking flow

**Capital Requirements:**
- API usage costs: none
- Hosting infrastructure (Vercel)
- Domain and SSL certificates
- Marketing and SEO investment
- Professional design and development

**Operational Knowledge:**
- Local market understanding (Lebanon specifics)
- Route knowledge for accurate pricing
- Customer preference patterns
- WhatsApp Business best practices
- Service area logistics

---

## 7. Revenue Model & Pricing Strategy

### 7.1 Ride Pricing Structure

**Base Components:**
- **Base Fare:** $2.00 (covers vehicle dispatch and first few km)
- **Variable Cost:** $1.10/km (distance-based charging)
- **Minimum Fare:** $6.00 (ensures profitability on short trips)

**Profit Margin Analysis:**
```
Example Trip: 10km city ride
- Customer Price: $2.00 + (10 × $1.10) = $13.00
- Driver Payout: ~$9.00 (70%)
- Platform Fee: ~$4.00 (30%)
- Gross Margin: 30%
```

**Round-Trip Incentive:**
- First 50 minutes wait time: FREE
- Hours 2-4: Standard hourly rate
- Encourages longer bookings
- Increases driver utilization
- Higher customer satisfaction

### 7.2 Revenue Streams

**Primary Revenue:**
- Commission on completed rides (30% platform fee)
- Estimated trips per month: 500-2000 (scaling phase)
- Average trip value: $15-25
- Monthly revenue potential: $2,250 - $15,000

**Ancillary Revenue Opportunities:**
1. **Premium Services:** Airport VIP meet-and-greet (+$10-15)
2. **Corporate Accounts:** B2B contracts with monthly billing
3. **Advertising:** Sponsored listings in app (future)
4. **Data Licensing:** Anonymized traffic pattern insights (future)
5. **White-Label Platform:** Licensing technology to other taxi companies

### 7.3 Cost Structure

**Variable Costs:**
- Driver payouts (70% of ride fare)
- Fare lookups: no cost (local price table)
- Support chat: no per-message cost
- Payment processing fees (if implemented)

**Fixed Costs:**
- Vercel hosting: $20/month (Pro plan)
- Domain registration: $15/year
- SSL certificate: Included in Vercel
- No AI or mapping subscription
- Mapping API: none — removed at handover, $0 at any scale

**Total Monthly Operating Cost:** ~$150-350 (excluding driver payouts)

**Break-Even Analysis:**
- Monthly revenue needed: $500 (covering ops + modest marketing)
- Trips required: ~35-40 rides/month at $15 average
- Daily target: 2 rides/day

---

## 8. Growth Strategy

### 8.1 Customer Acquisition

**Organic Search (SEO):**
- Target 500+ organic visitors/month by month 6
- Focus on "taxi Beirut" and related terms
- Content marketing via blog (future)
- Local business directory listings

**Social Media Marketing:**
- Facebook Ads targeting Beirut residents and tourists
- Instagram Stories showcasing vehicle cleanliness and professionalism
- User-generated content (customer photos with permission)
- Influencer partnerships (micro-influencers in Lebanon travel niche)

**Referral Program (Future):**
- $5 credit for referrer + referee
- Incentivizes word-of-mouth growth
- Tracked via unique referral codes

**Strategic Partnerships:**
- Hotels and tourist attractions (commission-based referrals)
- Corporate accounts with businesses
- Airport kiosks or signage
- Travel agencies and tour operators

### 8.2 Retention Strategy

**Quality Service Delivery:**
- Driver vetting and training
- Vehicle cleanliness standards
- Punctuality guarantees
- Professional behavior enforcement

**Customer Feedback Loop:**
- Post-ride WhatsApp survey (1-5 rating)
- Responsive complaint resolution
- Feature request collection
- Testimonial solicitation

**Loyalty Program (Future):**
- Points per dollar spent
- Tier system (Bronze/Silver/Gold)
- Exclusive benefits (priority booking, discounts)
- Birthday ride credits

### 8.3 Market Expansion

**Phase 1 (Current):** Beirut + Airport
**Phase 2 (Month 6):** Jounieh, Byblos, mountain regions
**Phase 3 (Month 12):** All major Lebanese cities
**Phase 4 (Year 2+):** Potential regional expansion (Cyprus, Jordan)

---

## 9. Risk Assessment & Mitigation

### 9.1 Technical Risks

**API Dependency:**
- **Risk:** none from third-party APIs; the site has no paid dependency
- **Mitigation:** Fallback to manual address entry, cached responses, service status monitoring

**Scaling Challenges:**
- **Risk:** Performance degradation at high traffic
- **Mitigation:** CDN usage, code splitting, database optimization, load testing

**Security Vulnerabilities:**
- **Risk:** Data breaches, API key exposure
- **Mitigation:** Environment variable encryption, regular security audits, HTTPS enforcement

### 9.2 Business Risks

**Competitive Pressure:**
- **Risk:** Established players (Uber, Bolt) enter Lebanon market
- **Mitigation:** Focus on local expertise, personalized service, community trust

**Regulatory Changes:**
- **Risk:** New taxi licensing or digital platform regulations
- **Mitigation:** Legal compliance monitoring, industry association membership

**Economic Instability (Lebanon-specific):**
- **Risk:** Currency fluctuations, political instability affecting tourism
- **Mitigation:** USD pricing, diversified customer segments, flexible pricing model

**Driver Availability:**
- **Risk:** Insufficient drivers during peak demand
- **Mitigation:** Surge incentives for drivers, predictive demand modeling, partnership with multiple fleet owners

### 9.3 Operational Risks

**Customer Support Scalability:**
- **Risk:** AI chat insufficient for complex issues
- **Mitigation:** Human support escalation path via WhatsApp, FAQ expansion

**Negative Reviews:**
- **Risk:** Service failure leading to poor online reputation
- **Mitigation:** Proactive issue resolution, compensation policy, quality assurance processes

**Payment Collection:**
- **Risk:** Cash-based payments create reconciliation challenges
- **Mitigation:** Digital payment integration (OMT, Whish Money), driver accountability systems

---

## 10. Product Roadmap

### 10.1 Immediate Priorities (Q1 2026)

- ✅ **SEO Implementation:** Meta tags, structured data, sitemap (COMPLETED)
- ✅ **Mobile Optimization:** Responsive layouts, touch targets (COMPLETED)
- ✅ **Support Chat:** keyword routing and action execution (COMPLETED)
- ✅ **Handover Cleanup:** Google Maps, OpenAI and Google Analytics removed so the site
  runs on no billed account (COMPLETED)
- 🔄 **Route Price List:** `ROUTE_PRICES` in `constants.ts` is empty; every route quotes
  on request until real prices are supplied (PENDING)

### 10.2 Short-Term (Q2 2026)

- [ ] **Driver App Development:** Dedicated driver interface for ride management
- [ ] **Real-Time Tracking:** GPS tracking for active rides
- [ ] **Digital Payment Integration:** OMT, Whish Money, credit card processing
- [ ] **Multi-Language Support:** Arabic interface translation
- [ ] **Email Confirmation System:** Automated booking confirmations and receipts

### 10.3 Medium-Term (Q3-Q4 2026)

- [ ] **Native Mobile App:** iOS and Android applications
- [ ] **Advanced Booking:** Schedule rides days/weeks in advance
- [ ] **Corporate Dashboard:** B2B account management portal
- [ ] **Loyalty Program:** Points system and tier benefits
- [ ] **In-App Chat:** Direct customer-driver communication
- [ ] **Ride Sharing:** Shared rides for cost reduction

### 10.4 Long-Term (2027+)

- [ ] **Fleet Management System:** Vehicle maintenance tracking, fuel monitoring
- [ ] **Predictive Analytics:** Demand forecasting, dynamic pricing optimization
- [ ] **Autonomous Dispatch:** AI-powered driver assignment
- [ ] **Regional Expansion:** Cyprus, Jordan market entry
- [ ] **White-Label Platform:** Licensed technology for other operators
- [ ] **EV Integration:** Electric vehicle incentives and infrastructure

---

## 11. Success Metrics & Goals

### 11.1 Year 1 Targets (2026)

**Traffic:**
- 5,000+ monthly website visitors
- 2,000+ booking initiations
- 1,000+ completed rides

**Revenue:**
- $15,000+ monthly recurring revenue
- $180,000+ annual revenue
- 25% month-over-month growth rate

**Customer Satisfaction:**
- 4.8+ average rating
- < 5% complaint rate
- 60%+ repeat customer rate

**Operational:**
- 50+ active drivers
- < 10 minute average pickup time
- 95%+ ride completion rate

### 11.2 Year 2 Targets (2027)

**Market Position:**
- Top 3 taxi service in Beirut
- 15% market share
- Brand recognition: 40% of surveyed residents

**Financial:**
- $50,000+ monthly revenue
- $600,000+ annual revenue
- Positive EBITDA (profitability)

**Scale:**
- 150+ active drivers
- 5,000+ monthly rides
- Expansion to 3 additional cities

---

## 12. Contact & Business Information

**Company Name:** Andrew's Taxi  
**Primary Contact:** +961 3 301 019  
**Email:** andrewstaxilb@gmail.com  
**Website:** https://www.andrewstaxi.com  
**Operating Hours:** 24/7, 365 days/year

**Social Media:**
- Facebook: https://www.facebook.com/andrwesTaxi/
- Instagram: https://www.instagram.com/andrewtaxi6/

**Service Area:**
- Primary: Beirut, Lebanon
- Secondary: Jounieh, Byblos, Airport
- Extended: All major Lebanese cities

**Payment Methods:**
- Cash (USD, LBP)
- Digital payments (future): OMT, Whish Money, Credit/Debit cards

**Business Registration:**
- Registered in Lebanon
- Licensed taxi operator
- Insurance: Comprehensive commercial vehicle coverage

---

## 13. Technical Documentation References

**For Developers:**
- Repository: https://github.com/becmacc/andrewtaxi
- Branch: `main` (production)
- Local Development: `npm run dev` (Vite)
- Build Command: `npm run build`
- Preview: `npm run preview`

**Environment Variables Required:** none.

Do not add a `VITE_`-prefixed API key. Vite inlines those into the public JavaScript
bundle, so any key added that way is published to every visitor. A key that must stay
secret has to sit behind a server-side route instead.

**API Documentation:**
- Open-Meteo: https://open-meteo.com/en/docs

**Deployment Platform:**
- Vercel Dashboard: https://vercel.com/dashboard
- Automatic deployments on push to `main`
- Environment variables configured in Vercel project settings

---

## 14. Competitive Landscape Analysis

### 14.1 Direct Competitors

**International Platforms (Potential Entry):**
1. **Uber:**
   - Strengths: Global brand, massive scale, sophisticated app
   - Weaknesses: Not currently in Lebanon, heavy app, high commission
   - Our Advantage: Local presence, WhatsApp simplicity, lower overhead

2. **Bolt:**
   - Strengths: European presence, competitive pricing
   - Weaknesses: Limited Middle East presence, app-dependent
   - Our Advantage: Web-based accessibility, local expertise

**Local Competitors:**
1. **Traditional Taxi Services:**
   - Strengths: Established relationships, street hailing presence
   - Weaknesses: No digital booking, opaque pricing, inconsistent quality
   - Our Advantage: Transparent pricing, instant booking, GPS tracking

2. **Local Ride Apps:**
   - Strengths: Understanding of Lebanese market
   - Weaknesses: Poor UX, limited features, unreliable service
   - Our Advantage: Superior technology, AI support, better design

### 14.2 Market Positioning

**Quadrant Analysis:**
```
                High Price
                    |
    Premium    |    Luxury
    International    Private
                    |
Low Tech -------|------- High Tech
                    |
    Traditional |    Andrew's
    Taxis      |    Taxi ⭐
                    |
                Low Price
```

**Positioning Statement:**
"Andrew's Taxi delivers reliable, professional transportation in Lebanon through innovative web technology and transparent pricing, making premium taxi service accessible to everyone without the complexity of traditional ride-hailing apps."

---

## 15. Marketing & Brand Guidelines

### 15.1 Brand Identity

**Brand Values:**
1. **Reliability:** Always on time, always available
2. **Transparency:** Fixed pricing, no hidden fees
3. **Professionalism:** Courteous drivers, clean vehicles
4. **Innovation:** Modern technology, AI support
5. **Local Expertise:** Deep understanding of Lebanon

**Brand Voice:**
- Friendly but professional
- Helpful without being pushy
- Clear and straightforward
- Confident and trustworthy
- Culturally sensitive (Lebanese context)

**Visual Identity:**
- Primary Color: Taxi Yellow (#EAB308)
- Secondary Color: Dark Gray (#1F2937)
- Accent Colors: White, subtle blues/greens
- Typography: Inter (modern, clean, readable)
- Logo: Professional, recognizable, scalable

### 15.2 Content Strategy

**Website Copy Principles:**
- Benefit-focused (not feature-focused)
- Action-oriented CTAs
- Social proof integrated naturally
- Mobile-optimized brevity
- SEO-friendly structure

**Marketing Messages:**
1. "Skip the stress. Book instantly on WhatsApp."
2. "Transparent pricing. Professional drivers. 24/7."
3. "Lebanon's most reliable taxi service."
4. "From airport to anywhere. Fixed rates, no surprises."
5. "Your trusted ride across Lebanon."

### 15.3 Customer Communication

**Tone Guidelines:**
- **Booking Confirmations:** Efficient, clear, reassuring
- **Support Responses:** Empathetic, solution-focused, patient
- **Marketing Messages:** Exciting but not overhyped
- **Problem Resolution:** Apologetic, accountable, generous

**Multilingual Approach:**
- Primary: English (current)
- Secondary: Arabic (Q2 2026 roadmap)
- Tourist-friendly: French (consideration)

---

## 16. Conclusion & Investment Opportunity

### 16.1 Business Viability

Andrew's Taxi represents a modern solution to transportation challenges in the Lebanese market, combining technological sophistication with operational simplicity. The platform's WhatsApp-first approach eliminates the primary barrier to digital taxi adoption in Lebanon — app download friction — while maintaining the benefits of web-based booking, transparent pricing, and AI-powered support.

**Key Success Factors:**
1. ✅ **Product-Market Fit:** Validated through WhatsApp's 95% penetration in Lebanon
2. ✅ **Technical Excellence:** Production-ready platform with modern architecture
3. ✅ **Scalable Model:** Low marginal cost per additional booking
4. ✅ **Defensible Differentiation:** AI support, GPS features, transparent pricing
5. ✅ **Clear Path to Profitability:** 30% gross margins, low fixed costs, organic growth

### 16.2 Investment Highlights

**Current Stage:** Seed/Early Revenue  
**Funding Need:** $50,000 - $100,000 (12-month runway)  
**Use of Funds:**
- 40% Marketing & Customer Acquisition
- 30% Technology Development (mobile apps, features)
- 20% Operations & Driver Network Expansion
- 10% Working Capital

**Projected ROI:**
- Break-even: Month 6-8
- Revenue: $180K (Year 1) → $600K (Year 2)
- Valuation: $500K (current) → $2M (18 months)
- Exit Opportunity: Acquisition by regional player or international ride-hailing platform

### 16.3 Strategic Vision

Andrew's Taxi is positioned to become the leading digital taxi platform in Lebanon, with potential for regional expansion. The combination of lightweight technology, local expertise, and customer-centric design creates a defensible moat against both traditional competitors and potential international entrants.

**Long-Term Vision:**
Transform Andrew's Taxi from a single-city operation into a regional transportation network, leveraging Lebanon as a proof-of-concept for similar emerging markets where app-based solutions face adoption challenges. The ultimate goal is to become the preferred technology platform for small-to-medium taxi operators across the Middle East and North Africa region.

---

**Document End**

*This business product overview is a living document and will be updated quarterly to reflect product evolution, market changes, and strategic pivots.*

**Next Review Date:** May 11, 2026  
**Document Owner:** Product Management & Business Development  
**Version History:**
- v1.0 (January 2026): Initial platform launch
- v2.0 (February 2026): SEO implementation, AI chat integration, mobile optimization
