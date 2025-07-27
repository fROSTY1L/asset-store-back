'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('models', 'preview_image', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('models', 'thumbnail', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('models', 'model_file_url', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('models', 'model_format', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'glb'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('models', 'preview_image');
    await queryInterface.removeColumn('models', 'thumbnail');
    await queryInterface.removeColumn('models', 'model_file_url');
    await queryInterface.removeColumn('models', 'model_format');
  }
};