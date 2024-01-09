'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function LoginForm() {
  const [loginClicked, setLoginClicked] = useState(false);
  const searchParams = useSearchParams();

  return (
    <div className="w-full overflow-hidden md:max-w-lg md:w-[80vw] md:rounded-2xl md:border md:border-gray-300">
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
        <h3 className="text-2xl font-bold">ログイン</h3>
        <p className="text-sm text-gray-500">
          メールアドレスと、公開されているプロフィール情報のみ保存されます。
        </p>
      </div>
      <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
        <button
          disabled={loginClicked}
          className={`${
            loginClicked
              ? 'cursor-not-allowed border-gray-200 bg-gray-100'
              : 'border border-gray-200 bg-white text-black hover:bg-gray-50'
          } flex py-2 px-4 w-full items-center justify-center space-x-4 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
          onClick={() => {
            setLoginClicked(true);
            signIn('google', {
              callbackUrl: searchParams.get('callbackUrl') || '/',
            });
          }}
        >
          {loginClicked ? (
            <BeatLoader size={12} color="gray" />
          ) : (
            <>
              <Icon icon='flat-color-icons:google' className='text-xl' />
              <p>Google でログイン</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
