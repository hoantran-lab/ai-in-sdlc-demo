// ============================================================
// localStorage helpers - An toàn với SSR (Next.js)
// ============================================================

/**
 * Lấy giá trị từ localStorage (trả về null nếu chạy trên server)
 */
export function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(key);
  } catch {
    console.warn(`[Storage] Không thể đọc key "${key}"`);
    return null;
  }
}

/**
 * Lưu giá trị vào localStorage
 */
export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, value);
  } catch {
    console.warn(`[Storage] Không thể lưu key "${key}"`);
  }
}

/**
 * Xóa giá trị khỏi localStorage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`[Storage] Không thể xóa key "${key}"`);
  }
}
