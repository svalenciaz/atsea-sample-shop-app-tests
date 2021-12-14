import { $, ElementFinder } from 'protractor';

export class SuccessPage {

  private successMessage: ElementFinder;

  private successButton: ElementFinder;

  private successButtonPurchase: ElementFinder;

  constructor() {
    this.successMessage = $('.successContainer .successMessage');
    this.successButton = $('.successContainer .successButton button > div > span');
    this.successButtonPurchase = $('.successContainer .successButton a');
  }

  public getSuccessMessage(): ElementFinder {
    return this.successMessage;
  }

  public getSuccessButton(): ElementFinder {
    return this.successButton;
  }

  public getSuccessButtonPurchase(): ElementFinder {
    return this.successButtonPurchase;
  }

  public async clickSuccessButton(): Promise<void> {
    await this.successButton.click();
  }

  public async clickSuccessButtonPurchase(): Promise<void> {
    await this.successButtonPurchase.click();
  }
}