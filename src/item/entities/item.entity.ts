export class Item {
  itemId: number;
  categoryId: number;
  sellerId: number;
  price: number;
  quantity: number;
  vasItems: any;

  constructor(
    itemId: number,
    categoryId: number,
    sellerId: number,
    price: number,
    quantity: number,
  ) {
    this.itemId = itemId;
    this.categoryId = categoryId;
    this.sellerId = sellerId;
    this.price = price;
    this.quantity = quantity;
    this.vasItems = [];
  }
}
