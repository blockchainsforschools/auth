export default (user, args, { models }) => {
	return models.googleAccounts.userIdLoader.load(user.id);
};
