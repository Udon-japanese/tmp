'use client';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { useState } from 'react';

export default function QuestionSettingMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const { isMd } = useMediaQuery();

  if (isMd) {
    return (
      <aside
        className={`fixed bottom-0 right-0 z-20 w-[19rem] h-[calc(100vh_-_4rem)] shadow transition-transform duration-500 ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <button
          tabIndex={0}
          className="absolute top-1/2 right-72 bg-gray-50 px-3 py-3 shadow rounded-md overflow-x-hidden -z-10"
          onClick={() => setShowMenu(!showMenu)}
          type="button"
        >
          <div className="mr-3">
gf
          </div>
        </button>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
          問題の設定
        </div>
      </aside>
    );
  }

  return (
    <button type="button" className='shadow bg-white rounded-full p-2.5 mx-4'>
     s
    </button>
  );
}
