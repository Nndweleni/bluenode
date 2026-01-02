# Bluenode Website

Simple, modern static website for Bluenode - a web development service for small businesses.

## Overview

This is a static HTML/CSS/JavaScript website built with simplicity and performance in mind. No frameworks, no build process - just clean, portable code that can be hosted anywhere.

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern CSS with custom properties (CSS variables)
- **Vanilla JavaScript** - No dependencies, no frameworks
- **Google Fonts** - Inter font family

## Project Structure

```
/BNT/
├── index.html              # Homepage
├── services.html           # Services page
├── pricing.html            # Pricing page
├── about.html              # About page
├── terms.html              # Terms of Service
│
├── css/
│   ├── reset.css          # CSS normalization
│   ├── variables.css      # Design tokens (colors, spacing, typography)
│   ├── base.css           # Base HTML element styles
│   ├── layout.css         # Grid systems and containers
│   ├── components.css     # Reusable UI components
│   └── pages.css          # Page-specific styles
│
├── js/
│   └── main.js            # Mobile menu toggle + smooth scroll
│
├── images/
│   ├── logo.svg           # Bluenode logo
│   ├── logo-white.svg     # White variant for dark backgrounds
│   └── favicon.png        # Browser icon
│
└── README.md              # This file
```

## Design System

### Colors

- **Primary Blue**: `#2c5282` - Trust, professionalism
- **Accent Blue**: `#4299e1` - CTAs, links
- **Dark Text**: `#2d3748` - Body copy
- **Light Gray**: `#f7fafc` - Backgrounds
- **Success Green**: `#38a169` - Highlights

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semi-bold)
- **Base Size**: 16px
- **Line Height**: 1.6 for body text

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Common Updates

### Changing Text Content

1. Open the relevant HTML file in a text editor
2. Locate the text you want to change
3. Edit the text between the HTML tags
4. Save the file
5. Upload to your hosting via FTP or git push

### Updating Pricing

1. Open `pricing.html`
2. Find the pricing card you want to update
3. Update the amount in the `<span class="amount">` tag
4. Update the features list if needed
5. Save and upload

### Changing Contact Email

The site currently uses `hello@bluenode.com`. To change it:

1. Use Find & Replace in your text editor
2. Find: `hello@bluenode.com`
3. Replace with: `your-new-email@domain.com`
4. Replace across all HTML files
5. Save and upload

### Adding a New Page

1. Copy an existing HTML file (e.g., `services.html`)
2. Rename it to your new page name (e.g., `contact.html`)
3. Update the page title in the `<title>` tag
4. Update the meta description
5. Replace the main content
6. Add a link to the new page in the navigation menu (in all HTML files)
7. Save and upload

### Changing Colors

1. Open `css/variables.css`
2. Update the color values in the `:root` section
3. Colors will automatically update across the entire site
4. Save and upload

## Hosting & Deployment

### Recommended Hosting

- **Netlify** (free tier, CDN included, easy deployment)
- **Vercel** (free tier, fast)
- **GitHub Pages** (free, simple)
- Any shared hosting with FTP access
- cPanel hosting

### Deployment via FTP

1. Connect to your hosting via FTP client (FileZilla, Cyberduck, etc.)
2. Upload all files to your web root (usually `public_html` or `www`)
3. Ensure file permissions are correct (usually 644 for files, 755 for directories)
4. Visit your domain to verify

### Deployment via Git

If using Netlify, Vercel, or GitHub Pages:

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Connect your repository to your hosting service
3. Set the build command to nothing (it's a static site)
4. Set the publish directory to the root directory
5. Deploy

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions
- Graceful degradation for older browsers
- No Internet Explorer support

## Performance

Current targets:

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total page size: < 500KB
- Lighthouse score: 90+ across all metrics

## Accessibility

- Semantic HTML5 markup
- ARIA labels where needed
- Keyboard navigation support
- Color contrast WCAG AA compliant
- Skip to main content link
- Alt text for all images

## Maintenance

### Regular Tasks

- Update pricing if it changes (in `pricing.html`)
- Update terms of service if they change (in `terms.html`)
- Renew domain annually
- Keep hosting paid
- Monitor email deliverability

### Backups

Since this is a static site:

1. Keep a local copy of all files
2. Use Git version control (recommended)
3. Download a backup from your hosting monthly
4. Store backups in multiple locations

## Adding Your Logo

1. Export your logo as SVG (recommended) or PNG
2. For SVG: Name it `logo.svg` and place in the `images/` folder
3. For PNG: Export at 2x size for retina displays (e.g., 200px height = export at 400px)
4. Create a white version for the footer if needed (`logo-white.svg`)
5. Upload to your hosting

The logo will automatically appear in the navigation. If you need to adjust the size, edit the CSS in `css/components.css` under the `.logo img` selector.

## Favicon

To add a favicon:

1. Create a 512x512px PNG icon
2. Use a favicon generator (e.g., realfavicongenerator.net)
3. Download the generated files
4. Place them in the root directory
5. Update the favicon link in the `<head>` of each HTML file

## Contact Form & Email Service

The client onboarding form uses **Web3Forms** (https://web3forms.com) for email delivery.

### Configuration
- **Service**: Web3Forms (free tier, unlimited submissions)
- **Target Email**: nndweleni@bluenode.co.za
- **Access Key**: Configured in `js/onboarding.js` (line 582)
- **File Uploads**: Supported up to 10MB
- **API Endpoint**: https://api.web3forms.com/submit

### Email Features
- Custom subject line includes package name for easy identification
- From name shows client's name for context
- All form fields included in email body
- Logo file attachment (if uploaded)
- Reliable delivery with built-in spam protection

### Form Files
- **Form Page**: `onboarding.html` (multi-step form with 9 steps)
- **JavaScript**: `js/onboarding.js` (form logic, validation, submission)
- **CSS**: `css/forms.css` (form-specific styling)
- **Thank You Page**: `thank-you.html` (post-submission confirmation)

### Testing
1. Submit a test through the onboarding form
2. Check email at nndweleni@bluenode.co.za (and spam folder)
3. Verify all form fields are present
4. Confirm logo attachment is included

### Troubleshooting
- If emails don't arrive, check Web3Forms dashboard: https://web3forms.com
- Verify access key is correct in `js/onboarding.js`
- Check browser console for submission errors
- Test from actual domain (not localhost) for best results

## Contact Information

For questions or support regarding this website:

- Email: nndweleni@bluenode.co.za
- Support Email: hello@bluenode.co.za
- GitHub: (Add repository link if applicable)

## License

All rights reserved © 2025 Bluenode

---

**Built with:**
- Plain HTML, CSS, and JavaScript
- No frameworks, no build process
- Designed for simplicity and reliability
- Boring tech that works
