const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { config } = require('./config');

const { emails, sender } = config;
const lettersPath = path.resolve(__dirname, './assets/letters/');


const latters = fs.readdirSync(lettersPath)
	.map(fileName => {
		const filePath = path.resolve(lettersPath, fileName);
		const text = fs.readFileSync(filePath, 'utf8');
		const subject = fileName.replace('.txt', '');
		return { text, subject }
	});


let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: sender.email, // generated ethereal user
		pass: sender.password // generated ethereal password
	}
});

latters.map(latter => {
	const to = emails.join(', ');
	const email = {
		to,
		subject: latter.subject,
		text: latter.text,
	};
	transporter.sendMail(email, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log(`Message sent: ${email.subject}  to ${to}`);
	});
});