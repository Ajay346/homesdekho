import nodemailer from "nodemailer";
import path from "path";
import { create } from "express-handlebars";
import hbs from "nodemailer-express-handlebars";
import Leads from "../models/emailModal.js";

// get template path
const emailTemplatesPath = path.join(path.resolve(), "/email_templates");

// Create the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testtgcms@gmail.com", // Replace with your email
    pass: "robjkwwvetxhxsts", // Replace with your app password
  },
});

// Configure handlebars for email templates
const handlebarOptions = {
  viewEngine: create({
    extname: ".hbs",
    partialsDir: emailTemplatesPath,
    defaultLayout: false,
  }),
  viewPath: emailTemplatesPath,
  extName: ".hbs",
};
transporter.use("compile", hbs(handlebarOptions));

// Controller function to send an email
export const emailGenerator = async (req, res) => {
  const { email, subject, name, mobile } = req.body;
  // const newSubject = "Homes Dekho " + subject;
  // Email options
  const mailOptions = {
    from: "testtgcms@gmail.com",
    to: "homesdekho5@gmail.com",
    cc: ["yogesh.lala@regnum.in", "deepti.k@regnum.in"],
    subject,
    template: "email", // Name of the Handlebars template
    context: {
      name,
      email,
      mobile,
    },
  };

  try {
    await transporter.sendMail(mailOptions);

    const lead = new Leads({ email, subject, name, mobile, status: "Sent" });
    await lead.save();

    res.status(200).json({ success: true, mobile: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.mobile });
  }
};
