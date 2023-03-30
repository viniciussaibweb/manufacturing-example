import RootLayout from "@/layout";
import { store } from "@/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-perfect-scrollbar/dist/css/styles.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div id="modal"></div>

      <ToastContainer autoClose={3000} />
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </Provider>
  );
}
export default App;
