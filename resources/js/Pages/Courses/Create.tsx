import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

const STEPS = ['Basics', 'Details', 'Review'];

export default function Create({ categories }: { categories: Category[] }) {
    const [step, setStep] = useState(0);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        prerequisites: '',
        learning_outcomes: '',
        target_audience: '',
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

    const canProceed = () => {
        if (step === 0) return data.title.trim().length > 0;
        return true;
    };

    const nextStep = () => {
        if (step < STEPS.length - 1) setStep((s) => s + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep((s) => s - 1);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('courses.store'));
    };

    const outcomesList = data.learning_outcomes
        .split('\n')
        .map((l) => l.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Create Course</h2>}
        >
            <Head title="Create Course" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {/* Steps Indicator */}
                    <div className="mb-8 flex items-center justify-center gap-0">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                                        i < step ? 'bg-primary text-primary-foreground' :
                                        i === step ? 'bg-accent text-accent-foreground ring-2 ring-accent' :
                                        'bg-muted text-muted-foreground'
                                    )}>
                                        {i < step ? '✓' : i + 1}
                                    </div>
                                    <span className={cn(
                                        'hidden text-sm font-medium sm:inline',
                                        i === step ? 'text-foreground' : 'text-muted-foreground'
                                    )}>
                                        {s}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn(
                                        'mx-3 h-0.5 w-16 sm:w-24 transition-colors',
                                        i < step ? 'bg-primary' : 'bg-muted'
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            {/* Step 1: Basics */}
                            {step === 0 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Tell students what your course is about.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title">Course Title *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="e.g., Complete Web Development Bootcamp"
                                        />
                                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            placeholder="Describe what students will learn and why they should take this course..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            id="category"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </Select>
                                        </div>

                                        <div className="space-y-2">
                                        <Label htmlFor="difficulty">Difficulty *</Label>
                                        <Select
                                            id="difficulty"
                                            value={data.difficulty}
                                            onChange={(e) => setData('difficulty', e.target.value)}
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </Select>
                                        </div>
                                    </div>

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
                                                <p className="mt-1 text-xs text-muted-foreground">JPG or PNG. Max 2MB.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Details */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Course Details</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Set expectations and logistics for your students.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prerequisites">Prerequisites</Label>
                                        <Textarea
                                            id="prerequisites"
                                            value={data.prerequisites}
                                            onChange={(e) => setData('prerequisites', e.target.value)}
                                            rows={2}
                                            placeholder="e.g., Basic knowledge of HTML and CSS"
                                        />
                                        <p className="text-xs text-muted-foreground">What students should know before taking this course.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="learning_outcomes">Learning Outcomes</Label>
                                        <Textarea
                                            id="learning_outcomes"
                                            value={data.learning_outcomes}
                                            onChange={(e) => setData('learning_outcomes', e.target.value)}
                                            rows={4}
                                            placeholder={'Build a full-stack web application\nUnderstand REST API design\nDeploy applications to the cloud'}
                                        />
                                        <p className="text-xs text-muted-foreground">One per line. What students will be able to do after completing this course.</p>
                                        {outcomesList.length > 0 && (
                                            <div className="rounded-md bg-muted p-3">
                                                <p className="mb-1 text-xs font-medium text-muted-foreground">Preview:</p>
                                                <ul className="list-inside list-disc space-y-0.5 text-sm text-foreground">
                                                    {outcomesList.map((o, i) => (
                                                        <li key={i}>{o}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target_audience">Target Audience</Label>
                                        <Input
                                            id="target_audience"
                                            value={data.target_audience}
                                            onChange={(e) => setData('target_audience', e.target.value)}
                                            placeholder="e.g., Aspiring web developers, CS students"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={data.estimated_duration_minutes}
                                                onChange={(e) => setData('estimated_duration_minutes', e.target.value)}
                                                placeholder="e.g., 180"
                                                min="1"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="max_students">Max Students</Label>
                                            <Input
                                                id="max_students"
                                                type="number"
                                                value={data.max_students}
                                                onChange={(e) => setData('max_students', e.target.value)}
                                                placeholder="No limit"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Review & Create</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Review your course details before publishing.</p>
                                    </div>

                                    <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
                                        {thumbnailPreview && (
                                            <img src={thumbnailPreview} alt="Thumbnail" className="h-32 w-full rounded-lg object-cover" />
                                        )}

                                        <div>
                                            <h4 className="text-lg font-semibold text-foreground">{data.title || '(Untitled Course)'}</h4>
                                            {data.description && (
                                                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{data.description}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {data.category_id && (
                                                <div>
                                                    <span className="font-medium text-foreground">Category: </span>
                                                    <span className="text-muted-foreground">
                                                        {categories.find((c) => String(c.id) === data.category_id)?.name}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium text-foreground">Difficulty: </span>
                                                <span className="text-muted-foreground capitalize">{data.difficulty}</span>
                                            </div>
                                            {data.estimated_duration_minutes && (
                                                <div>
                                                    <span className="font-medium text-foreground">Duration: </span>
                                                    <span className="text-muted-foreground">{Math.round(Number(data.estimated_duration_minutes) / 60)} hours</span>
                                                </div>
                                            )}
                                            {data.max_students && (
                                                <div>
                                                    <span className="font-medium text-foreground">Max Students: </span>
                                                    <span className="text-muted-foreground">{data.max_students}</span>
                                                </div>
                                            )}
                                            {data.target_audience && (
                                                <div className="col-span-2">
                                                    <span className="font-medium text-foreground">Target Audience: </span>
                                                    <span className="text-muted-foreground">{data.target_audience}</span>
                                                </div>
                                            )}
                                        </div>

                                        {data.prerequisites && (
                                            <div>
                                                <span className="text-sm font-medium text-foreground">Prerequisites: </span>
                                                <p className="mt-0.5 text-sm text-muted-foreground">{data.prerequisites}</p>
                                            </div>
                                        )}

                                        {outcomesList.length > 0 && (
                                            <div>
                                                <span className="text-sm font-medium text-foreground">Learning Outcomes ({outcomesList.length}):</span>
                                                <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-muted-foreground">
                                                    {outcomesList.map((o, i) => (
                                                        <li key={i}>{o}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                                <div>
                                    {step > 0 ? (
                                        <button type="button" onClick={prevStep} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                            Previous
                                        </button>
                                    ) : (
                                        <Link href={route('courses.index')} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                            Cancel
                                        </Link>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    {step < STEPS.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!canProceed()}
                                            className="rounded-md bg-accent px-6 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                                        >
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {processing ? 'Creating...' : 'Create Course'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
