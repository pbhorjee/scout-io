'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Asset', {
     _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.CHAR(255),
    data: DataTypes.BLOB(),
    publicComments: DataTypes.STRING(8000),
    active: DataTypes.BOOLEAN()
  });
};