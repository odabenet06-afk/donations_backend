import handleTokens from "../../adminFunctions/handleTokens.js";
import { editDonation } from "../../models/edit/editDonation.model.js";
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

export async function editDonationController(req, res) {
  const { donationData } = req.body;

  if (!donationData) {
    return res.status(400).json({ message: "Invalid donation data structure" });
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }

  const result = await editDonation(donationData, decoded.username);

  if (!result.success) {
    return res.status(500).json({ error: result.error || result.message });
  }


  if (result.email && result.after_value) {
    try {
      const safeFields = {};
      for (const [key, val] of Object.entries(result.after_value)) {
        if (val !== undefined && val !== null && val !== "")
          safeFields[key] = escapeHtml(val.toString());
      }

      const htmlFields = Object.entries(safeFields)
        .map(([k, v]) => `<p><strong>${k.replace("_", " ")}:</strong> ${v}</p>`)
        .join("");

      const textFields = Object.entries(safeFields)
        .map(([k, v]) => `- ${k.replace("_", " ")}: ${v}`)
        .join("\n");

      const sentResponse = await resend.emails.send({
        from: "Matura App <no-reply@maturaapp.org>",
        to: result.email,
        subject: `Donation Updated – Thank you for supporting [NGO Name]`,
        text: `Hello ${safeFields.donor_name || ""},

Your donation has been updated. Here are the latest details:

${textFields}

Thank you for your support!
[NGO Name] Team
`,
        html: `
<div style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
  <h2 style="color: #0056b3; text-align: center; margin-bottom: 20px;">Donation Updated</h2>
  <p>Hello <strong>${safeFields.donor_name || ""}</strong>,</p>
  <p>Your donation has been updated. Here are the updated details:</p>
  <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
    ${htmlFields}
  </div>
  <p>Thank you for your support! Your donation helps us continue our work.</p>
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
          ["email", result.email, "failed", JSON.stringify({ error: sentResponse.error.message })]
        );
      } else {
        console.log("Email sent successfully:", sentResponse.data.id);
        await pool.query(
          `INSERT INTO audit_logs (entity_type, entity_id, action, changed_at, before_value, after_value)
           VALUES (?, ?, ?, NOW(), NULL, ?)`,
          ["email", result.email, "sent", null]
        );
      }
    } catch (err) {
      console.error("System Crash:", err.message);
      await pool.query(
        `INSERT INTO audit_logs (entity_type, entity_id, action, changed_at, before_value, after_value)
         VALUES (?, ?, ?, NOW(), NULL, ?)`,
        ["email", result.email, "failed", JSON.stringify({ system_error: err.message })]
      );
    }
  }

  return res.status(200).json({ message: result.message });
}