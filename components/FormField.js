"use client";

// A labeled form field with an optional inline error message.
// The error's id follows "<field>-error" so the input can point
// at it with aria-describedby.

export default function FormField({ label, htmlFor, error, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        style={{
          display: "block",
          fontFamily: "'Courier New', monospace",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-sm)",
        }}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-accent)",
            margin: "var(--space-sm) 0 0",
            lineHeight: 1.5,
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}