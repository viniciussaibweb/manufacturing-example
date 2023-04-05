import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { PositionOcupationService } from "@/services/IndustrialMaintenance/PositionsOcupation";
import { PositionsOcupationData } from "@/services/IndustrialMaintenance/PositionsOcupation/types";
import {
  errorAlertMessage,
  getToastOptions,
  makeValidation,
} from "@/services/utils";
import { FormHandles } from "@unform/core";
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
import { FormPostionsOcupationData } from "./types";
import { useLoading } from "@/store/loadingSlice";

interface PositionsOcupationContextInterface {
  listPositionsOcupation: Array<PositionsOcupationData>;
  setListPositionsOcupation: SetStateInterface<Array<PositionsOcupationData>>;
  filterPositionsOcupation: () => Promise<void>;
  deletePositionsOcupation: (id: number) => Promise<void>;
  savePositionsOcupation: (data: FormPostionsOcupationData) => void;
  handleEditPositionOcupation: (
    id: number,
    description: string,
    code: number
  ) => void;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setTabActive: SetStateInterface<number>;
}

const PositionsOcupationContext =
  createContext<PositionsOcupationContextInterface>(
    {} as PositionsOcupationContextInterface
  );

export function PositionsOcupationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const positionsOcupationService = new PositionOcupationService();

  const [listPositionsOcupation, setListPositionsOcupation] = useState<
    Array<PositionsOcupationData>
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

  const filterPositionsOcupation = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);
      let response = await positionsOcupationService.getAll(
        String(code).length ? code : description
      );

      if (response.length) {
        setListPositionsOcupation(response);
      } else {
        setListPositionsOcupation([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePositionsOcupation = async (id: number) => {
    try {
      await positionsOcupationService.deletePositionOcupation(id);
      toast.success("Item deletado com sucesso!");
      filterPositionsOcupation();
    } catch (err) {
      toast.error(
        `Não foi possível excluir o cadastro. Motivo: ${err}`,
        getToastOptions()
      );
    }
  };

  const handleEditPositionOcupation = (
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

  const savePositionsOcupation = async (
    formData: FormPostionsOcupationData
  ) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }

      setIsLoading(true);
      if (formData?.code) {
        await positionsOcupationService.patchPositionOcupation({
          id: idEdit,
          description: formData.description,
        });
      } else {
        await positionsOcupationService.postPositionOcupation({
          description: formData.description,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      filterPositionsOcupation();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      listPositionsOcupation: listPositionsOcupation,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      tabActive,
      filterPositionsOcupation: filterPositionsOcupation,
      setListPositionsOcupation: setListPositionsOcupation,
      deletePositionsOcupation: deletePositionsOcupation,
      handleEditPositionOcupation: handleEditPositionOcupation,
      savePositionsOcupation: savePositionsOcupation,
      setTabActive,
    }),
    [listPositionsOcupation, tabActive]
  );

  return (
    <PositionsOcupationContext.Provider value={value}>
      {children}
    </PositionsOcupationContext.Provider>
  );
}

export function usePositionOcupation() {
  const context = useContext(PositionsOcupationContext);

  return context;
}
