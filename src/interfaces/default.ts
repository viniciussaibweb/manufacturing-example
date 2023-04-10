import { FormHandles } from "@unform/core";
import { Dispatch, SetStateAction } from "react";
import { Moment } from "moment"

export interface DefaultResponseApi<T> {
  success: boolean;
  message?: string;
  errors?: any;
  retorno: T;
}

export type SetStateInterface<T> = Dispatch<SetStateAction<T>>;

export type FormRefType = React.RefObject<FormHandles>;

export type DataPickerInput = Date | Moment | null