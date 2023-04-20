"use client";
import GlobalStyle from "@/styles/global";
import React from "react";
import { Content, ContentArea, Wrapper } from "./styles";
import WindowSizeListener from "react-window-size-listener";
import { useAuth } from "@/store/authSlice";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { ToastContainer } from "react-toastify";
import Header from "@/components/header";

// const Header = dynamic(() => import("auth-saibweb-front/label"));

function LoggedLayout({ children }: { children: React.ReactNode }) {
  const [Altura, setAltura] = React.useState(0);

  const authStore = useAuth();

  if (!authStore.authData.signed) {
    // setTimeout(() => {
    // router.replace("/");
    // }, 200);
    // return <div />;
  }

  return (
    <main>
      <GlobalStyle />
      {/* <Header /> */}

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
