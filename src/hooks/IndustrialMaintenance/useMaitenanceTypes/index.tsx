import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { MaintenaceTypeService } from "@/services/IndustrialMaintenance/MaintenanceType";
import { MaintenaceTypeData } from "@/services/IndustrialMaintenance/MaintenanceType/types";

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
  filterMaitenanceTypes: () => Promise<void>;
  deleteMaitenanceTypes: (id: number) => Promise<void>;
  saveMaitenanceTypes: (data: MaintenaceTypeData) => void;
  handleEditMaitenanceTypes: (
    id: number,
    description: string,
    code: number
  ) => void;
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

  const saveMaitenanceTypes = async (formData: MaintenaceTypeData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      if (formData?.code) {
        await maitananceTypesService.patchMaitenanceType({
          id: idEdit,
          description: formData.description,
        });
      } else {
        await maitananceTypesService.postMaitenanceType({
          description: formData.description,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      filterMaitenanceTypes();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMaitenanceTypes = async () => {
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

  const handleEditMaitenanceTypes = (
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

  const deleteMaitenanceTypes = async (Id: number) => {
    try {
      setIsLoading(true);
      await maitananceTypesService.deleteMaitenanceType(Id);

      toast.success("Item deletado com sucesso!");
      filterMaitenanceTypes();
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
      filterMaitenanceTypes: filterMaitenanceTypes,
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
