import { $, ElementFinder } from 'protractor';

export class HeaderIndexPage {
  private createUserButton: ElementFinder;
  private signInButton: ElementFinder;
  private signOutButton: ElementFinder;
  private welcomeMessage: ElementFinder;


  constructor() {
    this.createUserButton = $('.navHeader .navUser .buttonSection button:nth-child(1)');
    this.signInButton = $('.navHeader .navUser .buttonSection button:nth-child(2)');
    this.welcomeMessage = $('.navHeader .navUser .buttonSection .welcomeMessage');
    this.signOutButton = $('.navHeader .navUser .buttonSection .welcomeMessage + button');
  }

  public async clickCreateUser(): Promise<void> {
    await this.createUserButton.click();
  }

  public async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  public async clickSignOut(): Promise<void> {
    await this.signOutButton.click();
  }

  public getSignOutButton(): ElementFinder {
    return this.signOutButton;
  }

  public getWelcomeMessage(): ElementFinder {
    return this.welcomeMessage;
  }

}
