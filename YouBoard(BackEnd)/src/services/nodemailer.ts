import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { redis } from "./redis";
import { htmlTemplate } from "../utils/htmlTemplate";

// Configuring nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Function for sending mail
const sendEmail = async (email: string) => {
  // generates a unique token
  const token = uuidv4();
  const verificationUrl = `${process.env.BASE_URL}/verify-email?email=${email}&token=${token}`;

  // Store verification data in Redis (expires in 1 hour)
  await redis.setEx(
    `verify:${email}`,
    60,
    JSON.stringify({
      email,
      token,
      verified: false,
    })
  );

  // Content of mail
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Verify Your Email",
    html: htmlTemplate(verificationUrl),
  };

  // Will send mail to user including content
  return await transporter.sendMail(mailOptions);
};

export { sendEmail };
