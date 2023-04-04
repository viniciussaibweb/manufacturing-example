import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { MaintenaceTypeService } from "@/services/MaitenanceType";
import { MaintenaceTypeData } from "@/services/MaitenanceType/types";

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
  listMaitenanceType: Array<MaintenaceTypeData>;
  setListMaitenanceType: SetStateInterface<Array<MaintenaceTypeData>>;
  getAllMaitenanceTypes: () => Promise<void>;
  deleteMaitenanceTypes: (id: number) => Promise<void>;
  saveMaitenanceTypes: (data: MaintenaceTypeData) => void;
  handleEditMaitenanceTypes: (id: number, description: string) => void;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setTabActive: SetStateInterface<number>;
}

const MaitananceTypesContext = createContext<TypesContextInterface>(
  {} as TypesContextInterface
);

export function MaitananceTypesProvider({ children }: { children: ReactNode }) {
  const maitananceTypesService = new MaintenaceTypeService();

  const [listMaitenanceType, setListMaitenanceType] = useState<
    Array<MaintenaceTypeData>
  >([]);
  const formFilterRef = useRef<FormHandles>(null);
  const formRegisterRef = useRef<FormHandles>(null);
  const { setIsLoading } = useLoading();

  const [tabActive, setTabActive] = useState(0);

  const schema = Yup.object().shape({
    description: Yup.string()
      .required("O campo é obrigatório")
      .max(99, "O campo não pode ter mais de 100 caracteres"),
  });

  const saveMaitenanceTypes = async (formData: MaintenaceTypeData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      if (formData?.code) {
        await maitananceTypesService.patchMaitenanceType({
          id: formData?.code,
          description: formData.description,
        });
      } else {
        await maitananceTypesService.postMaitenanceType({
          description: formData.description,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      getAllMaitenanceTypes();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllMaitenanceTypes = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);

      let response = await maitananceTypesService.getAll(
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

  const handleEditMaitenanceTypes = (id: number, description: string) => {
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", id);
      formRegisterRef.current?.setFieldValue("description", description);
    }, 200);

    setTabActive(1);
  };

  const deleteMaitenanceTypes = async (Id: number) => {
    try {
      setIsLoading(true);
      await maitananceTypesService.deleteMaitenanceType(Id);

      toast.success("Item deletado com sucesso!");
      getAllMaitenanceTypes();
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
      setListMaitenanceType: setListMaitenanceType,
      deleteMaitenanceTypes: deleteMaitenanceTypes,
      handleEditMaitenanceTypes: handleEditMaitenanceTypes,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      saveMaitenanceTypes: saveMaitenanceTypes,
      tabActive,
      setTabActive,
      getAllMaitenanceTypes: getAllMaitenanceTypes,
    }),
    [listMaitenanceType, tabActive]
  );
  return (
    <MaitananceTypesContext.Provider value={value}>
      {children}
    </MaitananceTypesContext.Provider>
  );
}

export function useMaitenanceTypes() {
  const context = useContext(MaitananceTypesContext);

  return context;
}
