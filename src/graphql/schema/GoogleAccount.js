import { gql } from 'apollo-server-express';

export default gql`
	type GoogleAccount {
		id: Int!
		email: String
		sub: String
		picture: String
	}
`;
