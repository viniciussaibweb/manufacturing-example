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
import { useTools } from "@/hooks/IndustrialMaintenance/useTool";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import { ToolData } from "@/services/IndustrialMaintenance/tools/types";

interface CellRendererParams {
  data: ToolData;
}

const TabList: React.FC = () => {
  const {
    listIndustrialMaitenance,
    filterTools,
    handleExcluir,
    formFilterRef,
    handleEditTool,
    setTabActive,
  } = useTools();

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
              onClick={() => handleExcluir(params.data.id)}
            >
              <MdDelete size={20} color="#61098a" />
            </button>
          </BootstrapTooltip>
          <BootstrapTooltip title="Editar" placement="top">
            <button
              type="button"
              className="grid-button"
              onClick={() =>
                handleEditTool(
                  params.data.id,
                  params.data.description,
                  params.data.code
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
            <ToolbarButton type="button" onClick={filterTools}>
              <MdSearch size={25} color="#fff" />
            </ToolbarButton>
          </BootstrapTooltip>
        </ToolbarContainer>
      </Toolbar>
      <PageBody>
        <FormContainer>
          <Form ref={formFilterRef} onSubmit={filterTools}>
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
                  rowData={listIndustrialMaitenance}
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
