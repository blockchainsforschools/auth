import { ForbiddenError } from 'apollo-server-express';
import { sign } from 'jsonwebtoken';
import { COOKIE_SECRET, NODE_ENV } from '../../../constants';

export default async (root, args, { jwt, models }) => {
	if (!jwt) {
		throw new ForbiddenError('You are not signed in.');
	}

	const user = await models.users.findOne({ where: { id: jwt.user.id } });

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
