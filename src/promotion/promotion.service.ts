import { Injectable } from '@nestjs/common';
import { Promotion } from './entities/promotion.entity';
import { PromotionDTO } from './dto/create-promotion.dto';
import { PromotionRepository } from './promotion.repository';
import { ResultDTO } from '../common/dto/result-dto';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class PromotionService {
  constructor(private readonly promotionRepository: PromotionRepository) {}

  addPromotion(promotionDto: PromotionDTO): ResultDTO {
    return this.promotionRepository.addPromotion(promotionDto);
  }

  applyPromotion(cart: Cart): ResultDTO {
    return this.promotionRepository.applyPromotion(cart);
  }

  getPromotions(): Promotion[] {
    return this.promotionRepository.getPromotions();
  }
}
