var nodemailer = require('nodemailer');
var configs = require('../configs');

// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'web.dignityhope@gmail.com',
//     pass: configs.emailPassword
//   }
// });
let transporter = nodemailer.createTransport({
  host: 'auth.smtp.1and1.co.uk',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'no-reply@dignityhope.org',
    pass: configs.emailPassword
  }
});


module.exports = function(to, subject, body, callback) {

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"dignity & hope" <no-reply@dignityhope.org>', // sender address
      to: to.join(', '), // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body
      html: body // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        if (callback) callback(false);
      }
      else if (callback) callback(true);
  });
}
