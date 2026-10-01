# Category Images Guide for Jay Bhavani Ornaments

## Installed Category Images

Each homepage category now has its own local, full-resolution image. The originals are stored in `public/images/products/` and are displayed as responsive 3:2 crops.

| Category | Image | Pexels photo ID |
| --- | --- | ---: |
| Rings | `rings-4k.jpg` | 30541169 |
| Necklaces & Har | `necklaces-4k.jpg` | 28347074 |
| Earrings | `earrings-4k.jpg` | 13595577 |
| Bangles & Bracelets | `bangles-4k.jpg` | 28933801 |
| Mangalsutras | `mangalsutras-4k.jpg` | 7862219 |
| Bridal Sets | `bridal-sets-4k.jpg` | 32077588 |
| Silver Jewellery | `silver-jewellery-4k.jpg` | 9430468 |
| Temple Jewellery | `temple-jewellery-4k.jpg` | 13518918 |
| Kundan Jewellery | `kundan-jewellery-4k.jpg` | 32989032 |
| Pendant Sets | `pendant-sets-4k.jpg` | 29502933 |
| Chains | `chains-4k.jpg` | 7679824 |
| Anklets (Payal) | `anklets-4k.jpg` | 12564237 |
| Nose Pins | `nose-pins-4k.jpg` | 5500474 |
| Brooches | `brooches-4k.jpg` | 17434774 |
| Kamarband (Waist Belt) | `kamarband-4k.jpg` | 14825268 |
| Hair Accessories | `hair-accessories-4k.jpg` | 9585690 |
| Men's Jewellery | `mens-jewellery-4k.jpg` | 26246207 |
| Gold Coins | `gold-coins-4k.jpg` | 8442324 |
| Religious Items | `religious-items-4k.jpg` | 17027942 |
| Lockets | `lockets-4k.jpg` | 35756968 |
| Solitaires | `solitaires-4k.jpg` | 5737315 |
| Antique Jewellery | `antique-jewellery-4k.jpg` | 5497303 |

The images are from Pexels' free-photo collection. Attribution is not required by the [Pexels license](https://www.pexels.com/license/); photo IDs are listed here for reference.

## Image Specifications for 4K Quality

- **Resolution**: Use original 4K-or-higher photos; preserve the original dimensions
- **Format**: JPG or PNG (JPG recommended for web)
- **File Size**: Keep originals local; responsive image delivery handles browser-sized variants
- **Quality**: High quality, professional lighting, white or neutral background
- **Aspect Ratio**: Category cards use a consistent 3:2 crop; keep the subject near the center
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

The homepage uses Next.js responsive image delivery so the browser receives an appropriately sized, compressed variant instead of downloading every full-resolution original at once.