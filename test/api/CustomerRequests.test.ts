import { get, post, put, del } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import * as chai from 'chai';
import * as chaiSubset from 'chai-subset';
import * as chaiJsonSchema from 'chai-json-schema';
import { CustomerSchema } from 'src/schemas/Customer.schema';
import { Customer } from 'src/models/Customer';
import dotenv = require('dotenv')
dotenv.config()

chai.use(chaiSubset);
chai.use(chaiJsonSchema);
const { expect } = chai;
const baseURL = process.env.URL_API_BASE;
const customerAPIURL = `${baseURL}/api/customer/`

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
}

const newGenericCustomer : Customer = {
  customerId : 0,
  name: "New Generic Name",
  address: "Elsewhere Downstreet 1234 North",
  email: "newgeneric@example.com",
  phone: "601 444 5555",
  username: "newgeneric",
  password: "newgenericpassword",
  enabled: true,
  role: "USER"
}

const testCustomer : Customer = {
  customerId : 0,
  name: "Test Name",
  address: "Nowhere Downstreet 1234 North",
  email: "test@example.com",
  phone: "601 444 5555",
  username: "test",
  password: "testpassword",
  enabled: true,
  role: "USER"
}

describe('Customer Api Test', () => {

  let newCustomerId = 0;

  describe('when creating a non exsting customer', () => {

    it('should return its new id', async () => {
      const response = await post(customerAPIURL).send(genericCustomer);
      expect(response.status).to.equal(StatusCodes.CREATED);
      expect(response.body).to.has.property('customerId');
      newCustomerId = response.body.customerId;
    });

    it('should return its new id if its name is not in use', async () => {
      const response = await post(customerAPIURL).send(testCustomer);
      expect(response.status).to.equal(StatusCodes.CREATED);
      expect(response.body).to.has.property('customerId');
      expect(response.body.customerId).to.be.greaterThan(newCustomerId);
    });

  });

  describe('when creating an exsting customer', () => {
    it(`should return an error message for creating a customer with the same name`, async () => {
      let response;
      try {
        response = await post(customerAPIURL).send(genericCustomer);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.CONFLICT);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`A customer with username ${genericCustomer.username} already exists.`);
    });

  });

  describe('when getting a customer by id', () => {
    it('should return the customer information', async () => {
      const response = await get(`${customerAPIURL}/${newCustomerId}`);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.be.jsonSchema(CustomerSchema);
      expect(response.body.customerId).to.equal(newCustomerId);
    });

    it(`should return a not found message if doesn't exist a customer with the id`, async () => {
      let response;
      try {
        response = await get(`${customerAPIURL}/${newCustomerId+3}`);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Customer with id ${newCustomerId+3} not found`);
    });
  });

  describe('when getting a customer by name', () => {
    it('should return the customer information', async () => {
      const response = await get(`${customerAPIURL}/name=${genericCustomer.name}`);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.be.jsonSchema(CustomerSchema);
      expect(response.body.name).to.equal(genericCustomer.name);
    });

    it(`should return a not found message if doesn't exist a customer with the name`, async () => {
      let response;
      const noName = 'Unexists Null'
      try {
        response = await get(`${customerAPIURL}/name=${noName}`);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Customer with name ${noName} not found`);
    });
  });

  describe('when getting a customer by username', () => {
    it('should return the customer information', async () => {
      const response = await get(`${customerAPIURL}/username=${genericCustomer.username}`);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.be.jsonSchema(CustomerSchema);
      expect(response.body.username).to.equal(genericCustomer.username);
    });

    it(`should return a not found message if doesn't exist a customer with the username`, async () => {
      let response;
      const noUsername = 'Unexists'
      try {
        response = await get(`${customerAPIURL}/username=${noUsername}`);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Customer with username ${noUsername} not found`);
    });
  });

  describe('when updating a customer', () => {
    it('should update it if the customerId exists', async () => {
      const response = await put(`${customerAPIURL}/${newCustomerId}`).send(newGenericCustomer);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.be.jsonSchema(CustomerSchema);
      expect(response.body.username).to.equal(newGenericCustomer.username);
      expect(response.body.name).to.equal(newGenericCustomer.name);
      expect(response.body.customerId).to.equal(newCustomerId);
    });
    it(`should return a not found message if doesn't exist a customer with the id`, async () => {
      let response;
      try {
        response = await put(`${customerAPIURL}/${newCustomerId+3}`).send(newGenericCustomer);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Unable to upate. Customer with id ${newCustomerId+3} not found.`);
    });

  });

  describe('when deleting customers', () => {
    it('should delete it if the customerId exists', async () => {
      const response = await del(`${customerAPIURL}/${newCustomerId}`);
      expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    });
    it(`should return a not found message if the customer has just been deleted`, async () => {
      let response;
      try {
        response = await del(`${customerAPIURL}/${newCustomerId}`);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Unable to delete. Customer with id ${newCustomerId} not found.`);
    });
    it(`should return a not found message if doesn't exist a customer with the id`, async () => {
      let response;
      try {
        response = await del(`${customerAPIURL}/${newCustomerId+3}`);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Unable to delete. Customer with id ${newCustomerId+3} not found.`);
    });
    it('should delete all the customers', async () => {
      const response = await del(`${customerAPIURL}/`);
      expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    });

  });

});
