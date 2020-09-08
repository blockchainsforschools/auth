import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { validate } from 'email-validator';
import { COOKIE_SECRET, NODE_ENV } from '../../../constants';

export default async (parent, { firstName, lastName, email, password }, { models, res, jwt }) => {
	if (jwt) {
		throw new ForbiddenError('You are already signed in.');
	}

	if (!firstName) {
		throw new UserInputError('You must provide a first name.', { invalidArgs: ['firstName'] });
	}

	if (!lastName) {
		throw new UserInputError('You must provide a last name.', { invalidArgs: ['lastName'] });
	}

	if (!email) {
		throw new UserInputError('You must provide an email address.', { invalidArgs: ['email'] });
	}

	if (!validate(email)) {
		throw new UserInputError('That email address is not valid.', { invalidArgs: ['email'] });
	}

	const existingUser = await models.users.findOne({ where: { email } });

	if (existingUser) {
		throw new ForbiddenError("There's already a user with that email address");
	}

	if (password.length < 8) {
		throw new UserInputError('Your password must be at least 8 characters', {
			invalidArgs: ['password'],
		});
	}

	if (password.length > 64) {
		throw new UserInputError('Your password cannot be longer than 64 characters', {
			invalidArgs: ['password'],
		});
	}

	const passwordRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,64}$/g);

	if (!passwordRegex.test(password)) {
		throw new UserInputError(
			'Your password must have at least one uppercase character and at least one number.',
			{
				invalidArgs: ['password'],
			}
		);
	}

	const passwordHash = await hash(password, 12);

	let numBytes = 8;
	let userId = randomBytes(numBytes).toString('hex');

	let userIdCheck = await models.users.findOne({ where: { id: userId } });

	// If the id isn't unique generate a new longer id
	while (userIdCheck) {
		numBytes++;
		userId = randomBytes(numBytes).toString('hex');
		userIdCheck = await models.users.findOne({ where: { id: userId } });
	}

	// Now we can make their account
	const user = await models.users.create({
		id: userId,
		firstName,
		lastName,
		email,
		password: passwordHash,
		emailVerified: false,
	});

	const emailToken = randomBytes(64);

	await models.emailTokens.create({
		token: emailToken,
		userId,
		email,
		expires: new Date(new Date().getTime() + 1000 * 60 * 60),
	});

	// TODO Send out an email with the email verification link

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
