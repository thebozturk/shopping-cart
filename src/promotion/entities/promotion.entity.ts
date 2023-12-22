export class Promotion {
  promotionId: number;
  applicableItems: number[];
  discountRate?: number;
  discountAmount?: number;
  type?: string;

  constructor(
    promotionId: number,
    applicableItems: number[],
    discountRate?: number,
    discountAmount?: number,
    type?: string,
  ) {
    this.promotionId = promotionId;
    this.applicableItems = applicableItems;
    this.discountRate = discountRate;
    this.discountAmount = discountAmount;
    this.type = type;
  }
}

export class SameSellerPromotion extends Promotion {
  constructor() {
    super(9909, []);
  }
}

export class CategoryPromotion extends Promotion {
  constructor() {
    super(5676, [3003], 0.05);
  }
}

export class TotalPricePromotion extends Promotion {
  constructor() {
    super(1232, [], 0, 0);
  }
}
