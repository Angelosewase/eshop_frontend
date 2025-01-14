import { CirclePlus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

function AddProduct() {
  return (
    <Dialog className="p-10">
      <DialogTrigger>
        <button className="w-full flex items-center justify-center border-2 m-2  border-dashed border-blue-500 rounded-lg h-48">
          <CirclePlus size={40} color="#3b82f6" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">
            Add new Payment
          </DialogTitle>
        </DialogHeader>
        <div className="w-[90%] mx-auto my-10">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="cardNumber" className="mb-1">
              card number
            </Label>
            <Input type="number" id="cardNumber" placeholder="card number" />
          </div>
          <div className="flex items-center mt-4 gap-5">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="expDate" className="mb-1">
                Exp date
              </Label>
              <Input type="date" id="expDate" placeholder="Exp date" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="cvc" className="mb-1">
                cvc
              </Label>
              <Input type="number" id="cvc" placeholder="cvc" />
            </div>
          </div>
          <div className="grid w-full items-center gap-1.5 mt-4">
            <Label htmlFor="name" className="mb-1">
              Name on the card
            </Label>
            <Input type="text" id="name" placeholder="Owner's name" />
          </div>
          <div className="grid w-full  items-center gap-1.5 mt-4">
            <Label className="mb-1">country or region</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country/region" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>country/region</SelectLabel>
                  <SelectItem value="male">Rwanda/kigali</SelectItem>
                  <SelectItem value="female">Rwanda/Rubavu</SelectItem>
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
            Add card
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
