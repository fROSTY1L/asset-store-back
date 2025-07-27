const crypto = require('crypto');

function verifyTelegramData(initData) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const dataToCheck = [];
    
    params.sort();
    params.forEach((val, key) => {
      if (key !== 'hash') {
        dataToCheck.push(`${key}=${val}`);
      }
    });
    
    const secret = crypto.createHash('sha256')
      .update("7895889614:AAGA8Ut1FgvVbIyzLhHrU5aq3PZ98tecu7Q")
      .digest();
    
    const computedHash = crypto.createHmac('sha256', secret)
      .update(dataToCheck.join('\n'))
      .digest('hex');
    
    if (computedHash !== hash) {
      return null;
    }
    
    return JSON.parse(params.get('user'));
  } catch (error) {
    console.error('Telegram auth verification failed:', error);
    return null;
  }
}

module.exports = { verifyTelegramData };