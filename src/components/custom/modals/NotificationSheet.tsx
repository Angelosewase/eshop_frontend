import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, MoveDiagonal } from "lucide-react";

function NotificationSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Bell size={20} className="hover:cursor-pointer" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="w-full flex justify-between items-center pr-4  -mt-4">
              <p className="text-lg">Notifications</p>
              <MoveDiagonal size={20} />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex items-end gap-5 border-b mt-4 border-gray-300">
          <button className="border-b-2 border-white hover:border-gray-500">
            All
          </button>
          <button className="border-b-2 border-white hover:border-gray-500">
            Mending
          </button>
          <button className="border-b-2 border-white hover:border-gray-500">
            Purchase
          </button>
        </div>
        <div>
          <Notification
            name="Sewase Angel"
            date="10/10/24"
            description="purchased t-shirt"
            status="delivered"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationSheet;

function Notification({
  name,
  date,
  description,
  status,
}: {
  name: string;
  date: string;
  description: string;
  status: string;
}) {
  const firstLetters = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div className="flex items-center gap-4 mt-4 hover:bg-gray-200 px-2 py-3 rounded">
      <div className="rounded-full w-10 h-10 bg-gray-500 flex items-center justify-center">
        <div className="text-white text-2xl">{firstLetters}</div>
      </div>
      <div className="flex justify-between flex-1 flex-col">
        <div className="flex gap-1">
          <div className="text-base">{name} -</div>
          <div className="text-sm">{description}</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="text-sm text-gray-500">{date}</div>
          <div className="text-sm text-green-500">{status}</div>
        </div>
      </div>
    </div>
  );
}
