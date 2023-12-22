import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { CartService } from '../cart/cart.service';
import { VasItemDTO } from '../item/dto/vas-item.dto';
import { Item } from '../item/entities/item.entity';

@Injectable()
export class CommandService {
  constructor(private readonly cartService: CartService) {}

  commandHandler(inputFilePath: string, outputFilePath: string) {
    const input = fs.readFileSync(inputFilePath, 'utf-8');
    const file = JSON.parse(input);
    const { command, payload } = file;

    switch (command) {
      case 'addItem':
        const item: Item = payload;
        fs.writeFileSync(
          outputFilePath,
          JSON.stringify(this.cartService.addItem(item)),
        );
        break;
      case 'addVasItemToItem':
        const vasItem: VasItemDTO = payload;
        const itemdId = vasItem.itemId;
        const result = this.cartService.addVasItemToItem(itemdId, vasItem);
        fs.writeFileSync(outputFilePath, JSON.stringify(result));
        break;
      case 'removeItem':
        const { itemId } = payload;
        fs.writeFileSync(
          outputFilePath,
          JSON.stringify(this.cartService.removeItem(itemId)),
        );
        break;
      case 'resetCart':
        fs.writeFileSync(
          outputFilePath,
          JSON.stringify(this.cartService.resetCart()),
        );
        break;
      case 'displayCart':
        fs.writeFileSync(
          outputFilePath,
          JSON.stringify(this.cartService.displayCart()),
        );
        break;
      default:
        fs.writeFileSync(
          outputFilePath,
          JSON.stringify({
            result: false,
            message: 'Invalid command',
          }),
        );
    }
  }
}
