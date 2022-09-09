import ReactTooltip from 'react-tooltip';

interface ICustomTooltipProps {
  id: string;
  children?: React.ReactNode;
}

const CustomTooltip: React.FC<ICustomTooltipProps> = ({ id, children }) => {
  return (
    <ReactTooltip
      id={id}
      className="!tw-hw-auto !tw-hw-max-w-[180px] !tw-hw-rounded-md !tw-hw-bg-hyphen-gray-400 !tw-hw-px-2 !tw-hw-py-1 !tw-hw-font-sans !tw-hw-text-xxs"
      effect="solid"
      place="bottom"
      arrowColor="#545757"
    >
      {children}
    </ReactTooltip>
  );
};

export default CustomTooltip;
