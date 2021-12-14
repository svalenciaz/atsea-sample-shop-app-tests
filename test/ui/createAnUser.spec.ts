import { browser, ExpectedConditions } from 'protractor';
import { del } from 'superagent';
import { CreateUserModalPage, HeaderIndexPage, SuccessPage } from 'src/pages';
import * as chai from 'chai';
import dotenv = require('dotenv');
dotenv.config();
const { expect } = chai;

const customerAPIURL = `${process.env.URL_API_BASE}/api/customer/`;
const dockerInternalURL = `${process.env.HOST_DOCKER_INTERNAL}`;

const success: SuccessPage = new SuccessPage();
const headerIndex: HeaderIndexPage = new HeaderIndexPage();
const createUserModal: CreateUserModalPage = new CreateUserModalPage();

describe('Creating an user', () =>{
  const EC = ExpectedConditions;

  beforeEach(async () =>{
    await del(`${customerAPIURL}`);
    await browser.get(dockerInternalURL);
    await headerIndex.clickCreateUser();
    await browser.wait(EC.visibilityOf(await createUserModal.getCreateUserHeader()), 5000);

  });

  afterEach(async () => {
    await browser.wait(EC.elementToBeClickable(await headerIndex.getSignOutButton()));
    await headerIndex.clickSignOut();
    await del(`${customerAPIURL}`);
  });

  it('should create a new user and loggin with it', async () => {
    await createUserModal.signUp('genericUser', 'genericPassword');
    await browser.wait(
      EC.elementToBeClickable(await success.getSuccessButton()),
      5000
    );
    await browser.wait(EC.visibilityOf(await success.getSuccessMessage()), 5000);
    expect(await success.getSuccessMessage().getText()).to.equal('Congratulations! Your account has been created!');

    await success.clickSuccessButton();
    await browser.wait(EC.visibilityOf(await headerIndex.getWelcomeMessage()));
    expect(await headerIndex.getWelcomeMessage().getText()).to.equal('Welcome!');


  });

});
