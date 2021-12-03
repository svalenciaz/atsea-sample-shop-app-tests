import { get } from 'superagent'
import { StatusCodes } from 'http-status-codes'
import * as chai from 'chai'

const expect = chai.expect

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await get('https://httpbin.org/ip')

    expect(response.status).to.equal(StatusCodes.OK)
    expect(response.body).to.have.property('origin')
  })
})
