import { ChevronRight } from "lucide-react";
import React from "react";

export interface statisticsCardPropsInterface {
  Header: React.ReactNode;
  fact: string;
}

function StatisticsCard({ Header, fact }: statisticsCardPropsInterface) {
  return (
    <div className="flex-1 bg-[#D8DBE2] rounded-lg h-36 flex-flex-col px-5 py-2">
      <div className="flex w-full  justify-between">
        <div>{Header}</div>
        <button className="bg-blue-100 p-0.5 rounded-full">
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="flex-1  flex items-center justify-start h-[80%]">
        <h1 className="text-5xl font-bold">{fact}</h1>
      </div>
    </div>
  );
}

export default StatisticsCard;
