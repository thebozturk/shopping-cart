import { Item } from '../../item/entities/item.entity';

export class Cart {
  items: Item[];
  totalAmount: number;
  totalDiscount: number;
  appliedPromotionId: number;

  constructor() {
    this.items = [];
    this.totalAmount = 0;
    this.totalDiscount = 0;
    this.appliedPromotionId = 0;
  }
}
