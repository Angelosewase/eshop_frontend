import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Checkbox } from "../../ui/checkbox";
import { useState } from "react";
import { useCreateCategoryMutation } from "../../../features/inventory/categoriesSlice";
import { toast } from "sonner";

function AddCategoryModal() {
  const [createCategory, { isLoading, isError, isSuccess }] =
    useCreateCategoryMutation();
  const [formState, setFormState] = useState({
    name: "",
    description: "",
  });

  if (isError) {
    toast.error("something went wrong");
  }
  if (isSuccess) {
    toast.success("category created successfully");
  }

  function handleSubmit() {
    console.log("submitting")
    const { name, description } = formState;
    if (!name.trim()) {
      toast.error("Name is required");
    }
    if (!description.trim()) {
      toast.error("please select the gender");
    }

    createCategory(formState);
    setFormState({ name: "", description: "" });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  }

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
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="category name"
              onChange={handleChange}
              value={formState.name}
            />
          </div>
          <div className="grid w-full  items-center gap-1.5 mt-4">
            <Label className="mb-1">gender</Label>
            <Select
              onValueChange={(value) =>
                setFormState({ ...formState, description: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>gender</SelectLabel>
                  <SelectItem value="for male">Male</SelectItem>
                  <SelectItem value="for female">Female</SelectItem>
                  <SelectItem value="other description">other</SelectItem>
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

          <button
            className="bg-[#373F51] mt-6 w-full text-white text-center py-2 font-semibold"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              "Submit"
            )}
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

export default AddCategoryModal;
