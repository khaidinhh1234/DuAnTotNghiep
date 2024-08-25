import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";

import Router from "./routes";

function App() {
  return (
    <>
      <Router />
      <Toaster />
      <ToastContainer />
    </>
  );
}

export default App;
