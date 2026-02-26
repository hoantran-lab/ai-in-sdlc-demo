// ============================================================
// Types cho UC-01: Đăng nhập bằng mã PIN
// ============================================================

// --- Request/Response types ---

export interface VerifyPinRequest {
  pin: string;
}

export interface VerifyPinResponse {
  success: boolean;
  sessionId?: string;
  message: string;
}

// --- Component Props ---

export interface PINLoginProps {
  onSuccess?: (sessionId: string) => void;
  maxAttempts?: number;
  lockDurationSeconds?: number;
}

export interface PINDisplayProps {
  pin: string[];
  maxLength?: number;
  masked?: boolean;
}

export interface PINKeypadProps {
  onDigitPress: (digit: string) => void;
  onDelete: () => void;
  disabled?: boolean;
}

export interface PINKeypadButtonProps {
  value: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'number' | 'delete' | 'empty';
}

export interface LockOverlayProps {
  lockUntil: Date;
  onUnlock: () => void;
}
