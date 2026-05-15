"use server";

import { db } from "@/lib/firebase";
import nodemailer from "nodemailer";

export async function submitEnquiryForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const mobile = formData.get("mobile") as string;
  const postcode = formData.get("postcode") as string;
  const installedAddress = formData.get("installed_address") as string;

  if (!name || !email || !mobile || !postcode) {
    return { success: false, error: "Name, email, mobile, and postcode are required." };
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
