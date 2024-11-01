import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: '1a2b3c4d5e6f7g',
        pass: '1a2b3c4d5e6f7g',
    }
});

export const mailOptions = {
    from: 'lrimbault92@gmail.com',
    to: 'lrimbault92@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};


// Send the email
