import { Client } from '@elastic/elasticsearch';
import { logger } from '@delivery/shared';

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

export const initializeElasticsearch = async () => {
  try {
    // Create vendors index if it doesn't exist
    const indexExists = await esClient.indices.exists({ index: 'vendors' });

    if (!indexExists) {
      await esClient.indices.create({
        index: 'vendors',
        body: {
          settings: {
            number_of_shards: 3,
            number_of_replicas: 1,
            analysis: {
              analyzer: {
                autocomplete: {
                  tokenizer: 'autocomplete_tokenizer',
                  filter: ['lowercase'],
                },
                autocomplete_search: {
                  tokenizer: 'lowercase',
                },
              },
              tokenizer: {
                autocomplete_tokenizer: {
                  type: 'edge_ngram',
                  min_gram: 2,
                  max_gram: 10,
                  token_chars: ['letter', 'digit'],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: {
                type: 'text',
                analyzer: 'autocomplete',
                search_analyzer: 'autocomplete_search',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              description: { type: 'text' },
              categories: { type: 'keyword' },
              cuisines: { type: 'keyword' },
              tags: { type: 'keyword' },
              rating: { type: 'float' },
              totalOrders: { type: 'integer' },
              priceRange: { type: 'keyword' },
              location: { type: 'geo_point' },
              isActive: { type: 'boolean' },
              isOnline: { type: 'boolean' },
              deliveryTime: { type: 'integer' },
              deliveryFee: { type: 'float' },
              minimumOrder: { type: 'float' },
              operatingHours: { type: 'object', enabled: false },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });
      logger.info('Elasticsearch vendors index created');
    }

    // Create menu_items index
    const menuIndexExists = await esClient.indices.exists({ index: 'menu_items' });

    if (!menuIndexExists) {
      await esClient.indices.create({
        index: 'menu_items',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              vendorId: { type: 'keyword' },
              name: {
                type: 'text',
                analyzer: 'autocomplete',
                search_analyzer: 'autocomplete_search',
              },
              description: { type: 'text' },
              category: { type: 'keyword' },
              subcategory: { type: 'keyword' },
              price: { type: 'float' },
              tags: { type: 'keyword' },
              isAvailable: { type: 'boolean' },
              isVegetarian: { type: 'boolean' },
              isVegan: { type: 'boolean' },
              allergens: { type: 'keyword' },
              rating: { type: 'float' },
              orderCount: { type: 'integer' },
            },
          },
        },
      });
      logger.info('Elasticsearch menu_items index created');
    }

    logger.info('Elasticsearch initialized successfully');
  } catch (error) {
    logger.error('Elasticsearch initialization error:', error);
    throw error;
  }
};
