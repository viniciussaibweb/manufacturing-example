import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { ScaleTypeService } from "@/services/IndustrialMaintenance/ScaleType";
import {
  errorAlertMessage,
  getToastOptions,
  makeValidation,
} from "@/services/utils";
import { FormHandles } from "@unform/core";
import { ScaleTypeData } from "@/services/IndustrialMaintenance/ScaleType/types";
import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { FormScaleTypeData } from "./types";
import { useLoading } from "@/store/loadingSlice";

interface ScaleTypeContextInterface {
  listScaleType: Array<ScaleTypeData>;
  setListScaleType: SetStateInterface<Array<ScaleTypeData>>;
  filterScaleType: () => Promise<void>;
  handleExcluir: (mafeId: number) => Promise<void>;
  saveScaleType: (data: FormScaleTypeData) => void;
  handleEditScaleType: (params: ScaleTypeData) => void;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setTabActive: SetStateInterface<number>;
}

const ScaleTypeContext = createContext<ScaleTypeContextInterface>(
  {} as ScaleTypeContextInterface
);

export function ScaleTypeProvider({ children }: { children: ReactNode }) {
  const scaleTypeService = new ScaleTypeService();
  const [listScaleType, setListScaleType] = useState<Array<ScaleTypeData>>([]);
  const [idEdit, setIdEdit] = useState<number>();
  const formFilterRef = useRef<FormHandles>(null);
  const formRegisterRef = useRef<FormHandles>(null);
  const { setIsLoading } = useLoading();

  const [tabActive, setTabActive] = useState(0);

  const schema = Yup.object().shape({
    description: Yup.string()
      .required("O campo é obrigatório")
      .max(80, "O campo não pode ter mais de 80 caracteres"),

    workDays: Yup.string()
      .required("O campo é obrigatório")
      .max(3, "O valor deve ser menor que 1000"),
    offDays: Yup.string()
      .required("O campo é obrigatório")
      .max(3, "O valor deve ser menor que 1000"),
  });

  const filterScaleType = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);
      let res = await scaleTypeService.getAll(
        String(code).length ? code : description
      );

      if (res.length) {
        setListScaleType(res);
      } else {
        setListScaleType([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluir = async (mafeId: number) => {
    try {
      setIsLoading(true);
      await scaleTypeService.deleteTool(mafeId);
      filterScaleType();
      toast.success("Item deletado com sucesso!");
    } catch (err) {
      toast.error(
        `Não foi possível excluir o cadastro. Motivo: ${err}`,
        getToastOptions()
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditScaleType = (params: ScaleTypeData) => {
    setIdEdit(params.id);
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", params.code);
      formRegisterRef.current?.setFieldValue("description", params.description);
      formRegisterRef.current?.setFieldValue("workDays", params.workDays);
      formRegisterRef.current?.setFieldValue("offDays", params.offDays);
    }, 200);

    setTabActive(1);
  };

  const saveScaleType = async (formData: FormScaleTypeData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }

      setIsLoading(true);
      if (formData?.code && idEdit) {
        await scaleTypeService.patchScaleType({
          id: idEdit,
          description: formData.description,
          workDays: parseInt(formData.workDays),
          offDays: parseInt(formData.offDays),
        });
      } else {
        await scaleTypeService.postScaleType({
          description: formData.description,
          workDays: parseInt(formData.workDays),
          offDays: parseInt(formData.offDays),
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      filterScaleType();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      listScaleType: listScaleType,
      filterScaleType: filterScaleType,
      setListScaleType: setListScaleType,
      handleExcluir: handleExcluir,
      handleEditScaleType: handleEditScaleType,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      saveScaleType: saveScaleType,
      tabActive,
      setTabActive,
    }),
    [listScaleType, tabActive]
  );

  return (
    <ScaleTypeContext.Provider value={value}>
      {children}
    </ScaleTypeContext.Provider>
  );
}

export function useScaleType() {
  const context = useContext(ScaleTypeContext);

  return context;
}
