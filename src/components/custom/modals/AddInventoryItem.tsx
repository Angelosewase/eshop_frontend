import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function AddProduct() {
  return (
    <Dialog className="p-10 w-[800px]">
      <DialogTrigger>
        <button className="hover:bg-cyan-400 p-2 rounded-full">
          <Plus size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[88vh] flex  gap-4">
        <div className="flex-1  flex flex-col gap-2">
          <div className="h-[55%] bg-gray-100"></div>
          <div className="bg-gray-100 flex-1 mt-2"></div>
        </div>
        <div className="w-5/12 bg-gray-100"></div>
      </DialogContent>
    </Dialog>
  );
}

export default AddProduct;
