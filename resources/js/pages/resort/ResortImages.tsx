import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ImageIcon, Star, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResortImage {
    id: number;
    resort_id: number;
    image_path: string;
    caption: string | null;
    order: number;
    is_primary: boolean;
    created_at: string;
}

interface Resort {
    id: number;
    resort_name: string;
}

interface PageProps {
    resort: Resort;
    images: ResortImage[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Resort Images', href: '/resort-images' }];

export default function ResortImages() {
    const { resort, images } = usePage<PageProps>().props;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isPrimary, setIsPrimary] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingImage, setEditingImage] = useState<ResortImage | null>(null);
    const [editCaption, setEditCaption] = useState('');
    const [editIsPrimary, setEditIsPrimary] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size must be less than 2MB');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast.error('Please select an image');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('caption', caption);
        formData.append('is_primary', isPrimary ? '1' : '0');

        router.post(route('resort.images.store'), formData, {
            onSuccess: () => {
                toast.success('Image uploaded successfully');
                setSelectedFile(null);
                setPreviewUrl(null);
                setCaption('');
                setIsPrimary(false);
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to upload image');
            },
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    const handleDelete = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(route('resort.images.destroy', imageId), {
                onSuccess: () => {
                    toast.success('Image deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete image');
                },
            });
        }
    };

    const handleEdit = (image: ResortImage) => {
        setEditingImage(image);
        setEditCaption(image.caption || '');
        setEditIsPrimary(image.is_primary);
    };

    const handleUpdateImage = () => {
        if (!editingImage) return;

        router.put(
            route('resort.images.update', editingImage.id),
            {
                caption: editCaption,
                is_primary: editIsPrimary,
            },
            {
                onSuccess: () => {
                    toast.success('Image updated successfully');
                    setEditingImage(null);
                },
                onError: () => {
                    toast.error('Failed to update image');
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resort Images" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Resort Images</h1>
                <p className="text-muted-foreground">
                    Manage images for {resort.resort_name} - these will be displayed to customers
                </p>
            </div>

            <div className="mx-4 space-y-6">
                {/* Upload New Image */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload New Image
                        </CardTitle>
                        <CardDescription>Add photos of your resort to attract more customers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* File Upload Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image-upload">Select Image</Label>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    <p className="text-xs text-muted-foreground">Supported: JPEG, PNG, WebP (Max 2MB)</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="caption">Caption (Optional)</Label>
                                    <Input
                                        id="caption"
                                        type="text"
                                        placeholder="e.g., Swimming Pool, Garden View"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        disabled={uploading}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is-primary"
                                        checked={isPrimary}
                                        onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
                                        disabled={uploading}
                                    />
                                    <Label htmlFor="is-primary" className="cursor-pointer">
                                        Set as primary image
                                    </Label>
                                </div>

                                <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full">
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                </Button>
                            </div>

                            {/* Preview Section */}
                            <div className="space-y-2">
                                <Label>Preview</Label>
                                {previewUrl ? (
                                    <div className="relative">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-64 w-full rounded-lg object-cover border"
                                        />
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-2 right-2"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setPreviewUrl(null);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed">
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">No image selected</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Current Images */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Current Images ({images.length})
                        </CardTitle>
                        <CardDescription>Manage your existing resort images</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {images.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {images.map((image) => (
                                    <div key={image.id} className="group relative overflow-hidden rounded-lg border">
                                        <div className="aspect-video relative">
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt={image.caption || 'Resort image'}
                                                className="h-full w-full object-cover"
                                            />
                                            {image.is_primary && (
                                                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                                                    <Star className="h-3 w-3 fill-white" />
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-medium line-clamp-1">
                                                {image.caption || 'No caption'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Order: {image.order}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 p-3 pt-0">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handleEdit(image)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(image.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ImageIcon className="h-16 w-16 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No images yet</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Upload your first image to showcase your resort
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editingImage !== null} onOpenChange={(open) => !open && setEditingImage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Image</DialogTitle>
                        <DialogDescription>Update the caption and primary status of this image</DialogDescription>
                    </DialogHeader>
                    {editingImage && (
                        <div className="space-y-4">
                            <div>
                                <img
                                    src={`/storage/${editingImage.image_path}`}
                                    alt={editingImage.caption || 'Resort image'}
                                    className="w-full rounded-lg object-cover max-h-64"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-caption">Caption</Label>
                                <Input
                                    id="edit-caption"
                                    type="text"
                                    value={editCaption}
                                    onChange={(e) => setEditCaption(e.target.value)}
                                    placeholder="Enter a caption"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-is-primary"
                                    checked={editIsPrimary}
                                    onCheckedChange={(checked) => setEditIsPrimary(checked as boolean)}
                                />
                                <Label htmlFor="edit-is-primary" className="cursor-pointer">
                                    Set as primary image
                                </Label>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingImage(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateImage}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
