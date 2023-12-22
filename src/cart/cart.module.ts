import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { PromotionModule } from '../promotion/promotion.module';
import { CartRepository } from './cart.repository';
import { PromotionService } from '../promotion/promotion.service';
import { CommandService } from '../command/command.service';
import { CommandModule } from '../command/command.module';

@Module({
  providers: [CartService, CartRepository, PromotionService, CommandService],
  controllers: [],
  imports: [PromotionModule, CartModule, CommandModule],
  exports: [CartService, CartRepository],
})
export class CartModule {}
