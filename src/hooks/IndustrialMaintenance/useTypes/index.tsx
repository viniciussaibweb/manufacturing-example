import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { TypeService } from "@/services/ServiceType";
import { TypeData } from "@/services/ServiceType/types";

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
  listMaitenanceType: Array<TypeData>;
  setListMaitenanceType: SetStateInterface<Array<TypeData>>;
  filterTypes: () => Promise<void>;
  getAllTypes: () => Promise<void>;
  deleteTypes: (mafeId: number) => Promise<void>;
  saveTypes: (data: TypeData) => void;
  handleEditTypes: (id: number, description: string) => void;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setTabActive: SetStateInterface<number>;
}

const TypesContext = createContext<TypesContextInterface>(
  {} as TypesContextInterface
);

export function TypesProvider({ children }: { children: ReactNode }) {
  const typesService = new TypeService();

  const [listMaitenanceType, setListMaitenanceType] = useState<Array<TypeData>>(
    []
  );
  const formFilterRef = useRef<FormHandles>(null);
  const formRegisterRef = useRef<FormHandles>(null);
  const { setIsLoading } = useLoading();

  const [tabActive, setTabActive] = useState(0);

  const schema = Yup.object().shape({
    description: Yup.string().required("O campo é obrigatório"),
  });

  const getAllTypes = async () => {
    try {
      setIsLoading(true);
      const response = await typesService.getAll();
      setListMaitenanceType(response);
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
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
          id: formData?.code,
          description: formData.description,
        });
      } else {
        await typesService.postServiceType({
          description: formData.description,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      filterTypes();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTypes = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);

      let response = await typesService.getOneFilter(
        String(code).length ? code : description
      );

      if (response.length) {
        setListMaitenanceType(response);
      } else {
        setListMaitenanceType([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTypes = (id: number, description: string) => {
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", id);
      formRegisterRef.current?.setFieldValue("description", description);
    }, 200);

    setTabActive(1);
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
      listMaitenanceType: listMaitenanceType,
      filterTypes: filterTypes,
      setListMaitenanceType: setListMaitenanceType,
      deleteTypes: deleteTypes,
      handleEditTypes: handleEditTypes,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      saveTypes: saveTypes,
      tabActive,
      setTabActive,
      getAllTypes: getAllTypes,
    }),
    [listMaitenanceType, tabActive]
  );
  return (
    <TypesContext.Provider value={value}>{children}</TypesContext.Provider>
  );
}

export function useTypes() {
  const context = useContext(TypesContext);

  return context;
}
