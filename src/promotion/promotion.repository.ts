import { Injectable } from '@nestjs/common';
import { Promotion } from './entities/promotion.entity';
import { PromotionDTO } from './dto/create-promotion.dto';
import { Cart } from '../cart/entities/cart.entity';
import {
  SameSellerPromotion,
  CategoryPromotion,
  TotalPricePromotion,
} from './entities/promotion.entity';
import { ResultDTO } from '../common/dto/result-dto';

@Injectable()
export class PromotionRepository {
  private readonly promotions: Promotion[];

  constructor() {
    this.promotions = [
      new SameSellerPromotion(),
      new CategoryPromotion(),
      new TotalPricePromotion(),
    ];
  }

  addPromotion(promotionDto: PromotionDTO): ResultDTO {
    this.promotions.push(promotionDto);
    return {
      result: true,
      message: 'Promotion added.',
    };
  }

  /**
   * The function applies different types of promotions to a shopping cart and returns a result
   * indicating whether the promotion was successfully applied.
   * @param {Cart} cart - The `cart` parameter is an object that represents the shopping cart. It
   * contains information about the items in the cart, such as the quantity, price, and seller. The
   * `cart` object also has properties for the total discount, applied promotion ID, and total amount
   * after applying the promotion.
   * @returns The function `applyPromotion` returns a `ResultDTO` object.
   */
  applyPromotion(cart: Cart): ResultDTO {
    let maxDiscount = 0;
    let appliedPromotionId = 0;

    for (const promotion of this.promotions) {
      let discount = 0;

      if (promotion instanceof SameSellerPromotion) {
        discount = this.applySameSellerPromotion(cart);
      } else if (promotion instanceof CategoryPromotion) {
        discount = this.applyCategoryPromotion(cart, promotion);
      } else if (promotion instanceof TotalPricePromotion) {
        discount = this.applyTotalPricePromotion(cart);
      }

      if (discount > maxDiscount) {
        maxDiscount = discount;
        appliedPromotionId = promotion.promotionId;
      }
    }

    cart.totalDiscount = maxDiscount;
    cart.appliedPromotionId = appliedPromotionId;
    cart.totalAmount -= maxDiscount;
    return {
      result: true,
      message: 'Promotion applied.',
    };
  }

  getPromotions(): Promotion[] {
    return this.promotions;
  }

  /**
   * The function applies a promotion to the total amount in the cart if all items have the same seller
   * but there are multiple items.
   * @param {Cart} cart - The `cart` parameter is an object that represents a shopping cart. It
   * contains an array of `items`, where each item has properties such as `sellerId` and `itemId`. The
   * `totalAmount` property represents the total amount of the cart.
   * @returns a number, which represents the discount amount to be applied to the cart. If the cart
   * contains items from the same seller but with different item IDs, a discount of 10% of the total
   * cart amount will be applied. Otherwise, it returns 0, indicating no discount is applicable.
   */
  private applySameSellerPromotion(cart: Cart): number {
    const sellerIds = new Set();
    const itemIds = new Set();

    for (const item of cart.items) {
      sellerIds.add(item.sellerId);
      itemIds.add(item.itemId);
    }

    if (sellerIds.size === 1 && itemIds.size > 1) {
      return cart.totalAmount * 0.1;
    }
    return 0;
  }

  /**
   * The function applies a category promotion to a cart by calculating the total discount based on the
   * applicable items and the discount rate.
   * @param {Cart} cart - The cart parameter represents the shopping cart object that contains the
   * items the user wants to purchase.
   * @param {CategoryPromotion} promotion - The `promotion` parameter is an object that represents a
   * category promotion. It contains the following properties:
   * @returns the total discount amount for the applicable items in the cart based on the given
   * category promotion.
   */
  private applyCategoryPromotion(
    cart: Cart,
    promotion: CategoryPromotion,
  ): number {
    let discount = 0;

    for (const item of cart.items) {
      if (promotion.applicableItems.includes(item.categoryId)) {
        discount += item.price * promotion.discountRate;
      }
    }
    return discount;
  }

  /**
   * The function applies a promotion to the total price of a cart based on its total amount.
   * @param {Cart} cart - The `cart` parameter is an object of type `Cart` which represents a shopping
   * cart. It likely contains information about the items in the cart, such as their quantities and
   * prices. The `totalAmount` property of the `cart` object represents the total amount of the cart,
   * which is the
   * @returns a number, which represents the discount amount based on the total amount in the cart.
   */
  private applyTotalPricePromotion(cart: Cart): number {
    if (cart.totalAmount >= 500 && cart.totalAmount < 5000) {
      return 250;
    } else if (cart.totalAmount >= 5000 && cart.totalAmount < 10000) {
      return 500;
    } else if (cart.totalAmount >= 10000 && cart.totalAmount < 50000) {
      return 1000;
    } else if (cart.totalAmount >= 50000) {
      return 2000;
    }

    return 0;
  }
}
