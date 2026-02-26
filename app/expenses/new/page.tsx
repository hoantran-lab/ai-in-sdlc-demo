// ============================================================
// Page: /expenses/new - Màn hình thêm chi tiêu (SCR-003)
// ============================================================

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { STORAGE_KEY_SESSION } from '@/src/constants/auth';
import { getStorageItem } from '@/src/lib/utils/storage';
import { ExpenseForm } from '@/src/components/ExpenseForm';
import type { Expense } from '@/src/types/expense';

export default function NewExpensePage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  // Kiểm tra session
  const sessionId = getStorageItem(STORAGE_KEY_SESSION);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
    }
  }, [sessionId, router]);

  const handleSuccess = (expense: Expense) => {
    // Hiển thị toast thành công
    setShowSuccess(true);

    // Tự động quay lại sau 1.5s
    setTimeout(() => {
      router.push('/home');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/home');
  };

  if (!sessionId) return null;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <button
          onClick={handleCancel}
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Quay lại"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Thêm chi tiêu
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-lg">
          <ExpenseForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </main>

      {/* Toast thành công */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-bounce">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg">
            <span>✅</span>
            <span>Đã lưu chi tiêu thành công!</span>
          </div>
        </div>
      )}
    </div>
  );
}
