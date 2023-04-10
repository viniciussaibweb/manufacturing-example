import React, { useEffect } from "react";
import { PageContainer, Wrapper, ToolbarButtonBack } from "./styles";
import { Toolbar } from "../../../styles/global";
import { MdClose, MdSearch } from "react-icons/md";
import { FaClipboard } from "react-icons/fa";
import { BootstrapTooltip } from "../../../components/Tooltip/index";

import Tab from "@/components/Tab";

import TabList from "./TabList/index";
import TabRegister from "./TabRegister/index";

import {
  useCenterCost,
  CenterCostProvider,
} from "../../../hooks/IndustrialMaintenance/useCenterCost/index";

const CenterCost: React.FC = () => {
  const { filterCenterCost, tabActive, setTabActive } = useCenterCost();

  useEffect(() => {
    filterCenterCost();
  }, []);

  return (
    <Wrapper>
      <PageContainer>
        <Toolbar>
          <span className="title">CENTRO DE CUSTO</span>
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
                label: "Lista custos",
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
  <CenterCostProvider>
    <CenterCost />
  </CenterCostProvider>
);
