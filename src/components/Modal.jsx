import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ children, onClose, title, footer, mobileFullScreen }) {
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
      animation: "fadeIn 0.2s ease-out",
      padding: mobileFullScreen ? "0" : "20px"
    }} onClick={onClose}>
      <div style={{
        background: "#fff",
        width: "100%",
        maxWidth: mobileFullScreen ? "100%" : "500px",
        height: mobileFullScreen ? "100%" : "auto",
        maxHeight: mobileFullScreen ? "100%" : "90vh",
        borderRadius: mobileFullScreen ? "0" : "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>{title}</h3>
          <Button variant="icon" onClick={onClose} style={{ 
            width: "36px", height: "36px", borderRadius: "50%" 
          }}><X size={20} /></Button>
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
            gap: "10px",
            flexShrink: 0
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}