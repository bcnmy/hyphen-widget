import React, { HTMLAttributes } from 'react';
interface IModalProps extends HTMLAttributes<HTMLDivElement> {
    isVisible: boolean;
    onClose: () => void;
}
declare const Modal: React.FunctionComponent<IModalProps>;
export default Modal;
//# sourceMappingURL=Modal.d.ts.map