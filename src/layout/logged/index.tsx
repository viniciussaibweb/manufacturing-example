"use client";
import GlobalStyle from "@/styles/global";
import React from "react";
import { Content, ContentArea, Wrapper } from "./styles";
import WindowSizeListener from "react-window-size-listener";
import { useAuth } from "@/store/authSlice";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
// import Header from "@/components/header";

import { ToastContainer } from "react-toastify";

function LoggedLayout({ children }: { children: React.ReactNode }) {
  const Header = dynamic(() => import("main/components/header"), {
    ssr: false,
  });

  const [Altura, setAltura] = React.useState(0);
  console.log(Header);

  const authStore = useAuth();

  if (!authStore.authData.signed) {
    // setTimeout(() => {
    // router.replace("/");
    // }, 200);
    // return <div />;
  }
  const route = useRouter();

  return (
    <main>
      <GlobalStyle />
      <Wrapper translate="no">
        <WindowSizeListener
          onResize={(windowSize) => {
            setAltura(windowSize.windowHeight - 67);
          }}
        />
        <Header
          authData={authStore.authData}
          signOut={authStore.signOut}
          setNewCompany={authStore.setNewCompany}
          setSelectedModule={authStore.setSelectedModule}
          route={route}
        />
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
