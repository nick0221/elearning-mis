import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import RichTextEditor from '@/Components/RichTextEditor';
import { cn } from '@/lib/utils';
import { useRef, useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Category {
    id: number;
    name: string;
}

const STEPS = ['Basics', 'Details', 'Review'];

const DIFFICULTIES = [
    { value: 'beginner', label: 'Beginner', description: 'No prior knowledge needed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', badge: 'bg-green-500' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some foundational knowledge required', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', badge: 'bg-amber-500' },
    { value: 'advanced', label: 'Advanced', description: 'Designed for experienced learners', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', badge: 'bg-red-500' },
];

function SortableOutcome({ outcome, index, onRemove }: { outcome: string; index: number; onRemove: (i: number) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `outcome-${index}` });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

    return (
        <li ref={setNodeRef} style={style} className={cn('flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground', isDragging && 'shadow-md')}>
            <button type="button" {...attributes} {...listeners} className="cursor-grab touch-none text-muted-foreground hover:text-foreground">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h2v2H3V5zm4 0h2v2H7V5zm4 0h2v2h-2V5zm4 0h2v2h-2V5zm4 0h2v2h-2V5zM3 9h2v2H3V9zm4 0h2v2H7V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9zm-16 4h2v2H3v-2zm4 0h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" /></svg>
            </button>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{index + 1}</span>
            <span className="flex-1">{outcome}</span>
            <button type="button" onClick={() => onRemove(index)} className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </li>
    );
}

export default function Create({ categories }: { categories: Category[] }) {
    const [step, setStep] = useState(0);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const [outcomeInput, setOutcomeInput] = useState('');

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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    useEffect(() => { titleRef.current?.focus(); }, []);

    const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

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
        if (step === 0) return data.title.trim().length > 0 && data.description.trim().length > 0;
        if (step === 1) return outcomes.length > 0;
        return true;
    };

    const nextStep = () => {
        if (step < STEPS.length - 1 && canProceed()) setStep((s) => s + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep((s) => s - 1);
    };

    const goToStep = (s: number) => {
        if (s < step) setStep(s);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('courses.store'));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && canProceed() && step < STEPS.length - 1) {
            e.preventDefault();
            nextStep();
        }
        if (e.key === 'Escape' && step > 0) {
            e.preventDefault();
            prevStep();
        }
    };

    const outcomes = data.learning_outcomes
        .split('\n')
        .map((l) => l.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);

    const addOutcome = () => {
        if (!outcomeInput.trim() || outcomes.includes(outcomeInput.trim())) return;
        setData('learning_outcomes', [...outcomes, outcomeInput.trim()].join('\n'));
        setOutcomeInput('');
    };

    const removeOutcome = (index: number) => {
        setData('learning_outcomes', outcomes.filter((_, i) => i !== index).join('\n'));
    };

    const handleOutcomeKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addOutcome();
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = outcomes.findIndex((_, i) => `outcome-${i}` === active.id);
        const newIndex = outcomes.findIndex((_, i) => `outcome-${i}` === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const updated = [...outcomes];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);
        setData('learning_outcomes', updated.join('\n'));
    };

    const durationHours = data.estimated_duration_minutes ? Math.floor(Number(data.estimated_duration_minutes) / 60) : 0;
    const durationMins = data.estimated_duration_minutes ? Number(data.estimated_duration_minutes) % 60 : 0;

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
                                <button
                                    type="button"
                                    onClick={() => goToStep(i)}
                                    disabled={i > step}
                                    className="flex items-center gap-2"
                                >
                                    <div className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                                        i < step ? 'bg-primary text-primary-foreground cursor-pointer hover:ring-2 hover:ring-primary' :
                                        i === step ? 'bg-accent text-accent-foreground ring-2 ring-accent' :
                                        'bg-muted text-muted-foreground cursor-not-allowed'
                                    )}>
                                        {i < step ? '✓' : i + 1}
                                    </div>
                                    <span className={cn(
                                        'hidden text-sm font-medium sm:inline',
                                        i === step ? 'text-foreground' : i < step ? 'text-primary' : 'text-muted-foreground'
                                    )}>
                                        {s}
                                    </span>
                                </button>
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
                        <form onSubmit={submit} onKeyDown={handleKeyDown} className="p-6">
                            {/* Step 1: Basics */}
                            {step === 0 && (
                                <div className="space-y-6" key="step-0">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Tell students what your course is about.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="title">Course Title *</Label>
                                            <span className={cn('text-xs', data.title.length > 200 ? 'text-destructive' : 'text-muted-foreground')}>
                                                {data.title.length}/255
                                            </span>
                                        </div>
                                        <Input
                                            ref={titleRef}
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="e.g., Complete Web Development Bootcamp"
                                            className={errors.title ? 'border-destructive' : ''}
                                        />
                                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                        {slug && (
                                            <p className="text-xs text-muted-foreground">
                                                URL: <code className="rounded bg-muted px-1 py-0.5">/courses/{slug}</code>
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="description">Description *</Label>
                                            <span className={cn('text-xs', data.description.length > 4000 ? 'text-destructive' : 'text-muted-foreground')}>
                                                {data.description.length}/5000
                                            </span>
                                        </div>
                                        <RichTextEditor
                                            content={data.description}
                                            onChange={(html) => setData('description', html)}
                                            placeholder="Describe what students will learn and why they should take this course..."
                                        />
                                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                {DIFFICULTIES.map((d) => (
                                                    <option key={d.value} value={d.value}>{d.label}</option>
                                                ))}
                                            </Select>
                                            <p className={cn('text-xs font-medium', DIFFICULTIES.find((d) => d.value === data.difficulty)?.color)}>
                                                {DIFFICULTIES.find((d) => d.value === data.difficulty)?.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Thumbnail</Label>
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            {thumbnailPreview ? (
                                                <img src={thumbnailPreview} alt="Thumbnail" className="h-24 w-40 rounded-lg border border-border object-cover" />
                                            ) : (
                                                <div className="flex h-24 w-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted text-sm text-muted-foreground">
                                                    No image
                                                </div>
                                            )}
                                            <div>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                                    {thumbnailPreview ? 'Change thumbnail' : 'Upload thumbnail'}
                                                </button>
                                                <p className="mt-1 text-xs text-muted-foreground">JPG or PNG. Max 2MB.</p>
                                            </div>
                                        </div>
                                        {errors.thumbnail && <p className="text-sm text-destructive">{errors.thumbnail}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Details */}
                            {step === 1 && (
                                <div className="space-y-6" key="step-1">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Course Details</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Set expectations and logistics for your students.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prerequisites">Prerequisites</Label>
                                        <RichTextEditor
                                            content={data.prerequisites}
                                            onChange={(html) => setData('prerequisites', html)}
                                            placeholder="e.g., Basic knowledge of HTML and CSS"
                                        />
                                        <p className="text-xs text-muted-foreground">What students should know before taking this course.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Learning Outcomes *</Label>
                                        <p className="text-xs text-muted-foreground">Add each outcome students will achieve after completing this course.</p>

                                        <div className="flex gap-2">
                                            <Input
                                                value={outcomeInput}
                                                onChange={(e) => setOutcomeInput(e.target.value)}
                                                onKeyDown={handleOutcomeKeyDown}
                                                placeholder="e.g., Build a full-stack web application"
                                            />
                                            <button type="button" onClick={addOutcome} disabled={!outcomeInput.trim()} className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50">
                                                Add
                                            </button>
                                        </div>

                                        {outcomes.length > 0 && (
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                                <SortableContext items={outcomes.map((_, i) => `outcome-${i}`)} strategy={verticalListSortingStrategy}>
                                                    <ul className="space-y-1.5">
                                                        {outcomes.map((outcome, i) => (
                                                            <SortableOutcome key={`outcome-${i}`} outcome={outcome} index={i} onRemove={removeOutcome} />
                                                        ))}
                                                    </ul>
                                                </SortableContext>
                                            </DndContext>
                                        )}

                                        {errors.learning_outcomes && <p className="text-sm text-destructive">{errors.learning_outcomes}</p>}
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

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                            {data.estimated_duration_minutes && (
                                                <p className="text-xs text-muted-foreground">
                                                    ≈ {durationHours} hour{durationHours !== 1 ? 's' : ''}
                                                    {durationMins > 0 && ` ${durationMins} min`}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="max_students">Max Students</Label>
                                            <Input
                                                id="max_students"
                                                type="number"
                                                value={data.max_students}
                                                onChange={(e) => setData('max_students', e.target.value)}
                                                placeholder="Leave empty for unlimited"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 2 && (
                                <div className="space-y-6" key="step-2">
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
                                                <div className="mt-1 text-sm text-muted-foreground line-clamp-3 [&_p]:mb-1" dangerouslySetInnerHTML={{ __html: data.description }} />
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
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
                                                <span className={cn(
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                                                    DIFFICULTIES.find((d) => d.value === data.difficulty)?.bg,
                                                    DIFFICULTIES.find((d) => d.value === data.difficulty)?.color,
                                                )}>
                                                    <span className={cn('mr-1 h-1.5 w-1.5 rounded-full', DIFFICULTIES.find((d) => d.value === data.difficulty)?.badge)} />
                                                    {data.difficulty}
                                                </span>
                                            </div>
                                            {data.estimated_duration_minutes && (
                                                <div>
                                                    <span className="font-medium text-foreground">Duration: </span>
                                                    <span className="text-muted-foreground">
                                                        {durationHours} hour{durationHours !== 1 ? 's' : ''}
                                                        {durationMins > 0 && ` ${durationMins} min`}
                                                    </span>
                                                </div>
                                            )}
                                            {data.max_students && (
                                                <div>
                                                    <span className="font-medium text-foreground">Max Students: </span>
                                                    <span className="text-muted-foreground">{data.max_students}</span>
                                                </div>
                                            )}
                                            {data.target_audience && (
                                                <div className="sm:col-span-2">
                                                    <span className="font-medium text-foreground">Target Audience: </span>
                                                    <span className="text-muted-foreground">{data.target_audience}</span>
                                                </div>
                                            )}
                                        </div>

                                        {data.prerequisites && (
                                            <div>
                                                <span className="text-sm font-medium text-foreground">Prerequisites: </span>
                                                <div className="mt-0.5 text-sm text-muted-foreground [&_p]:mb-1" dangerouslySetInnerHTML={{ __html: data.prerequisites }} />
                                            </div>
                                        )}

                                        {outcomes.length > 0 && (
                                            <div>
                                                <span className="text-sm font-medium text-foreground">Learning Outcomes ({outcomes.length}):</span>
                                                <ul className="mt-1 space-y-1">
                                                    {outcomes.map((o, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                                                            {o}
                                                        </li>
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

                                <div className="flex items-center gap-3">
                                    <span className="hidden text-xs text-muted-foreground sm:inline">
                                        {step < STEPS.length - 1 ? 'Press Enter to continue' : ''}
                                    </span>
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
                                            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {processing && (
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            )}
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
