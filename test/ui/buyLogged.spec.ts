import { expect } from 'chai';
import { browser, ExpectedConditions } from 'protractor';
import { del, post } from 'superagent';
import { ProductsPage, CheckoutPage, SuccessPage, SignInModalPage, HeaderIndexPage } from 'src/pages';
import { Customer } from 'src/models/Customer';

const customerAPIURL = `${process.env.URL_API_BASE}/api/customer/`;
const dockerInternalURL = `${process.env.HOST_DOCKER_INTERNAL}`;

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

describe('Purchase Process', () => {
  const headerIndex: HeaderIndexPage = new HeaderIndexPage();
  const signInModal: SignInModalPage = new SignInModalPage();
  const products: ProductsPage = new ProductsPage();
  const checkout: CheckoutPage = new CheckoutPage();
  const success: SuccessPage = new SuccessPage();
  const EC = ExpectedConditions;

  before(async () => {
    await browser.get(dockerInternalURL);
    await del(`${customerAPIURL}`);
    await post(`${customerAPIURL}`).send(genericCustomer);
  });

  it('open sign in modal', async () => {
    await headerIndex.clickSignIn();
    await browser.sleep(3000);
    await browser.wait(EC.visibilityOf(await signInModal.getCreateUserHeader()), 5000);
    expect(await signInModal.getCreateUserHeader().isDisplayed()).to.be.true;
  });

  it('fill login form and login', async () => {
    await signInModal.signIn('g', 'g');
    await browser.sleep(4000);
    expect(await headerIndex.getWelcomeMessage().getText()).to.equal('Welcome!');
  });

  it('Add product', async () => {
    const currentCartNumber = await products.getCartDigit().getText();
    await products.addToCart(1);
    await browser.sleep(3000);
    const newCartNumber = await products.getCartDigit().getText();
    expect(currentCartNumber).to.equal("0");
    expect(currentCartNumber).not.equal(newCartNumber);
    expect(newCartNumber).to.equal("1");
  });

  it('Go to checkout', async () => {
    await products.clickCheckout();
  });

  it('Complete checkout data and purchase', async () => {
    await browser.wait(EC.visibilityOf(await checkout.getForm()), 5000);
    await checkout.fillCheckoutForm(
      'Andrés',
      'Valencia',
      '1234567890',
      '102',
      '12/24',
      'Unal',
      'Student',
      'Cra. 50',
      'Medellín',
      );
    await browser.sleep(3000);
    await checkout.clickCompleteOrder();
  });

  it('Check order confirmation and continue shopping', async () => {
    await browser.sleep(3000);
    await browser.wait(EC.elementToBeClickable(await success.getSuccessButtonPurchase()), 7000);
    expect(await success.getSuccessMessage().getText()).to.equal(
      'You have successfully placed an order!'
    );
    await success.clickSuccessButtonPurchase();
  });
});