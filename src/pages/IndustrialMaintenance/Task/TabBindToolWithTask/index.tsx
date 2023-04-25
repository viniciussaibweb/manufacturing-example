import {
  AreaComp,
  BoxComponentes,
  Toolbar,
  ToolbarButton,
} from "@/styles/global";
import { MdSave } from "react-icons/md";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useEffect, useState } from "react";

import {
  PageBody,
  GridContainer,
  WrapperTab,
  ToolbarContainer,
  ToolbarDescription,
} from "./styles";
import { AgGridTranslation } from "@/components/Grid/agGridTranslation";
import { useTools } from "@/hooks/IndustrialMaintenance/useTool";
import { useTask } from "@/hooks/IndustrialMaintenance/useTask";
import { useTaskTool } from "@/hooks/IndustrialMaintenance/useTaskTool";
import { FormTaskToolData } from "@/hooks/IndustrialMaintenance/useTaskTool/types";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";

import { GridInstance } from "@/interfaces/default";

interface CustomColDef extends ColDef {
  disableSelectionOnClick?: boolean;
}

const TabBindTollWithTask: React.FC = () => {
  const { listIndustrialMaitenance } = useTools();
  const { codeTask, descriptionTask, idTask } = useTask();
  const { listServiceTaskTool, saveTaskTool, deleteTaskTool } = useTaskTool();

  const [gridInstance, setGridInstance] = useState<GridInstance>({
    api: null,
    columnApi: null,
  });

  const onGridReady = (params: any) => {
    setGridInstance({ api: params.api, columnApi: params.columnApi });
  };

  useEffect(() => {
    if (!gridInstance.api) return;
    gridInstance?.api.forEachNode((node: any) => {
      if (parseInt(node.data.quantity) > 0) {
        node.setSelected(true);
      }
    });
  });

  useEffect(() => {
    return () => {
      if (gridInstance?.api) {
        const selectedRows = gridInstance.api.getSelectedRows();
        selectedRows.forEach((row: any) => {
          row.quantity = null;
          gridInstance.api?.applyTransaction({ update: [row] });
        });
      }
    };
  }, [gridInstance]);

  const handleSalveTaskTool = useCallback(() => {
    if (!gridInstance?.api) return;
    const selectedRows = gridInstance.api?.getSelectedRows();

    const selectRowsdata: FormTaskToolData[] = ([] = selectedRows.map(
      (row: any) => ({
        quantity: row.quantity,
        idTask: codeTask!,
        idTool: Number(row.id),
        codeTool: Number(row.code),
        descriptionTool: row.description!,
      })
    ));
    if (selectRowsdata.length === 0) {
      deleteTaskTool(codeTask!);
    } else {
      saveTaskTool(selectRowsdata);
    }
  }, [codeTask, gridInstance]);

  const listToolsTask = listIndustrialMaitenance.map((tool) => {
    const task = listServiceTaskTool.find(
      (task: any) => task.idTool === tool.id
    );

    if (task && task.quantity) {
      return {
        ...tool,
        quantity: task.quantity,
      };
    } else {
      return tool;
    }
  });

  const gridColumnDef: CustomColDef[] = [
    {
      field: " ",
      headerName: "AÇÕES",
      width: 100,
      lockVisible: true,
      checkboxSelection: true,
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
      headerName: "FERRAMENTA",
      sortable: true,
      resizable: true,
      flex: 1,
      filter: true,
      lockVisible: true,
    },
    {
      field: "quantity",
      headerName: "QUANTIDADE",
      sortable: true,
      resizable: true,
      flex: 1,
      filter: true,
      lockVisible: true,
      editable: true,
    },
  ];

  return (
    <WrapperTab>
      <Toolbar colorInverterDefault>
        <ToolbarContainer>
          <ToolbarButton type="button" onClick={handleSalveTaskTool}>
            <MdSave size={25} color="#fff" />
          </ToolbarButton>
        </ToolbarContainer>
        <ToolbarDescription>
          <h5>Código da tarefa: {idTask}</h5>
          <h5>Descrição da tarefa: {descriptionTask}</h5>
        </ToolbarDescription>
      </Toolbar>
      <PageBody>
        <BoxComponentes>
          <AreaComp>
            <GridContainer>
              <div className="ag-theme-alpine">
                <AgGridReact
                  columnDefs={gridColumnDef}
                  rowData={listToolsTask}
                  animateRows
                  gridOptions={{ localeText: AgGridTranslation }}
                  rowSelection="multiple"
                  onGridReady={onGridReady}
                  suppressRowClickSelection={true}
                />
              </div>
            </GridContainer>
          </AreaComp>
        </BoxComponentes>
      </PageBody>
    </WrapperTab>
  );
};

export default TabBindTollWithTask;
