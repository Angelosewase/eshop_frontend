import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useState } from "react";
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
import { useCreateProductMutation } from "../../../features/inventory/productSlice";
import { useGetCategoriesQuery } from "../../../features/inventory/categorySlice";
import { toast } from "sonner";

// Maximum safe integer for PostgreSQL INT4 type
const MAX_INT32 = 2147483647;

function StyledAddInventoryProduct() {
  const [createProduct] = useCreateProductMutation();
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    cover: "",
    productSkus: [
      {
        price: "",
        quantity: "",
        sizeAttribute: { value: "" },
        colorAttribute: { value: "" },
      },
    ],
  });

  const validateForm = () => {
    // Check for empty name
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    // Check for category
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return false;
    }

    // Check for SKU details
    const sku = formData.productSkus[0];

    // Check price
    if (
      !sku.price ||
      isNaN(parseFloat(sku.price)) ||
      parseFloat(sku.price) <= 0
    ) {
      toast.error("Price must be a positive number");
      return false;
    }

    // Check quantity
    if (
      !sku.quantity ||
      isNaN(Number(sku.quantity)) ||
      Number(sku.quantity) <= 0
    ) {
      toast.error("Quantity must be a positive number");
      return false;
    }

    // Check if quantity is within INT4 range
    if (Number(sku.quantity) > MAX_INT32) {
      toast.error(`Quantity cannot exceed ${MAX_INT32}`);
      return false;
    }

    // Check attributes
    if (!sku.sizeAttribute.value || !sku.colorAttribute.value) {
      toast.error("Please select size and color");
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
        productSkus: formData.productSkus.map((sku) => ({
          id: 0,
          productId: 0,
          sku: `${formData.name.slice(0, 3).toUpperCase()}-${sku.sizeAttribute.value || "NA"}-${sku.colorAttribute.value.slice(1, 4) || "NA"}`,
          price: parseFloat(sku.price).toString(),
          quantity: Number(sku.quantity),
          sizeAttributeId: 0,
          colorAttributeId: 0,
          createdAt: new Date()
        })),
      }).unwrap();

      toast.success("Product created successfully");
      setOpen(false);

      // Reset form
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        cover: "",
        productSkus: [
          {
            price: "",
            quantity: "",
            sizeAttribute: { value: "" },
            colorAttribute: { value: "" },
          },
        ],
      });
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create product");
    }
  };

  const handleSizeChange = (value: string) => {
    setFormData({
      ...formData,
      productSkus: formData.productSkus.map((sku) => ({
        ...sku,
        sizeAttribute: { value },
      })),
    });
  };

  const handleColorChange = (value: string) => {
    setFormData({
      ...formData,
      productSkus: formData.productSkus.map((sku) => ({
        ...sku,
        colorAttribute: { value },
      })),
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      productSkus: formData.productSkus.map((sku) => ({
        ...sku,
        price: e.target.value,
      })),
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      productSkus: formData.productSkus.map((sku) => ({
        ...sku,
        quantity: e.target.value,
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[92vh] flex gap-4">
        <form onSubmit={handleSubmit} className="flex gap-4 w-full">
          <div className="h-[68%] bg-gray-100 py-4 px-6 flex flex-col">
            <h1 className="text-lg font-semibold">General information</h1>
            <div className="mt-2">
              <label htmlFor="name" className="">
                Product name
              </label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="product name"
                className="bg-gray-200"
              />
            </div>
            <div className="mt-2">
              <label htmlFor="description" className="">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="product description"
                className="bg-gray-200"
              />
            </div>
            <div className="mt-2">
              <label htmlFor="cover" className="">
                Cover image URL
              </label>
              <Input
                type="text"
                id="cover"
                value={formData.cover}
                onChange={(e) =>
                  setFormData({ ...formData, cover: e.target.value })
                }
                placeholder="Image URL"
                className="bg-gray-200"
              />
            </div>
          </div>

          <div className="w-7/12 bg-gray-100 p-4 flex flex-col">
            <h1 className="font-semibold text-lg">Variants</h1>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="size">Size</Label>
                <Select
                  value={formData.productSkus[0].sizeAttribute.value}
                  onValueChange={handleSizeChange}
                >
                  <SelectTrigger className="w-full bg-gray-200">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Size</SelectLabel>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="color">Color</Label>
                <Select
                  value={formData.productSkus[0].colorAttribute.value}
                  onValueChange={handleColorChange}
                >
                  <SelectTrigger className="w-full bg-gray-200">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="Blue">Blue</SelectItem>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Yellow">Yellow</SelectItem>
                      <SelectItem value="Purple">Purple</SelectItem>
                      <SelectItem value="Orange">Orange</SelectItem>
                      <SelectItem value="Pink">Pink</SelectItem>
                      <SelectItem value="Gray">Gray</SelectItem>
                      <SelectItem value="Brown">Brown</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  value={formData.productSkus[0].price}
                  onChange={handlePriceChange}
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
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger className="w-full bg-gray-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Product category</SelectLabel>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No categories found
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <button
              type="submit"
              className="w-full mt-4 py-2 bg-primary rounded text-white"
            >
              Create Product
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StyledAddInventoryProduct;
