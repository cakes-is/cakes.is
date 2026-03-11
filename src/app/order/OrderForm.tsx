"use client";

import { useActionState } from "react";
import { submitOrder, type OrderActionState } from "./actions";
import Button from "@/components/Button";

const initialState: OrderActionState = { status: "idle" };

const cakeTypes = [
  "Afmæliskaka",
  "Brúðkaupskaka",
  "Skírnar kaka",
  "Kökur fyrir partý",
  "Sérsniðin kaka",
  "Annað",
];

function FieldError({ errors, name }: { errors?: Record<string, string[]>; name: string }) {
  const messages = errors?.[name];
  if (!messages?.length) return null;
  return (
    <p role="alert" className="mt-1 text-sm text-rose-dark">
      {messages[0]}
    </p>
  );
}

const inputClasses =
  "w-full px-4 py-3 rounded-lg border border-border bg-warm-white text-brown-dark placeholder:text-brown/50 focus:outline-none focus:border-rose-medium focus:ring-2 focus:ring-rose-light transition-colors duration-200";

export default function OrderForm() {
  const [state, formAction, isPending] = useActionState(submitOrder, initialState);

  if (state.status === "success") {
    return (
      <div className="text-center py-16 px-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-light mb-6"
          aria-hidden="true"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M6 16l8 8 12-14" stroke="#C97B7B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-brown-dark mb-3">
          Takk fyrir pöntunina!
        </h2>
        <p className="text-brown text-lg leading-relaxed max-w-md mx-auto">
          Við höfum móttekið pöntun þína og munum hafa samband við þig fljótlega til að ræða smáatriðin.
        </p>
        <div className="mt-8">
          <Button href="/cakes" variant="secondary">
            Skoða fleiri kökur
          </Button>
        </div>
      </div>
    );
  }

  const validationErrors =
    state.status === "validation_error" ? state.errors : undefined;

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.status === "error" && (
        <div
          role="alert"
          className="px-4 py-3 rounded-lg bg-rose-light border border-rose-medium text-brown-dark text-sm"
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brown-dark mb-1.5">
            Nafn <span className="text-rose-dark" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-describedby={validationErrors?.name ? "name-error" : undefined}
            className={inputClasses}
            placeholder="Jón Jónsson"
          />
          <FieldError errors={validationErrors} name="name" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brown-dark mb-1.5">
            Netfang <span className="text-rose-dark" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-describedby={validationErrors?.email ? "email-error" : undefined}
            className={inputClasses}
            placeholder="jon@dæmi.is"
          />
          <FieldError errors={validationErrors} name="email" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brown-dark mb-1.5">
            Sími <span className="text-rose-dark" aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            aria-required="true"
            aria-describedby={validationErrors?.phone ? "phone-error" : undefined}
            className={inputClasses}
            placeholder="555-1234"
          />
          <FieldError errors={validationErrors} name="phone" />
        </div>

        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-brown-dark mb-1.5">
            Dagsetning viðburðar <span className="text-rose-dark" aria-hidden="true">*</span>
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            aria-required="true"
            aria-describedby={validationErrors?.eventDate ? "eventDate-error" : undefined}
            className={inputClasses}
          />
          <FieldError errors={validationErrors} name="eventDate" />
        </div>
      </div>

      <div>
        <label htmlFor="cakeType" className="block text-sm font-medium text-brown-dark mb-1.5">
          Tegund köku <span className="text-rose-dark" aria-hidden="true">*</span>
        </label>
        <select
          id="cakeType"
          name="cakeType"
          required
          aria-required="true"
          aria-describedby={validationErrors?.cakeType ? "cakeType-error" : undefined}
          className={`${inputClasses} appearance-none`}
          defaultValue=""
        >
          <option value="" disabled>
            Veldu tegund köku...
          </option>
          {cakeTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <FieldError errors={validationErrors} name="cakeType" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brown-dark mb-1.5">
          Skilaboð <span className="text-rose-dark" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-required="true"
          aria-describedby={validationErrors?.message ? "message-error" : undefined}
          className={`${inputClasses} resize-y min-h-[120px]`}
          placeholder="Segðu okkur frá tilefninu, hönnunarvillum, fjölda gesta og öðru sem þú vilt..."
        />
        <FieldError errors={validationErrors} name="message" />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className={isPending ? "opacity-70 cursor-not-allowed" : ""}
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-warm-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sendi...
            </>
          ) : (
            "Senda pöntun"
          )}
        </Button>
      </div>
    </form>
  );
}
