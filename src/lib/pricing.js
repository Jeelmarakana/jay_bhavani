export function getRatePerGram(product, rates) {
  if (!product || !rates) return 0;

  const metal = product.metal.toLowerCase();

  if (metal.includes('gold')) {
    if (product.purity === '22K') return rates.gold22k;
    if (product.purity === '18K') return rates.gold18k;
    return rates.gold24k;
  }

  if (metal.includes('silver')) {
    return rates.silver;
  }

  if (metal.includes('diamond')) {
    return rates.gold18k;
  }

  return rates.gold22k;
}

export function calculateProductPrice(product, rates) {
  if (!product || !rates) return null;

  const ratePerGram = getRatePerGram(product, rates);
  let baseMetalValue = product.weight * ratePerGram;
  let diamondCharges = 0;

  if (product.metal.toLowerCase().includes('diamond')) {
    diamondCharges = product.weight * 12000;
  }

  const makingChargesValue = baseMetalValue * (product.makingCharges / 100);
  const subtotal = baseMetalValue + makingChargesValue + diamondCharges;
  const gstValue = subtotal * 0.03;
  const total = subtotal + gstValue;

  return {
    ratePerGram: Math.round(ratePerGram),
    metalValue: Math.round(baseMetalValue),
    diamondValue: Math.round(diamondCharges),
    makingCharges: Math.round(makingChargesValue),
    gst: Math.round(gstValue),
    total: Math.round(total),
  };
}

export function formatInr(amount) {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return '—';
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function formatGoldRatePer10g(ratePerGram) {
  return formatInr(Math.round(ratePerGram * 10));
}

export function formatSilverRatePer100g(ratePerGram) {
  return formatInr(Math.round(ratePerGram * 100));
}
