import { get, post, del } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import * as chai from 'chai';
import * as chaiSubset from 'chai-subset';
import * as chaiJsonSchema from 'chai-json-schema';
import { Customer } from 'src/models/Customer';
import dotenv = require('dotenv')
dotenv.config()

chai.use(chaiSubset);
chai.use(chaiJsonSchema);
const { expect } = chai;
const baseURL = process.env.URL_API_BASE;
const customerAPIURL = `${baseURL}/api/customer/`
const loginAPIURL = `${baseURL}/login/`;
const purchaseAPIURL = `${baseURL}/purchase/`;

const genericCustomer : Customer = {
  customerId : 0,
  name: "Generic Name",
  address: "Nowhere Downstreet 1234 North",
  email: "generic@example.com",
  phone: "601 444 5555",
  username: "generic",
  password: "genericpassword",
  enabled: true,
  role: "USER"
};

const signInCustomerData = {
  username: "generic",
  password: "genericpassword",
};

const wrongUsernameSignInCustomerData = {
  username: "generics",
  password: "genericpassword",
};

const wrongPasswordSignInCustomerData = {
  username: "generic",
  password: "genericpw",
};

describe('Login and Purchase API Test', () => {

  before(async () => {
    await post(customerAPIURL).send(genericCustomer);
  });

  after(async () => {
    await del(customerAPIURL);
  });

  let token = '';

  describe('when loggin in', () => {
    it('should return a login token if correct username and password', async () =>{
      const response = await post(loginAPIURL).send(signInCustomerData);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.has.property('token');
      token = response.body.token;
    });

    it(`should return a not found message if doesn't exist a customer with the username`, async () => {
      let response;
      try {
        response = await post(`${loginAPIURL}`).send(wrongUsernameSignInCustomerData);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Customer with username ${wrongUsernameSignInCustomerData.username} not found`);
    });

    it(`should return a not found message if an wrong password is given`, async () => {
      let response;
      try {
        response = await post(`${loginAPIURL}`).send(wrongPasswordSignInCustomerData);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal('Customer name or password not found.');
    });

  });

  describe('when purchasing', () => {
    it('should return a thanks message for shopping', async () => {
      const response = await get(purchaseAPIURL).auth(token, { type: 'bearer'});
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.has.property('message', 'Thank you for shopping @Sea! We\'re sending a confirmation email shortly and getting your order ready!');
    });

    it('should return an internal server error if a token is not given', async () => {
      let response
      try {
        response = await get(purchaseAPIURL);
      } catch (error) {
        response = error.response;
      }
      expect(response.status).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).to.has.property('error', 'Internal Server Error');
      expect(response.body).to.has.property('message', 'Missing or invalid Authorization header.');
    });
  });

});
