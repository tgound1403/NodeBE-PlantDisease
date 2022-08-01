// "use strict";
import { createTransport, getTestMessageUrl } from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email

    // create reusable transporter object using the default SMTP transport
    let transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'trieuduong140302@gmail.com',
            pass: 'Duong14032002'
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Plant Disease Server👻"', // sender address
        to: "tgound140302@gmail.com", // list of receivers
        subject: "Hello Duong✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);