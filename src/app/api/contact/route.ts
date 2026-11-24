import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/content/site-config";

export const runtime = "nodejs";

const contactSchema = z.object({
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  segment: z.enum(["omc", "station", "mine", "industrial", "other"]),
  product: z.enum(["petrol", "diesel", "gasoil", "mixed"]),
  route: z.string().trim().min(1).max(300),
  volume: z.string().trim().max(200).optional().default(""),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(200),
  message: z.string().trim().max(4000).optional().default(""),
  website: z.string().max(0).optional().or(z.literal("")),
});

function readString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    // Honeypot — bots fill hidden website field
    if (readString(form, "website")) {
      return NextResponse.json({ ok: true });
    }

    const parsed = contactSchema.safeParse({
      company: readString(form, "company"),
      role: readString(form, "role"),
      segment: readString(form, "segment"),
      product: readString(form, "product"),
      route: readString(form, "route"),
      volume: readString(form, "volume"),
      phone: readString(form, "phone"),
      email: readString(form, "email"),
      message: readString(form, "message"),
      website: readString(form, "website"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please check the required fields and try again." },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const target = process.env.CONTACT_EMAIL || siteConfig.email;

    // Delivery: log structured payload. Wire Resend/SMTP via Cloudflare Secrets later.
    // Never commit API keys. See docs/SECRETS.md.
    console.info("[fortitier-contact]", {
      to: target,
      ...payload,
      receivedAt: new Date().toISOString(),
    });

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const text = [
        `Company: ${payload.company}`,
        `Role: ${payload.role}`,
        `Segment: ${payload.segment}`,
        `Product: ${payload.product}`,
        `Route: ${payload.route}`,
        `Volume: ${payload.volume || "(not provided)"}`,
        `Phone: ${payload.phone}`,
        `Email: ${payload.email}`,
        `Message: ${payload.message || "(none)"}`,
      ].join("\n");

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || `Fortitier Logistics <onboarding@resend.dev>`,
            to: [target],
            reply_to: payload.email,
            subject: `Haulage request — ${payload.company}`,
            text,
          }),
        });
      } catch (err) {
        console.error("[fortitier-contact] resend failed", err);
        // Still accept the request; payload is logged for manual follow-up.
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[fortitier-contact] error", err);
    return NextResponse.json(
      { ok: false, error: "Could not process your request. Please call us." },
      { status: 500 },
    );
  }
}
