import { ToastPosition } from "react-toastify";

export interface GetToastOptionsParams {
  timeAutoClose?: number;
  position?: ToastPosition | undefined;
}
