import { useAuth } from "@/store/authSlice";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import LoggedLayout from "./logged";
import UnloggedLayout from "./unlogged";
import "@fortawesome/fontawesome-free/css/all.css";
import Global from "@/styles/global";
import DialogLoading from "@/components/DialogLoading";
import { useLoading } from "@/store/loadingSlice";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

const RootLayout = ({ children }: { children: ReactNode }) => {
  const { authData } = useAuth();
  const path = usePathname();
  const Layout = Boolean(authData?.signed) ? LoggedLayout : UnloggedLayout;

  const router = useRouter();

  if (!authData?.signed && path !== "/auth") {
    router.push("/auth");
  }
  const loading = useLoading().loading || authData.loading;
  const renderChildren = !authData?.signed
    ? path === "/auth"
      ? true
      : false
    : true;

  return (
    <main>
      <DialogLoading isOpen={loading} />
      <Global />
      <Layout>{renderChildren && children}</Layout>;
    </main>
  );
};
export default dynamic(() => Promise.resolve(RootLayout), {
  ssr: false,
});
