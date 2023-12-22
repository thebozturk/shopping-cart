import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionRepository } from './promotion.repository';

@Module({
  providers: [PromotionService, PromotionRepository],
  controllers: [],
  exports: [PromotionService, PromotionRepository],
})
export class PromotionModule {}
