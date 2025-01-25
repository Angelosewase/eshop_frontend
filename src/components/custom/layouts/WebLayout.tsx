import { Outlet } from "react-router-dom";
import WebFooter from "../WebFooter";
import WebHeader from "../WebHeader";

function WebLayout({ showFooter = true }: { showFooter?: boolean }) {
  return (
    <div className="flex flex-col h-screen w-full ">
      <WebHeader />
      <section className="flex-1 w-full px-14 ">
        <Outlet />
      </section>
      {showFooter && <WebFooter />}
    </div>
  );
}

export default WebLayout;
