## Shopping Cart

This project is a shopping cart application similar to those commonly found in e-commerce platforms. The application is designed to operate with a file-based input-output system, processing commands from an input file and outputting the results to a separate file.

### Features

- **Command Processing:** The application reads a series of commands from a provided input file. Each command represents an action related to the shopping cart, such as adding items, removing them, or displaying the cart's contents.

- **Shopping Cart Functionality:** Users can perform typical shopping cart operations like adding items, removing items, resetting the cart, and displaying the contents.

- **Item Management:** Supports different types of products, including default items, digital items, and value-added services (VAS items), with specific rules for each type.

- **Promotion Handling:** Implements various promotion types like SameSellerPromotion, CategoryPromotion, and TotalPricePromotion, applying discounts based on predefined criteria.

- **Output Generation**: After processing each command, the application writes the results to an output and db file, detailing the outcomes of the operations performed.

### General Design

- **Services:** The application is designed around the concept of services, with each service being responsible for a specific set of operations. The services are implemented as classes, with each service having a single responsibility.
- **Entities:** The application makes use of entities to represent the various objects in the domain model, such as the shopping cart, items, and promotions. The entities are implemented as classes, with each entity having a single responsibility.
- **Repositories:** The application makes use of repositories to store and retrieve the entities. The repositories are implemented as classes, with each repository having a single responsibility.
- **DTOs(Data Transfer Objects):** The application makes use of DTOs to transfer data between the services and the repositories. The DTOs are implemented as classes, with each DTO having a single responsibility.

### Architecture

The application structured arount key object-oriented design principles:

- **Cart:** The Cart class represents the shopping cart, which stores the items added by the user. It provides methods for adding and removing items, as well as for displaying the cart's contents.

- **Promotion:** The Promotion class represents the various types of promotions available. It provides methods for calculating the discount amount and for displaying the promotion's details.

- **Command:** The Command class represents the commands that can be performed on the shopping cart. It provides methods for executing the command and for displaying the command's details.

### Development Practices

- **Test-Driven Development:** The application was developed using a test-driven approach, with unit tests written for each class and method.

- **SOLID Principles:** The application was designed around the SOLID principles of object-oriented design, with each class having a single responsibility and being open to extension but closed to modification.

**Design Patterns in the Project**

- **Factory Method:** In the project, the CartRepository class may be seen as an implementation of the Factory Method pattern. This pattern is used to delegate the instantiation process of Cart objects to subclasses. For example, the CartRepository might have a method that creates different types of Cart objects depending on various promotion types, showcasing the flexibility and extensibility of the Factory Method pattern.

- **Strategy**: The Strategy pattern is exemplified in the PromotionService, where different promotion strategies (such as TotalPricePromotion, CategoryPromotion) are encapsulated within their respective classes. These classes implement a common Promotion interface, allowing for different discount calculation strategies to be applied interchangeably. This approach demonstrates the Strategy pattern's ability to enable switching between different algorithms or strategies seamlessly.

- **Template Method:** If the Cart class in the project outlines a general workflow for cart operations and leaves certain steps to be implemented by subclasses, it would be a classic example of the Template Method pattern. This pattern helps in defining the skeleton of an operation in a method, deferring some steps to subclasses, thereby allowing these steps to vary without changing the overall algorithm's structure.

**Domain-Driven Design (DDD) in the Project**

- **Entities**: The core entities in the project, such as Cart, Item, and Promotion, represent essential concepts in the e-commerce domain. Each entity encapsulates characteristics and behaviors crucial to the domain, illustrating the effective use of DDD principles.

- **Aggregates**: The Cart class acts as an aggregate root, encapsulating multiple Item objects and their associated Promotions. This design ensures the integrity and consistency of the entire aggregate, a key aspect of DDD.

- **Repositories**: Classes like CartRepository and PromotionRepository serve as bridges between the domain model and the data layer. They abstract the way domain objects are stored and retrieved, fulfilling DDD's emphasis on defining clear boundaries and interactions between the domain and data layers.

### Installation

Clone the repository

```sh
git clone https://github.com/DevelopmentHiring/BugrahanOzturk.git
```

Go to the project directory

```sh
cd shopping-cart
```

Install dependencies

```sh
npm install
```

Run the application

```sh
npm start
```

## Testing

Run the tests

```sh
npm test
```

#### Code Coverage

Run the tests with code coverage

```sh
npm run test:cov
```

**Coverage rates of all tests are 100%.**

### Usage

There are files in main directory named `input.json`, `output.json` and `db.json`. You can change these files as you wish. The application will read the commands from the input file and write the results to the output file.

#### Input File Format

```json
{
  "command": "addItem",
  "payload": {
    "itemId": 1,
    "categoryId": 2,
    "sellerId": 3,
    "price": 100,
    "quantity": 1
  }
}
```

#### Output File Format

```json
{ "result": true, "message": "Item added to cart" }
```

#### DB File Format

```json
{
  "items": [
    { "itemId": 1, "categoryId": 2, "sellerId": 3, "price": 100, "quantity": 1 }
  ],
  "totalAmount": 100,
  "totalDiscount": 0,
  "appliedPromotionId": 0
}
```

When the application is run, it will read the commands from the input file and write the results to the output and db files. The db file will be updated after each command, and the output file will contain the results of the operations performed.
