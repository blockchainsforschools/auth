import { sign } from 'jsonwebtoken';
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import { compare } from 'bcrypt';
import { COOKIE_SECRET, NODE_ENV } from '../../../constants';

export default async (parent, { email, password }, { models, res, jwt }) => {
	if (jwt) {
		throw new ForbiddenError('You are already signed in.');
	}

	const user = await models.users.findOne({ where: { email } });

	if (!user) {
		throw new ApolloError('Those credentials are not valid.', 'INVALID_CREDENTIALS');
	}

	const passwordCorrect = await compare(password, user.password);

	if (!passwordCorrect) {
		throw new ApolloError('Those credentials are not valid.', 'INVALID_CREDENTIALS');
	}

	// If we get to this point we can now send out the jwt
	const token = sign(
		{
			user: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				emailVerified: user.emailVerified,
			},
			audience: '*.blockchainsforschools.org',
			issuer: 'auth.blockchainsforschools.org',
		},
		COOKIE_SECRET,
		{ expiresIn: '14d' }
	);

	const cookieOptions = {
		httpOnly: true,
	};

	if (NODE_ENV === 'production') {
		cookieOptions.sameSite = 'none';
		cookieOptions.secure = true;
		cookieOptions.domain = '.blockchainsforschools.org';
	}

	res.cookie('auth-jwt', token, cookieOptions);

	return token;
};
