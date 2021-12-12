export const CustomerSchema = {
  type: 'object',
  required: ['customerId', 'name', 'address', 'email', 'phone', 'username'],
  properties: {
    customerId: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    enabled: {
      type: 'boolean',
    },
    role: {
      type: 'string',
    },
  },
}
