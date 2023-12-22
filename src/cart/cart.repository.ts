import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { Item } from '../item/entities/item.entity';
import { ResultDTO } from '../common/dto/result-dto';
import { DisplayCartDTO } from './dto/display-cart-dto';
import { DigitalItem } from '../item/dto/digital-item.dto';
import { PromotionService } from '../promotion/promotion.service';
import { VasItemDTO } from '../item/dto/vas-item.dto';

@Injectable()
export class CartRepository {
  private readonly dbFilePath = 'db.json';

  constructor(private readonly promotionService: PromotionService) {}

  addItem(item: Item): ResultDTO {
    const cart = this.readCartFromFile();
    item.vasItems = item.vasItems || [];

    const canAddItem = this.canAddItem(cart, item);
    if (canAddItem) {
      return canAddItem;
    }

    const increaseExistingItemQuantity = this.increaseExistingItemQuantity(
      cart,
      item,
    );
    if (increaseExistingItemQuantity) {
      return increaseExistingItemQuantity;
    }

    this.updateCartTotal(cart);
    this.writeCartToFile(cart);

    return { result: true, message: 'Item added to cart.' };
  }

  addVasItemToItem(itemId: number, vasItem: VasItemDTO): ResultDTO {
    const cart = this.readCartFromFile();
    const item = cart.items.find((i) => i.itemId === itemId);

    const canAddVasItem = this.canAddVasItem(item, vasItem);
    if (canAddVasItem) {
      return canAddVasItem;
    }

    const increaseExistVasItemQuantity = this.increaseExistVasItemQuantity(
      item,
      vasItem,
    );
    if (increaseExistVasItemQuantity) {
      return increaseExistVasItemQuantity;
    }

    item.vasItems.push(vasItem);
    this.updateCartTotal(cart);
    this.writeCartToFile(cart);

    return { result: true, message: 'VAS item added to item.' };
  }

  resetCart(): ResultDTO {
    const cart = new Cart();
    this.writeCartToFile(cart);
    return { result: true, message: 'Cart reset.' };
  }

  displayCart(): DisplayCartDTO {
    const data = { result: true, message: this.readCartFromFile() };
    this.writeDisplayCartToFile(data);
    return data;
  }

  removeItem(itemId: number): ResultDTO {
    const cart = this.readCartFromFile();
    const itemIndex = cart.items.findIndex((i) => i.itemId === itemId);
    if (itemIndex === -1) {
      return { result: false, message: 'Item not found in cart.' };
    }

    cart.items.splice(itemIndex, 1);
    this.updateCartTotal(cart);
    this.writeCartToFile(cart);

    return { result: true, message: 'Item removed from cart.' };
  }

  private canAddItem(cart: Cart, item: Item): ResultDTO {
    if (
      item.categoryId !== VasItemDTO.CATEGORY_ID &&
      this.getUniqueItemCount(cart) >= 10
    ) {
      return {
        result: false,
        message: 'Cannot add more than 10 unique items to cart.',
      };
    }

    // if there are more than 5 digital items, new item cannot be added.
    if (
      item.categoryId === DigitalItem.CATEGORY_ID &&
      this.getItemCount(cart, item) > 5
    ) {
      return {
        result: false,
        message: 'Cannot add more than 5 digital items to cart.',
      };
    }

    // check total item count
    if (this.getTotalItemCount(cart) + item.quantity > 30) {
      return {
        result: false,
        message: 'Cannot add more items, cart limit exceeded.',
      };
    }

    // check total cart value
    if (this.getTotalCartValue(cart) + item.price * item.quantity > 500000) {
      return {
        result: false,
        message: 'Cannot add item, cart total value limit exceeded.',
      };
    }
  }

  private canAddVasItem(item: Item, vasItem: VasItemDTO): ResultDTO {
    if (!item) {
      return { result: false, message: 'Item not found in cart.' };
    }

    if (vasItem.vasSellerId !== VasItemDTO.SELLER_ID) {
      return {
        result: false,
        message: 'VAS item cannot be added with this sellerId.',
      };
    }

    if (VasItemDTO.VALID_CATEGORIES !== item.categoryId) {
      return {
        result: false,
        message: 'VAS item cannot be added to this item.',
      };
    }

    const allVasItemsQuantity = item.vasItems.reduce(
      (total, vasItem) => total + vasItem.quantity,
      0,
    );
    if (
      item.vasItems.length >= 3 ||
      vasItem.quantity > 3 ||
      allVasItemsQuantity > 3
    ) {
      return {
        result: false,
        message: 'Cannot add more than 3 VAS items to a VAS item.',
      };
    }
  }

  private increaseExistVasItemQuantity(
    item: Item,
    vasItem: VasItemDTO,
  ): ResultDTO {
    const existingVasItem = this.findExistingVasItem(item, vasItem.vasItemId);
    if (existingVasItem) {
      if (existingVasItem.quantity + vasItem.quantity > 3) {
        return {
          result: false,
          message: 'Cannot add more than 3 of the same VAS item.',
        };
      }
      existingVasItem.quantity += vasItem.quantity;
    } else {
      item.vasItems.push(vasItem);
    }
  }

  private increaseExistingItemQuantity(cart: Cart, item: Item): ResultDTO {
    const existingItemIndex = cart.items.findIndex(
      (i) => i.itemId === item.itemId,
    );

    if (existingItemIndex !== -1) {
      // if the item already exist increase the quantity
      const existingItem = cart.items[existingItemIndex];
      if (existingItem.quantity + item.quantity > 10) {
        return {
          result: false,
          message: 'Cannot add more than 10 of the same item.',
        };
      }
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
  }

  private getUniqueItemCount(cart: Cart): number {
    return cart.items.filter(
      (item, index, self) =>
        self.findIndex((i) => i.itemId === item.itemId) === index,
    ).length;
  }

  private getTotalItemCount(cart: Cart): number {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  private updateCartTotal(cart: Cart) {
    cart.totalAmount = this.getTotalCartValue(cart);
    this.promotionService.applyPromotion(cart);
  }

  private getTotalCartValue(cart: Cart): number {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  private readCartFromFile(): Cart {
    try {
      const data = fs.readFileSync(this.dbFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return new Cart();
    }
  }

  private writeCartToFile(cart: Cart) {
    const data = JSON.stringify(cart);
    fs.writeFileSync(this.dbFilePath, data);
  }

  private writeDisplayCartToFile(data) {
    fs.writeFileSync(this.dbFilePath, JSON.stringify(data));
  }

  private getItemCount(cart: Cart, item: Item): number {
    const existingItemIndex = cart.items.findIndex(
      (i) => i.itemId === item.itemId,
    );
    let existingItemQuantity = 0;
    if (existingItemIndex !== -1) {
      existingItemQuantity = cart.items[existingItemIndex].quantity;
    }
    const totalQuantity = existingItemQuantity + item.quantity;
    return totalQuantity;
  }

  private findExistingVasItem(item, vasItemId) {
    return item.vasItems.find((i) => i.vasItemId === vasItemId);
  }
}
