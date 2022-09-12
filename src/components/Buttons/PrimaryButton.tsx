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
        `tw-hw-rounded-[10px] tw-hw-bg-hyphen-purple tw-hw-p-[18px] tw-hw-font-semibold tw-hw-text-white disabled:tw-hw-cursor-not-allowed disabled:tw-hw-bg-gray-100 disabled:tw-hw-text-hyphen-gray-300`,
        className || ''
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
