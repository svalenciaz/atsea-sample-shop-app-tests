import { $, ElementFinder } from 'protractor';

export class SuccessPage {

  private successMessage: ElementFinder;

  private successButton: ElementFinder;

  constructor() {
    this.successMessage = $('.successContainer .successMessage');
    this.successButton = $('.successContainer .successButton button > div > span');
  }

  public getSuccessMessage(): ElementFinder {
    return this.successMessage;
  }

  public getSuccessButton(): ElementFinder {
    return this.successButton;
  }

  public async clickSuccessButton(): Promise<void> {
    await this.successButton.click();
  }
}