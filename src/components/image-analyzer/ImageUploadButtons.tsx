
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Image as ImageIcon } from "lucide-react";

interface ImageUploadButtonsProps {
  onTriggerFileInput: (type: 'camera' | 'gallery') => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  cameraInputRef: React.RefObject<HTMLInputElement>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadButtons = ({
  onTriggerFileInput,
  fileInputRef,
  cameraInputRef,
  onImageUpload
}: ImageUploadButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button 
        onClick={() => onTriggerFileInput('gallery')}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        Choose from Gallery
      </Button>
      
      <Button 
        onClick={() => onTriggerFileInput('camera')}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Camera className="w-4 h-4" />
        Take Photo
      </Button>

      <Input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
        ref={fileInputRef}
      />

      <Input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onImageUpload}
        className="hidden"
        ref={cameraInputRef}
      />
    </div>
  );
};

export default ImageUploadButtons;

