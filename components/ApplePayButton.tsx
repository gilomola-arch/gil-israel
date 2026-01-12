
import React from 'react';

interface ApplePayButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const ApplePayButton: React.FC<ApplePayButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-black hover:bg-zinc-900 text-white h-14 rounded-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
    >
      <svg viewBox="0 0 100 100" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M78.5,58.8c-0.1,13.1,10.7,19.3,10.8,19.4c-0.1,0.2-1.7,5.8-5.6,11.5c-3.4,4.9-6.9,9.8-12.4,9.9c-5.4,0.1-7.1-3.2-13.3-3.2c-6.2,0-8.1,3.1-13.3,3.3c-5.3,0.1-9.4-5.4-12.8-10.4c-6.9-10.1-12.2-28.4-5.1-40.8c3.5-6.2,9.9-10.1,16.8-10.2c5.3-0.1,10.2,3.6,13.5,3.6c3.2,0,9.2-4.4,15.5-3.8c2.6,0.1,10,1,14.8,8C86.3,47.1,78.6,50.8,78.5,58.8z M65.2,21.8c2.8-3.4,4.7-8.2,4.2-12.9c-4.1,0.2-9,2.7-12,6.3c-2.6,3.1-5,7.8-4.3,12.4C57.8,28,62.4,25.2,65.2,21.8z" />
      </svg>
      <span className="font-medium text-lg">Pay</span>
    </button>
  );
};
