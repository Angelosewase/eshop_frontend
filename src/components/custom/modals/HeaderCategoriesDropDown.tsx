import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ChevronDown } from "lucide-react";

// You can expand this interface based on your needs
interface Category {
  name: string;
  icon: string;
  itemCount: number;
  slug: string;
}

function HeaderCategoriesDropDown() {
  // This can be moved to a constants file or fetched from an API
  const categories: Category[] = [
    { name: "Furniture", icon: "🪑", itemCount: 240, slug: "furniture" },
    { name: "Hand Bag", icon: "👜", itemCount: 240, slug: "hand-bag" },
    { name: "Shoe", icon: "👟", itemCount: 240, slug: "shoe" },
    { name: "Headphone", icon: "🎧", itemCount: 240, slug: "headphone" },
    { name: "Laptop", icon: "💻", itemCount: 240, slug: "laptop" },
    { name: "Book", icon: "📚", itemCount: 240, slug: "book" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="border-b border-white hover:border-black flex items-center justify-between gap-2">
          Categories
          <ChevronDown className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[70vw] mx-[15vw] mt-4 p-8">
        <h1 className="text-xl font-semibold mb-4 ">Popular categories</h1>
        <hr />

        <div className=" grid  gap-2 grid-cols-2 p-4">
          {categories.map((category) => (
            <div
              key={category.slug}
              className=" flex items-center gap-2   font-normal hover:bg-muted p-4 hover:cursor-pointer"
              onClick={() => {
                // Handle category click - you can add navigation logic here
              }}
            >
              <div className="text-2xl">{category.icon}</div>
              <div>
                <div className="flex-1 text-lg">{category.name}</div>
                <div className="text-md text-muted-foreground">
                  {category.itemCount} items available
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default HeaderCategoriesDropDown;
