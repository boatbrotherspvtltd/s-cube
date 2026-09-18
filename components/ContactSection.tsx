"use client";

import React, { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Clock, ShieldCheck, Send, CheckCircle2 } from "lucide-react";
import { company } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import SectionHeading from "@/components/SectionHeading";

const INQUIRY_OPTIONS = [
  "Dealership / Distribution",
  "Solar PV Panels (Adani / Waaree)",
  "Inverters & Batteries (Luminous / Microtek)",
  "Solar Water Pumps",
  "Solar Street & Home Lighting",
  "General / Other Enquiry",
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: INQUIRY_OPTIONS[0],
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMessage("Please fill in your name, phone number, and message.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit. Please try again or WhatsApp us.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMessage("Network error. Please try again or reach out on WhatsApp.");
    }
  };

  const dynamicWhatsAppMsg = formData.name
    ? `Hello S-Cube Mercantile, my name is ${formData.name}. I am inquiring about ${formData.inquiryType}.`
    : undefined;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <SectionHeading
        eyebrow="Contact Us"
        title="Partner with S-Cube Mercantile"
        subtitle="For dependable solar product distribution, dealership inquiries, and channel supply across Assam and the Northeast."
      />

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Contact Form (7 cols) */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-[#ddd6c8]/60 lg:col-span-7">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#0b1f36]">Send Us an Enquiry</h3>
            <p className="mt-1 text-sm text-[#5d6b7a]">
              Fill out the form below and our distribution team will get back to you promptly.
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">Enquiry Received!</h4>
                <p className="text-sm text-emerald-700 mt-1">
                  Thank you, <strong>{formData.name}</strong>. Our team in Guwahati will contact you shortly regarding your {formData.inquiryType} enquiry.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      inquiryType: INQUIRY_OPTIONS[0],
                      message: "",
                    });
                  }}
                  className="text-xs text-[#0b1f36] underline hover:text-[#153454]"
                >
                  Send another message
                </button>
                <a
                  href={whatsappUrl(dynamicWhatsAppMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1f8a4c] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#18753f]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Continue on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#142033] mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-[#ddd6c8] bg-[#f7f4ee] px-3.5 py-2.5 text-sm text-[#142033] focus:border-[#0b1f36] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142033] mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#ddd6c8] bg-[#f7f4ee] px-3.5 py-2.5 text-sm text-[#142033] focus:border-[#0b1f36] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142033] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-[#ddd6c8] bg-[#f7f4ee] px-3.5 py-2.5 text-sm text-[#142033] focus:border-[#0b1f36] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142033] mb-1">
                  Area of Interest / Inquiry Type
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full rounded-xl border border-[#ddd6c8] bg-[#f7f4ee] px-3.5 py-2.5 text-sm text-[#142033] focus:border-[#0b1f36] focus:outline-none transition"
                >
                  {INQUIRY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142033] mb-1">
                  Your Message or Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details about your solar requirements, required capacity, or dealership questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-[#ddd6c8] bg-[#f7f4ee] px-3.5 py-2.5 text-sm text-[#142033] focus:border-[#0b1f36] focus:outline-none transition"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0b1f36] hover:bg-[#153454] disabled:opacity-60 px-7 py-3 text-sm font-semibold text-white shadow-sm transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {status === "submitting" ? "Sending..." : "Submit Enquiry"}
                </button>

                <span className="text-[11px] text-[#5d6b7a]">
                  ⚡ Fast response guaranteed by our team
                </span>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: WhatsApp & Quick Details (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* WhatsApp Direct Action Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1f8a4c] to-[#156e3b] p-6 text-white shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-base">Chat on WhatsApp</h4>
                <p className="text-xs text-white/80">Direct & Instant Assistance</p>
              </div>
            </div>

            <p className="text-xs text-white/90 leading-relaxed mb-4">
              Need immediate pricing, product brochures, or stock availability? Speak directly with our sales representative on WhatsApp.
            </p>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#156e3b] hover:bg-amber-50 shadow transition"
            >
              <MessageCircle className="w-4 h-4" />
              Open WhatsApp Chat
            </a>
          </div>

          {/* Office & Commercial Info Card */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#ddd6c8]/60 space-y-4">
            <h4 className="font-bold text-sm text-[#0b1f36] uppercase tracking-wider">
              Guwahati Office
            </h4>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-[#142033]">
              <MapPin className="mt-0.5 h-4 w-4 text-[#1f8a4c] flex-shrink-0" />
              <p className="leading-relaxed">{company.address}</p>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#142033]">
              <Mail className="h-4 w-4 text-[#1f8a4c] flex-shrink-0" />
              <a
                href={`mailto:${company.email}`}
                className="hover:text-[#1f8a4c] underline transition"
              >
                {company.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#142033]">
              <Clock className="h-4 w-4 text-[#1f8a4c] flex-shrink-0" />
              <span>Monday – Saturday: 9:30 AM – 6:30 PM</span>
            </div>

            <div className="pt-2 border-t border-[#ddd6c8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5d6b7a]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#e3a31a]" />
                <span>ISO 9001:2015 Certified</span>
              </div>
              <span className="font-mono font-medium">GSTN: {company.gstn}</span>
            </div>
          </div>

          {/* Map Embed */}
          <div className="h-[220px] overflow-hidden rounded-3xl border border-[#ddd6c8]/60 shadow-sm">
            <iframe
              title="S-Cube Mercantile location on Google Maps"
              src="https://www.google.com/maps?q=Nikita+Pinacle+Khanpara+Guwahati&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
