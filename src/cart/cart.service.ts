import { Injectable } from '@nestjs/common';
import { Item } from '../item/entities/item.entity';
import { CartRepository } from './cart.repository';
import { ResultDTO } from '../common/dto/result-dto';
import { DisplayCartDTO } from './dto/display-cart-dto';
import { PromotionService } from '../promotion/promotion.service';
import { PromotionRepository } from '../promotion/promotion.repository';
import { VasItemDTO } from '../item/dto/vas-item.dto';
@Injectable()
export class CartService {
  private readonly repository: CartRepository;

  constructor() {
    this.repository = new CartRepository(
      new PromotionService(new PromotionRepository()),
    );
  }

  addItem(item: Item): ResultDTO {
    return this.repository.addItem(item);
  }

  addVasItemToItem(itemId: number, vasItem: VasItemDTO): ResultDTO {
    return this.repository.addVasItemToItem(itemId, vasItem);
  }

  // Removes an item from the cart and returns the result
  removeItem(itemId: number): ResultDTO {
    return this.repository.removeItem(itemId);
  }

  // Resets the cart and returns the result
  resetCart(): ResultDTO {
    return this.repository.resetCart();
  }

  // Returns the cart
  displayCart(): DisplayCartDTO {
    return this.repository.displayCart();
  }
}
