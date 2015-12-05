"use strict"

module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    albumId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    tableName: 'like',
    timestamps: true,
    classMethods: {
      associate: function(models) {
        Like.belongsTo(models.Album, {
          foreignKey: 'albumId'
        });
      }
    }
  });
  return Like;
}