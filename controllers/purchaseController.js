const { Purchase, Model, User } = require('../models');

module.exports = {
  createPurchase: async (req, res) => {
    try {
      const { model_id } = req.body;
      const model = await Model.findByPk(model_id);
      const user = await User.findByPk(req.user.id);
      
      if (user.balance < model.price) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      const purchase = await Purchase.create({
        user_id: user.id,
        model_id: model.id,
        price_paid: model.price,
        status: 'completed'
      });
      
      await user.decrement('balance', { by: model.price });
      
      res.status(201).json(purchase);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getUserPurchases: async (req, res) => {
    try {
      const purchases = await Purchase.findAll({
        where: { user_id: req.user.id },
        include: [Model]
      });
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};