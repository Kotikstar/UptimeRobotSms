const SMS = require('sms_ru');
const sms = new SMS('');

async function sendSms(options, client = sms) {
    return new Promise((resolve, reject) => {
        client.sms_send(options, (e) => {
            if (e) return reject(e);
            resolve();
        });
    })
}

module.exports.client = sms;
module.exports.sendSms = sendSms;