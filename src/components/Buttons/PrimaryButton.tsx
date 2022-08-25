import * as React from 'react';
import { twMerge } from 'tailwind-merge';

interface IPrimaryButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
}

const PrimaryButton: React.FunctionComponent<IPrimaryButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        `rounded-[10px] bg-hyphen-purple p-[18px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-hyphen-gray-300`,
        className || ''
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
