const { User } = require('../models');
const { verifyTelegramData } = require('../utils/telegram-auth');

module.exports = {
  telegramLogin: async (req, res) => {
    try {
      const { initData, isDevMode } = req.body;
      
      let userData;
      if (isDevMode) {
        userData = {
          id: '123456789',
          username: 'test_user'
        };
      } else {

        userData = verifyTelegramData(initData);
        if (!userData) {
          return res.status(401).json({ 
            success: false,
            error: 'Invalid Telegram auth data' 
          });
        }
        userData.id = String(userData.id);
      }

      const [user] = await User.findOrCreate({
        where: { telegram_id: userData.id },
        defaults: {
          username: userData.username || `user_${userData.id}`,
          balance: '0.00'
        }
      });

      res.json({
        success: true,
        user: {
          id: user.id,
          telegram_id: user.telegram_id,
          username: user.username,
          balance: user.balance,
          role: user.role,
          status: user.status,
        }
      });
    } catch (error) {
      console.error('Telegram auth error:', error);
      res.status(500).json({ 
        success: false,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Auth failed'
      });
    }
  }
};