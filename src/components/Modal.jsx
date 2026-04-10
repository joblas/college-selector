import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div;

export function Modal({ children, onClose, title, footer, mobileFullScreen }) {
  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26, 31, 54, 0.4)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: mobileFullScreen ? "0" : "20px"
        }}
        onClick={onClose}
      >
        <MotionDiv
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          style={{
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
          }}
          onClick={e => e.stopPropagation()}
        >
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
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
}