export class PromotionDTO {
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
  ) {
    this.promotionId = promotionId;
    this.applicableItems = applicableItems;
    this.discountRate = discountRate;
    this.discountAmount = discountAmount;
  }
}
