const fetch = require('node-fetch');
const fs = require("fs");
const {promisify} = require('util');
const smsService = require('./sms.js');

const isError = (status) => status >= 400;


class HttpError extends Error {
    constructor(response) {
        super();
        this.response = response;
    }
}

function uptime(url) {
    return async function () {
        try {
            const result = await fetch(url);
            const {status} = result;

            if (isError(status)) {
                throw new HttpError({message: `Сервер вернул код ${status}`, status, code: 'HTTP_ERROR'});
            }

            const now = new Date();

            await promisify(fs.appendFile)("log.txt", `${now} Сервер вернул код: ${status}\n`);
            console.log('SUCCESS');
        } catch (e) {
            let code = e.code || 'ERRNORES';
            let status = e.errno || 404;
            if (e instanceof HttpError) {
                code = e.response.code;
                status = e.response.status;
            }
            const options = {
                to: '',
                text: `Сервер вернул код: ${code} ${status}`
            };

            await smsService.sendSms(options).catch(err => console.error(err));
            if (e instanceof fetch.FetchError) {
                console.error(`Сайта не существует ${code} ${status}`);
            } else {
                console.error(`¯\\_(ツ)_/¯ ${code} ${status}`);
            }
        }
    }
}

setInterval(uptime('https://google.com/'), 1000);