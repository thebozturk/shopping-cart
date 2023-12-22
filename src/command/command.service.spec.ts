import * as fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandService } from './command.service';
import { CartService } from '../cart/cart.service';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('CommandService', () => {
  let service: CommandService;
  let cartService: CartService;
  const dbMock = {
    items: [
      {
        itemId: 3,
        categoryId: 2,
        sellerId: 3,
        price: 100,
        quantity: 1,
        vasItems: [],
      },
    ],
    totalAmount: 100,
    totalDiscount: 0,
    appliedPromotionId: 0,
  };
  const inputFilePath = 'input.json';
  const outputFilePath = 'output.json';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandService, CartService],
    }).compile();

    service = module.get<CommandService>(CommandService);
    cartService = module.get<CartService>(CartService);
  });

  it('if command is addItem, call addItem method', () => {
    const input = {
      command: 'addItem',
      payload: {
        itemId: 1,
        categoryId: 1001,
        sellerId: 2001,
        price: 100,
        quantity: 2,
        vasItems: [],
      },
    };

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(input))
      .mockReturnValueOnce(JSON.stringify(dbMock));
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest.spyOn(cartService, 'addItem');
    service.commandHandler(inputFilePath, outputFilePath);
  });

  it('if command is addVasItemToItem, call addVasItemToItem method', () => {
    const input = {
      command: 'addVasItemToItem',
      payload: {
        itemId: 1,
        vasItemId: 2,
        vasCategoryId: 1,
        vasSellerId: 23,
        price: 120,
        quantity: 3,
      },
    };

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(input))
      .mockReturnValueOnce(JSON.stringify(dbMock));
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest.spyOn(cartService, 'addItem');
    jest.spyOn(cartService, 'addVasItemToItem');
    service.commandHandler(inputFilePath, outputFilePath);
  });

  it('if command is removeItem, call removeItem method', () => {
    const input = { command: 'removeItem', payload: { itemId: 1 } };

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(input))
      .mockReturnValueOnce(JSON.stringify(dbMock));
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest.spyOn(cartService, 'removeItem');
    service.commandHandler(inputFilePath, outputFilePath);
  });

  it('if command is resetCart, call resetCart method', () => {
    const input = { command: 'resetCart' };

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(input))
      .mockReturnValueOnce(JSON.stringify(dbMock));
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest.spyOn(cartService, 'resetCart');
    service.commandHandler(inputFilePath, outputFilePath);
  });

  it('if command is displayCart, call displayCart method', () => {
    const input = { command: 'displayCart' };

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(input))
      .mockReturnValueOnce(JSON.stringify(dbMock));
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest.spyOn(cartService, 'displayCart');
    service.commandHandler(inputFilePath, outputFilePath);
  });

  it('if command is invalid, return error message', () => {
    const input = { command: 'invalid' };

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(input))
      .mockReturnValueOnce(
        JSON.stringify({ result: false, message: 'Invalid command' }),
      );
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    service.commandHandler(inputFilePath, outputFilePath);
  });
});
