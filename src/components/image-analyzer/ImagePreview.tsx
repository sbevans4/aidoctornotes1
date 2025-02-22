
import React from 'react';

interface ImagePreviewProps {
  url: string;
}

const ImagePreview = ({ url }: ImagePreviewProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
      <div className="relative max-w-md border rounded-lg overflow-hidden">
        <img 
          src={url} 
          alt="Preview" 
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default ImagePreview;

