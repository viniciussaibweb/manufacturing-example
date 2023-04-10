import {
  FormRefType,
  SetStateInterface,
  DataPickerInput,
} from "@/interfaces/default";
import { ShiftService } from "@/services/IndustrialMaintenance/Shift";
import { ShiftData } from "@/services/IndustrialMaintenance/Shift/types";

import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useMemo,
  useRef,
} from "react";

import moment, { Moment } from "moment";

import { toast } from "react-toastify";
import * as Yup from "yup";
import { useLoading } from "@/store/loadingSlice";

import {
  errorAlertMessage,
  getToastOptions,
  makeValidation,
} from "@/services/utils";

import { FormHandles } from "@unform/core";

interface ShiftContextInterface {
  listShift: Array<ShiftData>;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  startTime: any;
  endTime: any;
  startBreakTime: any;
  endBreakTime: any;
  minTime: Moment | undefined;
  maxTime: Moment | undefined;
  setListShift: SetStateInterface<Array<ShiftData>>;
  getAllShift: () => Promise<void>;
  deleteShift: (id: number) => Promise<void>;
  onChangeStartTime: (data: any) => void;
  onChangeEndTime: (data: any) => void;
  onChangeStartBreackTime: (data: any) => void;
  onChangeEndBreackTime: (data: any) => void;
  saveShift: (data: ShiftData) => void;
  handleEditShift: (
    id: number,
    description: string,
    code: number,
    startTime: string,
    endTime: string,
    startBreakTime: string,
    endBreakTime: string
  ) => void;
  setTabActive: SetStateInterface<number>;
}

const ShiftContext = createContext<ShiftContextInterface>(
  {} as ShiftContextInterface
);

export function ShiftProvider({ children }: { children: ReactNode }) {
  const shiftService = new ShiftService();

  const [listShift, setListShift] = useState<Array<ShiftData>>([]);
  const [idEdit, setIdEdit] = useState<number>();
  const [startTime, setStartTime] = useState<DataPickerInput>(new Date());
  const [endTime, setEndTime] = useState<DataPickerInput>(new Date());
  const [startBreakTime, setStartBreakTime] = useState<DataPickerInput>(
    new Date()
  );
  const [endBreakTime, setEndBreakTime] = useState<DataPickerInput>(new Date());

  const minTime = moment().hours(8).minutes(0);
  const maxTime = moment().hours(17).minutes(0);

  const formFilterRef = useRef<FormHandles>(null);
  const formRegisterRef = useRef<FormHandles>(null);
  const { setIsLoading } = useLoading();

  const [tabActive, setTabActive] = useState(0);

  const schema = Yup.object().shape({
    description: Yup.string()
      .required("O campo é obrigatório")
      .max(99, "O campo não pode ter mais de 100 caracteres"),
  });

  const handleEditShift = (
    id: number,
    description: string,
    code: number,
    startTime: string,
    endTime: string,
    startBreakTime: string,
    endBreakTime: string
  ) => {
    setIdEdit(id);
    setStartTime(moment(startTime));
    setEndTime(moment(endTime));
    setStartBreakTime(moment(startBreakTime));
    setEndBreakTime(moment(endBreakTime));
    setTimeout(() => {
      formRegisterRef.current?.setFieldValue("code", code);
      formRegisterRef.current?.setFieldValue("description", description);
    }, 200);

    setTabActive(1);
  };

  const saveShift = async (formData: ShiftData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      if (formData?.code) {
        await shiftService.patchShift({
          id: idEdit,
          description: formData.description,
          startTime: startTime!.toISOString(),
          endTime: endTime!.toISOString(),
          startBreakTime: startBreakTime!.toISOString(),
          endBreakTime: endBreakTime!.toISOString(),
        });
      } else {
        await shiftService.postShift({
          description: formData.description,
          startTime: startTime!.toISOString(),
          endTime: endTime!.toISOString(),
          startBreakTime: startBreakTime!.toISOString(),
          endBreakTime: endBreakTime!.toISOString(),
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      getAllShift();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllShift = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);

      let response = await shiftService.getAll(
        String(code).length ? code : description
      );

      if (response.length) {
        setListShift(response);
      } else {
        setListShift([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteShift = async (Id: number) => {
    try {
      setIsLoading(true);
      await shiftService.deleteShift(Id);

      toast.success("Item deletado com sucesso!");
      getAllShift();
    } catch (err) {
      toast.error(
        `Não foi possível excluir o cadastro. Motivo: ${err}`,
        getToastOptions()
      );
    } finally {
      setIsLoading(false);
    }
  };

  function onChangeStartTime(newValue: Date) {
    setStartTime(moment(newValue));
  }
  function onChangeEndTime(newValue: Date) {
    setEndTime(moment(newValue));
  }
  function onChangeStartBreackTime(newValue: Date) {
    setStartBreakTime(moment(newValue));
  }
  function onChangeEndBreackTime(newValue: Date) {
    setEndBreakTime(moment(newValue));
  }

  const value = useMemo(
    () => ({
      listShift: listShift,
      startTime: startTime,
      endTime: endTime,
      startBreakTime: startBreakTime,
      endBreakTime: endBreakTime,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      minTime: minTime,
      maxTime: maxTime,
      tabActive,
      setStartTime: setStartTime,
      setListShift: setListShift,
      deleteShift: deleteShift,
      handleEditShift: handleEditShift,
      onChangeStartTime: onChangeStartTime,
      onChangeEndTime: onChangeEndTime,
      onChangeStartBreackTime: onChangeStartBreackTime,
      onChangeEndBreackTime: onChangeEndBreackTime,
      saveShift: saveShift,
      setTabActive,
      getAllShift: getAllShift,
    }),
    [listShift, tabActive, startTime, endTime, startBreakTime, endBreakTime]
  );
  return (
    <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>
  );
}

export function useShift() {
  const context = useContext(ShiftContext);

  return context;
}
