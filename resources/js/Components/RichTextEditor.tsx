import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

function ToolbarButton({
    onClick, active, label, children,
}: {
    onClick: () => void;
    active?: boolean;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            className={cn(
                'flex h-8 w-8 items-center justify-center rounded text-sm transition-colors',
                active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: placeholder ?? 'Write something...' }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
            },
        },
    });

    useEffect(() => {
        return () => editor?.destroy();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className={cn('overflow-hidden rounded-md border border-input', className)}>
            <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/50 px-2 py-1.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    label="Bold"
                >
                    <span className="font-bold">B</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    label="Italic"
                >
                    <span className="italic">I</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    label="Strikethrough"
                >
                    <span className="line-through">S</span>
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    label="Heading"
                >
                    <span className="text-xs font-bold">H2</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    label="Subheading"
                >
                    <span className="text-xs font-bold">H3</span>
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    label="Bullet List"
                >
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path d="M3 4a1 1 0 100-2 1 1 0 000 2zm3-1.5h8a.5.5 0 010 1H6a.5.5 0 010-1zM3 9a1 1 0 100-2 1 1 0 000 2zm3-1.5h8a.5.5 0 010 1H6a.5.5 0 010-1zM3 14a1 1 0 100-2 1 1 0 000 2zm3-1.5h8a.5.5 0 010 1H6a.5.5 0 010-1z" /></svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    label="Ordered List"
                >
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-.5v1h.5a.5.5 0 010 1h-1a.5.5 0 010-1H3a.5.5 0 01-.5-.5zM6 3h8a.5.5 0 010 1H6a.5.5 0 010-1zM3 7.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1h.5a.5.5 0 010 1h-1a.5.5 0 010-1h-.5v1h.5a.5.5 0 010 1h-1a.5.5 0 010-1H3a.5.5 0 01-.5-.5zM6 8h8a.5.5 0 010 1H6a.5.5 0 010-1zm-2.5 3a.5.5 0 010 1h-.5v1h.5a.5.5 0 010 1h-1a.5.5 0 010-1H2a.5.5 0 010-1h.5v-1H2a.5.5 0 010-1h1a.5.5 0 01.5.5zM6 13h8a.5.5 0 010 1H6a.5.5 0 010-1z" /></svg>
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    label="Blockquote"
                >
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 3a.5.5 0 000 1h11a.5.5 0 000-1H2.5zm0 3a.5.5 0 000 1h11a.5.5 0 000-1H2.5zm0 3a.5.5 0 000 1h11a.5.5 0 000-1H2.5zm0 3a.5.5 0 000 1h11a.5.5 0 000-1H2.5z" /></svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    active={editor.isActive('codeBlock')}
                    label="Code Block"
                >
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path d="M4.854 4.146a.5.5 0 010 .708L1.707 8l3.147 3.146a.5.5 0 01-.708.708l-3.5-3.5a.5.5 0 010-.708l3.5-3.5a.5.5 0 01.708 0zm6.292 0a.5.5 0 000 .708L14.293 8l-3.147 3.146a.5.5 0 00.708.708l3.5-3.5a.5.5 0 000-.708l-3.5-3.5a.5.5 0 00-.708 0zm-.999-3.124a.5.5 0 01.33.625l-4 13a.5.5 0 01-.955-.294l4-13a.5.5 0 01.625-.33z" /></svg>
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    label="Undo"
                >
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 3a5 5 0 11-4.546 2.914.5.5 0 01.908-.417A4 4 0 108 3a4.002 4.002 0 00-3.467 2.027.5.5 0 01-.866-.5A5 5 0 018 3z" clipRule="evenodd" /><path d="M4 2.5v3a.5.5 0 00.5.5h3a.5.5 0 000-1h-2a5 5 0 014.5 3.5.5.5 0 10.928-.344A6 6 0 004.5 4.5V2.5a.5.5 0 00-1 0z" /></svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    label="Redo"
                >
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 3a5 5 0 11-4.546 2.914.5.5 0 00.908-.417A4 4 0 108 3a4.002 4.002 0 00-3.467 2.027.5.5 0 01-.866-.5A5 5 0 018 3z" clipRule="evenodd" /><path d="M12 2.5v3a.5.5 0 01-.5.5h-3a.5.5 0 010-1h2a5 5 0 00-4.5 3.5.5.5 0 11-.928-.344A6 6 0 0111.5 4.5V2.5a.5.5 0 011 0z" /></svg>
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
