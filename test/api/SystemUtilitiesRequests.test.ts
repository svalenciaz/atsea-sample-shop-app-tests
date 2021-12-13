import { get } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import * as chai from 'chai';
import * as chaiSubset from 'chai-subset';
import * as chaiJsonSchema from 'chai-json-schema';
import dotenv = require('dotenv')
dotenv.config()
chai.use(chaiSubset);
chai.use(chaiJsonSchema);
const { expect } = chai;

const baseURL = process.env.URL_API_BASE;
const utilityAPIURL = `${baseURL}/utility/`;

describe('System Utilities Api Test', () => {
  describe('when doing a database healthcheck', () => {
    it('should return the database current status', async () => {
      const response = await get(`${utilityAPIURL}healthcheck/`);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.has.property('status');
    });
  });
  describe('when getting the container id', () => {
    it('should return the container\'s host and ip', async () => {
      const response = await get(`${utilityAPIURL}containerid/`);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.has.property('host');
      expect(response.body).to.has.property('ip');
    });
  });
});
