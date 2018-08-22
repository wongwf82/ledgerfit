"use strict";
module.exports = (sequelize, DataTypes) => {
  var Review = sequelize.define(
    "Review",
    {
      review: DataTypes.STRING,
      address: DataTypes.STRING,
      verified: DataTypes.BOOLEAN
    },
    {}
  );
  Review.associate = function(models) {
    // associations can be defined here
  };
  return Review;
};
