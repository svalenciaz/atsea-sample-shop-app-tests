import { browser, ExpectedConditions } from 'protractor';
import { del } from 'superagent';
import { CreateUserModalPage, HeaderIndexPage } from 'src/pages';
import * as chai from 'chai';
const { expect } = chai;

const customerAPIURL = 'http://localhost:8080/api/customer/';
const dockerInternalURL = 'http://host.docker.internal:8080/';

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
      EC.elementToBeClickable(await createUserModal.getSuccessButton()),
      5000
    );
    await browser.wait(EC.visibilityOf(await createUserModal.getSuccessMessage()), 5000);
    expect(await createUserModal.getSuccessMessage().getText()).to.equal('Congratulations! Your account has been created!');

    await createUserModal.clickSuccessButton();
    await browser.wait(EC.visibilityOf(await headerIndex.getWelcomeMessage()));
    expect(await headerIndex.getWelcomeMessage().getText()).to.equal('Welcome!');


  });

});
