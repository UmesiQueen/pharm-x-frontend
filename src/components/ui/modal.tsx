import type React from "react";
import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Types
type ModalContextValue = {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
};

interface ModalProps {
	children: React.ReactNode;
}

interface ModalTriggerProps {
	children: React.ReactNode;
	asChild?: boolean;
}

interface ModalContentProps {
	children: React.ReactNode;
	className?: string;
}

// Context
const ModalContext = createContext<ModalContextValue | undefined>(undefined);

// Hook
export const useModal = () => {
	const context = useContext(ModalContext);

	if (!context) {
		throw new Error("useModal must be used within a Modal component");
	}

	return context;
};

// Components
export function Modal({ children }: ModalProps) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const value = { isOpen, openModal, closeModal };

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function ModalTrigger({ children, asChild = false }: ModalTriggerProps) {
	const { openModal } = useModal();

	if (asChild) {
		return <Slot onClick={openModal}>{children}</Slot>;
	}

	return <Button onClick={openModal}>{children}</Button>;
}

export function ModalContent({ children, className = "" }: ModalContentProps) {
	const { isOpen, closeModal } = useModal();

	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50" aria-hidden="true" />

			{/* Modal */}
			<div
				className={`relative bg-white h-fit rounded-lg py-6 shadow-lg max-w-md w-full mx-4 z-10 ${className}`}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				aria-modal="true"
			>
				{/* Close button */}
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2"
					onClick={closeModal}
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</Button>

				{children}
			</div>
		</div>,
		document.body
	);
}

// Export compound component
export const ModalRoot = {
	Root: Modal,
	Trigger: ModalTrigger,
	Content: ModalContent,
};
