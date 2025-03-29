import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { useState } from "react";
import { useUpdateCategoryMutation } from "../../../features/inventory/categorySlice";
import { toast } from "sonner";
import { Category } from "../../../features/inventory/categorySlice";

interface EditCategoryModalProps {
  category: Category;
}

function EditCategoryModal({ category }: EditCategoryModalProps) {
  const [updateCategory] = useUpdateCategoryMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCategory({
        id: category.id,
        data: formData,
      }).unwrap();
      toast.success("Category updated successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Pencil size={16} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit Category
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter category description"
              className="h-32"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Update Category
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategoryModal;
