import { Bell, Search, User } from "lucide-react";

function PageHeaderWithIcons({title}:{title:string}) {
  return (
    <div className="flex-1 flex justify-between  w-full py-3 items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <div className="flex gap-2 items-center">
        <Search  size={20} className="hover:cursor-pointer"/>
        <Bell size={20} className="hover:cursor-pointer"/>
        <button className="p-2 rounded-full bg-blue-200 hover:cursor-pointer">
        <User  size={20}/>

        </button>
      </div>
    </div>
  );
}

export default PageHeaderWithIcons;
