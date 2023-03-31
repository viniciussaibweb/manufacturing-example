import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { ToolsService } from "@/services/tools";
import { ToolData } from "@/services/tools/types";
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
import { FormToolData } from "./types";

interface ToolsContextInterface {
  listIndustrialMaitenance: Array<ToolData>;
  setListIndustrialMaitenance: SetStateInterface<Array<ToolData>>;
  filterTools: () => Promise<void>;
  handleExcluir: (mafeId: number) => Promise<void>;
  saveTools: (data: FormToolData) => void;
  formFilterRef: FormRefType;
  formCadastroRef: FormRefType;
}

const ToolsContext = createContext<ToolsContextInterface>(
  {} as ToolsContextInterface
);

export function ToolsProvider({ children }: { children: ReactNode }) {
  const toolsService = new ToolsService();
  const [listIndustrialMaitenance, setListIndustrialMaitenance] = useState<
    Array<ToolData>
  >([]);
  const formFilterRef = useRef<FormHandles>(null);
  const formCadastroRef = useRef<FormHandles>(null);

  const schema = Yup.object().shape({
    mafeDescricao: Yup.string().required("O campo é obrigatório"),
  });

  const filterTools = async () => {
    const mafeDescricao = formFilterRef.current?.getFieldValue("mafeDescricao");

    try {
      const res = await toolsService.getAll(mafeDescricao);
      setListIndustrialMaitenance(res);
    } catch (err) {
      errorAlertMessage(err);
    }
  };

  const handleExcluir = async (mafeId: number) => {
    try {
      toolsService.deleteTool(mafeId);
      toast.success("Item deletado com sucesso!");
      filterTools();
    } catch (err) {
      toast.error(
        `Não foi possível excluir o cadastro. Motivo: ${err}`,
        getToastOptions()
      );
    }
  };

  const saveTools = async (formData: FormToolData) => {
    try {
      const isValid = await makeValidation(schema, formData, formCadastroRef);

      if (!isValid) {
        return;
      }
      await toolsService.postTool(formData.description);
      formCadastroRef.current?.reset();
      filterTools();
    } catch (err) {
      errorAlertMessage(err);
    }
  };

  const value = useMemo(
    () => ({
      listIndustrialMaitenance: listIndustrialMaitenance,
      filterTools: filterTools,
      setListIndustrialMaitenance: setListIndustrialMaitenance,
      handleExcluir: handleExcluir,
      formFilterRef: formFilterRef,
      formCadastroRef: formCadastroRef,
      saveTools: saveTools,
    }),
    [listIndustrialMaitenance]
  );

  return (
    <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);

  return context;
}
