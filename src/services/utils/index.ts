import { toast } from "react-toastify";
import { GetToastOptionsParams } from "./types";
import * as Yup from "yup";
import { FormRefType } from "@/interfaces/default";

export const GetApiBaseUrl = (apiType: string): string | undefined => {
  let baseUrl;

  switch (apiType) {
    case "EMISSORES":
      baseUrl = process.env.NEXT_PUBLIC_URL_API_EMISS;
      break;
    case "ADM":
      baseUrl = process.env.NEXT_PUBLIC_URL_API_ADM_PROD;
      break;
    case "SAIBWEB":
      baseUrl = process.env.NEXT_PUBLIC_URL_API_SAIB;
      break;
    case "MAINTENANCE":
      baseUrl = process.env.NEXT_PUBLIC_URL_API_MAINTENANCE;
      break;

    default:
      baseUrl = "";
      break;
  }

  return baseUrl;
};

export const getToastOptions = (params?: GetToastOptionsParams) => ({
  autoClose: params?.timeAutoClose ?? 4000,
  position: params?.position ?? toast.POSITION.TOP_CENTER,
});

export const errorAlertMessage = (error: any | unknown) => {
  const msg = `Erro: ${error?.message || error?.error || error}`;
  return toast.error(msg, getToastOptions());
};

export const makeValidation = async (
  schema: Yup.Schema,
  data: any,
  formRef: FormRefType,
  callback?: (errors: any) => void
) => {
  formRef.current?.setErrors({});

  try {
    await schema.validate(data, {
      abortEarly: false,
    });
    return true;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const validationErrors: Record<string, string> = {};
      err.inner.forEach((error) => {
        if (!error.path || !error.message) {
          return;
        }

        validationErrors[error.path] = error.message;
      });
      formRef.current?.setErrors(validationErrors);
      callback && callback(validationErrors);
    }
    return false;
  }
};
