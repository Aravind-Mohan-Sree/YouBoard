import Cropper, { Area } from "react-easy-crop";
import { useCallback, useEffect, useState } from "react";
import { ImageUploadProps } from "../types";
import { CircleX } from "lucide-react";
import getCroppedImg from "../utils/cropImage";

const ImageUpload = ({
  handleImageUpload,
  inputRef,
  setIsVisible,
}: ImageUploadProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [setCroppedAreaPixels],
  );

  useEffect(() => {
    if (imageSrc && croppedAreaPixels) {
      const timer = setTimeout(() => {
        setZoom(zoom + 0.0000001);
        setTimeout(() => setZoom(zoom), 50);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [crop, imageSrc, zoom, croppedAreaPixels]);

  const handleDoubleTap = () => {
    setCrop({ x: 0, y: 0 });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleUpload = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setImageSrc(null);
    setIsVisible(false);

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

    handleImageUpload(croppedBlob);
  }, [
    imageSrc,
    setImageSrc,
    setIsVisible,
    croppedAreaPixels,
    handleImageUpload,
  ]);

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div
            className="relative w-100 h-100 max-w-md bg-gray-800 p-4"
            onDoubleClick={handleDoubleTap}
            tabIndex={0}
          >
            <CircleX
              className="absolute text-white right-5 top-5 cursor-pointer z-10"
              size={30}
              onClick={() => setImageSrc(null)}
            />

            <ul className="absolute left-5 top-5 list-disc list-inside text-white text-xs space-y-0.5 z-10">
              <li>Mousewheel or pinch to zoom</li>
              <li>Tap and move to drag</li>
              <li>Double tap to center</li>
            </ul>

            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />

            <button
              className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-800 rounded-full transition-all cursor-pointer"
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
