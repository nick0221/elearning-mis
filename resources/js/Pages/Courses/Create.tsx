import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { useRef, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

export default function Create({ categories }: { categories: Category[] }) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        difficulty: 'beginner',
        max_students: '',
        estimated_duration_minutes: '',
        thumbnail: null as File | null,
    });

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('courses.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Create Course</h2>}
        >
            <Head title="Create Course" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Thumbnail Upload */}
                            <div className="space-y-2">
                                <Label>Thumbnail</Label>
                                <div className="flex items-center gap-4">
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="Thumbnail" className="h-24 w-40 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex h-24 w-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted text-sm text-muted-foreground">
                                            No image
                                        </div>
                                    )}
                                    <div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                            Upload thumbnail
                                        </button>
                                        <p className="mt-1 text-xs text-muted-foreground">Optional. JPG, PNG. Max 2MB.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g., Complete Web Development Bootcamp" />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} placeholder="Describe what students will learn in this course..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select id="category" value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty *</Label>
                                    <Select id="difficulty" value={data.difficulty} onChange={(e) => setData('difficulty', e.target.value)}>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="max_students">Max Students</Label>
                                    <Input id="max_students" type="number" value={data.max_students} onChange={(e) => setData('max_students', e.target.value)} placeholder="No limit" min="1" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (minutes)</Label>
                                    <Input id="duration" type="number" value={data.estimated_duration_minutes} onChange={(e) => setData('estimated_duration_minutes', e.target.value)} placeholder="e.g., 180" min="1" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Link href={route('courses.index')} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                    Cancel
                                </Link>
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                    {processing ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
