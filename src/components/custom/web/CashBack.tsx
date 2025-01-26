import React from "react";
import cashBackImage from "../../../assets/images/image.png";

const CashbackSection = () => {
  return (
    <div className="relative mt-16 flex items-center justify-center rounded-lg shadow-lg h-[400px] border overflow-hidden">
      <div className="">
        <img src={cashBackImage} alt="Cashback Background" className="" />
      </div>
      <div className="absolute  transform -translate-y-1/2 right-20 top-1/2 z-10 text-start text-white p-6 max-w-72  bg-[#373F51]">
        <h2 className="text-3xl font-bold mb-2">Get 5% Cash back on $500</h2>
        <p className="mb-4 text-base ">
          Shopping is a bit of a relaxing hobby for me, which is sometimes
          troubling for the bank balance.
        </p>
        <button className="bg-[#373F51]   text-white border birder-white font-semibold px-6 py-2 rounded-lg shadow ">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default CashbackSection;
