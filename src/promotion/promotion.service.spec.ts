import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { PromotionRepository } from './promotion.repository';
import {
  SameSellerPromotion,
  CategoryPromotion,
  TotalPricePromotion,
} from './entities/promotion.entity';

describe('Services -> Promotion', () => {
  let service: PromotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionService, PromotionRepository],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
  });

  it('should add a promotion', () => {
    const response = service.addPromotion({
      promotionId: 1,
      applicableItems: [1],
      discountRate: 10,
      discountAmount: 0,
      type: 'same-seller',
    });
    expect(response).toEqual({
      result: true,
      message: 'Promotion added.',
    });
  });

  it('should apply a promotion', () => {
    service.addPromotion({
      promotionId: 1,
      applicableItems: [1],
      discountRate: 10,
      discountAmount: 0,
      type: 'same-seller',
    });
    const response = service.applyPromotion({
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
    });
    expect(response).toEqual({
      result: true,
      message: 'Promotion applied.',
    });
  });

  it('should get all promotions', () => {
    service.addPromotion({
      promotionId: 1,
      applicableItems: [1],
      discountRate: 10,
      discountAmount: 0,
      type: 'same-seller',
    });
    const response = service.getPromotions();
    expect(response).toEqual([
      new SameSellerPromotion(),
      new CategoryPromotion(),
      new TotalPricePromotion(),
      {
        promotionId: 1,
        applicableItems: [1],
        discountRate: 10,
        discountAmount: 0,
        type: 'same-seller',
      },
    ]);
  });
});
