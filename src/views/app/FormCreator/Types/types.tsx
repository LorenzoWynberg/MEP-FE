
export type IPropsViewQuestion = {
    question: any;
    response?: boolean;
    active?:boolean;
    value?: any;
    form?: any;
    disabled?: boolean;
    handleImagesOpen: (any) => void;
    handleKeyPress?: (any) => void;
    handleOnChangeValue?: (any) => void;
    dragEnd?: (any) => void;
}
