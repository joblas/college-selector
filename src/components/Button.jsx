import React from 'react';

export function Button({ children, onClick, variant = "primary", style, disabled, className = "", ...props }) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: variant === "icon" ? "8px" : "10px 18px",
    borderRadius: variant === "icon" ? "50%" : "var(--radius-md)",
    fontSize: "14px",
    fontWeight: "600",
    cursor: disabled ? "default" : "pointer",
    transition: "var(--transition)",
    border: "none",
    opacity: disabled ? 0.5 : 1,
    whiteSpace: "nowrap",
    ...style
  };

  const variants = {
    primary: {
      background: "var(--primary)",
      color: "var(--text-on-primary)",
      boxShadow: "0 2px 8px rgba(240, 100, 73, 0.2)"
    },
    secondary: {
      background: "var(--secondary)",
      color: "var(--text-on-primary)"
    },
    outline: {
      background: "transparent",
      border: "1.5px solid var(--border-color)",
      color: "var(--text-main)"
    },
    danger: {
      background: "var(--danger)",
      color: "var(--text-on-primary)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-muted)"
    },
    icon: {
      background: "transparent",
      color: "var(--text-light)",
      padding: "6px"
    }
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <button 
      onClick={onClick} 
      style={{ ...baseStyle, ...currentVariant }}
      disabled={disabled}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
