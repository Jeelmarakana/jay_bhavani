export function getProductOccasion(product) {
  if (product.occasion) return product.occasion;

  if (product.category === 'bridal-sets') return 'Bridal';

  const name = product.name.toLowerCase();
  if (name.includes('antique') || name.includes('temple') || name.includes('kundan')) {
    return 'Antique';
  }

  if (product.metal.toLowerCase().includes('diamond')) {
    return 'Modern';
  }

  if (product.category === 'silver') {
    return 'Daily Wear';
  }

  return 'Daily Wear';
}
