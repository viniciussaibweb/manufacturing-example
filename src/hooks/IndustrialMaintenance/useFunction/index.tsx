import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { FunctionService } from "@/services/IndustrialMaintenance/Function";
import { FunctionData } from "@/services/IndustrialMaintenance/Function/types";

import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useMemo,
  useRef,
} from "react";

import { toast } from "react-toastify";
import * as Yup from "yup";
import { useLoading } from "@/store/loadingSlice";

import {
  errorAlertMessage,
  getToastOptions,
  makeValidation,
} from "@/services/utils";

import { FormHandles } from "@unform/core";

interface FunctionInterface {
  listFunction: Array<FunctionData>;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setListFunction: SetStateInterface<Array<FunctionData>>;
  filterFunction: () => Promise<void>;
  deleteFunction: (id: number) => Promise<void>;
  saveFunction: (data: FunctionData) => void;
  handleEditFunction: (id: number, description: string, code: number) => void;
  setTabActive: SetStateInterface<number>;
}

const FunctionContext = createContext<FunctionInterface>(
  {} as FunctionInterface
);

export function FunctionProvider({ children }: { children: ReactNode }) {
  const functionService = new FunctionService();

  const [listFunction, setListFunction] = useState<Array<FunctionData>>([]);
  const [idEdit, setIdEdit] = useState<number>();
  const formFilterRef = useRef<FormHandles>(null);
  const formRegisterRef = useRef<FormHandles>(null);
  const { setIsLoading } = useLoading();

  const [tabActive, setTabActive] = useState(0);

  const schema = Yup.object().shape({
    description: Yup.string()
      .required("O campo é obrigatório")
      .max(99, "O campo não pode ter mais de 100 caracteres"),
  });

  const saveFunction = async (formData: FunctionData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      if (formData?.code) {
        await functionService.patchFunction({
          id: idEdit,
          description: formData.description,
        });
      } else {
        await functionService.postFunction({
          description: formData.description,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      filterFunction();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterFunction = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);

      let response = await functionService.getAll(
        String(code).length ? code : description
      );

      if (response.length) {
        setListFunction(response);
      } else {
        setListFunction([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFunction = (
    id: number,
    description: string,
    code: number
  ) => {
    setIdEdit(id);
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", code);
      formRegisterRef.current?.setFieldValue("description", description);
    }, 200);

    setTabActive(1);
  };

  const deleteFunction = async (id: number) => {
    try {
      setIsLoading(true);
      await functionService.deleteFunction(id);

      toast.success("Item deletado com sucesso!");
      filterFunction();
    } catch (err) {
      toast.error(
        `Não foi possível excluir o cadastro. Motivo: ${err}`,
        getToastOptions()
      );
    } finally {
      setIsLoading(false);
    }
  };
  const value = useMemo(
    () => ({
      listFunction: listFunction,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      tabActive,
      setListFunction: setListFunction,
      deleteFunction: deleteFunction,
      handleEditFunction: handleEditFunction,
      saveFunction: saveFunction,
      setTabActive,
      filterFunction: filterFunction,
    }),
    [listFunction, tabActive]
  );
  return (
    <FunctionContext.Provider value={value}>
      {children}
    </FunctionContext.Provider>
  );
}

export function useFunction() {
  const context = useContext(FunctionContext);

  return context;
}
