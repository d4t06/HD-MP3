export function abbreviateNumber(val: number) {
  const SI_SYMBOL = ["", "K", "M", "B"];

  // Determine the tier
  const tier = (Math.log10(Math.abs(val)) / 3) | 0;

  // If number is less than 1000, just return it as is
  if (tier === 0) {
    return val.toString();
  }

  // Get the scaled number
  const scaledNumber = val / Math.pow(10, tier * 3);

  // Format the number and add the suffix
  return scaledNumber.toFixed(1) + SI_SYMBOL[tier];
}
