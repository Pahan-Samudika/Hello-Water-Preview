"use server";

import { db } from "@/lib/firebase";
import nodemailer from "nodemailer";

export async function submitEnquiryForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const mobile = formData.get("mobile") as string;
  const postcode = formData.get("postcode") as string;
  const installedAddress = formData.get("installed_address") as string;
  const recaptchaToken = formData.get("g-recaptcha-response") as string;

  if (!name || !email || !mobile || !postcode) {
    return { success: false, error: "Name, email, mobile, and postcode are required." };
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
    await db.collection("enquiries").add({
      name,
      email,
      mobile,
      postcode,
      installedAddress,
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
      from: `"Hello Water Enquiry" <${process.env.SMTP_USER}>`,
      to: process.env.ENQUIRY_RECIPIENTS || "content@hellowaterfiltration.com.au",
      subject: `New QR Enquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #3b82f6;">New Enquiry Received</h2>
          <p>A new enquiry has been submitted via the QR system.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Postcode:</strong> ${postcode}</p>
          <p><strong>Installed Address:</strong> ${installedAddress || "Not provided"}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">Submitted on ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error: unknown) {
    console.error("Error submitting enquiry:", error);
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
