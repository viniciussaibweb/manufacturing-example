"use client";
import React, { useEffect } from "react";
import { FaClipboard } from "react-icons/fa";
import { PageContainer, Wrapper, ToolbarButtonBack } from "./styles";
import { Toolbar } from "../../../styles/global";
import { MdClose, MdSearch } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { BootstrapTooltip } from "../../../components/Tooltip/index";

import TabList from "./TabList";
import { TaskProvider, useTask } from "@/hooks/IndustrialMaintenance/useTask";
import { ToolsProvider, useTools } from "@/hooks/IndustrialMaintenance/useTool";
import { TaskToolProvider } from "@/hooks/IndustrialMaintenance/useTaskTool";

import Tab from "@/components/Tab";
import TabRegister from "./TabRegister";
import TabBindTollWithTask from "./TabBindToolWithTask";

const Task: React.FC = () => {
  const { getAllTask, tabActive, handleDataContainerTools } = useTask();
  const { filterTools } = useTools();

  useEffect(() => {
    getAllTask();
    filterTools();
  }, []);

  return (
    <Wrapper>
      <PageContainer>
        <Toolbar>
          <span className="title">TAREFAS</span>
          <BootstrapTooltip title="Voltar para Dashboard" placement="top">
            <ToolbarButtonBack type="button">
              <MdClose size={21} color="#61098a" />
            </ToolbarButtonBack>
          </BootstrapTooltip>
        </Toolbar>

        <Tab
          tabActive={tabActive}
          onChange={(index) => handleDataContainerTools(index)}
          tabItems={[
            {
              component: <TabList />,
              title: {
                icon: <MdSearch size={20} />,
                label: "Lista tarefa",
              },
            },
            {
              component: <TabRegister />,
              title: {
                icon: <FaClipboard size={20} />,
                label: "Cadastrar/editar",
              },
              
            },
            {
              component: <TabBindTollWithTask />,
              title: {
                icon: <FaExchangeAlt size={20} />,
                label: "Vincular ferramentas",
              },
              disabled: true,
            },
          ]}
        />
      </PageContainer>
    </Wrapper>
  );
};

export default () => (
  <TaskProvider>
    <ToolsProvider>
      <TaskToolProvider>
        <Task />
      </TaskToolProvider>
    </ToolsProvider>
  </TaskProvider>
);
