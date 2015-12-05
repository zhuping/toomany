"use strict"

module.exports = function(sequelize, DataTypes) {
  var Album = sequelize.define('Album', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    poster: DataTypes.STRING,
    likeCount: DataTypes.INTEGER,
    downCount: DataTypes.INTEGER,
    access: {
      type: DataTypes.INTEGER,
      defaultValue: 1 // 是否公开相册，0代表私有，1代表公开
    },
    reason: DataTypes.STRING,
    dbId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    tableName: 'albums',
    timestamps: true,
    classMethods: {
      associate: function(models) {
        Album.belongsTo(models.User, {
          foreignKey: 'userId'
        });
        Album.hasMany(models.Like, {
          foreignKey: 'albumId'
        });
      }
    }
  });
  return Album;
}