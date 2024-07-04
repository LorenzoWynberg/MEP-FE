export type PropsContenedor = {
  titulo: string;
  relleno: boolean;
  tooltip: string;
};

export type PropsSimpleText = {
  titulo: string;
  tooltip: string;
  mask: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
  required: boolean;
};

export type PropsTextArea = {
  titulo: string;
  tooltip: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
  required: boolean;
};

export type PropsLocation = {
  required: boolean;
};

export type PropsCoordinates = {
  required: boolean;
  useModal: boolean;
};

export type PropsFileUpload = {
  titulo: string;
  tooltip: string;
  required: boolean;
};
