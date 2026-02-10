import handleTokens from "../../adminFunctions/handleTokens.js";
import { createDonation } from "../../models/create/createDonation.model.js";
import { toggleReload } from "../../../index.js";
import { Resend } from "resend";
import pool from "../../../db/db.js";

const resend = new Resend(process.env.RESEND);

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function createDonationController(req, res) {
  const { donationData } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Missing authorization header" });

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const result = await createDonation(donationData, decoded.username);

  if (result.success) {
    toggleReload();

    if (result.email) {
      try {
        const safe = {
          donor_name: escapeHtml(donationData.donor_name),
          donor_id: escapeHtml(donationData.donor_id),
          amount: donationData.amount,
          currency: escapeHtml(donationData.currency),
          donation_purpose: escapeHtml(donationData.donation_purpose),
          receipt_number: escapeHtml(donationData.receipt_number),
          date: new Date().toLocaleString(),
        };

        const sentResponse = await resend.emails.send({
          from: "Matura App <no-reply@maturaapp.org>",
          to: result.email,
          subject: `Donation Confirmation – Thank you for supporting [NGO Name]`,
          text: `Hello ${safe.donor_name},

Thank you for your generous donation of ${safe.amount} ${safe.currency}.

Donation Details:
- Donor Name: ${safe.donor_name}
- Donor ID: ${safe.donor_id}
- Amount: ${safe.amount} ${safe.currency}
- Purpose: ${safe.donation_purpose}
- Receipt Number: ${safe.receipt_number}
- Date: ${safe.date}

We appreciate your support!

Thank you,
[NGO Name] Team
`,
          html: `
<div style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
  <h2 style="color: #0056b3; text-align: center; margin-bottom: 20px;">Donation Confirmation</h2>
  <p>Hello <strong>${safe.donor_name}</strong>,</p>
  <p>Thank you for your generous donation. Here are your donation details:</p>
  <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Donor Name:</strong> ${safe.donor_name}</p>
      <p><strong>Donor ID:</strong> ${safe.donor_id}</p>
      <p><strong>Amount:</strong> ${safe.amount} ${safe.currency}</p>
      <p><strong>Purpose:</strong> ${safe.donation_purpose}</p>
      <p><strong>Receipt Number:</strong> ${safe.receipt_number}</p>
      <p><strong>Date:</strong> ${safe.date}</p>
  </div>
  <p>We appreciate your support! Your donation helps us continue our work.</p>
  <p style="margin-top: 30px; text-align: center; color: #555;">
      Thank you,<br>
      [NGO Name] Team
  </p>
  <p style="font-size: 0.8em; text-align: center; color: #aaa; margin-top: 20px;">
      This is an automated email, please do not reply.
  </p>
</div>
`,
        });

        if (sentResponse.error) {
          console.error("Email API Error:", sentResponse.error.message);

          await pool.query(
            `INSERT INTO audit_logs (entity_type, entity_id, action, changed_at, before_value, after_value)
             VALUES (?, ?, ?, NOW(), NULL, ?)`,
            [
              "email",
              result.email,
              "failed",
              JSON.stringify({ error: sentResponse.error.message }),
            ],
          );
        } else {
          console.log("Email sent successfully:", sentResponse.data.id);

          await pool.query(
            `INSERT INTO audit_logs (entity_type, entity_id, action, changed_at, before_value, after_value)
             VALUES (?, ?, ?, NOW(), NULL, ?)`,
            ["email", result.email, "sent", null],
          );
        }
      } catch (err) {
        console.error("System Crash:", err.message);
        await pool.query(
          `INSERT INTO audit_logs (entity_type, entity_id, action, changed_at, before_value, after_value)
           VALUES (?, ?, ?, NOW(), NULL, ?)`,
          [
            "email",
            result.email,
            "failed",
            JSON.stringify({ system_error: err.message }),
          ],
        );
      }
    }
    return res.status(201).json({ message: "Donation created", id: result.id });
  }

  return res.status(500).json({ error: result.error });
}
