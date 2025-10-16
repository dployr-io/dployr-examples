# Fallback Images

This directory contains fallback images used when external APIs (picsum.photos, thispersondoesnotexist.com) are unavailable.

## Image Requirements

- **Article Images**: 400x300px, newspaper-appropriate content
- **Author Images**: Square format, professional headshots or avatars
- **Format**: JPG or PNG
- **Size**: Keep under 100KB each for performance

## Usage

These images are automatically used by the ApiHelpers class when external services fail. The system randomly selects from available fallback images to maintain variety even in offline scenarios.

## Adding Images

To add more fallback images:
1. Add image files to this directory
2. Update the `fallbackImages` and `fallbackAuthorImages` arrays in `../js/api-helpers.js`
3. Follow the naming convention: `fallback-{number}.jpg` for articles, `author-{number}.jpg` for authors