import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { PromotionModule } from './promotion/promotion.module';
import { CommandService } from './command/command.service';
import { PromotionService } from './promotion/promotion.service';
import { CartService } from './cart/cart.service';
import { PromotionRepository } from './promotion/promotion.repository';

@Module({
  imports: [CartModule, PromotionModule],
  controllers: [],
  providers: [
    CommandService,
    PromotionService,
    CartService,
    PromotionRepository,
  ],
})
export class AppModule {}
