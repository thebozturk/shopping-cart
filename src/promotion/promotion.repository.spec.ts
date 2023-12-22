import { PromotionRepository } from './promotion.repository';
import { PromotionDTO } from './dto/create-promotion.dto';
import { Cart } from '../cart/entities/cart.entity';

describe('Repositories -> Promotion', () => {
  let repository: PromotionRepository;

  beforeEach(() => {
    repository = new PromotionRepository();
  });

  it('should add a promotion', () => {
    const promotionDto: PromotionDTO = {
      promotionId: 41,
      applicableItems: [1, 2, 3],
      discountRate: 0.1,
      discountAmount: 0,
      type: 'same-seller',
    };

    repository.addPromotion(promotionDto);
    expect(repository.getPromotions().length).toEqual(4);
  });

  it('if the sellers are not same, should not apply same seller promotion', () => {
    const cart: Cart = {
      items: [
        {
          itemId: 61,
          categoryId: 1,
          price: 100,
          sellerId: 1,
          quantity: 1,
          vasItems: [],
        },
        {
          itemId: 62,
          categoryId: 1,
          price: 100,
          sellerId: 2,
          quantity: 1,
          vasItems: [],
        },
      ],
      totalAmount: 200,
      totalDiscount: 0,
      appliedPromotionId: 0,
    };

    repository.applyPromotion(cart);
    expect(cart.totalDiscount).toEqual(0);
    expect(cart.appliedPromotionId).toEqual(0);
    expect(cart.totalAmount).toEqual(200);
  });

  it('if the sellers are same, should apply same seller promotion', () => {
    const cart: Cart = {
      items: [
        {
          itemId: 61,
          categoryId: 1,
          price: 100,
          sellerId: 1,
          quantity: 1,
          vasItems: [],
        },
        {
          itemId: 62,
          categoryId: 1,
          price: 100,
          sellerId: 1,
          quantity: 1,
          vasItems: [],
        },
      ],
      totalAmount: 200,
      totalDiscount: 0,
      appliedPromotionId: 0,
    };

    repository.applyPromotion(cart);
    expect(cart.totalDiscount).toEqual(20);
    expect(cart.appliedPromotionId).toEqual(9909);
    expect(cart.totalAmount).toEqual(180);
  });

  it('if categoryId is 3003, should apply category promotion', () => {
    const cart: Cart = {
      items: [
        {
          itemId: 61,
          categoryId: 3003,
          price: 100,
          sellerId: 1,
          quantity: 1,
          vasItems: [],
        },
      ],
      totalAmount: 100,
      totalDiscount: 0,
      appliedPromotionId: 0,
    };

    repository.applyPromotion(cart);
    expect(cart.totalDiscount).toEqual(5);
    expect(cart.appliedPromotionId).toEqual(5676);
    expect(cart.totalAmount).toEqual(95);
  });

  it('if total amount is higher than 500 and les than 5.000, should apply 250 TL discount', () => {
    const cart: Cart = {
      items: [
        {
          itemId: 61,
          categoryId: 1,
          price: 100,
          sellerId: 1,
          quantity: 1,
          vasItems: [],
        },
      ],
      totalAmount: 1000,
      totalDiscount: 0,
      appliedPromotionId: 0,
    };

    repository.applyPromotion(cart);
    expect(cart.totalDiscount).toEqual(250);
    expect(cart.appliedPromotionId).toEqual(1232);
    expect(cart.totalAmount).toEqual(750);
  });

  it('if total amount is higher than 5.000 and less than 10.000, should apply 500 TL discount', () => {
    const cart: Cart = {
      items: [
        {
          itemId: 61,
          categoryId: 1,
          price: 100,
          sellerId: 1,
          quantity: 1,
          vasItems: [],
        },
      ],
      totalAmount: 9000,
      totalDiscount: 0,
      appliedPromotionId: 0,
    };

    repository.applyPromotion(cart);
    expect(cart.totalDiscount).toEqual(500);
    expect(cart.appliedPromotionId).toEqual(1232);
    expect(cart.totalAmount).toEqual(8500);
  });

  it('if total amount is higher than 10.000 and less than 50.000, should apply 1.000 TL discount', () => {
    const cart: Cart = {
      items: [
        {
          itemId: 61,
          categoryId: 1,
          price: 100,
          sellerId: 1,
          quantity: 1,
          vasItems: [],
        },
      ],
      totalAmount: 10000,
      totalDiscount: 0,
      appliedPromotionId: 0,
    };

    repository.applyPromotion(cart);
    expect(cart.totalDiscount).toEqual(1000);
    expect(cart.appliedPromotionId).toEqual(1232);
    expect(cart.totalAmount).toEqual(9000);
  });
  it('if total amount is higher than 50.000, should apply 2.000 TL discount', () => {
    const cart: Cart = {
      items: [
        {
          itemId: 61,
          categoryId: 1,
          price: 100,
          sellerId: 1,
          quantity: 1,
          vasItems: [],
        },
      ],
      totalAmount: 100000,
      totalDiscount: 0,
      appliedPromotionId: 0,
    };

    repository.applyPromotion(cart);
    expect(cart.totalDiscount).toEqual(2000);
    expect(cart.appliedPromotionId).toEqual(1232);
    expect(cart.totalAmount).toEqual(98000);
  });
});
