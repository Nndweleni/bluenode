# Changelog

All notable changes to the Bluenode website project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.2.1] - 2026-01-10

### Fixed

#### Form Navigation Scroll Issue
- **Fixed scroll behavior**: Next button now scrolls to the form container instead of the very top of the page
- **User impact**: Users can now immediately see where to start filling in the next step
- **Technical change**: Updated `showStep()` function to scroll to form container with 80px navbar offset

#### Checkbox/Radio Button Sizing and Alignment
- **Reduced visual size**: Checkbox and radio buttons now display at 20x20px instead of 44x44px
- **Fixed vertical alignment**: Inputs now properly centered with their label text
- **Maintained accessibility**: Touch target remains 44x44px for WCAG 2.5.5 compliance using padding trick
- **User feedback**: Buttons no longer appear oversized while remaining easy to tap on mobile

#### Form Submission Error Handling
- **Improved error debugging**: Now captures and logs actual Web3Forms API error response
- **Better error messages**: Console shows specific API error details (e.g., invalid access key, missing fields)
- **Technical change**: Added JSON response parsing in error handling to display meaningful error messages

### Technical Details

**Files Modified:**
- `js/onboarding.js` - Fixed scroll behavior (line 155-160), improved error handling (lines 1089-1108)
- `css/forms.css` - Reduced checkbox/radio visual size, fixed vertical alignment (changed `align-items: flex-start` to `align-items: center` on line 403)

**Debugging Note:**
- If form submission fails with 400 error, check browser console for "Web3Forms API Error:" message
- This will show the specific reason from the API (invalid key, missing required fields, file issues, etc.)

---

## [2.2.0] - 2026-01-09

### Added - UX Enhancements (Research-Backed)

This release implements three research-backed UX improvements based on Nielsen Norman Group, Baymard Institute, and WCAG 2.1 AA standards.

#### 1. Inline Form Validation
- **Blur validation** for email, phone, and domain fields
- **Real-time validation** for domain inputs (debounced 500ms)
- **Success feedback** with checkmarks for validated fields
- **Research impact:** Reduces form errors by 18% (Nielsen Norman Group)

**Technical changes:**
- Added `validateFieldInline()` function for single-field validation
- Added `showFieldError()`, `clearFieldError()`, `showFieldSuccess()` helper functions
- Added `initInlineValidation()` to set up blur event listeners
- Validation triggers on blur event (user leaves field) rather than only on form submit
- More descriptive error messages (e.g., "Please enter a valid email address (e.g., you@example.com)")

#### 2. Enhanced Error/Success States
- **WCAG 2.1 AA compliant** error display with icon + color + text (not color alone)
- **Success state** visual feedback with green borders and checkmarks
- **Improved error messages** with specific examples
- **Research impact:** Success feedback reduces completion time by 11% (Luke Wroblewski)

**Technical changes:**
- Added `.success` CSS class for valid input fields
- Added `.input-wrapper` for positioning icons
- Added `.input-icon-error` and `.input-icon-success` CSS classes
- Updated `forms.css` with success/error icon styles
- Added `aria-invalid` attribute management
- Error messages now use `role="alert"` for screen reader announcements

#### 3. Progressive Loading Messages
- **Step-by-step feedback** during form submission (5 stages)
- **Loading messages** show current progress (validating → uploading → sending → completing)
- **Research impact:** Reduces perceived wait time by 20-30% (Nielsen Norman Group)

**Technical changes:**
- Added `showProgressiveLoading()` function with 5-stage message sequence
- Updated loading overlay HTML structure with `.loading-content` and `.loading-message` elements
- Messages update every 800-2000ms showing different stages
- Added `aria-live="polite"` for accessibility
- Enhanced loading overlay CSS with better visibility and typography

### Changed

- **Form validation timing:** Now validates fields on blur (user leaves field) instead of only on submit
- **Error messages:** More specific and helpful (includes format examples)
- **Loading overlay:** Now shows progressive messages instead of static "Processing..." text
- **CSS:** Enhanced input states with success/error visual feedback

### Files Modified

- `js/onboarding.js` - Added 150+ lines for inline validation and progressive loading
- `css/forms.css` - Added 60+ lines for success/error states and loading enhancements
- `onboarding.html` - Updated loading overlay HTML structure

### Developer Notes

- All enhancements maintain backward compatibility
- No breaking changes to existing form functionality
- Follows WCAG 2.1 AA accessibility standards
- Research-backed patterns from Nielsen Norman Group and Baymard Institute

---

## [2.1.1] - 2026-01-09

### Fixed
- **Delivery timeline inconsistency**: Updated pricing.html line 173 to reflect correct 14 business days delivery timeline (was incorrectly showing 10 business days)
  - This ensures consistency with live site and all other documentation
  - Affects: Website Development section on pricing page
  - Now matches: services.html, about.html, and rest of pricing.html

### Documentation
- This fix aligns local codebase with live site at bluenode.vercel.app
- No functional changes, only correcting inconsistent timeline information

---

## [2.1.0] - 2026-01-09

### Code Quality & Security Improvements
This release focuses on modernizing the JavaScript codebase with ES6+ patterns, improving security, and enhancing code maintainability.

### Changed
- **JavaScript modernization**: Converted traditional `function()` callbacks to ES6 arrow functions throughout `js/main.js`
  - Navigation link handlers
  - Anchor link scroll handlers
  - Form submission handlers
  - Scroll-to-top handlers
  - IntersectionObserver callbacks
  - requestAnimationFrame callbacks
- **Security enhancements**: Replaced `innerHTML` with safer DOM methods in `js/onboarding.js`
  - Changed `innerHTML = '✓'` to `textContent = '✓'` for checkmark display
  - Replaced `innerHTML` with `createElement()` and `appendChild()` for submit button spinner
  - Updated container clearing from `innerHTML = ''` to `removeChild()` loop
- **Template literals**: Converted string concatenation to template literals in email input generation
- **Code cleanup**: Removed production `console.log()` statements from both JS files
- **Anti-pattern removal**: Refactored function reassignment pattern in `showStep()` function
  - Moved `generateSummary()` call directly into `showStep()` function body
  - Eliminated hacky function wrapping approach

### Technical Improvements
- Improved code readability and consistency across JavaScript files
- Enhanced maintainability with modern ES6+ patterns
- Reduced potential XSS attack surface with safer DOM manipulation
- Cleaner function patterns following JavaScript best practices

### Files Modified
- `js/main.js` - Modernized arrow functions (14 improvements), removed console log
- `js/onboarding.js` - Security improvements, template literals, cleaner patterns (7 improvements)

### Developer Notes
- All changes are backward-compatible
- No breaking changes to functionality
- Commit: `d459d07`

---

## [2.0.0] - 2026-01-08

### Major Content Updates
This release includes comprehensive website content updates, new Privacy Policy, updated Terms of Service, and a complete rewrite of the About page with a more personal, portfolio-focused approach.

### Added
- **Privacy Policy page** (`privacy.html`): Complete POPIA-compliant privacy policy with information collection, usage, sharing, data retention, and user rights sections
- **Personal About page**: Completely rewritten About page introducing Nndweleni, the developer behind Bluenode
- **Portfolio Special Offer**: Added discounted rates section for first 5 clients (R1,200 Basic, R1,700 Standard) with 3 slots remaining
- **Current Availability notices**: Added "2 project slots remaining this month" messaging across site
- **WhatsApp contact**: Added WhatsApp link (+27 81 776 6452) to all footers and CTA sections
- **Support availability info**: Added "Evenings & weekends" availability messaging

### Changed
- **Logo size**: Increased navbar logo from 60px → 80px (desktop) and 50px → 60px (mobile) for better visibility
- **Email addresses**: Changed all `support@bluenode.co.za` to `hello@bluenode.co.za` (except onboarding pages which use `onboarding@bluenode.co.za`)
- **Copyright format**: Updated from "© Bluenode Technologies (Pty) Ltd." to "© Bluenode Technologies (Pty) Ltd, trading as Bluenode."
- **Terms of Service**: Complete rewrite with 18 sections (was 14), added new sections for Third-Party Services, Client Content Responsibility, Portfolio Usage, and Maintenance Services Scope
- **Homepage hero subtitle**: Added detailed subtitle "Affordable, professional websites for South African small businesses. No complexity, no hidden fees. Delivered within 14 business days."
- **Homepage CTA section**: Changed from generic "Let's build..." to personal "I'm currently taking on 2-3 projects per month" with response time and availability details
- **Footer Quick Links**: Added Privacy Policy link to all page footers
- **Footer Contact section**: Added WhatsApp number and detailed response time/availability information

### About Page Complete Rewrite
New sections on About page:
- **Hi, I'm Nndweleni**: Personal introduction with qualifications (MANCOSA, World Skills SA 2nd place)
- **Why I Started Bluenode**: Explains motivation to help small businesses avoid overpriced or DIY solutions
- **How I Work**: Capacity (2-3 projects/month), communication (email/WhatsApp evenings/weekends), response time (24 hours), timeline (14 days)
- **Building My Portfolio**: Includes special launch offer with discounted pricing
- **Our Philosophy: Boring Tech That Works**: Focus on proven, reliable technology
- **Our Core Values**: Simplicity, Reliability, Transparency, Accessibility
- **What We Actually Sell**: Outcome-focused value proposition
- **Who We Work With**: Ideal client types and capacity limits
- **Developer-Led, Not Agency Fluff**: Direct communication benefits

### Files Created
- `privacy.html` - New POPIA-compliant Privacy Policy page with full header, navigation, content, footer, and schema

### Files Modified
- `index.html` - Hero subtitle added, CTA section updated, footer updated, email changed to hello@
- `about.html` - Complete replacement with personal, portfolio-focused content
- `terms.html` - Complete content replacement with 18-section structure, link to privacy policy
- `services.html` - Added 3 new sections (DNS Access Note, Website Maintenance R400/month, Current Availability), updated hosting provider text, footer updated
- `pricing.html` - Added Current Availability Notice section at top, navigation email updated, footer updated
- `onboarding.html` - Footer updated with WhatsApp, Privacy Policy link, new copyright format (kept onboarding@ email)
- `thank-you.html` - Footer updated with WhatsApp, Privacy Policy link, new copyright format (kept onboarding@ email)
- All HTML files - Footer updated with WhatsApp, Privacy Policy link, new copyright format

### Services Page New Sections
- **DNS Access Note**: Explains why DNS access is needed for hosting, email, SSL setup
- **Website Maintenance (R400/month)**: Complete breakdown of what's included/excluded, 48-hour turnaround
- **Current Availability**: Part-time operation model (2-3 projects/month, evenings/weekends communication)

### Documentation
- Branch: `feature/content-updates-jan-2026`
- All changes focus on personalizing the Bluenode brand and adding transparency about part-time operation model

---

## [1.1.4] - 2025-12-28

### Mobile UX Improvements
- **Mobile progress sidebar**: Progress sidebar now sticky on mobile, stays visible while scrolling
- **Compact mobile layout**: Progress steps display horizontally with only active step title visible
- **Improved mobile scrolling**: Horizontal scroll for progress steps on smaller screens

### Added
- **Autosave indicator**: Visual feedback when form progress is saved to session storage
- **showAutosaveIndicator() function**: Displays "Progress saved" notification with checkmark icon
- **Smooth animations**: Autosave indicator fades in/out with CSS transitions

### Files Modified
- `css/forms.css` - Added mobile sticky progress sidebar styles, autosave indicator styles
- `onboarding.html` - Added autosave indicator HTML element
- `js/onboarding.js` - Added showAutosaveIndicator() function, integrated with FormState.save()

---

## [1.1.3] - 2025-12-28

### Security Fixes
- **XSS vulnerability fixed**: Summary generation now uses safe DOM methods (textContent) instead of innerHTML
- **MIME type validation**: File uploads now validate actual file MIME type, not just extension
- **escapeHtml() function**: Added utility function for HTML entity escaping

### Validation Improvements
- **Domain format validation**: All domain input fields now validate format (e.g., example.co.za)
- **Email name validation**: Email prefix fields (info, hello, etc.) now validate allowed characters
- **ValidationRules.domain()**: New regex-based domain format validator
- **ValidationRules.emailName()**: New validator for email address prefixes
- **ValidationRules.fileMimeType()**: New MIME type checker for file uploads

### Files Modified
- `js/onboarding.js` - Added validation rules, MIME checking, XSS fix in generateSummary()

---

## [1.1.2] - 2025-12-28

### Accessibility Improvements
- **Autocomplete attributes**: Added `autocomplete` to form fields (name, email, tel, organization) for better mobile keyboard optimization
- **Touch target sizes**: Increased radio/checkbox touch targets to 44px minimum for mobile accessibility (WCAG 2.5.5)
- **Focus management**: Step headings now receive focus when navigating between steps for screen reader users

### Removed
- **Unused CSS classes**: Removed `.mono`, `.data`, `.uppercase` utility classes from base.css (never used in HTML)

### Files Modified
- `onboarding.html` - Added autocomplete attributes to client details form
- `css/forms.css` - Increased touch targets for radio buttons and checkboxes
- `css/base.css` - Removed unused utility classes
- `js/onboarding.js` - Added focus management on step change

---

## [1.1.1] - 2025-12-28

### Fixed
- **Duplicate form submission prevention**: Added `isSubmitting` flag to prevent multiple form submissions
- **Navigation active link bug**: Home page link now correctly highlights when visiting root URL or index.html
- **Network error handling**: Form submission now handles timeout (30s) and offline errors gracefully

### Added
- **Submit button loading state**: Button shows spinner and "Submitting..." text during form submission
- **AbortController for fetch timeout**: 30-second timeout for form submission with proper error handling
- **Offline detection**: Shows user-friendly message when submitting form while offline

### Changed
- **submitForm() function**: Now disables button, shows loading state, and handles errors more gracefully
- **Active navigation logic**: Improved detection of home page across different URL patterns

### Files Modified
- `js/onboarding.js` - Added submission protection, loading states, timeout handling
- `js/main.js` - Fixed navigation active link detection
- `css/forms.css` - Added button spinner and submitting state styles

---

## [1.1.0] - 2025-12-28

### Fixed
- **Questionnaire flow for email-only packages**: Users selecting email-only now only see relevant steps (1, 2, 6, 8, 9) instead of all 9 steps
- **Questionnaire flow for hosting-only packages**: Users selecting hosting-only now only see relevant steps (1, 2, 6, 8, 9)
- **Progress sidebar dynamic updates**: Sidebar now shows only relevant steps and renumbers them sequentially
- **Terms page missing Open Graph image**: Added og:image and twitter:image meta tags

### Added
- **Package-specific questionnaire flows**: Different packages now show different sets of questions
  - Website packages: Full 9-step flow (with step 7 conditional on email addon)
  - Email-only: 5-step flow (Client Details, Service Selection, Domain, Legal, Review)
  - Hosting-only: 5-step flow (Client Details, Service Selection, Domain, Legal, Review)
- **Email-only domain section**: New Step 6 variant for email-only packages with "I have a domain" / "I need to register one" options
- **Hosting-only domain section**: New Step 6 variant for hosting-only packages
- **Dynamic progress sidebar**: Shows only relevant steps with sequential numbering
- **getVisibleSteps() function**: Returns array of visible steps based on package type
- **updateProgressSidebar() function**: Updates sidebar visibility and numbering
- **getNextVisibleStep() / getPreviousVisibleStep() functions**: Smart navigation that skips hidden steps
- **updateEmailDomainFields() function**: Handles domain field visibility for email-only packages

### SEO Improvements
- **WebSite schema** added to index.html
- **BreadcrumbList schema** added to all 5 main pages (index, services, pricing, about, terms)
- **Service schema** added to services.html with all service offerings
- **Product/Offer schema** added to pricing.html with all pricing plans
- **AboutPage schema** added to about.html with organization details
- **Twitter Card meta tags** added to terms.html
- **og:locale** meta tag added to terms.html

### Changed
- **checkCondition() function**: Now supports multiple condition types (emailSetup, requiresWebsite)
- **updateDomainHostingStep() function**: Now handles email-only and hosting-only sections
- **showStep() function**: Now calls updateProgressSidebar() and updateDomainHostingStep()
- **nextStep() function**: Uses getNextVisibleStep() for smart navigation
- **previousStep() function**: Uses getPreviousVisibleStep() for smart navigation
- **updateNavigationButtons() function**: Checks first/last visible step, not hardcoded step numbers
- **updateProgressIndicator() function**: Works with visible steps array for proper numbering

### Files Modified
- `js/onboarding.js` - Major updates to questionnaire logic
- `onboarding.html` - Added data-condition attributes, new domain sections
- `index.html` - Added WebSite schema
- `services.html` - Added BreadcrumbList and Service schemas
- `pricing.html` - Added BreadcrumbList and Product schemas
- `about.html` - Added BreadcrumbList and AboutPage schemas
- `terms.html` - Added BreadcrumbList schema, og:image, twitter:image meta tags

### Files Created
- `CHANGELOG.md` - This changelog file
- `PROJECT-STATUS.md` - Project status documentation

---

## [1.0.0] - 2025-01-20

### Initial Release
- 7-page static website (index, services, pricing, about, terms, onboarding, thank-you)
- Dark/light theme toggle with system preference detection
- 9-step onboarding form with Web3Forms integration
- Mobile responsive design
- SEO meta tags (Open Graph, Twitter Cards)
- PWA manifest and icons
- LocalBusiness schema on homepage
- CSS design system with custom properties
- Accessibility features (skip links, ARIA labels)
