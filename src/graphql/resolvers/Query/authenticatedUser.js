export default (root, args, { models, jwt }) => {
	if (jwt) {
		return models.users.findOne({
			where: {
				id: jwt.user.id,
			},
		});
	}
};
