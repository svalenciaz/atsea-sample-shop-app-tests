import { $, ElementFinder } from 'protractor';

export class CheckoutPage {

  private form: ElementFinder;

  private firstNameInput: ElementFinder;

  private lastNameInput: ElementFinder;

  private cardNumberInput: ElementFinder;

  private cvvInput: ElementFinder;

  private mmyyInput: ElementFinder;

  private companyInput: ElementFinder;

  private titleInput: ElementFinder;

  private addressInput: ElementFinder;

  private cityInput: ElementFinder;

  private loginErrorMessage: ElementFinder;

  private continueShoppingButton: ElementFinder;

  private completeOrderButton: ElementFinder;

  constructor() {
    this.form = $('.infoSection > form');
    this.firstNameInput = $('input[name="firstName"]');
    this.lastNameInput = $('input[name="lastName"]');
    this.cardNumberInput = $('input[name="cardNumber"]');
    this.cvvInput = $('input[name="cvv"]');
    this.mmyyInput = $('input[name="expirationDate"]');
    this.companyInput = $('input[name="company"]');
    this.titleInput = $('input[name="title"]');
    this.addressInput = $('input[name="address"]');
    this.cityInput = $('input[name="city"]');
    this.loginErrorMessage = $('form .loginErrorMessage');
    this.continueShoppingButton = $('div.infoButton > a');
    this.completeOrderButton = $('div.infoButton > button');

  }

  public getForm(): ElementFinder{
    return this.form;
  }

  public getLoginErrorMessage(): ElementFinder {
    return this.loginErrorMessage;
  }

  public async fillCheckoutForm(
    firstName: string,
    lastName: string,
    cardNumber: string,
    cvv: string,
    mmyy: string,
    company: string,
    title: string,
    address: string,
    city: string
    ): Promise<void> {
    await this.firstNameInput.click();
    await this.firstNameInput.sendKeys(firstName);

    await this.lastNameInput.click();
    await this.lastNameInput.sendKeys(lastName);

    await this.cardNumberInput.click();
    await this.cardNumberInput.sendKeys(cardNumber);

    await this.cvvInput.click();
    await this.cvvInput.sendKeys(cvv);

    await this.mmyyInput.click();
    await this.mmyyInput.sendKeys(mmyy);

    await this.companyInput.click();
    await this.companyInput.sendKeys(company);

    await this.titleInput.click();
    await this.titleInput.sendKeys(title);

    await this.addressInput.click();
    await this.addressInput.sendKeys(address);

    await this.cityInput.click();
    await this.cityInput.sendKeys(city);
  }

  public async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  public async clickCompleteOrder(): Promise<void> {
    await this.completeOrderButton.click();
  }


}