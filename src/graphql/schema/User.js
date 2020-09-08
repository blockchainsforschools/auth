import { gql } from 'apollo-server-express';

export default gql`
	type User {
		id: String!
		firstName: String
		lastName: String
		email: String
		emailVerified: Boolean

		# Custom Properties
		name: String
		googleAccount: GoogleAccount
	}
`;
