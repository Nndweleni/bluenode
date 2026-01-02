# Bluenode Website - Project Status

Last Updated: 2025-12-28

## Overview

| Attribute | Value |
|-----------|-------|
| **Tech Stack** | HTML5, CSS3, Vanilla JavaScript |
| **Build Tools** | None (static site) |
| **Form Handler** | Web3Forms |
| **Target Market** | Small businesses in South Africa |
| **Domain** | bluenode.co.za |

## Project Structure

```
/bluenode/
├── index.html           # Homepage
├── services.html        # Services page
├── pricing.html         # Pricing page
├── about.html           # About page
├── terms.html           # Terms of Service
├── onboarding.html      # Client onboarding form
├── thank-you.html       # Form confirmation
├── /css/                # Stylesheets (8 files)
├── /js/                 # JavaScript (2 files)
├── /images/             # Logos and icons
├── manifest.json        # PWA manifest
├── sitemap.xml          # SEO sitemap
├── robots.txt           # Crawler directives
├── CHANGELOG.md         # Change history
└── PROJECT-STATUS.md    # This file
```

## Completed Features

- [x] 7-page static website
- [x] Dark/light theme toggle with system preference detection
- [x] Multi-step onboarding form (package-specific flows)
- [x] Mobile responsive design
- [x] SEO meta tags (Open Graph, Twitter Cards)
- [x] PWA manifest and icons
- [x] Schema.org structured data
  - [x] LocalBusiness (homepage)
  - [x] WebSite (homepage)
  - [x] BreadcrumbList (all pages)
  - [x] Service (services page)
  - [x] Product/Offer (pricing page)
  - [x] AboutPage (about page)
- [x] Accessibility features (skip links, ARIA labels)
- [x] Package-specific questionnaire flows
  - [x] Website packages: Full 9-step flow
  - [x] Email-only: 5-step flow
  - [x] Hosting-only: 5-step flow
- [x] Dynamic progress sidebar
- [x] Mobile-friendly sticky progress indicator
- [x] Form autosave with visual indicator

## Known Issues

| Issue | Status | Priority | Notes |
|-------|--------|----------|-------|
| None currently tracked | - | - | - |

## Security Considerations

### Acceptable Risks
- **Web3Forms API key** is client-side exposed - This is acceptable as it's designed for client-side form submission
- **No server-side validation** - Forms rely on client-side validation; Web3Forms provides basic spam protection

### Implemented Protections
- File upload limited to 5MB client-side
- File type validation (PNG, JPG, SVG only)
- File MIME type validation (prevents extension spoofing)
- HTML5 form validation
- Domain format validation (regex-based)
- Email name validation (prefix characters)
- HTTPS enforced (via hosting)
- Duplicate form submission prevention (isSubmitting flag)
- Network timeout handling (30s with AbortController)
- Offline detection for form submission
- XSS prevention in summary (uses textContent, not innerHTML)

### Recommendations for Future
- [ ] Consider adding Google reCAPTCHA for spam protection
- [ ] Implement Content Security Policy (CSP) headers
- [ ] Add rate limiting at hosting level

## Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| CSS consolidation | Low | Some duplicate styles exist across files |
| Image optimization | Low | Consider WebP format for images |

## TODO / Future Improvements

### High Priority
- [x] Create og-image.jpg for social sharing (completed)
- [ ] Add Google Analytics / Plausible integration
- [ ] Test all package flows thoroughly

### Medium Priority
- [ ] Add testimonials section
- [ ] Add FAQ section with schema
- [ ] Implement contact form on main pages
- [ ] Add blog/news section

### Low Priority
- [ ] Add WhatsApp floating button
- [ ] Implement page transitions
- [x] Add loading states for form (completed - submit button spinner)
- [x] Add form autosave indicator (completed - visual feedback on save)
- [ ] Consider adding cookie consent (if analytics added)

## Package Flows Reference

### Website Packages (basic-website, standard-website, starter-bundle, custom)
Steps: 1 (Client) → 2 (Service) → 3 (Website) → 4 (Design) → 5 (Content) → 6 (Domain) → 7* (Email) → 8 (Legal) → 9 (Review)
*Step 7 only if email addon selected

### Email-Only Package
Steps: 1 (Client) → 2 (Service) → 6 (Domain) → 8 (Legal) → 9 (Review)

### Hosting-Only Package
Steps: 1 (Client) → 2 (Service) → 6 (Domain) → 8 (Legal) → 9 (Review)

## URLs for Testing

| Package | URL |
|---------|-----|
| Basic Website | `onboarding.html?package=basic-website&type=website-only&pages=3` |
| Standard Website | `onboarding.html?package=standard-website&type=website-only&pages=5` |
| Starter Bundle | `onboarding.html?package=starter-bundle&type=starter-bundle&pages=3` |
| Email Setup | `onboarding.html?package=email-setup&type=email-only&pages=0` |
| Hosting Only | `onboarding.html?package=hosting-only&type=hosting-only&pages=0` |
| Custom | `onboarding.html?package=custom&type=custom&pages=0` |

## Contacts

| Role | Contact |
|------|---------|
| Primary Contact | hello@bluenode.co.za |
| Form Handler | Web3Forms (nndweleni@bluenode.co.za) |

## Deployment

### Recommended Platforms
- Netlify (free tier with CDN)
- Vercel (fast static hosting)
- GitHub Pages (free)
- Standard cPanel/FTP hosting

### Deployment Steps
1. Upload all files to hosting root
2. Ensure HTTPS is enabled
3. Verify sitemap.xml is accessible
4. Test all forms
5. Verify Open Graph previews

---

*This document should be updated whenever significant changes are made to th