import React, { useState, useRef } from "react";
import { cn } from "../../lib/utils";
import { Camera, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileImageProps {
  src?: string;
  alt?: string;
  onImageChange?: (file: File) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src = "/placeholder.svg",
  alt = "Profile picture",
  onImageChange,
  className,
  size = "md",
}) => {
  const [image, setImage] = useState(src);
  const [isHovering, setIsHovering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) {
      // 5MB
      toast.error("Image size should not exceed 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      if (onImageChange) {
        onImageChange(file);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-secondary",
        sizeClasses[size],
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Profile image */}
      <img
        src={image}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-200",
          isHovering && "opacity-80",
        )}
      />

      {/* Hover overlay */}
      {isHovering && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer animate-fade-in"
          onClick={handleImageClick}
        >
          <Camera className="h-6 w-6 text-white" />
        </div>
      )}

      {/* Success indicator */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/80 animate-fade-in">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ProfileImage;
