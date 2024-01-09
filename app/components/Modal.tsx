'use client';
import { Dispatch, SetStateAction } from 'react';
import { Drawer } from 'vaul';
import * as Dialog from '@radix-ui/react-dialog';
import useMediaQuery from '../hooks/useMediaQuery';

export default function Modal({
  children,
  showModal,
  setShowModal,
  isModalBelowMd,
}: {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  isModalBelowMd?: boolean;
}) {
  const { isMd } = useMediaQuery();

  if (isMd || isModalBelowMd) {
    return (
      <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            id="modal-backdrop"
            className="animate-fade-in fixed inset-0 z-40 bg-opacity-50 backdrop-blur-md"
          />
          <Dialog.Content
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="animate-scale-in fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 max-h-fit max-w-full overflow-auto p-0 focus:outline-none"
          >
            {children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
  return (
    <Drawer.Root open={showModal} onOpenChange={setShowModal}>
      <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white focus:outline-none">
          <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
            <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
          </div>
          {children}
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
