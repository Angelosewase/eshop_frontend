import { CirclePlus, FolderPen, FolderX } from "lucide-react";
import { useState } from "react";
import { AddCardModal } from "../../components/custom/modals";
import { useGetAccountQuery } from "../../features/account/accountSlice";

function Payments() {
  const [tabState, setTabState] = useState<"accounts" | "payments">("accounts");
  return (
    <div>
      <div className=" w-full py-3 items-center px-2">
        <h1 className="text-3xl font-bold">Payments</h1>
      </div>
      <TopTapComponent setState={setTabState} />
      <TabComponent tab={tabState} />
    </div>
  );
}

export default Payments;

export const TopTapComponent = ({
  setState,
}: {
  setState: (val: "accounts" | "payments") => void;
}) => {
  return (
    <div className="flex justify-between  w-[95%] mt-5 mx-auto   bg-white shadow-lg shadow-gray-100 gap-10 ">
      <button
        className={`py-5 flex-1 text-center  text-xl font-medium border-b-4 border-white   hover:border-blue-500 `}
        onClick={() => setState("accounts")}
      >
        Accounts
      </button>
      <div className="] border-2 border-gray-300 my-1"></div>
      <button
        className="py-5 flex-1 text-center  text-xl font-medium border-b-4 border-white   hover:border-blue-500 "
        onClick={() => setState("payments")}
      >
        Payment methods
      </button>
    </div>
  );
};

const TabComponent = ({ tab }: { tab: "accounts" | "payments" }) => {
  const { data } = useGetAccountQuery();

  function AccountsTab() {
    const accountDetails = {
      name: data?.firstName + " " + data?.lastName,
      "Phone number": data?.phoneNumber,
      Password: "********",
      email: data?.email,
    };
    return (
      <div className="shadow-xl shadow-gray-100 rounded-lg p-2">
        {Object.entries(accountDetails).map(([key, value]) => (
          <div
            className="w-full flex items-center py-1 px-2 mt-2  justify-between"
            key={key}
          >
            <div className="flex flex-col px-2 py-1">
              <h1 className="text-gray-500">{key}</h1>
              <h2 className="text-gray-900 font-semibold text-lg">
                {key.toLowerCase() === "password" ? "********" : value}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {key.toLowerCase() === "email" && (
                <button className="border-2 border-black py-2 px-4 rounded flex items-center gap-2">
                  <CirclePlus size={15} />
                  <p>Add another email</p>
                </button>
              )}
              <button className="border-2 border-black py-2 px-4 rounded flex items-center gap-2">
                <FolderPen size={15} />
                <p>Change</p>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function PaymentMethodsTab() {
    const paymentMethods = [
      {
        name: "Visa",
        cardNumber: "**** **** **** 1234",
        provider: "Visa",
      },
      {
        name: "Mastercard",
        cardNumber: "**** **** **** 1234",
        provider: "Mastercard",
      },
    ];

    const PaymentMethodCard = ({
      name,
      cardNumber,
      provider,
    }: {
      name: string;
      cardNumber: string;
      provider: string;
    }) => {
      return (
        <div className="w-full flex flex-col justify-between  p-4 mt-2 bg-gray-100 rounded-lg h-48">
          <div className="flex w-full  items-center justify-between">
            <h2 className="text-gray-900 font-semibold text-xl ">
              {cardNumber}
            </h2>
            <FolderX size={25} />
          </div>
          <div className=" ">
            <h2 className="text-sm">{provider}</h2>
            <h1 className="text-gray-500 text-xl font-semibold">{name}</h1>
          </div>
        </div>
      );
    };
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <PaymentMethodCard {...method} key={method.name} />
        ))}
        <AddCardModal />
      </div>
    );
  }
  return (
    <div className="w-[95%] mx-auto bg-white    mt-8 rounded-lg">
      {tab === "accounts" ? <AccountsTab /> : <PaymentMethodsTab />}
    </div>
  );
};
