import { $, ElementFinder } from 'protractor';

export class CreateUserModalPage {
  private createUserHeader: ElementFinder;

  private userIDInput: ElementFinder;

  private passwordInput: ElementFinder;

  private signUpButton: ElementFinder;

  private successMessage: ElementFinder;

  private successButton: ElementFinder;

  constructor() {
    this.createUserHeader = $('.createFormHeader');
    this.userIDInput = $('.createFormRow input[name="username"]');
    this.passwordInput = $('.createFormRow input[name="password"]');
    this.signUpButton = $('.createFormButton button > div > span');
    this.successMessage = $('.successContainer .successMessage');
    this.successButton = $('.successContainer .successButton button > div > span');
  }

  public getCreateUserHeader(): ElementFinder {
    return this.createUserHeader;
  }

  public async signUp(userID, password): Promise<void> {
    await this.userIDInput.sendKeys(userID);
    await this.passwordInput.sendKeys(password);
    await this.signUpButton.click();
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
