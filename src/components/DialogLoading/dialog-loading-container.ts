import dynamic from "next/dynamic";
import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

function DialogLoadingContainer({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
}) {
  const el = document.createElement("div");
  const modalContainer = document.getElementById("modal");

  console.log(el);
  console.log(modalContainer);

  useEffect(() => {
    if (isOpen) {
      modalContainer?.appendChild(el);
    } else {
      try {
        modalContainer?.removeChild(el);
      } catch (err) {
        // vazio
      }
    }
  }, [isOpen]);

  return ReactDOM.createPortal(children, el);
}

export default dynamic(() => Promise.resolve(DialogLoadingContainer), {
  ssr: false,
});
