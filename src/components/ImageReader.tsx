import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageReaderProps {
    images: string[];
    title?: string;
    onClose: () => void;
}

const ImageReader: React.FC<ImageReaderProps> = ({ images, title, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const prevImage = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl relative">
                <Button
                    variant="ghost"
                    className="absolute top-2 right-2 text-white"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </Button>
                {title && <h2 className="text-white text-lg text-center mb-4">{title}</h2>}
                <div className="flex items-center justify-center">
                    <button
                        onClick={prevImage}
                        disabled={currentIndex === 0}
                        className="text-white text-3xl px-2 select-none"
                    >
                        ‹
                    </button>
                    <img
                        src={images[currentIndex]}
                        alt={`Page ${currentIndex + 1}`}
                        className="max-h-[80vh] object-contain mx-4"
                    />
                    <button
                        onClick={nextImage}
                        disabled={currentIndex === images.length - 1}
                        className="text-white text-3xl px-2 select-none"
                    >
                        ›
                    </button>
                </div>
                <p className="text-white text-sm mt-2 text-center">
                    Page {currentIndex + 1} / {images.length}
                </p>
            </div>
        </div>
    );
};

export default ImageReader;