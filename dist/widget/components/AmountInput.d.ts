import React from 'react';
import { ValidationErrors } from '../../context/Transaction';
interface IAmountInputProps {
    disabled?: boolean;
    amount: string;
    setAmount: (newValue: string) => void;
    error: ValidationErrors[];
}
declare const AmountInput: React.FunctionComponent<IAmountInputProps>;
export default AmountInput;
//# sourceMappingURL=AmountInput.d.ts.map