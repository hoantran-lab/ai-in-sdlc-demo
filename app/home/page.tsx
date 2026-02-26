'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { STORAGE_KEY_SESSION } from '@/src/constants/auth';
import { getStorageItem, removeStorageItem } from '@/src/lib/utils/storage';

/**
 * Trang chủ sau khi đăng nhập thành công.
 * Route: /home
 */
export default function HomePage() {
  const router = useRouter();
  // Khởi tạo sessionId từ localStorage (lazy, tránh setState trong effect)
  const sessionId = getStorageItem(STORAGE_KEY_SESSION);

  // Redirect nếu chưa có session
  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
    }
  }, [sessionId, router]);

  // Đăng xuất
  const handleLogout = () => {
    removeStorageItem(STORAGE_KEY_SESSION);
    router.replace('/');
  };

  if (!sessionId) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Đăng nhập thành công!
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Chào mừng bạn đến với Quản lý Chi tiêu Gia đình
          </p>
        </div>

        {/* Chức năng chính */}
        <div className="space-y-3">
          <button
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 active:bg-emerald-700"
            onClick={() => {
              router.push('/expenses/new');
            }}
          >
            💰 Thêm chi tiêu
          </button>
          <button
            className="w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
            onClick={() => {
              router.push('/stats');
            }}
          >
            📊 Xem thống kê
          </button>
        </div>

        {/* Đăng xuất */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
