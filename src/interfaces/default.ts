import { FormHandles } from "@unform/core";
import { Dispatch, SetStateAction } from "react";
import { Moment } from "moment";

export interface DefaultResponseApi<T> {
  success: boolean;
  message?: string;
  errors?: any;
  retorno: T;
}

export type SetStateInterface<T> = Dispatch<SetStateAction<T>>;

export type FormRefType = React.RefObject<FormHandles>;

export type DataPickerInput = Date | Moment | null;

export interface GridInstance {
  api?: {
    forEachNode: (callback: (node: any) => void) => void;
    getSelectedRows: () => any[];
    applyTransaction: ({}) => any[];
    getSelectedNodes: () => any[];
    getColumn: (item: string) => void;
    startEditingCell: ({}) => void;
    addEventListener: (value: string, index: () => void) => void;
    removeEventListener: (value: string, index: () => void) => void;
  } | null;
  columnApi?: {
    getAllColumns: () => any[];
  } | null;
}
