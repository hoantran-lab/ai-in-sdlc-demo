// ============================================================
// Hằng số cho UC-01: Đăng nhập bằng mã PIN
// ============================================================

/** Độ dài mã PIN (AC-01.1) */
export const PIN_LENGTH = 4;

/** Số lần thử tối đa trước khi khóa (NFR-SEC-03) */
export const MAX_ATTEMPTS = 3;

/** Thời gian khóa tạm (giây) sau khi nhập sai quá số lần (NFR-SEC-03) */
export const LOCK_DURATION_SECONDS = 30;

/** Thời gian session hết hạn (giờ) */
export const SESSION_EXPIRY_HOURS = 24;

/** Key lưu sessionId trong localStorage */
export const STORAGE_KEY_SESSION = 'sessionId';

/** Key lưu thời điểm hết khóa trong localStorage */
export const STORAGE_KEY_LOCKOUT = 'pin_lockout_until';
