import { Outlet } from "react-router-dom";
import WebFooter from "../WebFooter";
import WebHeader from "../WebHeader";
import { useValidatePath } from "../../../hooks/auth";
import { useAppSelector } from "../../../hooks/Reduxhooks";

function WebLayout({ showFooter = true }: { showFooter?: boolean }) {
  const {loading} = useAppSelector(state => state.auth)
  useValidatePath()
  return (
    <div
      className={` w-full   flex flex-col justify-center ${
        loading ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      ) : (
    loading ? <div>Loading...</div> : ( 
      <div className="flex flex-col h-screen w-full ">
        <WebHeader />
        <section className="flex-1 w-full px-14 ">
          <Outlet />
        </section>
        {showFooter && <WebFooter />}
      </div>
    )
      )}
    </div>
  );
}

export default WebLayout;
