import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
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
import {  useState } from "react";
import {
  useCreateProductMutation,
} from "../../../features/inventory/productSlice";
import { toast } from "sonner";

export interface productFullData {
  product: {
    name: string;
    description?: string;
    summary?: string;
    cover?: string;
    categoryId: number;
    subCategories?: number[];
  };
  variants: Array<{
    size: string;
    // color: string;
    price: string;
    quantity: number;
  }>;
}


const initialState : productFullData = {
  product:{
    name:"",
    description:"",
    summary:"",
    cover:"",
    categoryId:-1, 
    subCategories:[]
  },
  variants:[]
}

function AddProduct() {
  const [formState, setFormState] = useState<productFullData>(initialState);
  const [createProduct, { isLoading, isError, isSuccess }] =
    useCreateProductMutation();

  async function handleSubmit() {
    if (formState) await createProduct(formState);

    if (isError) {
      toast.error("failed to create the product");
    }
    if (isSuccess) {
      toast.dismiss();
      toast.success("product created successfully");
    }
    setFormState(initialState);
  }

  function handleChange (e :React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLTextAreaElement>) {
    setFormState({...formState , [e.target.name]:e.target.value})
  }

  return (
    //@ts-expect-error unknown className
    <Dialog className="p-10 w-[800px]">
      <DialogTrigger>
        <button className="hover:bg-cyan-400 p-2 rounded-full">
          <Plus size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[92vh] flex  gap-4">
        <div className="flex-1  flex flex-col gap-2">
          <div className="h-[68%] bg-gray-100 py-4 px-6 flex flex-col">
            <h1 className="text-lg font-semibold">General information</h1>
            <div className="mt-2">
              <label htmlFor="name" className="">
                product name
              </label>
              <Input
                type="text"
                id="name"
                name= "name"
                placeholder="product name"
                className="bg-gray-200 mt-1"
                value={formState.product.name}
                onChange={handleChange}

              />
            </div>
            <div className="mt-2 ">
              <label htmlFor="name" className="">
                product description
              </label>
              <Textarea
                id="name"
                placeholder="product description "
                name="description"
                value={formState.product.description
                }
                onChange={(e)=> handleChange(e)}
                className="bg-gray-200 mt-1 h-[160px] items-start pl-1"
              />
            </div>
            <div className="mt-3 flex ">
              <div className="flex-1">
                <div className="">
                  <h1 className="font-semibold -mt-1">Size:</h1>
                  <p className="text-sm mb-1 ">pick available size </p>
                </div>
                {["XS", "X", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className="rounded border-2 mx-1 py-1 mt-2 px-2 text-xs border-gray-400 hover:bg-[#373F51] hover:text-white hover:border-none"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <div className="">
                  <h1 className="font-semibold -mt-1">Gender:</h1>
                  <p className="text-sm mb-1 ">pick available gender </p>
                </div>
                <RadioGroup defaultValue="male" className="flex gap-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unisex" id="unisex" />
                    <Label htmlFor="unisex">unisex</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 flex-1  py-4 px-6">
            <h1 className="font-semibold">Pricing and Stock</h1>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="pricing">Base pricing</Label>
                <Input
                  type="number"
                  id="pricing"
                  placeholder="Base pricing"
                  className="bg-gray-200"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="stock">stock</Label>
                <Input
                  type="number"
                  id="stock"
                  placeholder="stock"
                  className="bg-gray-200"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="discount">Discount</Label>
                <Input
                  type="number"
                  id="discount"
                  placeholder="discount"
                  className="bg-gray-200"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="percentageType">Email</Label>
                <Select>
                  <SelectTrigger className="w-full bg-gray-200">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>discount type</SelectLabel>
                      <SelectItem value="male">percentage</SelectItem>
                      <SelectItem value="female">amount</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="w-5/12 bg-gray-100 p-4 flex flex-col">
          <h1 className="font-semibold text-lg product media ">Media</h1>
          <div className="mt-2 p-4 h-[400px]   flex flex-col ">
            <div className="flex-1 bg-gray-200"></div>
            <div className="h-20 mt-2 grid grid-cols-3 gap-4">
              <div className="h-full w-full  bg-gray-200"></div>
              <div className="h-full w-full  bg-gray-200"></div>
              <button className=" flex items-center justify-center border-2  bg-gray-200  border-dashed border-blue-500 rounded-lg ">
                <Plus size={40} color="#3b82f6" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 ">
            <h1 className="font-semibold text-lg">Category</h1>
            <div className="grid w-full  items-center gap-1.5 mt-2">
              <Label htmlFor="productCategory">Product category</Label>
              <Select>
                <SelectTrigger className="w-full bg-gray-200 ">
                  <SelectValue placeholder="Select category type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>product category </SelectLabel>
                    <SelectItem value="category1">category 1</SelectItem>
                    <SelectItem value="category2">category 2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <button
              className="w-full mt-4 py-2 bg-primary rounded text-white"
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddProduct;
