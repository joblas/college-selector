import React from 'react';

const commonStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--border-color)",
  borderRadius: "var(--radius-md)",
  fontSize: "14px",
  background: "var(--bg-input)",
  outline: "none",
  boxSizing: "border-box",
  transition: "var(--transition)",
  color: "var(--text-main)"
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--text-muted)",
  marginBottom: "6px",
  letterSpacing: "0.01em"
};

const wrapperStyle = {
  marginBottom: "16px"
};

export function Input({ label, style = {}, ...props }) {
  return (
    <div style={wrapperStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input 
        {...props} 
        style={{ ...commonStyle, ...style }} 
        onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
        onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
      />
    </div>
  );
}

export function TextArea({ label, style = {}, ...props }) {
  return (
    <div style={wrapperStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea 
        {...props} 
        style={{ ...commonStyle, minHeight: "80px", ...style }}
        onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
        onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
      />
    </div>
  );
}

export function Select({ label, children, style = {}, ...props }) {
  return (
    <div style={wrapperStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <select 
        {...props} 
        style={{ ...commonStyle, ...style }}
        onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
        onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
      >
        {children}
      </select>
    </div>
  );
}
