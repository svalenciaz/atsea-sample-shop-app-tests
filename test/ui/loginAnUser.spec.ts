import { browser, ExpectedConditions } from 'protractor';
import { del, post } from 'superagent';
import { HeaderIndexPage, SignInModalPage} from 'src/pages';
import * as chai from 'chai';
import dotenv = require('dotenv');
import { Customer } from 'src/models/Customer';
dotenv.config();
const { expect } = chai;

const customerAPIURL = `${process.env.URL_API_BASE}/api/customer/`;
const dockerInternalURL = `${process.env.HOST_DOCKER_INTERNAL}`;

const headerIndex: HeaderIndexPage = new HeaderIndexPage();
const signInModal: SignInModalPage = new SignInModalPage();

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


describe('Login an user', () =>{
  const EC = ExpectedConditions;

  before(async () =>{
    await del(`${customerAPIURL}`);
    await post(`${customerAPIURL}`).send(genericCustomer);

  });

  beforeEach(async () =>{
    await browser.get(dockerInternalURL);
    await headerIndex.clickSignIn();
    await browser.wait(EC.visibilityOf(await signInModal.getCreateUserHeader()), 5000);

  });

  afterEach(async () => {
    await browser.wait(EC.elementToBeClickable(await headerIndex.getSignOutButton()));
    await headerIndex.clickSignOut();
  });

  after(async () => {
    await del(`${customerAPIURL}`);
  });

  it('should login a register user', async () => {
    await signInModal.signIn('g', 'g');

    await browser.wait(EC.visibilityOf(await headerIndex.getWelcomeMessage()));
    expect(await headerIndex.getWelcomeMessage().getText()).to.equal('Welcome!');

  });

});