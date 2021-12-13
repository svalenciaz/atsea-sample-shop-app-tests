import { $, ElementFinder } from 'protractor';

export class SignInModalPage {
  private loginFormHeader: ElementFinder;

  private userIDInput: ElementFinder;

  private passwordInput: ElementFinder;

  private loginButton: ElementFinder;


  constructor() {
    this.loginFormHeader = $('.loginFormHeader');
    this.userIDInput = $('.loginFormRow input[name="username"]');
    this.passwordInput = $('.loginFormRow input[name="password"]');
    this.loginButton = $('.loginFormButton button > div > span');
  }

  public getCreateUserHeader(): ElementFinder {
    return this.loginFormHeader;
  }

  public async signIn(userID, password): Promise<void> {
    await this.userIDInput.sendKeys(userID);
    await this.passwordInput.sendKeys(password);
    await this.loginButton.click();
  }

}

