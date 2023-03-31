import Input from "@/components/Input";
import { BootstrapTooltip } from "@/components/Tooltip";
import { ApiService, ApiTypes } from "@/services/api";
import { getToastOptions } from "@/services/utils";
import {
  AreaComp,
  BoxComponentes,
  Toolbar,
  ToolbarButton,
} from "@/styles/global";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { AgGridReact } from "ag-grid-react";
import React, { useRef, useState } from "react";
import { MdDelete, MdModeEdit, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { PageBody, FormContainer, GridContainer, WrapperTab } from "./styles";
import * as Yup from "yup";
import { AgGridTranslation } from "@/components/Grid/agGridTranslation";
import { useTools } from "@/hooks/IndustrialMaintenance/useTool";
import { ColDef, GridOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";

interface CellRendererParams {
  data: {
    mafeId: number;
    mafeEmpId: number;
    mafeUsrId: number;
    mafeCodigo: number;
    mafeDescricao: string;
  };
}

const TabList: React.FC = () => {
  const formCadastroRef: React.RefObject<FormHandles> =
    useRef<FormHandles>(null);
  const api = ApiService.getInstance(ApiTypes.MAINTENANCE);

  const {
    listIndustrialMaitenance,
    filterTools,
    handleExcluir,
    formFilterRef,
  } = useTools();

  const handleOpenEdit = async (params: {
    data: { mafeDescricao: string; mafeId: number };
  }) => {
    // const description = params.data.mafeDescricao;
    // formGerenceMaitenace.current?.setFieldValue("mafeDescricao", description);
    // setIdEdicao(params.data.mafeId);
    // setVisible(true);
  };
  const gridDef: GridOptions = {
    columnDefs: [
      {
        field: "mafeEmpId",
        headerName: "AÇÕES",
        minWidth: 100,
        maxWidth: 200,
        lockVisible: true,
        // cellRendererParams
        // cellRen
        // cellRenderer() {
        //   return (
        //     <>
        //       <BootstrapTooltip title="Excluir" placement="top">
        //         <button
        //           type="button"
        //           className="grid-button"
        //           // onClick={() => handleExcluir(params.data.mafeId)}
        //         >
        //           <MdDelete size={20} color="#61098a" />
        //         </button>
        //       </BootstrapTooltip>
        //       <BootstrapTooltip title="Editar" placement="top">
        //         <button
        //           type="button"
        //           className="grid-button"
        //           // onClick={() => handleOpenEdit(params)}
        //         >
        //           <MdModeEdit size={20} color="#61098a" />
        //         </button>
        //       </BootstrapTooltip>
        //     </>
        //   );
        // },
      },
    ],
  };
  const gridColumnDef: ColDef[] = [
    {
      field: "mafeCodigo",
      headerName: "AÇÕES",
      width: 100,
      lockVisible: true,
      // cellRenderer: () => <button>teste</button>,
      // lockVisible: true,
      // cellRenderer: "genericCellRenderer",
      cellRenderer: () => (
        <div>
          <BootstrapTooltip title="Excluir" placement="top">
            <button
              type="button"
              className="grid-button"
              // onClick={() => handleExcluir(params.data.mafeId)}
            >
              <MdDelete size={20} color="#61098a" />
            </button>
          </BootstrapTooltip>
          <BootstrapTooltip title="Editar" placement="top">
            <button
              type="button"
              className="grid-button"
              // onClick={() => handleOpenEdit(params)}
            >
              <MdModeEdit size={20} color="#61098a" />
            </button>
          </BootstrapTooltip>
        </div>
      ),
    },
    {
      field: "mafeCodigo",
      headerName: "CÓDIGO",
      minWidth: 100,
      maxWidth: 100,
      sortable: true,
      resizable: true,
      filter: true,
      lockVisible: true,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "mafeDescricao",
      headerName: "DESCRIÇÃO",
      sortable: true,
      resizable: true,
      flex: 1,
      // headerClass: "ag-header-cell-editable",
      // cellEditorFramework: GridInput,
      filter: true,
      lockVisible: true,
    },
  ];

  const handleActionSubmit = async (
    formData: { mafeDescricao: string },
    { reset }: { reset: () => void }
  ) => {
    try {
      formCadastroRef.current?.setErrors({});

      const schema = Yup.object().shape({
        mafeDescricao: Yup.string().required("O campo é obrigatório"),
      });

      await schema.validate(formData, {
        abortEarly: false,
      });
      const objRequest = {
        mafeDescricao: formData.mafeDescricao,
      };
      await api.post("/industrial-maintenance/tool", objRequest);

      reset();

      filterTools();
    } catch (err) {
      const validationErrors: Record<string, string> = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error: Yup.ValidationError) => {
          const path = error.path!;
          const message = error.message;
          validationErrors[path] = message;
        });
        formCadastroRef.current?.setErrors(validationErrors);
      } else {
        toast.error(
          `Falha ao Salvar o cadastro. Motivo: ${err}`,
          getToastOptions()
        );
      }
    }
  };

  return (
    <WrapperTab>
      <Toolbar colorInverterDefault>
        <BootstrapTooltip title="Pesquisar" placement="bottom">
          <ToolbarButton type="button" onClick={filterTools}>
            <MdSearch size={25} color="#543676" />
          </ToolbarButton>
        </BootstrapTooltip>
      </Toolbar>
      <PageBody>
        <FormContainer>
          <Form ref={formFilterRef} onSubmit={handleActionSubmit}>
            <BoxComponentes>
              <AreaComp wd="30" noPd>
                <Input label="Descrição:" type="text" name="mafeDescricao" />
              </AreaComp>
            </BoxComponentes>
          </Form>
        </FormContainer>

        <BoxComponentes>
          <AreaComp>
            <GridContainer>
              <div
                className="ag-theme-alpine"
                // style={{
                //   height: "800px",
                // }}
              >
                <AgGridReact
                  columnDefs={gridColumnDef}
                  rowData={listIndustrialMaitenance}
                  rowSelection="single"
                  animateRows

                  // gridOptions={{ localeText: AgGridTranslation }}
                  // frameworkComponents={{
                  //   genericCellRenderer: <button>teste</button>,
                  // }}
                />
              </div>
            </GridContainer>
          </AreaComp>
        </BoxComponentes>
      </PageBody>
    </WrapperTab>
  );
};

export default TabList;
