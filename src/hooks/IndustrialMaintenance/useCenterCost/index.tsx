import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { CenterCostService } from "@/services/IndustrialMaintenance/CenterCost";
import { CenterCostData } from "@/services/IndustrialMaintenance/CenterCost/types";

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

interface CenterCostContextInterface {
  listCenterCost: Array<CenterCostData>;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setListCenterCost: SetStateInterface<Array<CenterCostData>>;
  filterCenterCost: () => Promise<void>;
  deleteCenterCost: (id: number) => Promise<void>;
  saveCenterCost: (data: CenterCostData) => void;
  handleEditCenterCost: (
    id: number,
    description: string,
    code: number,
    tag: string
  ) => void;
  setTabActive: SetStateInterface<number>;
}

const CenterCostContext = createContext<CenterCostContextInterface>(
  {} as CenterCostContextInterface
);

export function CenterCostProvider({ children }: { children: ReactNode }) {
  const centerCostService = new CenterCostService();

  const [listCenterCost, setListCenterCost] = useState<Array<CenterCostData>>(
    []
  );
  const [idEdit, setIdEdit] = useState<number>();
  const formFilterRef = useRef<FormHandles>(null);
  const formRegisterRef = useRef<FormHandles>(null);
  const { setIsLoading } = useLoading();

  const [tabActive, setTabActive] = useState(0);

  const schema = Yup.object().shape({
    description: Yup.string()
      .required("O campo é obrigatório")
      .max(99, "O campo não pode ter mais de 100 caracteres"),

    tag: Yup.string()
      .required("O campo é obrigatório")
      .max(15, "O campo não pode ter mais de 15 caracteres"),
  });

  const saveCenterCost = async (formData: CenterCostData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      if (formData?.code) {
        await centerCostService.patchCenterCost({
          id: idEdit,
          description: formData.description,
          tag: formData.tag,
        });
      } else {
        await centerCostService.postCenterCost({
          description: formData.description,
          tag: formData.tag,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      filterCenterCost();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCenterCost = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");
    const tag = formFilterRef.current?.getFieldValue("tag");

    try {
      setIsLoading(true);

      let response = await centerCostService.getAll(
        String(code).length ? code : description
      );

      if (response.length) {
        setListCenterCost(response);
      } else {
        setListCenterCost([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCenterCost = (
    id: number,
    description: string,
    code: number,
    tag: string
  ) => {
    setIdEdit(id);
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", code);
      formRegisterRef.current?.setFieldValue("description", description);
      formRegisterRef.current?.setFieldValue("tag", tag);
    }, 200);

    setTabActive(1);
  };

  const deleteCenterCost = async (id: number) => {
    try {
      setIsLoading(true);
      await centerCostService.deleteCenterCost(id);

      toast.success("Item deletado com sucesso!");
      filterCenterCost();
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
      listCenterCost: listCenterCost,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      tabActive,
      setListCenterCost: setListCenterCost,
      deleteCenterCost: deleteCenterCost,
      handleEditCenterCost: handleEditCenterCost,
      saveCenterCost: saveCenterCost,
      setTabActive,
      filterCenterCost: filterCenterCost,
    }),
    [listCenterCost, tabActive]
  );
  return (
    <CenterCostContext.Provider value={value}>
      {children}
    </CenterCostContext.Provider>
  );
}

export function useCenterCost() {
  const context = useContext(CenterCostContext);

  return context;
}
