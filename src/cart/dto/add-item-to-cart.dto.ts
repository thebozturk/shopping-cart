export class AddItemToCartDto {
  readonly itemId: number;
  readonly categoryId: number;
  readonly sellerId: number;
  readonly price: number;
  readonly quantity: number;
  readonly type: string;
}
