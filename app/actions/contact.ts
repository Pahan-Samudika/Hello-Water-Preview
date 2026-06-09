"use server";

import { db } from "@/lib/firebase";
import nodemailer from "nodemailer";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const suburb = formData.get("suburb") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const recaptchaToken = formData.get("g-recaptcha-response") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, & message are required." };
  }

  if (!recaptchaToken) {
    return { success: false, error: "reCAPTCHA verification is required." };
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not defined in environment variables.");
      return { success: false, error: "Server configuration error. reCAPTCHA key missing." };
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const verifyResponse = await fetch(verificationUrl, { method: "POST" });
    const verifyResult = await verifyResponse.json();

    console.log(`reCAPTCHA v3 verification score for ${email}:`, verifyResult.score);

    if (!verifyResult.success || (verifyResult.score !== undefined && verifyResult.score < 0.5)) {
      return { success: false, error: "reCAPTCHA verification failed. Low trust score." };
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return { success: false, error: "An error occurred during verification. Please try again." };
  }


  try {
    await db.collection("contact_submissions").add({
      name,
      email,
      suburb,
      phone,
      message,
      createdAt: new Date().toISOString(),
    });

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
      to: process.env.CONTACT_RECIPIENTS || "support@hellowaterfiltration.com.au",
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
  } catch (error: unknown) {
    console.error("Error submitting contact form:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again later.";

    return { 
      success: false, 
      error: message,
    };
  }
}
