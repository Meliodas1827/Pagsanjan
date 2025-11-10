import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageGalleryProps {
    images: { id: number; image_url: string }[];
    mainImage?: string;
}

export default function ImageGallery({ images, mainImage }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Combine main image with gallery images
    const allImages = [
        ...(mainImage ? [{ id: 0, image_url: mainImage }] : []),
        ...images,
    ];

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsLightboxOpen(true);
    };

    if (allImages.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center bg-gray-200 text-gray-400">
                No images available
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-2">
                {/* Main large image */}
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={allImages[0].image_url}
                        alt="Main view"
                        className="h-96 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                        onClick={() => openLightbox(0)}
                    />
                    {allImages.length > 1 && (
                        <div className="absolute right-4 bottom-4 rounded bg-black bg-opacity-70 px-3 py-1 text-sm text-white">
                            {allImages.length} photos
                        </div>
                    )}
                </div>

                {/* Thumbnail grid */}
                {allImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {allImages.slice(1, 5).map((image, index) => (
                            <div key={image.id} className="relative overflow-hidden rounded-lg">
                                <img
                                    src={image.image_url}
                                    alt={`Gallery ${index + 1}`}
                                    className="h-24 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                    onClick={() => openLightbox(index + 1)}
                                />
                                {index === 3 && allImages.length > 5 && (
                                    <div
                                        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-60 text-xl font-semibold text-white transition-opacity hover:bg-opacity-70"
                                        onClick={() => openLightbox(4)}
                                    >
                                        +{allImages.length - 5}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent className="max-w-5xl p-0">
                    <div className="relative">
                        {/* Close button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:bg-opacity-70"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Main image */}
                        <div className="relative">
                            <img
                                src={allImages[currentIndex].image_url}
                                alt={`Image ${currentIndex + 1}`}
                                className="h-[70vh] w-full object-contain"
                            />

                            {/* Navigation arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={goToPrevious}
                                        className="absolute top-1/2 left-4 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-3 text-white transition-colors hover:bg-opacity-70"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-3 text-white transition-colors hover:bg-opacity-70"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            {/* Image counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black bg-opacity-70 px-4 py-2 text-sm text-white">
                                {currentIndex + 1} / {allImages.length}
                            </div>
                        </div>

                        {/* Thumbnail strip */}
                        <div className="flex gap-2 overflow-x-auto bg-black bg-opacity-90 p-4">
                            {allImages.map((image, index) => (
                                <img
                                    key={image.id}
                                    src={image.image_url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`h-16 w-24 flex-shrink-0 cursor-pointer rounded object-cover transition-all ${
                                        index === currentIndex ? 'ring-4 ring-white' : 'opacity-60 hover:opacity-100'
                                    }`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
