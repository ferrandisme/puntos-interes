"use client";

import { useState } from "react";
import { LoginModal } from "./login-modal";
import { RegisterModal } from "./register-modal";

export type AuthModalType = "login" | "register" | null;

interface AuthModalsProps {
  initialModal?: AuthModalType;
  onClose?: () => void;
}

export function AuthModals({ initialModal = null, onClose }: AuthModalsProps) {
  const [activeModal, setActiveModal] = useState<AuthModalType>(initialModal);

  const handleClose = () => {
    setActiveModal(null);
    onClose?.();
  };

  const switchToLogin = () => {
    setActiveModal("login");
  };

  const switchToRegister = () => {
    setActiveModal("register");
  };

  return (
    <>
      <LoginModal
        isOpen={activeModal === "login"}
        onClose={handleClose}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={activeModal === "register"}
        onClose={handleClose}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}

// Hook for state control
export function useAuthModals() {
  const [activeModal, setActiveModal] = useState<AuthModalType>(null);

  const openLogin = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModals = () => setActiveModal(null);

  return {
    activeModal,
    openLogin,
    openRegister,
    closeModals,
    AuthModalsComponent: () => (
      <AuthModals initialModal={activeModal} onClose={closeModals} />
    ),
  };
}
