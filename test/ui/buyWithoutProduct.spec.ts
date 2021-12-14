import { browser, ExpectedConditions } from 'protractor';
import { del, post } from 'superagent';
import { ProductsPage, CheckoutPage, HeaderIndexPage } from 'src/pages';
import { Customer } from 'src/models/Customer';
import * as chai from 'chai';
import dotenv = require('dotenv');
dotenv.config();
const { expect } = chai;

const customerAPIURL = `${process.env.URL_API_BASE}/api/customer/`;
const dockerInternalURL = `${process.env.HOST_DOCKER_INTERNAL}`;
const loginAPIURL = `${process.env.URL_API_BASE}/login/`;

const products: ProductsPage = new ProductsPage();
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

describe('Buying without product', () =>{
  const EC = ExpectedConditions;

  beforeEach(async () =>{
    await del(`${customerAPIURL}`);
    await post(`${customerAPIURL}`).send(genericCustomer);
    await post(loginAPIURL).send(signInCustomerData);
    await browser.get(dockerInternalURL);
  });

  it('should return an error message suggesting to add something to the cart', async () => {

    await browser.wait(EC.visibilityOf(await products.getCartDigit()), 10000);
    await browser.wait(EC.elementToBeClickable(await products.getCheckoutButton()), 10000);
    expect(await products.getCartDigit().getText()).to.equal("0");
    await products.clickCheckout();
    browser.sleep(10000);
    await browser.wait(EC.visibilityOf(await checkout.getForm()), 10000);
    await checkout.fillCheckoutForm('a', 'a','2','0','1','a','a','a','a');
    await checkout.clickCompleteOrder();
    await browser.wait(EC.visibilityOf(await checkout.getLoginErrorMessage()), 10000);
    expect(await checkout.getLoginErrorMessage().getText()).to.equal("Please add to cart first...");
    await checkout.clickContinueShopping();
    await browser.wait(EC.visibilityOf(await products.getCartDigit()), 10000);
    expect(await products.getCartDigit().getText()).to.equal("0");
  });

  afterEach(async () => {
    await browser.wait(EC.elementToBeClickable(await headerIndex.getSignOutButton()));
    await headerIndex.clickSignOut();
    await del(`${customerAPIURL}`);
  });

});