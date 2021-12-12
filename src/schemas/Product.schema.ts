export const ProductSchema = {
  type: 'object',
  required: ['description', 'image', 'name', 'price', 'productId'],
  properties: {
    description: {
      type: 'string',
    },
    image: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    price: {
      type: 'number',
    },
    productId: {
      type: 'integer',
    },
  },
}

export const ProductListSchema = {
  type: 'array',
  items: [{ ...ProductSchema}],
}
