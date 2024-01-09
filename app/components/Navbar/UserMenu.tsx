'use client';
import Image from 'next/image';
import { Session } from 'next-auth';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Popover from '../Popover';
import { useRouter } from 'next/navigation';

export default function UserMenu({ session }: { session: Session | null }) {
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();

  if (!session) {
    return (
      <div className="animate-pulse">
        <div className="h-10 w-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
    );
  }

  const closePopover = () => {
    setOpenPopover(false);
  };

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 md:w-56">
            <div className="p-2">
              {session.user?.name && (
                <p className="truncate text-sm font-medium text-gray-900">
                  {session.user.name}
                </p>
              )}
              <p className="truncate text-sm text-gray-500">
                {session.user?.email}
              </p>
            </div>
            <button
              onClick={() => {
                closePopover();
                router.push('/mypage');
              }}
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
            >
              <p className="text-sm">マイページ</p>
            </button>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={() => {
                closePopover();
                signOut({ callbackUrl: '/' });
              }}
            >
              <p className="text-sm">ログアウト</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 md:h-9 md:w-9"
        >
          <Image
            alt={`${session.user?.name} のアイコン`}
            src={session.user?.image!}
            width={40}
            height={40}
          />
        </button>
      </Popover>
    </div>
  );
}
