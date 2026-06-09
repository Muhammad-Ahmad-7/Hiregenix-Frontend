import React from "react";

interface Props {
    content: string;
    isUser?: boolean;
}

export default function MarkdownMessage({ content, isUser }: Props) {
    if (isUser) return <span>{content}</span>;
    return <div className="markdown-msg">{parseMarkdown(content)}</div>;
}

function parseMarkdown(raw: string): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];
    const lines = raw.split("\n");
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // ── Fenced code block ```
        if (line.startsWith("```")) {
            const lang = line.slice(3).trim();
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            nodes.push(
                <pre key={i} style={{
                    background: "rgba(0,0,0,0.06)",
                    borderRadius: 6,
                    padding: "8px 10px",
                    fontSize: 10.5,
                    overflowX: "auto",
                    margin: "4px 0",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}>
                    {lang && <span style={{ opacity: 0.45, fontSize: 9, display: "block", marginBottom: 2 }}>{lang}</span>}
                    <code>{codeLines.join("\n")}</code>
                </pre>
            );
            i++;
            continue;
        }

        // ── Markdown table  (line contains |)
        if (line.includes("|") && line.trim().startsWith("|")) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
                tableLines.push(lines[i]);
                i++;
            }

            const parseRow = (r: string) =>
                r.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

            const [headerRow, , ...bodyRows] = tableLines; // skip separator row
            const headers = parseRow(headerRow);
            const rows = bodyRows.map(parseRow);

            nodes.push(
                <div key={i} style={{ overflowX: "auto", margin: "4px 0" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                        <thead>
                            <tr>
                                {headers.map((h, hi) => (
                                    <th key={hi} style={{
                                        textAlign: "left", padding: "3px 8px 3px 0",
                                        borderBottom: "1px solid rgba(0,0,0,0.15)",
                                        fontWeight: 600, whiteSpace: "nowrap", opacity: 0.7,
                                    }}>
                                        {inlineFormat(h)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, ri) => (
                                <tr key={ri} style={{ borderBottom: "0.5px solid rgba(0,0,0,0.07)" }}>
                                    {row.map((cell, ci) => (
                                        <td key={ci} style={{ padding: "4px 8px 4px 0", verticalAlign: "top" }}>
                                            {inlineFormat(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            continue;
        }

        // ── Heading  ## / ###
        if (/^#{1,3}\s/.test(line)) {
            const level = line.match(/^#+/)![0].length;
            const text = line.replace(/^#+\s*/, "");
            const style: React.CSSProperties = {
                fontWeight: 600,
                margin: "6px 0 2px",
                fontSize: level === 1 ? 13 : level === 2 ? 12 : 11,
                opacity: 0.9,
            };
            nodes.push(<div key={i} style={style}>{inlineFormat(text)}</div>);
            i++;
            continue;
        }

        // ── Bullet list  - / * / •
        if (/^[-*•]\s/.test(line.trim())) {
            const items: string[] = [];
            while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^[-*•]\s/, ""));
                i++;
            }
            nodes.push(
                <ul key={i} style={{ margin: "2px 0", paddingLeft: 14, listStyleType: "disc" }}>
                    {items.map((item, ii) => (
                        <li key={ii} style={{ marginBottom: 1 }}>{inlineFormat(item)}</li>
                    ))}
                </ul>
            );
            continue;
        }

        // ── Numbered list  1. 2.
        if (/^\d+\.\s/.test(line.trim())) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
                i++;
            }
            nodes.push(
                <ol key={i} style={{ margin: "2px 0", paddingLeft: 16 }}>
                    {items.map((item, ii) => (
                        <li key={ii} style={{ marginBottom: 1 }}>{inlineFormat(item)}</li>
                    ))}
                </ol>
            );
            continue;
        }

        // ── Blank line
        if (line.trim() === "") {
            nodes.push(<div key={i} style={{ height: 4 }} />);
            i++;
            continue;
        }

        // ── Paragraph
        nodes.push(
            <p key={i} style={{ margin: "2px 0", lineHeight: 1.55 }}>
                {inlineFormat(line)}
            </p>
        );
        i++;
    }

    return nodes;
}

// Handles **bold**, *italic*, `inline code` within a line
function inlineFormat(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) parts.push(text.slice(last, match.index));

        if (match[2] !== undefined)
            parts.push(<strong key={match.index} style={{ fontWeight: 600 }}>{match[2]}</strong>);
        else if (match[3] !== undefined)
            parts.push(<em key={match.index}>{match[3]}</em>);
        else if (match[4] !== undefined)
            parts.push(
                <code key={match.index} style={{
                    background: "rgba(0,0,0,0.08)", borderRadius: 3,
                    padding: "0 3px", fontSize: "0.92em", fontFamily: "monospace",
                }}>
                    {match[4]}
                </code>
            );

        last = match.index + match[0].length;
    }

    if (last < text.length) parts.push(text.slice(last));
    return parts;
}