import { browser, ExpectedConditions } from 'protractor';
import { del, post } from 'superagent';
import { Customer } from 'src/models/Customer';
import { ProductsPage, CheckoutPage, HeaderIndexPage, SuccessPage } from 'src/pages';
import * as chai from 'chai';
import dotenv = require('dotenv');
dotenv.config();
const { expect } = chai;

const customerAPIURL = `${process.env.URL_API_BASE}/api/customer/`;
const dockerInternalURL = `${process.env.HOST_DOCKER_INTERNAL}`;
const loginAPIURL = `${process.env.URL_API_BASE}/login/`;

const products: ProductsPage = new ProductsPage();
const success: SuccessPage = new SuccessPage();
const checkout: CheckoutPage = new CheckoutPage();
const headerIndex: HeaderIndexPage = new HeaderIndexPage();

const genericCustomer: Customer = {
  customerId : 0,
  name: "Generic Name",
  address: "Nowhere Downstreet 1234 North",
  email: "generic@example.com",
  phone: "601 444 5555",
  username: "g",
  password: "g",
  enabled: true,
  role: "USER"
};

const signInCustomerData = {
  username: "g",
  password: "g",
};

describe('Buying logged', () =>{
  const EC = ExpectedConditions;

  beforeEach(async () =>{
    await del(`${customerAPIURL}`);
    await post(`${customerAPIURL}`).send(genericCustomer);
    await post(loginAPIURL).send(signInCustomerData);
    await browser.get(dockerInternalURL);
  });

  it('should return the success page and the ', async () => {

    await browser.wait(EC.visibilityOf(await products.getCartDigit()), 20000);
    await browser.wait(EC.elementToBeClickable(await products.getCheckoutButton()), 20000);
    await products.addToCart(1);
    expect(await products.getCartDigit().getText()).to.equal("1");
    await products.clickCheckout();
    browser.sleep(20000);
    await browser.wait(EC.visibilityOf(await checkout.getForm()), 20000);
    await checkout.fillCheckoutForm('a', 'a','2','0','1','a','a','a','a');
    await checkout.clickCompleteOrder();

    await browser.wait(
      EC.elementToBeClickable(await success.getSuccessButton()),
      20000
    );
    await browser.wait(EC.visibilityOf(await success.getSuccessMessage()), 20000);
    expect(await success.getSuccessMessage().getText()).to.equal('You have successfully placed an order!');

    await success.clickSuccessButton();

    await browser.wait(EC.visibilityOf(await products.getCartDigit()), 20000);
    expect(await products.getCartDigit().getText()).to.equal("0");
  });

  afterEach(async () => {
    await browser.wait(EC.elementToBeClickable(await headerIndex.getSignOutButton()));
    await headerIndex.clickSignOut();
    await del(`${customerAPIURL}`);
  });

});