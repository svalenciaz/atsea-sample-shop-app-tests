export const OrderSchema = {
  type: 'object',
  required: ['orderId', 'orderDate', 'customerId', 'productsOrdered'],
  properties: {
    orderId: {
      type: 'integer',
    },
    orderDate: {
      type: 'string',
    },
    customerId: {
      type: 'integer',
    },
    productsOrdered: {
      type: 'object',
    },
  },
}

export const OrderUpdatedSchema = {
  type: 'object',
  required: ['orderId', 'orderDate', 'customerId', 'productsOrdered'],
  properties: {
    orderId: {
      type: 'integer',
    },
    orderDate: {
      type: 'integer',
    },
    customerId: {
      type: 'integer',
    },
    productsOrdered: {
      type: 'object',
    },
  },
}

export const OrderListSchema = {
  type: 'array',
  items: [{ ...OrderSchema}],
}
