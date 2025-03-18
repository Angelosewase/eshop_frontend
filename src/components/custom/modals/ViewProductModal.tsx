import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Product } from "../../../features/inventory/productSlice";

interface ViewProductModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewProductModal({ product, open, onOpenChange }: ViewProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80vw] h-[92vh] flex gap-4">
        <div className="flex flex-col gap-6 w-full">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Name</Label>
                <p className="mt-1">{product.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="mt-1">{product.description || 'No description available'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Category</Label>
                <p className="mt-1">{product.category?.name || 'Uncategorized'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Average Rating</Label>
                <p className="mt-1">{product.averageRating ? `${product.averageRating.toFixed(1)}/5` : 'No ratings yet'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">SKUs</Label>
                <div className="mt-2 space-y-2">
                  {product.productSkus?.map((sku) => (
                    <div key={sku.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">SKU: {sku.sku}</span>
                        <span className="text-gray-600">Qty: {sku.quantity}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <p>Size: {sku.sizeAttribute?.value || 'N/A'}</p>
                        <p>Color: {sku.colorAttribute?.value || 'N/A'}</p>
                        <p>Price: ${sku.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Recent Reviews</Label>
                  <div className="mt-2 space-y-2">
                    {product.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium">Rating: {review.rating}/5</span>
                          <span className="text-sm text-gray-500">User ID: {review.userId}</span>
                        </div>
                        {review.comment && (
                          <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 