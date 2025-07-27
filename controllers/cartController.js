const { CartItem, Model } = require('../models');

module.exports = {
  getCart: async (req, res) => {
    try {
      const cartItems = await CartItem.findAll({
        where: { user_id: req.user.id },
        include: [Model]
      });
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { model_id } = req.body;
      
      const [cartItem] = await CartItem.findOrCreate({
        where: { 
          user_id: req.user.id,
          model_id 
        },
      });
      
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      await CartItem.destroy({
        where: {
          id: req.params.id,
          user_id: req.user.id
        }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};