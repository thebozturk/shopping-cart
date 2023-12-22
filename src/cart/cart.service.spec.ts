import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PromotionService } from '../promotion/promotion.service';
import { PromotionRepository } from '../promotion/promotion.repository';

describe('Services -> Cart', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, PromotionService, PromotionRepository],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should add an item to the cart', () => {
    const response = service.addItem({
      itemId: 1,
      categoryId: 1001,
      sellerId: 2001,
      price: 100,
      quantity: 2,
      vasItems: [],
    });
    expect(response).toEqual({
      result: true,
      message: 'Item added to cart.',
    });
  });

  it('should add vas item to the cart', () => {
    const response = service.addVasItemToItem(1, {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 3242,
      vasSellerId: 5003,
      price: 120,
      quantity: 3,
    });
    expect(response).toEqual({
      result: true,
      message: 'VAS item added to item.',
    });
  });

  it('should remove an item from the cart', () => {
    const response = service.removeItem(1);
    expect(response).toEqual({
      result: true,
      message: 'Item removed from cart.',
    });
  });

  it('should display the cart', () => {
    const response = service.displayCart();
    expect(response.result).toEqual(true);
    expect(response.message).toBeInstanceOf(Object);
  });

  it('should reset the cart', () => {
    const response = service.resetCart();
    expect(response).toEqual({
      result: true,
      message: 'Cart reset.',
    });
  });
});
