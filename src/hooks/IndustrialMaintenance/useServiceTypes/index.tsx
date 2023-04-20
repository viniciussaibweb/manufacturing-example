import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { TypeService } from "@/services/IndustrialMaintenance/ServiceType";
import { TypeData } from "@/services/IndustrialMaintenance/ServiceType/types";

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

interface TypesContextInterface {
  listServiceType: Array<TypeData>;
  setListServiceType: SetStateInterface<Array<TypeData>>;
  getAllTypes: () => Promise<void>;
  deleteTypes: (mafeId: number) => Promise<void>;
  saveTypes: (data: TypeData) => void;
  handleEditTypes: (id: number, description: string, code: number) => void;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setTabActive: SetStateInterface<number>;
}

const ServiceTypesContext = createContext<TypesContextInterface>(
  {} as TypesContextInterface
);

export function ServiceTypesProvider({ children }: { children: ReactNode }) {
  const typesService = new TypeService();

  const [listServiceType, setListServiceType] = useState<Array<TypeData>>([]);
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

  const handleEditTypes = (id: number, description: string, code: number) => {
    setIdEdit(id);
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", code);
      formRegisterRef.current?.setFieldValue("description", description);
    }, 200);

    setTabActive(1);
  };

  const saveTypes = async (formData: TypeData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      if (formData?.code) {
        await typesService.patchServiceType({
          id: idEdit,
          description: formData.description,
        });
      } else {
        await typesService.postServiceType({
          description: formData.description,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      getAllTypes();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTypes = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);

      let response = await typesService.getAll(
        String(code).length ? code : description
      );

      if (response.length) {
        setListServiceType(response);
      } else {
        setListServiceType([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTypes = async (Id: number) => {
    try {
      setIsLoading(true);
      await typesService.deleteServiceType(Id);

      toast.success("Item deletado com sucesso!");
      getAllTypes();
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
      listServiceType: listServiceType,
      setListServiceType: setListServiceType,
      deleteTypes: deleteTypes,
      handleEditTypes: handleEditTypes,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      saveTypes: saveTypes,
      tabActive,
      setTabActive,
      getAllTypes: getAllTypes,
    }),
    [listServiceType, tabActive]
  );
  return (
    <ServiceTypesContext.Provider value={value}>
      {children}
    </ServiceTypesContext.Provider>
  );
}

export function useServiceTypes() {
  const context = useContext(ServiceTypesContext);

  return context;
}
