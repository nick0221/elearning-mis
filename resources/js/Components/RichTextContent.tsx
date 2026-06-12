import { useState } from 'react';

interface RichTextContentProps {
    content: string;
}

function parseContent(content: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        // Add text before code block
        if (match.index > lastIndex) {
            const text = content.slice(lastIndex, match.index);
            if (text.trim()) {
                parts.push(<span key={`text-${lastIndex}`} className="whitespace-pre-wrap">{text}</span>);
            }
        }

        const language = match[1] || 'text';
        const code = match[2].trimEnd();

        parts.push(
            <CodeBlock key={`code-${match.index}`} language={language} code={code} />
        );

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
        const text = content.slice(lastIndex);
        if (text.trim()) {
            parts.push(<span key={`text-${lastIndex}`} className="whitespace-pre-wrap">{text}</span>);
        }
    }

    return parts.length > 0 ? parts : [<span key="content" className="whitespace-pre-wrap">{content}</span>];
}

function CodeBlock({ language, code }: { language: string; code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-4 rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between bg-muted px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <pre className="overflow-x-auto bg-foreground/5 p-4">
                <code className="text-sm font-mono text-foreground">{code}</code>
            </pre>
        </div>
    );
}

export default function RichTextContent({ content }: RichTextContentProps) {
    return (
        <div className="prose prose-slate max-w-none text-foreground">
            {parseContent(content)}
        </div>
    );
}
