import Input from "@/components/Input";
import { BootstrapTooltip } from "@/components/Tooltip";
import {
  AreaComp,
  BoxComponentes,
  Toolbar,
  ToolbarButton,
  ToolbarContainer,
} from "@/styles/global";
import { Form } from "@unform/web";
import { AgGridReact } from "ag-grid-react";
import React from "react";
import {
  MdDelete,
  MdModeEdit,
  MdSearch,
  MdAddCircleOutline,
} from "react-icons/md";
import { PageBody, FormContainer, GridContainer, WrapperTab } from "./styles";
import { AgGridTranslation } from "@/components/Grid/agGridTranslation";
import { useTask } from "@/hooks/IndustrialMaintenance/useTask";
import { useTaskTool } from "@/hooks/IndustrialMaintenance/useTaskTool";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import { TaskData } from "@/services/IndustrialMaintenance/Task/types";

interface CellRendererParams {
  data: TaskData;
}

const TabList: React.FC = () => {
  const {
    listServiceTask,
    getAllTask,
    deleteTask,
    formFilterRef,
    handleEditTask,
    setTabActive,
    addToolTask,
  } = useTask();
  const { getAllTaskTool } = useTaskTool();

  const handleDifferentContextFunctions = (
    id: number,
    description: string,
    code: number,
    detail: string
  ) => {
    addToolTask(code, description, id, detail);
    getAllTaskTool(id);
  };

  const gridColumnDef: ColDef[] = [
    {
      field: "code",
      headerName: "AÇÕES",
      minWidth: 150,
      maxWidth: 160,
      lockVisible: true,
      cellRenderer: (params: CellRendererParams) => (
        <div>
          <BootstrapTooltip title="Vincular ferramenta" placement="top">
            <button
              type="button"
              className="grid-button"
              onClick={() =>
                handleDifferentContextFunctions(
                  params.data.id,
                  params.data.description,
                  params.data.code,
                  params.data.detail
                )
              }
            >
              <MdAddCircleOutline size={20} color="#61098a" />
            </button>
          </BootstrapTooltip>
          <BootstrapTooltip title="Excluir" placement="top">
            <button
              type="button"
              className="grid-button"
              onClick={() => deleteTask(params.data.id)}
            >
              <MdDelete size={20} color="#61098a" />
            </button>
          </BootstrapTooltip>
          <BootstrapTooltip title="Editar" placement="top">
            <button
              type="button"
              className="grid-button"
              onClick={() =>
                handleEditTask(
                  params.data.id,
                  params.data.description,
                  params.data.code,
                  params.data.detail
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
      flex: 1,

      filter: true,
      lockVisible: true,
    },
    {
      field: "detail",
      headerName: "DETALHES",
      sortable: true,
      resizable: true,
      flex: 1,

      filter: true,
      lockVisible: true,
    },
  ];

  return (
    <WrapperTab>
      <Toolbar colorInverterDefault>
        <ToolbarContainer>
          <BootstrapTooltip title="Cadastrar" placement="bottom">
            <ToolbarButton type="button" onClick={() => setTabActive(1)}>
              <MdAddCircleOutline size={25} color="#fff" />
            </ToolbarButton>
          </BootstrapTooltip>
          <BootstrapTooltip title="Pesquisar" placement="bottom">
            <ToolbarButton type="button" onClick={getAllTask}>
              <MdSearch size={25} color="#fff" />
            </ToolbarButton>
          </BootstrapTooltip>
        </ToolbarContainer>
      </Toolbar>
      <PageBody>
        <FormContainer>
          <Form ref={formFilterRef} onSubmit={getAllTask}>
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
                  rowData={listServiceTask}
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
