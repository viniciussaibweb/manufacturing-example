import React, { ReactNode } from 'react';

export interface TabProps {
  tabActive: number;
  onChange: (index: number) => void;
  tabItems: Array<{
    title: {
      label: string;
      icon: string | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    };
    component: ReactNode;
  }>;
}
