import React from 'react';

export function Card({ children, onClick, style = {}, className = "", hover = false }) {
  const baseStyle = {
    background: "var(--bg-card)",
    borderRadius: "var(--radius-lg)",
    padding: "16px",
    border: "1px solid var(--border-color)",
    boxShadow: "var(--shadow-sm)",
    transition: "var(--transition)",
    position: "relative",
    ...style
  };

  const hoverStyle = hover ? {
    cursor: "pointer",
    boxShadow: "var(--shadow-md)",
    transform: "translateY(-2px)",
    borderColor: "var(--border-focus)"
  } : {};

  return (
    <div 
      onClick={onClick} 
      className={`card ${className}`}
      style={{ ...baseStyle, ...(onClick || hover ? hoverStyle : {}) }}
    >
      {children}
    </div>
  );
}
