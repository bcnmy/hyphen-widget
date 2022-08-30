import ReactTooltip from 'react-tooltip';

interface ICustomTooltipProps {
  id: string;
  children?: React.ReactNode;
}

const CustomTooltip: React.FC<ICustomTooltipProps> = ({ id, children }) => {
  return (
    <ReactTooltip
      id={id}
      className="!w-auto !max-w-[180px] !rounded-md !bg-hyphen-gray-400 !px-2 !py-1 !font-sans !text-xxs"
      effect="solid"
      place="bottom"
      arrowColor="#545757"
    >
      {children}
    </ReactTooltip>
  );
};

export default CustomTooltip;
