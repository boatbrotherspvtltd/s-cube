import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, inquiryType, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "Please provide your name, phone number, and a message." },
        { status: 400 }
      );
    }

    const contactDoc = {
      name: String(name).trim(),
      email: String(email || "").trim(),
      phone: String(phone).trim(),
      inquiryType: String(inquiryType || "General Enquiry").trim(),
      message: String(message).trim(),
      createdAt: new Date(),
    };

    // If MongoDB is configured, save lead
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db();
        await db.collection("contacts").insertOne(contactDoc);
      } catch (dbErr) {
        console.warn("Could not save contact submission to MongoDB:", dbErr);
      }
    }

    console.log("New contact lead received:", contactDoc);

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Our team will contact you shortly.",
    });
  } catch (err: unknown) {
    console.error("Error in /api/contact:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit enquiry. Please try again." },
      { status: 500 }
    );
  }
}
