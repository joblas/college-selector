import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ children, onClose, title, footer }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(26, 31, 54, 0.4)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
      animation: "fadeIn 0.2s ease-out"
    }} onClick={onClose}>
      <div style={{
        background: "#fff",
        width: "100%",
        maxWidth: "500px",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
        overflow: "hidden"
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>{title}</h3>
          <Button variant="icon" onClick={onClose}><X size={20} /></Button>
        </div>
        
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
        
        {footer && (
          <div style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px"
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
