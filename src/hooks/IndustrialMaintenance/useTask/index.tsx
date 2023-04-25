import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { TaksService } from "@/services/IndustrialMaintenance/Task";
import { TaskData } from "@/services/IndustrialMaintenance/Task/types";

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

interface TaskContextInterface {
  listServiceTask: Array<TaskData>;
  setListServiceTask: SetStateInterface<Array<TaskData>>;
  getAllTask: () => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  saveTask: (data: TaskData) => void;
  handleEditTask: (
    id: number,
    description: string,
    code: number,
    detail: string
  ) => void;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  codeTask: number | undefined;
  descriptionTask: string;
  setTabActive: SetStateInterface<number>;
  addToolTask: (
    id: number,
    description: string,
    code: number,
    detail: string
  ) => void;
  handleDataContainerTools: (index: number) => void;
  idTask: number | undefined;
  detailTask: string
}

const TaskContext = createContext<TaskContextInterface>(
  {} as TaskContextInterface
);

export function TaskProvider({ children }: { children: ReactNode }) {
  const taskService = new TaksService();

  const [listServiceTask, setListServiceTask] = useState<Array<TaskData>>([]);
  const [idEdit, setIdEdit] = useState<number>();
  const formFilterRef = useRef<FormHandles>(null);
  const formRegisterRef = useRef<FormHandles>(null);
  const { setIsLoading } = useLoading();
  const [tabActive, setTabActive] = useState(0);

  const [codeTask, setCodeTask] = useState<number>();
  const [idTask, setIdTask] = useState<number>();
  const [descriptionTask, setDescriptionTask] = useState<string>("");
  const [detailTask, setDetailTask] = useState<string>("");

  const schema = Yup.object().shape({
    description: Yup.string()
      .required("O campo é obrigatório")
      .max(99, "O campo não pode ter mais de 100 caracteres"),

    detail: Yup.string()
      .required("O campo é obrigatório")
      .max(499, "O campo não pode ter mais de 500 caracteres"),
  });


  const handleEditTask = (
    id: number,
    description: string,
    code: number,
    detail: string
  ) => {
    setIdEdit(id);
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", code);
      formRegisterRef.current?.setFieldValue("description", description);
      formRegisterRef.current?.setFieldValue("detail", detail);
    }, 200);

    setTabActive(1);
  };

  const saveTask = async (formData: TaskData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      if (formData?.code) {
        await taskService.patchTask({
          id: idEdit,
          description: formData.description,
          detail: formData.detail,
        });
      } else {
        await taskService.postTask({
          description: formData.description,
          detail: formData.detail,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      getAllTask();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTask = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);

      let response = await taskService.getAll(
        String(code).length ? code : description
      );

      if (response.length) {
        setListServiceTask(response);
      } else {
        setListServiceTask([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (Id: number) => {
    try {
      setIsLoading(true);
      await taskService.deleteTask(Id);

      toast.success("Item deletado com sucesso!");
      getAllTask();
    } catch (err) {
      toast.error(
        `Não foi possível excluir o cadastro. Motivo: ${err}`,
        getToastOptions()
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addToolTask = (
    id: number,
    description: string,
    code: number,
    detail: string
  ) => {
    setCodeTask(code);
    setIdTask(id);
    setDescriptionTask(description);
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", code);
      formRegisterRef.current?.setFieldValue("description", description);
      formRegisterRef.current?.setFieldValue("detail", detail);
    }, 200);

    setTabActive(2);
  };

  const handleDataContainerTools = (index: number) => {
    setCodeTask(undefined);
    setDescriptionTask("");
    setTabActive(index);
  };
  const value = useMemo(
    () => ({
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      listServiceTask: listServiceTask,
      tabActive,
      codeTask: codeTask,
      descriptionTask: descriptionTask,
      idTask: idTask,
      detailTask: detailTask,

      setIdTask: setIdTask,
      setListServiceTask: setListServiceTask,
      deleteTask: deleteTask,
      handleEditTask: handleEditTask,
      saveTask: saveTask,
      setTabActive,
      getAllTask: getAllTask,
      addToolTask: addToolTask,
      handleDataContainerTools: handleDataContainerTools,

      setDescriptionTask: setDescriptionTask,
      setDetailTask: setDetailTask,
      setCodeTask: setCodeTask,
    }),
    [listServiceTask, tabActive]
  );
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask() {
  const context = useContext(TaskContext);

  return context;
}
