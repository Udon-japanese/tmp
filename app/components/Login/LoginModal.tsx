import Modal from '../Modal';
import { Dispatch, SetStateAction } from 'react';
import LoginForm from './LoginForm';

export default function LoginModal({
  showLoginModal,
  setShowLoginModal,
}: {
  showLoginModal: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal showModal={showLoginModal} setShowModal={setShowLoginModal}>
      <LoginForm />
    </Modal>
  );
}
