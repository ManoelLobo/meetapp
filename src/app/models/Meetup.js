import { isBefore } from 'date-fns';
import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'file_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.hasMany(models.Registration, { foreignKey: 'meetup_id' });
  }
}

export default Meetup;
