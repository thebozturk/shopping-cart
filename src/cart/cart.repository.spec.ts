import * as fs from 'fs';
import { CartRepository } from './cart.repository';
import { PromotionService } from '../promotion/promotion.service';
import { PromotionRepository } from '../promotion/promotion.repository';
import { Cart } from './entities/cart.entity';
import {
  TenUniqueItems,
  ThirtyQuantityItems,
  ThreeVasItem,
} from '../../mock/items';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('Repositories -> Cart', () => {
  let repository: CartRepository;

  beforeEach(() => {
    const promotionService = new PromotionService(new PromotionRepository());
    repository = new CartRepository(promotionService);

    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ items: [] }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add an item to the cart', () => {
    const item = {
      itemId: 1,
      categoryId: 1001,
      sellerId: 2001,
      price: 100,
      quantity: 2,
      vasItems: [],
    };

    const response = repository.addItem(item);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'db.json',
      expect.any(String),
    );

    const writtenData = JSON.parse(
      (fs.writeFileSync as jest.Mock).mock.calls[0][1],
    );
    expect(writtenData.items).toContainEqual(item);
    expect(response).toEqual({
      result: true,
      message: 'Item added to cart.',
    });
  });

  it('if there is not exist vasItems, it should add default array', () => {
    const item = {
      itemId: 1,
      categoryId: 1001,
      sellerId: 2001,
      price: 100,
      quantity: 2,
    } as any;

    const response = repository.addItem(item);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'db.json',
      expect.any(String),
    );

    const writtenData = JSON.parse(
      (fs.writeFileSync as jest.Mock).mock.calls[0][1],
    );
    expect(writtenData.items).toContainEqual({
      ...item,
      vasItems: [],
    });
    expect(response).toEqual({
      result: true,
      message: 'Item added to cart.',
    });
  });

  it('if the cart has 10 unique items, it should not add a new item', () => {
    const item = {
      itemId: 1,
      categoryId: 1001,
      sellerId: 2001,
      price: 100,
      quantity: 2,
      vasItems: [],
    };
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: TenUniqueItems,
      }),
    );
    const response = repository.addItem(item);
    expect(response).toEqual({
      result: false,
      message: 'Cannot add more than 10 unique items to cart.',
    });
  });

  it('if the cart has 5 digital items, it should not add a new digital item', () => {
    const item = {
      itemId: 1,
      categoryId: 7889,
      sellerId: 2001,
      price: 100,
      quantity: 2,
      vasItems: [],
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 7889,
            sellerId: 2,
            price: 100,
            quantity: 5,
            vasItems: [],
          },
        ],
      }),
    );
    const response = repository.addItem(item);
    expect(response).toEqual({
      result: false,
      message: 'Cannot add more than 5 digital items to cart.',
    });
  });

  it('if the cart has 10 items of the same product, it should not add a new item', () => {
    const item = {
      itemId: 1,
      categoryId: 1001,
      sellerId: 2001,
      price: 100,
      quantity: 2,
      vasItems: [],
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 1,
            sellerId: 2,
            price: 100,
            quantity: 10,
            vasItems: [],
          },
        ],
      }),
    );
    const response = repository.addItem(item);
    expect(response).toEqual({
      result: false,
      message: 'Cannot add more than 10 of the same item.',
    });
  });

  it('if the cart has 30 items, it should not add a new item', () => {
    const item = {
      itemId: 1,
      categoryId: 1001,
      sellerId: 2001,
      price: 100,
      quantity: 2,
      vasItems: [],
    };
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: ThirtyQuantityItems,
      }),
    );
    const response = repository.addItem(item);
    expect(response).toEqual({
      result: false,
      message: 'Cannot add more items, cart limit exceeded.',
    });
  });

  it('if the cart has 500000 total value, it should not add a new item', () => {
    const item = {
      itemId: 2,
      categoryId: 1001,
      sellerId: 2001,
      price: 498000,
      quantity: 1,
      vasItems: [],
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 1,
            sellerId: 2,
            price: 300,
            quantity: 10,
            vasItems: [],
          },
        ],
      }),
    );
    const response = repository.addItem(item);
    expect(response).toEqual({
      result: false,
      message: 'Cannot add item, cart total value limit exceeded.',
    });
  });

  it('if the item already exist increase the quantity', () => {
    const item = {
      itemId: 1,
      categoryId: 1001,
      sellerId: 2001,
      price: 100,
      quantity: 2,
      vasItems: [],
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 1,
            sellerId: 2,
            price: 100,
            quantity: 1,
            vasItems: [],
          },
        ],
      }),
    );
    const response = repository.addItem(item);
    expect(response).toEqual({
      result: true,
      message: 'Item added to cart.',
    });
  });

  it('should add vasItem to item', () => {
    const vasItem = {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 1,
      vasSellerId: 5003,
      price: 120,
      quantity: 3,
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 1001,
            sellerId: 3,
            price: 100,
            quantity: 1,
            vasItems: [],
          },
        ],
      }),
    );
    const response = repository.addVasItemToItem(1, vasItem);
    expect(response).toEqual({
      result: true,
      message: 'VAS item added to item.',
    });
  });

  it('if given itemId does not exist, it should not add the vasItem', () => {
    const vasItem = {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 1,
      vasSellerId: 23,
      price: 120,
      quantity: 3,
    };
    const response = repository.addVasItemToItem(1, vasItem);
    expect(response).toEqual({
      result: false,
      message: 'Item not found in cart.',
    });
  });

  it('if given vasSellerId is not match the valid vasItem sellerId, it should not add the vasItem', () => {
    const vasItem = {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 1,
      vasSellerId: 23,
      price: 120,
      quantity: 3,
    };
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 1,
            sellerId: 2,
            price: 100,
            quantity: 1,
            vasItems: [],
          },
        ],
      }),
    );
    const response = repository.addVasItemToItem(1, vasItem);
    expect(response).toEqual({
      result: false,
      message: 'VAS item cannot be added with this sellerId.',
    });
  });

  it('if the cart has 3 vasItems of the same product, it should not add a new vasItem', () => {
    const vasItem = {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 1,
      vasSellerId: 5003,
      price: 120,
      quantity: 3,
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: ThreeVasItem,
      }),
    );
    const response = repository.addVasItemToItem(1, vasItem);
    expect(response).toEqual({
      result: false,
      message: 'Cannot add more than 3 VAS items to a VAS item.',
    });
  });

  it('if sum of exist vasItem and new vasItem quantity is more than 3, it should not add the vasItem', () => {
    const vasItem = {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 1,
      vasSellerId: 5003,
      price: 120,
      quantity: 2,
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 1001,
            sellerId: 3,
            price: 100,
            quantity: 1,
            vasItems: [
              {
                itemId: 1,
                vasItemId: 2,
                vasCategoryId: 1,
                vasSellerId: 5003,
                price: 120,
                quantity: 2,
              },
            ],
          },
        ],
      }),
    );
    const response = repository.addVasItemToItem(1, vasItem);
    expect(response).toEqual({
      result: false,
      message: 'Cannot add more than 3 of the same VAS item.',
    });
  });

  it('if vasItem quantity is more than 3, it should not add the vasItem', () => {
    const vasItem = {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 1,
      vasSellerId: 5003,
      price: 120,
      quantity: 4,
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 1001,
            sellerId: 3,
            price: 100,
            quantity: 1,
            vasItems: [],
          },
        ],
      }),
    );

    const response = repository.addVasItemToItem(1, vasItem);
    expect(response).toEqual({
      result: false,
      message: 'Cannot add more than 3 VAS items to a VAS item.',
    });
  });

  it('if vasItem already exist, it should increase the quantity', () => {
    const vasItem = {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 1,
      vasSellerId: 5003,
      price: 120,
      quantity: 2,
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 1001,
            sellerId: 3,
            price: 100,
            quantity: 1,
            vasItems: [
              {
                itemId: 1,
                vasItemId: 2,
                vasCategoryId: 1,
                vasSellerId: 5003,
                price: 120,
                quantity: 1,
              },
            ],
          },
        ],
      }),
    );
    const response = repository.addVasItemToItem(1, vasItem);
    expect(response).toEqual({
      result: true,
      message: 'VAS item added to item.',
    });
  });

  it('if vasItem category is not match the item category, it should not add the vasItem', () => {
    const vasItem = {
      itemId: 1,
      vasItemId: 2,
      vasCategoryId: 1,
      vasSellerId: 5003,
      price: 120,
      quantity: 3,
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 1,
            categoryId: 61,
            sellerId: 2,
            price: 100,
            quantity: 1,
            vasItems: [],
          },
        ],
      }),
    );
    const response = repository.addVasItemToItem(1, vasItem);
    expect(response).toEqual({
      result: false,
      message: 'VAS item cannot be added to this item.',
    });
  });

  it('should reset the cart', () => {
    const response = repository.resetCart();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'db.json',
      expect.any(String),
    );

    const writtenData = JSON.parse(
      (fs.writeFileSync as jest.Mock).mock.calls[0][1],
    );
    expect(writtenData.items).toEqual([]);
    expect(response).toEqual({
      result: true,
      message: 'Cart reset.',
    });
  });

  it('should display the cart', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        items: [
          {
            itemId: 3,
            categoryId: 1,
            sellerId: 2,
            price: 100,
            quantity: 10,
            vasItems: [],
          },
        ],
        totalAmount: 1000,
        totalDiscount: 0,
        appliedPromotionId: 0,
      }),
    );
    const response = repository.displayCart();
    expect(response).toEqual({
      result: true,
      message: {
        items: [
          {
            itemId: 3,
            categoryId: 1,
            sellerId: 2,
            price: 100,
            quantity: 10,
            vasItems: [],
          },
        ],
        totalAmount: 1000,
        totalDiscount: 0,
        appliedPromotionId: 0,
      },
    });
  });

  it('if there is error when reading cart from file, should return new cart', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw new Error('error');
    });
    const response = repository.displayCart();
    expect(response).toEqual({
      result: true,
      message: new Cart(),
    });
  });
});
