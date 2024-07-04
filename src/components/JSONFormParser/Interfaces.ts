import {
  LayoutSizes,
  LayoutClasses,
  FieldTypes,
  FieldOrientation,
  ImageFieldShape,
  layoutTypes
} from './types'
export interface PageData {
    layouts: Layout[];
    contents: LayoutContent[];
    table: Table;
    reactTable?: any
}

export interface FormResponse {
    estado: boolean;
    formulario: '';
    formularioCategoriaId: number;
    id: number;
    nombre: string;
}

export interface FileInterface {
    url: string;
    title: string;
}

export interface Table {
    onCreate?: string | number;
    columns: Column[];
    mobileColumns: Column[];
    thumbView: boolean;
    backendPaginated: boolean;
    actions: Action[];
    actionRow: ActionRow[];
}

export interface Action {
    actionName: string;
    actionFunction: string;
}

export interface ActionRow {
    actionName: string;
    actionFunction: string;
    actionDisplay: boolean;
}

export interface Column {
    column: string;
    label: string;
}

export interface Layout {
    size: LayoutSizes;
    classes?: LayoutClasses;
    id: number;
    title?: string;
    type?: layoutTypes;
    content?: Layout[];
    config?: LayoutConfig;
}

export interface LayoutConfig {
    tooltipText?: string;
}

export interface FieldOption {
    label: string;
    value: number;
    default: boolean;
}

export interface FieldConfig {
    required: boolean;
    tooltipText?: string;
}

export interface Field {
    readonly id: number;
    type: FieldTypes;
    label?: string;
    langKey?:string
    options?: FieldOption[];
    orientation?: FieldOrientation;
    shape?: ImageFieldShape;
    config: FieldConfig;
}
export interface MapField {
    readonly id: number;
    type: FieldTypes;
    label?: string;
    showLocation: boolean;
    useModal: boolean;
    defaultHidden: boolean;
    config?: FieldConfig;
    fields: Field[];
}

export interface LayoutContent {
    layoutId: number;
    title?: string;
    fields?: Field[];
}
