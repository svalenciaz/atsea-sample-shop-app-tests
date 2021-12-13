import { get } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import * as chai from 'chai';
import * as chaiSubset from 'chai-subset';
import * as chaiJsonSchema from 'chai-json-schema';
import { ProductListSchema, ProductSchema } from 'src/schemas/Product.schema';
import dotenv = require('dotenv')
dotenv.config()

chai.use(chaiSubset);
chai.use(chaiJsonSchema);
const { expect } = chai;
const baseURL = process.env.URL_API_BASE;
const productAPIURL = `${baseURL}/api/product/`;

describe('Product Api Test', () => {

  describe('when getting all products', () => {

    it('should return all available products', async () => {
      const response = await get(productAPIURL);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.be.jsonSchema(ProductListSchema);

    });

  });

  describe('when getting a product by id', () => {
    const productID = 1;
    const wrongProductID = 404;
    it(`should, return a single product with id ${productID}`, async () => {
      const response = await get(`${productAPIURL}${productID}`)
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.be.jsonSchema(ProductSchema);
      expect(response.body.productId).to.equal(productID);
    });

    it(`should thrown an error message if the product doesn't exist`, async () => {
      let response;
      try {
        response = await get(`${productAPIURL}${wrongProductID}`);
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.response.body).has.property('errorMessage');
      expect(response.response.body.errorMessage).to.equal(`Product with id ${wrongProductID} not found`);
    });

  });

});
