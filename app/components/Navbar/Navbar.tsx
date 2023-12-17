'use client';
import UserMenu from './UserMenu';
import { Button } from '@radix-ui/themes';
import { useState } from 'react';
import LoginModal from '../Login/LoginModal';
import { Session } from 'next-auth';
import useScroll from '@/app/hooks/useScroll';
import Link from 'next/link';

export default function Header({ session }: { session: Session | null }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const scrolled = useScroll(50);

  return (
    <>
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
      <div
        className={`fixed top-0 w-full flex justify-center ${
          scrolled
            ? 'border-b border-gray-200 bg-white/50 backdrop-blur-xl'
            : 'bg-white/0'
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 items-center justify-between w-full">
          <Link href="/" className="flex items-center font-display text-2xl">
            クイズ
          </Link>
          <div>
            {session ? (
              <UserMenu session={session} />
            ) : (
              <Button
                onClick={() => setShowLoginModal(true)}
                color="gray"
                variant="outline"
                radius="full"
              >
                ログイン
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
