# Images Directory

This directory contains images and logos for the Bluenode website.

## Required Files

### Logo Files

You need to add the following logo files:

1. **logo.svg** (or logo.png)
   - Main logo for navigation
   - Recommended: SVG format for scalability
   - If using PNG: Export at 2x size (e.g., 80px height → export at 160px)
   - Color: Should work on white background

2. **logo-white.svg** (or logo-white.png)
   - White version of logo for dark backgrounds
   - Used in footer (dark blue background)
   - Same dimensions as main logo

3. **favicon.png**
   - Browser tab icon
   - Size: 512x512px or 192x192px
   - PNG format
   - Simple, recognizable at small sizes

## How to Add Your Logo

### Option 1: SVG (Recommended)

1. Export your logo as SVG from your design tool
2. Name it `logo.svg`
3. Create a white version and name it `logo-white.svg`
4. Place both files in this directory
5. The website will automatically use them

### Option 2: PNG

1. Export your logo at 2x the display size
   - Display size: 40px height
   - Export size: 80px height
2. Name it `logo.png`
3. Create a white version and name it `logo-white.png`
4. Place both files in this directory
5. Update HTML files to use `.png` instead of `.svg`

## Current Setup

The HTML files are currently set up to:
- Look for `logo.svg` first
- Fall back to showing "Bluenode" as text if logo is missing
- Logo appears in navigation at 40px height

## Adjusting Logo Size

If you need to change the logo size:

1. Open `css/components.css`
2. Find the `.logo img` selector
3. Change the `height` value (currently 40px)
4. Save and refresh

## Favicon Setup

For a complete favicon setup:

1. Create a 512x512px icon
2. Use a favicon generator (e.g., realfavicongenerator.net)
3. Download all generated files
4. Place them in the root directory (not this images folder)
5. Update the `<link rel="icon">` tag in each HTML file

## Additional Images

If you add other images to the site:

- Keep them organized in this directory
- Use descriptive file names (e.g., `hero-background.jpg`)
- Optimize images before uploading:
  - JPG for photos (quality 80-85%)
  - PNG for graphics with transparency
  - SVG for icons and illustrations
  - WebP for modern browsers (optional)

## Image Optimization Tips

- Compress images before uploading
- Use appropriate formats
- Consider 2x versions for retina displays
- Add descriptive alt text in HTML
- Keep file sizes reasonable (< 200KB for most images)

## Questions?

If you need help with logo files, contact hello@bluenode.com
