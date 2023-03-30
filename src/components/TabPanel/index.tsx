import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import { BootstrapTooltip } from "../Tooltip";

const TabPanel = () => {
  return (
    <>
      <AppBar position="static" color="default">
        <Tabs
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
        >
          <BootstrapTooltip title="Idustrial" placement="top">
            <Tab label="Industrial Maitenance" />
          </BootstrapTooltip>

          <BootstrapTooltip title="Criar" placement="top">
            <Tab label="Novo" />
          </BootstrapTooltip>
        </Tabs>
      </AppBar>
    </>
  );
};
export default TabPanel;
