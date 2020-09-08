import { createComplexityLimitRule } from 'graphql-validation-complexity';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from '../database';

const ComplexityLimitRule = createComplexityLimitRule(75000, {
	scalarCost: 1,
	objectCost: 5,
	listFactor: 10,
});

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => {
		return {
			models,
			jwt: req.jwt,
			ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
			res,
		};
	},
	uploads: false,
	introspection: true,
	playground: {
		settings: {
			'request.credentials': 'same-origin',
		},
	},
	validationRules: [ComplexityLimitRule],
});

export default apolloServer;
