const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'balaji.y.1228@gmail.com',
    pass: 'Balaji_1228' // naturally, replace both with your real credentials or an application-specific password
  }
});

const mailOptions = {
  from: 'balaji.y.1228@gmail.com',
  to: 'balaji.y.1998@gmail.com, balaji.y.12@gmail.com',
  subject: 'Nodemailer',
  text: 'Nodemailer implementation'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
	console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});