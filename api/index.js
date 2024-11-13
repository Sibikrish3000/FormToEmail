import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();  // Initialize `app` first

// Add CORS middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// (Optional) Function to verify Bearer token
function verifyBearerToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (token === process.env.AUTH_TOKEN) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Invalid Token' });
  }
}

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post('/send-email', verifyBearerToken, (req, res) => {
  const { name, email, message } = req.body;

  const mailtouser = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: `Hello ${name}, here is your message`,
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #ff6a00, #ee0979);
              color: #fff;
              height: 100%;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 2.5rem;
              color: #333;
              margin-top: 20px;
            }
            p {
              font-size: 1.1rem;
              line-height: 1.5;
              color: #333;
            }
            blockquote {
              font-style: italic;
              background: #f7f7f7;
              border-left: 5px solid #ff6a00;
              padding: 15px;
              margin: 20px 0;
              font-size: 1.2rem;
              color: #555;
            }
            .footer {
              font-size: 0.9rem;
              color: #aaa;
              margin-top: 30px;
              text-align: center;
            }
            .footer__social {
               margin-bottom: var(--mb-4);
                text-align: center;
            }
            .footer__icon {
              font-size: 1.5rem;
              margin: 0 var(--mb-2);
            }
            .cta-button {
              display: inline-block;
              background-color: #ff6a00;
              color: #fff;
              padding: 10px 25px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 30px;
              transition: background-color 0.3s ease;
            }
            .cta-button:hover {
              background-color: #ee0979;
            }
          </style>
        </head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <body>
          <div class="container">
            <h1>Thank you for reaching out, ${name}!</h1>
            <p>I received the following message from you:</p>
            <blockquote>${message}</blockquote>
            <p>We’ll be in touch soon.</p>
            <a href="https://sibikrish3000.github.io/" class="cta-button">Visit My Website</a>
            <div class="footer">
              <p>If you have any questions, feel free to reach out to me.</p>
                <div class="footer__social">
                  <a href="https://www.facebook.com/Sibikrish3000" class="footer__icon"><img src="https://img.icons8.com/?size=40&id=118497&format=png&color=000000" alt="Facebook" /></a>
                  <a href="https://www.instagram.com/wasperversa_302/" class="footer__icon"><img src="https://img.icons8.com/?size=40&id=32323&format=png&color=000000" alt="Instagram" /></a>
                  <a href="https://twitter.com/sibikrish3000" class="footer__icon"><img src="https://img.icons8.com/?size=38&id=phOKFKYpe00C&format=png&color=000000" alt="Twitter" /></a>
                </div>
              <p>&copy; Sibikrish. All rigths reserved ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
  
  transporter.sendMail(mailtouser, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send email to user' });
    }
    res.status(200).json({ message: 'Email sent successfully to user' });
  });


  const mailtome = {
    from: process.env.EMAIL_USERNAME, // Send from your email (configured in .env)
    to: process.env.EMAIL_RECEIVE, // Replace with your email address
    subject: `New message from ${name}`,
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background: #f3f4f6;
              color: #333;
              height: 100%;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 2.5rem;
              color: #007bff;
              margin-top: 20px;
            }
            p {
              font-size: 1.1rem;
              line-height: 1.6;
              color: #333;
            }
            .message {
              font-style: italic;
              background: #f7f7f7;
              border-left: 5px solid #007bff;
              padding: 15px;
              margin: 20px 0;
              font-size: 1.2rem;
              color: #555;
            }
            .footer {
              font-size: 0.9rem;
              color: #aaa;
              margin-top: 30px;
            }
            .cta-button {
              display: inline-block;
              background-color: #007bff;
              color: #fff;
              padding: 10px 25px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 30px;
              transition: background-color 0.3s ease;
            }
            .cta-button:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You have a new message from ${name}!</h1>
            <p>Here are the details of the message:</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div class="message">
              <p><strong>Message:</strong></p>
              <blockquote>${message}</blockquote>
            </div>
            <a href="mailto:${email}" class="cta-button">Reply to Message</a>
            <div class="footer">
              <p>&copy; Sibikrish. All rigths reserved ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
  transporter.sendMail(mailtome, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send email to dev' });
    }
    res.status(200).json({ message: 'Email sent successfully to dev' });
  });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
