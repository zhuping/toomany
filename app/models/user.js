"use strict"

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    sign: DataTypes.STRING,
    albumCount: DataTypes.INTEGER
  }, {
    tableName: 'users',
    timestamps: true,
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Album, {
          foreignKey: 'userId'
        })
      }
    }
  });
  return User;
}