import { get, post, put, del } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import * as chai from 'chai';
import * as chaiSubset from 'chai-subset';
import * as chaiJsonSchema from 'chai-json-schema';
import { OrderSchema, OrderUpdatedSchema ,OrderListSchema } from 'src/schemas/Order.schema';
import { Order } from 'src/models/Order';
import dotenv = require('dotenv')
dotenv.config()
chai.use(chaiSubset);
chai.use(chaiJsonSchema);
const { expect } = chai;

const baseURL = process.env.URL_API_BASE;
const orderAPIURL = `${baseURL}/api/order/`;

const genericOrder: Order = {
  orderId: 0,
  orderDate: "2021-12-12T19:06:39Z",
  customerId: 12345,
  productsOrdered: {"1":1, "2":1, "3":1}
}

const newOrder: Order = {
  orderId: 0,
  orderDate: "2021-12-12T19:06:39Z",
  customerId: 10,
  productsOrdered: {"1":10, "2":10, "3":10}
}

describe('Order API Test', () => {
  let createdOrderId = 0;
  describe('when creating an order', () => {
    it('should return the given orderId', async () =>{
      const response = await post(orderAPIURL).send(genericOrder);
      expect(response.status).to.equal(StatusCodes.CREATED);
      expect(response.body).to.have.property('orderId');
      createdOrderId = response.body.orderId;
    });
  });

  describe('when getting orders', () => {
    it('should return a list of orders', async () => {
      const response = await get(orderAPIURL);
      expect(response.status).to.oneOf([StatusCodes.OK, StatusCodes.NO_CONTENT]);
      expect(response.body).to.be.jsonSchema(OrderListSchema);
    });

    it('should return an order if a valid id is given', async () => {
      const response = await get(`${orderAPIURL}${createdOrderId}`);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.be.jsonSchema(OrderSchema);
      expect(response.body.orderId).to.equal(createdOrderId);
    });

    it(`should return an error message if a not valid id is given`, async () => {
      let response;
      try {
        response = await get(`${orderAPIURL}${createdOrderId+3}`);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Order with id ${createdOrderId+3} not found`);
    });

  });

  describe('when updating an order', () => {

    it('should return an order updated if a valid id is given', async () => {
      const response = await put(`${orderAPIURL}${createdOrderId}`).send(newOrder);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.be.jsonSchema(OrderUpdatedSchema);
      expect(response.body.orderId).to.equal(createdOrderId);
      expect(response.body.customerId).to.equal(newOrder.customerId);
      expect(response.body.productsOrdered).to.eql(newOrder.productsOrdered);
    });

    it(`should return an error message if a not valid id is given`, async () => {
      let response;
      try {
        response = await put(`${orderAPIURL}${createdOrderId+3}`).send(newOrder);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Unable to upate. Order with id ${createdOrderId+3} not found.`);
    });

  });

  describe('when deleting an order', () => {

    it('should return an order updated if a valid id is given', async () => {
      const response = await del(`${orderAPIURL}${createdOrderId}`);
      expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    });

    it(`should return an error message if a not valid id is given`, async () => {
      let response;
      try {
        response = await del(`${orderAPIURL}${createdOrderId+3}`);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Unable to delete order. Order with id ${createdOrderId+3} not found.`);
    });

  });


});
