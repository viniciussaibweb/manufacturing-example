import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { ToolsService } from "@/services/IndustrialMaintenance/tools";
import { ToolData } from "@/services/IndustrialMaintenance/tools/types";
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
import { useLoading } from "@/store/loadingSlice";

interface ToolsContextInterface {
  listIndustrialMaitenance: Array<ToolData>;
  setListIndustrialMaitenance: SetStateInterface<Array<ToolData>>;
  filterTools: () => Promise<void>;
  handleExcluir: (mafeId: number) => Promise<void>;
  saveTools: (data: FormToolData) => void;
  handleEditTool: (id: number, description: string, code: number) => void;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setTabActive: SetStateInterface<number>;
}

const ToolsContext = createContext<ToolsContextInterface>(
  {} as ToolsContextInterface
);

export function ToolsProvider({ children }: { children: ReactNode }) {
  const toolsService = new ToolsService();
  const [listIndustrialMaitenance, setListIndustrialMaitenance] = useState<
    Array<ToolData>
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

  const filterTools = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);
      let res = await toolsService.getAll(
        String(code).length ? code : description
      );

      if (res.length) {
        setListIndustrialMaitenance(res);
      } else {
        setListIndustrialMaitenance([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluir = async (mafeId: number) => {
    try {
      await toolsService.deleteTool(mafeId);
      toast.success("Item deletado com sucesso!");
      filterTools();
    } catch (err) {
      toast.error(
        `Não foi possível excluir o cadastro. Motivo: ${err}`,
        getToastOptions()
      );
    }
  };

  const handleEditTool = (id: number, description: string, code: number) => {
    setIdEdit(id);
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", code);
      formRegisterRef.current?.setFieldValue("description", description);
    }, 200);

    setTabActive(1);
  };

  const saveTools = async (formData: FormToolData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }

      setIsLoading(true);
      if (formData?.code) {
        await toolsService.patchTool({
          id: idEdit,
          description: formData.description,
        });
      } else {
        await toolsService.postTool({
          description: formData.description,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      filterTools();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      listIndustrialMaitenance: listIndustrialMaitenance,
      filterTools: filterTools,
      setListIndustrialMaitenance: setListIndustrialMaitenance,
      handleExcluir: handleExcluir,
      handleEditTool: handleEditTool,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      saveTools: saveTools,
      tabActive,
      setTabActive,
    }),
    [listIndustrialMaitenance, tabActive]
  );

  return (
    <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);

  return context;
}
