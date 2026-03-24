"use client"
import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  modalType: string | null;
  openModal: (type: string) => void;
  closeModal: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  openModal: (type) => set({ isOpen: true, modalType: type }),
  closeModal: () => set({ isOpen: false, modalType: null }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

