import { randomInt } from 'crypto';
import { $, $$, ElementFinder, ElementArrayFinder } from 'protractor';

export class ProductsPage {
  private checkoutButton: ElementFinder;

  private cartDigit: ElementFinder;

  private products: ElementArrayFinder;

  constructor() {
    this.checkoutButton = $('.checkout-button > a');
    this.cartDigit = $('.cartQuantity .cartDigit');
    this.products = $$('.tileAdd button');
  }

  public async addToCart(number=0): Promise<void> {
    let index = number;
    const lenghProducts = (await this.products).length
    if (index <= 0 || index > lenghProducts ) {
      index = randomInt(0, lenghProducts - 1);
    } else{
      index = index - 1;
    }
     const selectedProduct: ElementFinder = await (await this.products)[index];

     await selectedProduct.click();

  }

  public async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  public getCheckoutButton(): ElementFinder {
    return this.checkoutButton;
  }

  public getCartDigit(): ElementFinder {
    return this.cartDigit
  }

}