import { SetStateInterface } from "@/interfaces/default";
import { TaskToolService } from "@/services/IndustrialMaintenance/Task-Tools";
import { ToolData } from "@/services/IndustrialMaintenance/tools/types";
import { FormTaskToolData } from "./types";
import { createContext, ReactNode, useState, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import { useLoading } from "@/store/loadingSlice";
import { errorAlertMessage } from "@/services/utils";

interface TaskToolContextInterface {
  toolTableData: ToolData[];
  setToolTableData: SetStateInterface<ToolData[]>;
  getAllTaskTool: (idaTask: number) => void;
  saveTaskTool: (paramsTaskTool: FormTaskToolData[]) => void;
  listServiceTaskTool: FormTaskToolData[];
  deleteTaskTool: (id: number) => void;
}

const TaskToolContext = createContext<TaskToolContextInterface>(
  {} as TaskToolContextInterface
);

export function TaskToolProvider({ children }: { children: ReactNode }) {
  const taskToolService = new TaskToolService();

  const [listServiceTaskTool, setListServiceTaskTool] = useState<any>([]);
  const [toolTableData, setToolTableData] = useState<ToolData[]>([]);
  const { setIsLoading } = useLoading();

  const getAllTaskTool = async (idTask: number) => {
    try {
      setIsLoading(true);

      const response = await taskToolService.getAll(idTask);
      setListServiceTaskTool(response);
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateTaskToolParams = (paramsTaskTool: FormTaskToolData[]) => {
    let allConditionsMet = true;

    Object.values(paramsTaskTool).forEach((item: FormTaskToolData) => {
      if (!parseInt(item.quantity) || parseInt(item.quantity) <= 0) {
        toast.error(
          `Quantidade inválida - Ferramenta: ${item.codeTool} - ${item.descriptionTool}`
        );
        allConditionsMet = false;
      }
    });

    return allConditionsMet;
  };

  const saveTaskTool = async (paramsTaskTool: FormTaskToolData[]) => {
    try {
      setIsLoading(true);

      const allConditionsMet = validateTaskToolParams(paramsTaskTool);

      const objRequest = paramsTaskTool.map((item: FormTaskToolData) => ({
        idTask: item.idTask,
        idTool: item.idTool,
        quantity: parseInt(item.quantity),
      }));

      if (allConditionsMet) {
        await taskToolService.postTaskTool(objRequest);

        toast.success("Ferramentas vinculadas com sucesso!");
      }
    } catch (err) {
      toast.error(`Não foi possível vincular. Motivo: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTaskTool = async (id: number) => {
    try {
      setIsLoading(true);

      await taskToolService.deleteTaskTool(id);

      toast.success("Ferramentas desvinculadas com sucesso!");
    } catch (err) {
      toast.error(
        `Não foi possível desvincular as ferramentas. Motivo: ${err}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      setToolTableData: setToolTableData,
      getAllTaskTool: getAllTaskTool,
      toolTableData: toolTableData,
      listServiceTaskTool: listServiceTaskTool,
      setListServiceTaskTool: setListServiceTaskTool,
      saveTaskTool: saveTaskTool,
      deleteTaskTool: deleteTaskTool,
    }),
    [listServiceTaskTool, toolTableData]
  );
  return (
    <TaskToolContext.Provider value={value}>
      {children}
    </TaskToolContext.Provider>
  );
}

export function useTaskTool() {
  const context = useContext(TaskToolContext);

  return context;
}
