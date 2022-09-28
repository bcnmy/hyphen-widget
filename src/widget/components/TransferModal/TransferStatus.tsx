function TransferStatus({
  children,
  ...delegated
}: {
  children: React.ReactNode;
  [delegated: string]: any;
}) {
  return (
    <span
      className="tw-hw-mb-3 tw-hw-block tw-hw-w-full tw-hw-rounded-[10px] tw-hw-bg-hyphen-gray-300 tw-hw-bg-opacity-25 tw-hw-py-4 tw-hw-text-sm tw-hw-font-semibold"
      {...delegated}
    >
      {children}
    </span>
  );
}

export default TransferStatus;
