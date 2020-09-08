'use strict';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class googleAccounts extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			googleAccounts.belongsTo(models.users);
		}

		static userIdLoader = findOneLoader(googleAccounts, 'userId');
		static emailLoader = findOneLoader(googleAccounts, 'email');
	}
	googleAccounts.init(
		{
			userId: DataTypes.STRING,
			sub: DataTypes.STRING,
			email: DataTypes.STRING,
			picture: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'googleAccounts',
		}
	);
	return googleAccounts;
};
