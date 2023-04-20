import { FormRefType, SetStateInterface } from "@/interfaces/default";
import { LocationService } from "@/services/IndustrialMaintenance/Location";
import { LocationData } from "@/services/IndustrialMaintenance/Location/types";

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

interface LocationContextInterface {
  listLocation: Array<LocationData>;
  formFilterRef: FormRefType;
  formRegisterRef: FormRefType;
  tabActive: number;
  setListLocation: SetStateInterface<Array<LocationData>>;
  filterLocation: () => Promise<void>;
  deleteLocation: (id: number) => Promise<void>;
  saveLocation: (data: LocationData) => void;
  handleEditLocation: (id: number, description: string, code: number) => void;
  setTabActive: SetStateInterface<number>;
}

const LocationContext = createContext<LocationContextInterface>(
  {} as LocationContextInterface
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const locationService = new LocationService();

  const [listLocation, setListLocation] = useState<Array<LocationData>>([]);
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

  const saveLocation = async (formData: LocationData) => {
    try {
      const isValid = await makeValidation(schema, formData, formRegisterRef);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      if (formData?.code) {
        await locationService.patchLocation({
          id: idEdit,
          description: formData.description,
        });
      } else {
        await locationService.postLocation({
          description: formData.description,
        });
      }

      toast.success("Item salvo com sucesso!", getToastOptions());
      formRegisterRef.current?.reset();
      filterLocation();
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLocation = async () => {
    const description = formFilterRef.current?.getFieldValue("description");
    const code = formFilterRef.current?.getFieldValue("code");

    try {
      setIsLoading(true);

      let response = await locationService.getAll(
        String(code).length ? code : description
      );

      if (response.length) {
        setListLocation(response);
      } else {
        setListLocation([]);
      }
    } catch (err) {
      errorAlertMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLocation = (
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

  const deleteLocation = async (id: number) => {
    try {
      setIsLoading(true);
      await locationService.deleteLocation(id);

      toast.success("Item deletado com sucesso!");
      filterLocation();
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
      listLocation: listLocation,
      formFilterRef: formFilterRef,
      formRegisterRef: formRegisterRef,
      tabActive,
      setListLocation: setListLocation,
      deleteLocation: deleteLocation,
      handleEditLocation: handleEditLocation,
      saveLocation: saveLocation,
      setTabActive,
      filterLocation: filterLocation,
    }),
    [listLocation, tabActive]
  );
  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  return context;
}
