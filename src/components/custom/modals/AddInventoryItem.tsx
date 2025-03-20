import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
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
import { useState } from "react";
import { useCreateProductMutation } from "../../../features/inventory/productSlice";
import { useGetCategoriesQuery } from "../../../features/inventory/categorySlice";
import { toast } from "sonner";

// Maximum safe integer for PostgreSQL INT4 type
const MAX_INT32 = 2147483647;

function AddProduct() {
  const [createProduct] = useCreateProductMutation();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    cover: "",
    productSkus: [{
      price: "",
      quantity: "",
      sizeAttribute: { value: "" },
      colorAttribute: { value: "" }
    }]
  });

  const validateForm = () => {
    // Check for empty name
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }
    
    // Check for category
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return false;
    }
    
    // Check for SKU details
    const sku = formData.productSkus[0];
    
    // Check price
    if (!sku.price || isNaN(parseFloat(sku.price)) || parseFloat(sku.price) <= 0) {
      toast.error('Price must be a positive number');
      return false;
    }
    
    // Check quantity
    if (!sku.quantity || isNaN(Number(sku.quantity)) || Number(sku.quantity) <= 0) {
      toast.error('Quantity must be a positive number');
      return false;
    }
    
    // Check if quantity is within INT4 range
    if (Number(sku.quantity) > MAX_INT32) {
      toast.error(`Quantity cannot exceed ${MAX_INT32}`);
      return false;
    }
    
    // Check attributes
    if (!sku.sizeAttribute.value || !sku.colorAttribute.value) {
      toast.error('Please select size and color');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createProduct({
        ...formData,
        categoryId: Number(formData.categoryId),
        productSkus: formData.productSkus.map(sku => ({
          ...sku,
          price: sku.price.toString(),
          quantity: Math.min(Number(sku.quantity), MAX_INT32),
          sku: `${formData.name.slice(0, 3).toUpperCase()}-${sku.sizeAttribute.value || 'NA'}-${sku.colorAttribute.value.slice(1, 4) || 'NA'}`,
          id: 0
        }))
      }).unwrap();
      toast.success('Product created successfully');
      // Reset form
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        cover: "",
        productSkus: [{
          price: "",
          quantity: "",
          sizeAttribute: { value: "" },
          colorAttribute: { value: "" }
        }]
      });
      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error('Create product error:', error);
      if ((error as Error).data?.error) {
        toast.error(`Failed to create product: ${error.data.error}`);
      } else {
        toast.error('Failed to create product');
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    // Don't allow values that are too large
    if (numValue > MAX_INT32) {
      toast.error(`Quantity cannot exceed ${MAX_INT32}`);
      return;
    }

    setFormData({
      ...formData,
      productSkus: formData.productSkus.map(sku => ({
        ...sku,
        quantity: value
      }))
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:bg-cyan-400 p-2 rounded-full">
          <Plus size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[92vh] flex gap-4">
        <form onSubmit={handleSubmit} className="flex gap-4 w-full">
          <div className="h-[68%] bg-gray-100 py-4 px-6 flex flex-col">
            <h1 className="text-lg font-semibold">General information</h1>
            <div className="mt-2">
              <label htmlFor="name" className="">Product name</label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="product name"
                className="bg-gray-200 mt-1"
                              />
            </div>
            <div className="mt-2">
              <label htmlFor="description" className="">Product description</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="product description"
                className="bg-gray-200 mt-1 h-[160px] items-start pl-1"
              />
            </div>

            <div className="flex-1">
              <div className="">
                <h1 className="font-semibold -mt-1">Size:</h1>
                <p className="text-sm mb-1">pick available size</p>
              </div>
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    productSkus: formData.productSkus.map(sku => ({
                      ...sku,
                      sizeAttribute: { value: size }
                    }))
                  })}
                  className={`rounded border-2 mx-1 py-1 mt-2 px-2 text-xs ${formData.productSkus[0].sizeAttribute.value === size
                    ? 'bg-[#373F51] text-white border-[#373F51]'
                    : 'border-gray-400 hover:bg-[#373F51] hover:text-white hover:border-none'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <div className="">
                <h1 className="font-semibold -mt-1">Color:</h1>
                <p className="text-sm mb-1">pick available color</p>
              </div>
              {["#000000", "#FF0000", "#00FF00", "#0000FF"].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    productSkus: formData.productSkus.map(sku => ({
                      ...sku,
                      colorAttribute: { value: color }
                    }))
                  })}
                  className={`w-4 h-4 rounded-full mx-1 my-3 ${formData.productSkus[0].colorAttribute.value === color
                    ? 'ring-2 ring-offset-2 ring-[#373F51]'
                    : ''
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-100 flex-1 py-4 px-6">
            <h1 className="font-semibold">Pricing and Stock</h1>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  value={formData.productSkus[0].price}
                  onChange={(e) => setFormData({
                    ...formData,
                    productSkus: formData.productSkus.map(sku => ({
                      ...sku,
                      price: e.target.value
                    }))
                  })}
                  placeholder="Price"
                  className="bg-gray-200"
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="quantity">Stock</Label>
                <Input
                  type="number"
                  id="quantity"
                  value={formData.productSkus[0].quantity}
                  onChange={handleQuantityChange}
                  placeholder="Stock quantity"
                  className="bg-gray-200"
                  min="1"
                  max={MAX_INT32}
                />
              </div>
            </div>
          </div>

          <div className="w-5/12 bg-gray-100 p-4 flex flex-col">
            <h1 className="font-semibold text-lg">Category</h1>
            <div className="grid w-full items-center gap-1.5 mt-2">
              <Label htmlFor="category">Product category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger className="w-full bg-gray-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Product category</SelectLabel>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    ) : categories && categories.length > 0 ? (
                      categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No categories found</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <button type="submit" className="w-full mt-4 py-2 bg-primary rounded text-white">
              Create Product
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProduct;
