"use server";

import pool from "@/lib/db";
import nodemailer from "nodemailer";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const suburb = formData.get("suburb") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO contact_submissions (name, email, suburb, phone, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, suburb, phone, message]
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Hello Water Website" <${process.env.SMTP_USER}>`,
      to: "support@hellowaterfiltration.com.au",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Suburb:</strong> ${suburb}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return { 
      success: false, 
      error: error.message || "Something went wrong. Please try again later." 
    };
  }
}
