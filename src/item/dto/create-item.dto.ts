import { VasItemDTO } from '../dto/vas-item.dto';

export class Item {
  itemId: number;
  categoryId: number;
  sellerId: number;
  price: number;
  quantity: number;
  vasItems: Array<VasItemDTO>;

  constructor(
    itemId: number,
    categoryId: number,
    sellerId: number,
    price: number,
    quantity: number,
    vasItems: Array<VasItemDTO> = [],
  ) {
    this.itemId = itemId;
    this.categoryId = categoryId;
    this.sellerId = sellerId;
    this.price = price;
    this.quantity = quantity;
    this.vasItems = vasItems;
  }
}
