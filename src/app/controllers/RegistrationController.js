import Meetup from '../models/Meetup';
import User from '../models/User';
import Registration from '../models/Registration';

import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [User],
    });

    if (!meetup) {
      return res.status(400).json({ error: 'Invalid meetup' });
    }

    if (meetup.user_id === req.userId) {
      return res.status(400).json({ error: 'You already are the organizer' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't register to past meetups" });
    }

    const checkDate = await Registration.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          required: true,
          where: { date: meetup.date },
        },
      ],
    });

    if (checkDate) {
      return res.status(400).json({
        error: "Can't register to two meetups happening at the same time",
      });
    }

    const registration = await Registration.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    const user = await User.findByPk(req.userId);

    await Queue.add(RegistrationMail.key, {
      meetup,
      user,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
