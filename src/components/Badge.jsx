import React from 'react';

export function Badge({ children, bg = "var(--primary-light)", color = "var(--primary)", style = {} }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "700",
      background: bg,
      color: color,
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      ...style
    }}>
      {children}
    </span>
  );
}
