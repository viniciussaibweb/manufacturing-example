"use client";
import GlobalStyle from "@/styles/global";
import React from "react";
import { Content, ContentArea, Wrapper } from "./styles";
import WindowSizeListener from "react-window-size-listener";

import dynamic from "next/dynamic";

import { ToastContainer } from "react-toastify";
import Header from "@/components/header";

function LoggedLayout({ children }: { children: React.ReactNode }) {
  const [Altura, setAltura] = React.useState(0);

  return (
    <main>
      <GlobalStyle />

      <Wrapper translate="no">
        <WindowSizeListener
          onResize={(windowSize) => {
            setAltura(windowSize.windowHeight - 67);
          }}
        />
        <Header />
        <Content altura={Altura}>
          <ToastContainer autoClose={3000} />
          <ContentArea altura={Altura}>{children}</ContentArea>
        </Content>
      </Wrapper>
    </main>
  );
}

export default dynamic(() => Promise.resolve(LoggedLayout), {
  ssr: false,
});
