type Props = {
  content: string;
};

export default function LegacyArticleBody({ content }: Props) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let key = 0;
  let inList = false;
  let listItems: JSX.Element[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${key++}`}
          className="list-disc list-inside space-y-2 mb-4 text-slate-700"
        >
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24"
        >
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={key++}
          className="text-xl font-semibold text-slate-900 mt-8 mb-3 scroll-mt-24"
        >
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      inList = true;
      listItems.push(
        <li key={key++} className="leading-relaxed ml-2">
          {line.replace("- ", "")}
        </li>
      );
    } else if (/^\*\*(.+)\*\*$/.test(line)) {
      flushList();
      const text = line.replace(/^\*\*|\*\*$/g, "");
      elements.push(
        <p
          key={key++}
          className="text-slate-900 font-bold leading-relaxed mb-4"
        >
          {text}
        </p>
      );
    } else {
      flushList();
      elements.push(
        <p key={key++} className="text-slate-700 leading-relaxed mb-4">
          {line}
        </p>
      );
    }
  }

  flushList();
  return <>{elements}</>;
}
