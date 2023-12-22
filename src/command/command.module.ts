import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CartService } from '../cart/cart.service';
@Module({
  providers: [CommandService, CartService],
  controllers: [],
})
export class CommandModule {}
