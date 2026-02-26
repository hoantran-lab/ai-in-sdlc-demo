'use client';

import { PINKeypadProps } from '@/src/types/auth';
import { PINKeypadButton } from './PINKeypadButton';

/**
 * Bàn phím số 3x4 để nhập mã PIN.
 * Layout: 1-9, empty, 0, delete
 */
export function PINKeypad({
  onDigitPress,
  onDelete,
  disabled = false,
}: PINKeypadProps) {
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'empty', '0', 'delete',
  ];

  return (
    <div
      className="grid grid-cols-3 gap-4 place-items-center"
      role="group"
      aria-label="Bàn phím nhập mã PIN"
    >
      {keys.map((key) => {
        if (key === 'empty') {
          return <PINKeypadButton key={key} value="" onClick={() => {}} variant="empty" />;
        }

        if (key === 'delete') {
          return (
            <PINKeypadButton
              key={key}
              value="⌫"
              onClick={onDelete}
              disabled={disabled}
              variant="delete"
            />
          );
        }

        return (
          <PINKeypadButton
            key={key}
            value={key}
            onClick={() => onDigitPress(key)}
            disabled={disabled}
            variant="number"
          />
        );
      })}
    </div>
  );
}
