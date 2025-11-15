import { FormEvent, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2, Upload } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface LandingAreaImage {
    id: number;
    landing_area_id: number;
    image_path: string;
    caption: string | null;
    order: number;
    is_primary: boolean;
    created_at: string;
}

interface LandingArea {
    id: number;
    name: string;
    description: string | null;
    images: LandingAreaImage[];
}

interface Props {
    landingArea: LandingArea;
    images: LandingAreaImage[];
}

export default function LandingAreaImages({ landingArea, images }: Props) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [caption, setCaption] = useState('');
    const [isPrimary, setIsPrimary] = useState(false);
    const [editingImage, setEditingImage] = useState<LandingAreaImage | null>(null);
    const [editCaption, setEditCaption] = useState('');
    const [editIsPrimary, setEditIsPrimary] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('caption', caption);
        formData.append('is_primary', isPrimary ? '1' : '0');

        router.post('/landing-area-images', formData, {
            forceFormData: true,
            onSuccess: () => {
                setSelectedImage(null);
                setPreviewUrl('');
                setCaption('');
                setIsPrimary(false);
            },
        });
    };

    const handleEdit = (image: LandingAreaImage) => {
        setEditingImage(image);
        setEditCaption(image.caption || '');
        setEditIsPrimary(image.is_primary);
    };

    const handleUpdate = () => {
        if (!editingImage) return;

        router.put(`/landing-area-images/${editingImage.id}`, {
            caption: editCaption,
            is_primary: editIsPrimary,
        }, {
            onSuccess: () => {
                setEditingImage(null);
            },
        });
    };

    const handleDelete = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(`/landing-area-images/${imageId}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Landing Area Images" />

            <div className="container mx-auto p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">{landingArea.name} - Images</h1>
                    <p className="text-muted-foreground">
                        Manage your landing area images
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Image</CardTitle>
                        <CardDescription>
                            Add images to showcase your landing area to customers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Select Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageSelect}
                                    required
                                />
                            </div>

                            {previewUrl && (
                                <div className="space-y-2">
                                    <Label>Preview</Label>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-md rounded-lg border"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="caption">Caption (Optional)</Label>
                                <Input
                                    id="caption"
                                    type="text"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Enter image caption"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_primary"
                                    checked={isPrimary}
                                    onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
                                />
                                <Label htmlFor="is_primary" className="cursor-pointer">
                                    Set as primary image
                                </Label>
                            </div>

                            <Button type="submit" disabled={!selectedImage}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Image
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Uploaded Images</CardTitle>
                        <CardDescription>
                            {images.length} image{images.length !== 1 ? 's' : ''} uploaded
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {images.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No images uploaded yet. Upload your first image above.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative group border rounded-lg overflow-hidden"
                                    >
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt={image.caption || 'Landing area image'}
                                            className="w-full h-48 object-cover"
                                        />
                                        {image.is_primary && (
                                            <Badge className="absolute top-2 left-2">
                                                Primary
                                            </Badge>
                                        )}
                                        <div className="p-3 space-y-2">
                                            {image.caption && (
                                                <p className="text-sm">{image.caption}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(image)}
                                                        >
                                                            <Pencil className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Image</DialogTitle>
                                                            <DialogDescription>
                                                                Update caption and settings
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="edit-caption">Caption</Label>
                                                                <Input
                                                                    id="edit-caption"
                                                                    value={editCaption}
                                                                    onChange={(e) => setEditCaption(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="edit-primary"
                                                                    checked={editIsPrimary}
                                                                    onCheckedChange={(checked) =>
                                                                        setEditIsPrimary(checked as boolean)
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor="edit-primary"
                                                                    className="cursor-pointer"
                                                                >
                                                                    Set as primary image
                                                                </Label>
                                                            </div>
                                                            <Button onClick={handleUpdate}>
                                                                Save Changes
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(image.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
