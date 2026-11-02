import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const STYLES = [
    "text-[15px] leading-relaxed",
    "[&_h1]:mb-2 [&_h1]:mt-5 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-black",
    "[&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-black",
    "[&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold",
    "[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1",
    "[&_strong]:font-bold [&_a]:text-goji [&_a]:underline [&_a]:underline-offset-2",
    "[&_code]:rounded [&_code]:bg-sun/40 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px]",
    "[&_hr]:my-4 [&_hr]:border-ink/20 [&_blockquote]:border-l-4 [&_blockquote]:border-goji [&_blockquote]:pl-3 [&_blockquote]:italic",
    "[&_table]:my-3 [&_table]:block [&_table]:overflow-x-auto [&_table]:text-sm",
    "[&_th]:border-b-2 [&_th]:border-ink [&_th]:py-1 [&_th]:pr-3 [&_th]:text-left",
    "[&_td]:border-b [&_td]:border-ink/15 [&_td]:py-1.5 [&_td]:pr-3",
].join(" ");

export function MarkdownView({ children }: { children: string }) {
    return (
        <div className={STYLES}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children: c }) => (
                        <a href={href} target="_blank" rel="noreferrer">
                            {c}
                        </a>
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
