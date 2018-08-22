"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Companies",
      [
        {
          name: "Lunyr",
          category: "Education",
          address: "0xfa05A73FfE78ef8f1a739473e462c54bae6567D9",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "AidCoin",
          category: "Charity",
          address: "0x37E8789bB9996CaC9156cD5F5Fd32599E6b91289",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "MedToken",
          category: "Medical",
          address: "0x41dBECc1cdC5517C6f76f6a6E836aDbEe2754DE3",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Companies", null, {});
  }
};
