import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        path: Sequelize.STRING,
        name: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }
}

export default File;
