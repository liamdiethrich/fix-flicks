export function buildAmazonProductUrl(
  asin: string,
  tag: string,
  domain = "www.amazon.com"
): string {
  const url = new URL(`https://${domain}/dp/${asin}`);
  if (tag) {
    url.searchParams.set("tag", tag);
  }
  return url.toString();
}

export function buildAddToCartUrl(
  items: { asin: string; quantity: number }[],
  tag: string,
  domain = "www.amazon.com"
): string {
  const url = new URL(`https://${domain}/gp/aws/cart/add.html`);
  if (tag) {
    url.searchParams.set("AssociateTag", tag);
  }
  items.forEach((item, index) => {
    const position = index + 1;
    url.searchParams.set(`ASIN.${position}`, item.asin);
    url.searchParams.set(`Quantity.${position}`, String(item.quantity));
  });
  return url.toString();
}
