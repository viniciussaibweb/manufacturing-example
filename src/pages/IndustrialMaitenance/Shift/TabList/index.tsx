import React from "react";
import Input from "@/components/Input";
import { Form } from "@unform/web";
import { BootstrapTooltip } from "@/components/Tooltip";
import {
  AreaComp,
  BoxComponentes,
  Toolbar,
  ToolbarButton,
} from "@/styles/global";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";

import { MdDelete, MdModeEdit, MdSearch } from "react-icons/md";
import { PageBody, FormContainer, GridContainer, WrapperTab } from "./styles";
import { AgGridTranslation } from "@/components/Grid/agGridTranslation";
import { useShift } from "@/hooks/IndustrialMaintenance/useShift";
import { ShiftData } from "@/services/IndustrialMaintenance/Shift/types";

import { format } from "date-fns";

interface CellRendererParams {
  data: ShiftData;
}

const timeFormat = "hh:mm a";

function formatTime(params: any) {
  const date = new Date(params.value);
  return format(date, timeFormat);
}

const TabList: React.FC = () => {
  const {
    listShift,
    deleteShift,
    handleEditShift,
    getAllShift,
    formFilterRef,
  } = useShift();

  const gridColumnDef: ColDef[] = [
    {
      field: "code",
      headerName: "AÇÕES",
      width: 100,
      lockVisible: true,

      cellRenderer: (params: CellRendererParams) => (
        <div>
          <BootstrapTooltip title="Excluir" placement="top">
            <button
              type="button"
              className="grid-button"
              onClick={() => deleteShift(params.data.id)}
            >
              <MdDelete size={20} color="#61098a" />
            </button>
          </BootstrapTooltip>
          <BootstrapTooltip title="Editar" placement="top">
            <button
              type="button"
              className="grid-button"
              onClick={() =>
                handleEditShift(
                  params.data.id,
                  params.data.description,
                  params.data.code,
                  params.data.startTime,
                  params.data.endTime,
                  params.data.startBreakTime,
                  params.data.endBreakTime
                )
              }
            >
              <MdModeEdit size={20} color="#61098a" />
            </button>
          </BootstrapTooltip>
        </div>
      ),
    },
    {
      field: "code",
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
      field: "description",
      headerName: "DESCRIÇÃO",
      sortable: true,
      resizable: true,
      filter: true,
      lockVisible: true,
    },
    {
      field: "startTime",
      headerName: "INÍCIO DO TURNO",
      sortable: true,
      resizable: true,
      flex: 1,
      cellRenderer: formatTime,

      filter: true,
      lockVisible: true,
    },
    {
      field: "endTime",
      headerName: "FIM DO TURNO",
      sortable: true,
      resizable: true,
      flex: 1,
      cellRenderer: formatTime,

      filter: true,
      lockVisible: true,
    },
    {
      field: "startBreakTime",
      headerName: "INÍCIO DO INTERVALO",
      sortable: true,
      resizable: true,
      cellRenderer: formatTime,
      flex: 1,

      filter: true,
      lockVisible: true,
    },
    {
      field: "endBreakTime",
      headerName: "FIM DO INTERVALO ",
      sortable: true,
      resizable: true,
      flex: 1,
      cellRenderer: formatTime,
      filter: true,
      lockVisible: true,
    },
  ];

  return (
    <WrapperTab>
      <Toolbar colorInverterDefault>
        <BootstrapTooltip title="Pesquisar" placement="bottom">
          <ToolbarButton type="button" onClick={getAllShift}>
            <MdSearch size={25} color="#fff" />
          </ToolbarButton>
        </BootstrapTooltip>
      </Toolbar>
      <PageBody>
        <FormContainer>
          <Form ref={formFilterRef} onSubmit={getAllShift}>
            <BoxComponentes gap="10px">
              <AreaComp wd="20" noPd>
                <Input label="Código:" type="number" name="code" />
              </AreaComp>
              <AreaComp wd="60" noPd>
                <Input label="Descrição:" type="text" name="description" />
              </AreaComp>
            </BoxComponentes>
          </Form>
        </FormContainer>

        <BoxComponentes>
          <AreaComp>
            <GridContainer>
              <div className="ag-theme-alpine">
                <AgGridReact
                  columnDefs={gridColumnDef}
                  rowData={listShift}
                  rowSelection="single"
                  animateRows
                  gridOptions={{ localeText: AgGridTranslation }}
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
