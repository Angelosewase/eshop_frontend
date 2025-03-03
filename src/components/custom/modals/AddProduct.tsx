import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { Checkbox } from "../../../components/ui/checkbox";

function AddProduct() {
  return (
    //@ts-expect-error unknown className
    <Dialog className="p-10">
      <DialogTrigger>
        <button className="text-[#58A4B0] flex items-center gap-0.5 button ">
          <Plus size={15} />
          <p>Add</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">
            Add new Category
          </DialogTitle>
        </DialogHeader>
        <div className="w-[90%] mx-auto my-10">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name" className="mb-1">
              Category name
            </Label>
            <Input type="text" id="name" placeholder="category name" />
          </div>
          <div className="grid w-full  items-center gap-1.5 mt-4">
            <Label className="mb-1">gender</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>gender</SelectLabel>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Securely save my information for 1-click checkout
            </label>
          </div>

          <button className="bg-[#373F51] mt-6 w-full text-white text-center py-2 font-semibold">
            Add category
          </button>

          <p className="text-gray-400 text-xs text-center leading-4 mt-5">
            By confirming your subscription, you allow The Outdoor Inn Crowd
            Limited to charge your card for this payment and future payments in
            accordance with their terms. You can always cancel your subscription
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddProduct;
