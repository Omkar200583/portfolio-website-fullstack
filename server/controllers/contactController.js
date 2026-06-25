// backend/controllers/contactController.js
import Contact from "../models/Contact.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/response.js";
import { sendContactEmail, sendAutoReply } from "../services/emailService.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1️⃣ Save to MongoDB FIRST (always succeeds)
    const contact = await Contact.create({
      name,
      email,
      subject: subject || "Portfolio Contact",
      message,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // 2️⃣ Send emails WITHOUT blocking the response
    // If email fails, the message is still saved in DB
    Promise.all([
      sendContactEmail({ name, email, subject: subject || "Portfolio Contact", message }).catch((e) =>
        console.error("Background: contact email failed:", e.message)
      ),
      sendAutoReply({ name, email }).catch((e) =>
        console.error("Background: auto-reply failed:", e.message)
      ),
    ]);

    // 3️⃣ Return success immediately — don't wait for emails
    return sendSuccess(res, contact, "Message sent successfully", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    return sendPaginated(res, contacts, total, Number(page), Number(limit));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );
    if (!contact) return sendError(res, "Message not found", 404);
    return sendSuccess(res, contact);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const replyContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) return sendError(res, "Message not found", 404);

    // Fire email in background, don't block response
    sendAutoReply({
      name: contact.name,
      email: contact.email,
      replyMessage,
      originalMessage: contact.message,
    }).catch((e) => console.error("Background: reply email failed:", e.message));

    contact.status = "replied";
    contact.replyMessage = replyMessage;
    contact.repliedAt = new Date();
    await contact.save();

    return sendSuccess(res, contact, "Reply sent");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) return sendError(res, "Message not found", 404);
    return sendSuccess(res, contact, "Status updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return sendError(res, "Message not found", 404);
    return sendSuccess(res, null, "Message deleted");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};