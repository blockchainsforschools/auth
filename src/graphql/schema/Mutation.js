import { gql } from 'apollo-server-express';

export default gql`
	type Mutation {
		# Return a JWT after successful login
		login(email: String!, password: String!): String

		# Return a JWT after sign-up
		signUp(firstName: String!, lastName: String!, email: String!, password: String!): String

		# Renew the jwt in the cookie and return its value
		refreshJWT: String
	}
`;
