import React from "react";
export interface Option {
    name: string;
    image?: string;
    id: any;
    disabled?: boolean;
    tooltip?: string;
}
export interface ISelectProps {
    options: Option[];
    selected?: Option;
    setSelected: (option: Option) => void;
    label: string;
    disabled?: boolean;
}
export declare const Select: React.FC<ISelectProps>;
export default Select;
//# sourceMappingURL=Select.d.ts.map