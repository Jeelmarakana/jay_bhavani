# Category Images Guide for Jay Bhavani Ornaments

## Current Categories and Recommended 4K Images

### 1. Rings
- **Current**: gold-ring.jpg
- **Recommended 4K**: Add a high-resolution (3840x2160px) image showing a beautiful gold ring with detailed craftsmanship
- **Filename**: rings-4k.jpg

### 2. Necklaces & Har
- **Current**: antique-necklace.jpg  
- **Recommended 4K**: Add a stunning 4K image of a traditional necklace set with intricate design
- **Filename**: necklaces-4k.jpg

### 3. Earrings
- **Current**: royal-earrings.jpg
- **Recommended 4K**: Add a crystal clear 4K image of elegant earrings with detailed work
- **Filename**: earrings-4k.jpg

### 4. Bangles & Bracelets
- **Current**: gold-bangles.jpg
- **Recommended 4K**: Add a 4K image showing a collection of gold bangles and bracelets
- **Filename**: bangles-4k.jpg

### 5. Mangalsutras
- **Current**: designer-mangalsutra.jpg
- **Recommended 4K**: Add a beautiful 4K image of designer mangalsutras with traditional and modern designs
- **Filename**: mangalsutras-4k.jpg

### 6. Bridal Sets
- **Current**: bridal-set.jpg
- **Recommended 4K**: Add a magnificent 4K image of complete bridal jewellery sets
- **Filename**: bridal-sets-4k.jpg

### 7. Silver Jewellery
- **Current**: silver-earrings.jpg
- **Recommended 4K**: Add a 4K image showcasing silver jewellery collection
- **Filename**: silver-jewellery-4k.jpg

### 8. Temple Jewellery
- **Current**: temple-earrings.jpg
- **Recommended 4K**: Add a 4K image of traditional temple jewellery with divine designs
- **Filename**: temple-jewellery-4k.jpg

### 9. Kundan Jewellery
- **Current**: pearl-choker.jpg
- **Recommended 4K**: Add a 4K image of exquisite Kundan jewellery with precious stones
- **Filename**: kundan-jewellery-4k.jpg

### 10. Pendant Sets
- **Current**: diamond-ring.jpg
- **Recommended 4K**: Add a 4K image of beautiful pendant sets with chains
- **Filename**: pendant-sets-4k.jpg

### 11. Chains
- **Current**: silver-necklace.jpg
- **Recommended 4K**: Add a 4K image showing various gold and silver chains
- **Filename**: chains-4k.jpg

### 12. Anklets (Payal)
- **Current**: silver-payal.jpg
- **Recommended 4K**: Add a 4K image of ornate anklets/payals with detailed work
- **Filename**: anklets-4k.jpg

### 13. Nose Pins
- **Current**: diamond-ring.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of elegant nose pins in various designs
- **Filename**: nose-pins-4k.jpg

### 14. Brooches
- **Current**: royal-earrings.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of decorative brooches and pins
- **Filename**: brooches-4k.jpg

### 15. Kamarband (Waist Belt)
- **Current**: antique-necklace.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of traditional kamarband/waist belts
- **Filename**: kamarband-4k.jpg

### 16. Hair Accessories
- **Current**: temple-earrings.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of gold hair accessories and clips
- **Filename**: hair-accessories-4k.jpg

### 17. Men's Jewellery
- **Current**: kada-bracelet.jpg
- **Recommended 4K**: Add a 4K image of men's jewellery including chains, rings, and kadas
- **Filename**: mens-jewellery-4k.jpg

### 18. Gold Coins
- **Current**: gold-ring.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of gold coins of various weights
- **Filename**: gold-coins-4k.jpg

### 19. Religious Items
- **Current**: temple-earrings.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of religious jewellery items and pendants
- **Filename**: religious-items-4k.jpg

### 20. Lockets
- **Current**: pearl-choker.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of decorative lockets and photo lockets
- **Filename**: lockets-4k.jpg

### 21. Solitaires
- **Current**: diamond-ring.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of solitaire diamond rings and jewellery
- **Filename**: solitaires-4k.jpg

### 22. Antique Jewellery
- **Current**: antique-necklace.jpg (placeholder)
- **Recommended 4K**: Add a 4K image of antique and vintage jewellery pieces
- **Filename**: antique-jewellery-4k.jpg

## Image Specifications for 4K Quality

- **Resolution**: 3840 x 2160 pixels (minimum)
- **Format**: JPG or PNG (JPG recommended for web)
- **File Size**: Aim for 2-5 MB per image (compressed for web)
- **Quality**: High quality, professional lighting, white or neutral background
- **Aspect Ratio**: 16:9 for category cards
- **Color Space**: sRGB for web compatibility

## How to Add 4K Images

1. **Replace existing images** with 4K versions using the same filenames
2. **Or create new 4K images** with the recommended filenames above
3. **Update the category mapping** in `src/app/page.js` to use the new 4K image filenames

## Example Update in page.js

Once you have the 4K images, update the categories array like this:

```javascript
const categories = [
  { name: 'Rings', slug: 'rings', image: '/images/products/rings-4k.jpg', fallback: '💍' },
  { name: 'Necklaces & Har', slug: 'necklaces', image: '/images/products/necklaces-4k.jpg', fallback: '📿' },
  // ... and so on for all categories
];
```

## Professional Photography Tips

- Use professional lighting setup
- Clean background (white or light gray)
- Multiple angles if possible
- Show jewelry details and craftsmanship
- Natural lighting when possible
- Proper focus and depth of field
- Edit for color accuracy and brightness

## Image Compression for Web

After creating 4K images, compress them for web:
- Use tools like TinyPNG, ImageOptim, or Adobe Photoshop
- Maintain quality while reducing file size
- Target: 70-80% quality for JPG
- This ensures fast loading while maintaining visual quality