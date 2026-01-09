import { describe, expect, it } from "vitest";
import { buildAddToCartUrl, buildAmazonProductUrl } from "./amazon";

describe("amazon url builders", () => {
  it("builds product urls with tag", () => {
    const url = buildAmazonProductUrl("B000000000", "tag-20");
    expect(url).toBe("https://www.amazon.com/dp/B000000000?tag=tag-20");
  });

  it("builds add-to-cart urls with items and tag", () => {
    const url = buildAddToCartUrl(
      [
        { asin: "B000000000", quantity: 1 },
        { asin: "B000000001", quantity: 2 },
      ],
      "tag-20"
    );
    expect(url).toBe(
      "https://www.amazon.com/gp/aws/cart/add.html?AssociateTag=tag-20&ASIN.1=B000000000&Quantity.1=1&ASIN.2=B000000001&Quantity.2=2"
    );
  });
});
