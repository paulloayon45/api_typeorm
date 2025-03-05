const { DataTypes } = require('sequelize');

module.exports = module;

function model(sequelize) {
    const attribute = {
        email: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exlude: ['passwordHash'] }

        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };
    return sequelize.define('User', attributes, options);

}