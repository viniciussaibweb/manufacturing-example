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

const RootLayout = ({ children }: { children: ReactNode }) => {
  const { authData } = useAuth();
  const path = usePathname();
  console.log("path", path);
  const Layout = Boolean(authData?.signed) ? LoggedLayout : UnloggedLayout;
  console.log("authData?.signed", authData?.signed);

  const router = useRouter();

  if (!authData?.signed && path !== "/auth") {
    router.push("/auth");
  }
  const loading = useLoading().loading || authData.loading;

  return (
    <main>
      <DialogLoading isOpen={loading} />
      <Global />
      <Layout>{children}</Layout>;
    </main>
  );
};
export default dynamic(() => Promise.resolve(RootLayout), {
  ssr: false,
});
