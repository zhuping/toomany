'use strict';

module.exports = {
  up: function (migration, DataTypes) {
    migration.addColumn(
      'users',
      'albumCount', {
        type: DataTypes.INTEGER,
        defaultValue:0
      }
    )
  },

  down: function (migration, DataTypes) {
    migration.removeColumn('users', 'albumCount')
  }
};
