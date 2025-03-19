import { Modal } from "antd";
import { createContext, useCallback, useContext, useState } from "react";
import { MdClose } from "react-icons/md";

const ModalContext = createContext();

function CompoundModal({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, toggleModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

function ModalTrigger({ render }) {
  const { openModal } = useModal();
  return render(openModal);
}

function ModalContent({ children, ...rest }) {
  const { isOpen, closeModal } = useModal();
  return (
    <Modal
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      closeIcon={<MdClose className="text-2xl" />}
      classNames={{ content: "!bg-[var(--background-color)]" }}
      {...rest}
    >
      {children}
    </Modal>
  );
}

function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a CompoundModal");
  }
  return context;
}

CompoundModal.Trigger = ModalTrigger;
CompoundModal.Content = ModalContent;

export { CompoundModal, useModal };
