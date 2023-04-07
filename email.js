"use strict";
const nodemailer = require("nodemailer");
const account = {
  stmp:{
    user:'soportebackofficeapp@gmail.com',
    pass:'s0mepass#'
  },
  tls:{
    user:'refam@grupo-id.com.mx',
    pass:'Hp;X~Vn[;%*N'
  }
}

// async..await is not allowed in global scope, must use a wrapper
async function main(protocolo , to , message , res) {
  let {user , pass } = account[protocolo]
  
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  class Send{
    static smtp(){
      return nodemailer.createTransport({
        host: "mail.grupo-id.com.mx",
        port: 443,
        secure: false, // true for 465, false for other ports
        auth: { user, pass },
      });
    }
    static tls(){
      return nodemailer.createTransport({
        host: "mail.grupo-id.com.mx",
        port: 587,
        requireTLS:true , 
        tls:{ rejectUnauthorized:false},
        secure: false, // true for 465, false for other ports
        auth: { user, pass },
      });
      }
  }
  let transporter = Send[protocolo]()
  // send mail with defined transport object
  if( message == 'default')
    message = {
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>I refam<br>", // html body
    }

  let info = await transporter.sendMail({
    from: user, // sender address
    to, // list of receivers
    subject: message.subject, // Subject line
    text: message.text ?? '', // plain text body
    html: message.html ?? '', // html body
  });

  if(res != undefined) res.json({success:"Message sent: %s" + info.messageId});

  return {success:"Message sent: %s" + info.messageId}
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //res.json({success:"Preview URL: %s"+ nodemailer.getTestMessageUrl(info)});
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports =  app => {
  if( app != undefined )
    app.get('/email/:protocolo/:email', function (req, res) {
      main(req.params.protocolo , req.params.email , 'default', res)
        .catch(error => res.send({error:"Error: " + error.message}))
  })
  return main
}
