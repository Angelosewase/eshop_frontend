import {
  Dialog,
  DialogContent
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Product } from "../../../features/inventory/productSlice";
import { useState, useEffect } from "react";
import { useUpdateProductMutation } from "../../../features/inventory/productSlice";
import { toast } from "sonner";

interface EditProductModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Maximum safe integer for PostgreSQL INT4 type
const MAX_INT32 = 2147483647;

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export function EditProductModal({
  product,
  open,
  onOpenChange,
}: EditProductModalProps) {
  const [updateProduct] = useUpdateProductMutation();

  // Ensure product is valid
  const isValidProduct =
    product && typeof product.id === "number" && !isNaN(product.id);

  // Initialize form data with safe defaults
  const [formData, setFormData] = useState({
    name: isValidProduct ? product.name : "",
    description: isValidProduct ? product.description || "" : "",
    cover: isValidProduct ? product.cover || "" : "",
    productSkus: isValidProduct ? product.productSkus || [] : [],
  });

  // Reset form data when product changes
  useEffect(() => {
    if (product && typeof product.id === "number" && !isNaN(product.id)) {
      setFormData({
        name: product.name,
        description: product.description || "",
        cover: product.cover || "",
        productSkus: product.productSkus || [],
      });
    } else {
      // Close the modal if product data is invalid
      onOpenChange(false);
    }
  }, [product, onOpenChange]);

  const validateForm = () => {
    // Check for empty name
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    // Validate cover URL if provided
    if (formData.cover && formData.cover.trim() !== "") {
      if (!URL_REGEX.test(formData.cover)) {
        toast.error("Please enter a valid URL for the cover image");
        return false;
      }
    }

    // Validate SKUs
    for (const sku of formData.productSkus) {
      // Check for valid price
      if (isNaN(parseFloat(sku.price)) || parseFloat(sku.price) <= 0) {
        toast.error("Price must be a positive number");
        return false;
      }

      // Check for valid quantity (must be a positive integer within INT4 range)
      if (isNaN(sku.quantity) || sku.quantity < 0 || sku.quantity > MAX_INT32) {
        toast.error(
          `Quantity must be a positive number less than ${MAX_INT32}`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate product ID first - ensure it's a valid number
    if (!product || typeof product.id !== "number" || isNaN(product.id)) {
      console.error("Invalid product ID:", product?.id);
      toast.error("Invalid product ID");
      onOpenChange(false);
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // Ensure all numeric values are within safe ranges and ID is a valid number
      const safeFormData = {
        ...formData,
        // Only include cover if it's a valid URL
        cover:
          formData.cover && formData.cover.trim() !== ""
            ? formData.cover
            : null,
        productSkus: formData.productSkus.map((sku) => ({
          ...sku,
          quantity: Math.min(sku.quantity, MAX_INT32),
        })),
      };

      // Ensure product ID is a valid number
      const productId = Number(product.id);

      // Double-check that the ID is valid before proceeding
      if (isNaN(productId)) {
        console.error("Product ID is NaN after conversion:", product.id);
        toast.error("Invalid product ID");
        onOpenChange(false);
        return;
      }

      console.log("Using product ID:", productId);
      console.log("Sending update with ID:", productId);
      console.log("Update payload:", safeFormData);

      const result = await updateProduct({
        id: productId,
        product: safeFormData,
      }).unwrap();
      console.log(result);
      toast.success("Product updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Update product error:", error);
      // Log the full error details
      if (error.data) {
        console.error("Error data:", JSON.stringify(error.data));
      }
      if (error.status) {
        console.error("Error status:", error.status);
      }

      if (error.data?.error) {
        toast.error(`Failed to update product: ${error.data.error}`);
      } else {
        toast.error("Failed to update product");
      }
    }
  };

  const handleQuantityChange = (index: number, value: string) => {
    const numValue = parseInt(value, 10);

    // Don't allow values that are too large
    if (numValue > MAX_INT32) {
      toast.error(`Quantity cannot exceed ${MAX_INT32}`);
      return;
    }

    const newSkus = [...formData.productSkus];
    newSkus[index] = {
      ...newSkus[index],
      quantity: isNaN(numValue) ? 0 : numValue,
    };
    setFormData({ ...formData, productSkus: newSkus });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                className="bg-gray-200 mt-1"
              />
            </div>
            <div className="mt-2">
              <label htmlFor="description" className="">
                Product description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="product description"
                className="bg-gray-200 mt-1 h-[160px] items-start pl-1"
              />
            </div>
            <div className="mt-2">
              <label htmlFor="cover" className="">
                Cover Image URL (optional)
              </label>
              <Input
                type="text"
                id="cover"
                value={formData.cover || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cover: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="bg-gray-200 mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty if you don't want to change the cover image
              </p>
            </div>
          </div>

          <div className="bg-gray-100 flex-1 py-4 px-6">
            <h1 className="font-semibold">SKUs</h1>
            <div className="mt-4 space-y-4">
              {formData.productSkus.map((sku, index) => (
                <div key={sku.id} className="bg-white p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={sku.price}
                        onChange={(e) => {
                          const newSkus = [...formData.productSkus];
                          newSkus[index] = { ...sku, price: e.target.value };
                          setFormData({ ...formData, productSkus: newSkus });
                        }}
                        className="bg-gray-200"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={sku.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                        className="bg-gray-200"
                        min="0"
                        max={MAX_INT32}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label>SKU</Label>
                    <Input
                      type="text"
                      value={sku.sku}
                      disabled
                      className="bg-gray-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-5/12 bg-gray-100 p-4 flex flex-col">
            <h1 className="font-semibold text-lg">Actions</h1>
            <div className="mt-4">
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
