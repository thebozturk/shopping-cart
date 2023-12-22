export class VasItemDTO {
  itemId: number;
  vasItemId: number;
  vasCategoryId: number;
  vasSellerId: number;
  price: number;
  quantity: number;
  static readonly VALID_CATEGORIES = 1001 || 3004;
  static readonly CATEGORY_ID = 3242;
  static readonly SELLER_ID = 5003;
}
