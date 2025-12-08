import { GraphQLClient } from 'graphql-request';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

export const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
        // Add authentication headers here if needed in the future
        // Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
});
