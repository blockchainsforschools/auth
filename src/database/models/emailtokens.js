'use strict';
import findManyLoader from '../dataloaders/findManyLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class emailTokens extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			emailTokens.belongsTo(models.users);
		}

		static userIdLoader = findManyLoader(emailTokens, 'userId');
	}
	emailTokens.init(
		{
			userId: DataTypes.STRING,
			email: DataTypes.STRING,
			token: DataTypes.STRING,
			expires: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'emailTokens',
		}
	);
	return emailTokens;
};
