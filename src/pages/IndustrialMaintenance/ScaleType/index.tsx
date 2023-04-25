"use client";
import React, { useEffect } from "react";
import { FaClipboard } from "react-icons/fa";
import { PageContainer, Wrapper, ToolbarButtonBack } from "./styles";
import { Toolbar } from "../../../styles/global";
import { MdClose, MdSearch } from "react-icons/md";
import { BootstrapTooltip } from "../../../components/Tooltip/index";

import TabList from "./TabList";
import { ToolsProvider, useTools } from "@/hooks/IndustrialMaintenance/useTool";
import Tab from "@/components/Tab";
import TabRegister from "./TabRegister";
import {
  ScaleTypeProvider,
  useScaleType,
} from "@/hooks/IndustrialMaintenance/useScaleType";

const IndustrialMaitenance: React.FC = () => {
  const { filterScaleType, tabActive, setTabActive } = useScaleType();

  useEffect(() => {
    filterScaleType();
  }, []);

  return (
    <Wrapper>
      <PageContainer>
        <Toolbar>
          <span className="title">TIPO DE ESCALA</span>
          <BootstrapTooltip title="Voltar para Dashboard" placement="top">
            <ToolbarButtonBack type="button">
              <MdClose size={21} color="#61098a" />
            </ToolbarButtonBack>
          </BootstrapTooltip>
        </Toolbar>

        <Tab
          tabActive={tabActive}
          onChange={(index) => setTabActive(index)}
          tabItems={[
            {
              component: <TabList />,
              title: {
                icon: <MdSearch size={20} />,
                label: "Lista tipos de escala",
              },
            },
            {
              component: <TabRegister />,
              title: {
                icon: <FaClipboard size={20} />,
                label: "Cadastrar/editar",
              },
            },
          ]}
        />
      </PageContainer>
    </Wrapper>
  );
};

export default () => (
  <ScaleTypeProvider>
    <IndustrialMaitenance />
  </ScaleTypeProvider>
);
