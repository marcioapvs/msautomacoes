import React, { useCallback, useRef } from 'react';
import { UploadIcon, TrashIcon, PlusIcon } from './icons';

export type ImageRole = 'Principal' | 'Fundo' | 'Elemento';

export interface ImageObject {
  id: string;
  file: File;
  previewUrl: string;
  role: ImageRole;
}

interface ImageUploaderProps {
  images: ImageObject[];
  onImagesChange: (images: ImageObject[]) => void;
}

const MAX_FILES = 5;

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: ImageObject[] = [];
    for (let i = 0; i < files.length; i++) {
        if (images.length + newImages.length >= MAX_FILES) break;
        const file = files[i];
        if (['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
            newImages.push({
                id: `${file.name}-${Date.now()}`,
                file,
                previewUrl: URL.createObjectURL(file),
                role: 'Principal',
            });
        }
    }
    if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = ''; // Reset input
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleRemoveImage = (idToRemove: string) => {
    const imageToRemove = images.find(img => img.id === idToRemove);
    if(imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    onImagesChange(images.filter(img => img.id !== idToRemove));
  };
  
  const handleRoleChange = (idToUpdate: string, newRole: ImageRole) => {
    onImagesChange(images.map(img => img.id === idToUpdate ? {...img, role: newRole} : img));
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#E6EEF6] mb-2">1. Envie suas Imagens</h2>
      <p className="text-slate-400 mb-4">Envie até {MAX_FILES} imagens para compor sua arte final.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {images.map((image) => (
          <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed border-slate-600">
            <img src={image.previewUrl} alt={image.file.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <select 
                    value={image.role}
                    onChange={(e) => handleRoleChange(image.id, e.target.value as ImageRole)}
                    className="absolute top-2 left-2 text-xs bg-[#121821] text-white rounded border border-slate-500 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                >
                    <option>Principal</option>
                    <option>Fundo</option>
                    <option>Elemento</option>
                </select>
                <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
                    aria-label="Remover imagem"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
        
        {images.length < MAX_FILES && (
          <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className="flex flex-col items-center justify-center w-full aspect-square px-4 text-center border-2 border-slate-600 border-dashed rounded-lg cursor-pointer hover:border-[#0EA5E9] hover:bg-slate-800/20 transition-colors"
          >
            <PlusIcon className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-300">Adicionar Imagem</p>
            <p className="text-xs text-slate-500">ou arraste e solte</p>
          </label>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        multiple
      />
    </div>
  );
};
