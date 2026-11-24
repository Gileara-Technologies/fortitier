"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { siteConfig } from "@/content/site-config";
import { cn } from "@/lib/cn";

const segments = [
  { value: "omc", label: "Oil marketing company (OMC)" },
  { value: "station", label: "Filling station / retail" },
  { value: "mine", label: "Mine" },
  { value: "industrial", label: "Industrial" },
  { value: "other", label: "Other" },
] as const;

const products = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "gasoil", label: "Gasoil" },
  { value: "mixed", label: "Mixed / multiple" },
] as const;

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const q = useSearchParams();
  const origin = q.get("origin");
  const destination = q.get("destination");
  const prefRoute = origin && destination ? `${origin} to ${destination}` : "";
  const prefProduct = q.get("product") ?? "";
  const prefSegment = q.get("segment") ?? "";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Could not send your request.");
      }
      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "success") {
    return (
      <div
        className="rounded-lg border border-bronze/30 bg-gold-soft/40 p-6"
        role="status"
      >
        <h3 className="font-display text-heading-md text-brown">Request received</h3>
        <p className="mt-2 text-body text-brown-muted">
          Thank you. We will respond on phone or email during {siteConfig.businessHours}.
          For urgent dispatch, call{" "}
          <a className="link-gold font-medium" href={`tel:${siteConfig.phoneTel}`}>
            {siteConfig.phone}
          </a>
          .
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-5"
          onClick={() => setState("idle")}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company name" name="company" required autoComplete="organization" />
        <Field label="Your name / role" name="role" required autoComplete="name" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Segment" name="segment" required options={segments} defaultValue={prefSegment} />
        <SelectField label="Product" name="product" required options={products} defaultValue={prefProduct} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Route or corridor"
          name="route"
          required
          defaultValue={prefRoute}
          placeholder="e.g. Tema depot to Kumasi stations"
        />
        <Field
          label="Volume cadence"
          name="volume"
          placeholder="e.g. 2 loads / week"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-body-sm font-medium text-brown">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          placeholder="Schedule needs, special site access, or contract interest"
        />
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-body-sm text-brown-muted">
        We respond on phone or email — {siteConfig.businessHours}. By submitting you agree we
        may contact you about this haulage request. See our{" "}
        <a href="/privacy" className="link-gold">
          privacy notice
        </a>
        .
      </p>

      {error ? (
        <p className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-body-sm text-error" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending…" : siteConfig.ctaLabel}
      </Button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-outline bg-paper px-3.5 py-2.5 text-body text-brown placeholder:text-brown-soft/70 shadow-sm transition-[border-color,box-shadow] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  const id = name;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body-sm font-medium text-brown">
        {label}
        {required ? <span className="text-bronze"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  required,
  options,
  defaultValue = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
}) {
  const id = name;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body-sm font-medium text-brown">
        {label}
        {required ? <span className="text-bronze"> *</span> : null}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={options.some((o) => o.value === defaultValue) ? defaultValue : ""}
        className={cn(inputClass, "bg-paper")}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
