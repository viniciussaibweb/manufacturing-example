import * as React from "react";
import Tabs from "@mui/material/Tabs";
import { Tab as TabMui } from "@mui/material";
import { TabProps } from "./types";
import * as S from "./styles";

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
  disabled?: boolean;
  
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="tab-item"
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function Tab(props: TabProps) {
  const { tabItems, onChange, tabActive } = props;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <S.Container>
      <Tabs value={tabActive} onChange={handleChange}>
        {tabItems.map((tab) => (
          <TabMui
            key={tab.title.label}
            icon={tab.title.icon}
            label={tab.title.label}
            color="#000"
            disabled={tab.disabled} 
          />
        ))}
      </Tabs>

      {tabItems.map((tab, i) => (
        <TabPanel key={tab.title.label} value={tabActive} index={i}>
          <S.WrapperItemTab>{tab.component}</S.WrapperItemTab>
        </TabPanel>
      ))}
    </S.Container>
  );
}
