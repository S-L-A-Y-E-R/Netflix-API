const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const fs = require('fs');

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Ahmed Elshehry <${process.env.EMAIL_FROM}>`;
    };

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
        };

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    };

    async send(html, subject) {

        const emailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
        };

        await this.newTransport().sendMail(emailOptions);
    };

    async sendPasswordReset() {
        const template = await fs.
            promises.
            readFile(`${__dirname}/../public/templates/resetPassword.html`, 'utf-8');

        const html = template.replace('#url#', this.url);
        await this.send(html, 'Your password reset token is (valid for 10 minutes)');
    }
}

module.exports = Email;