interface ActionRow {
    actionName: string;
    actionFunction(item: object): void;
    actionDisplay(item: object): boolean
}

interface Column {
    label: string;
    column: string;
    width?: number;
    sum?: number;
    isBadge?: boolean;
}
