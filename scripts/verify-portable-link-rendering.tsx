import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  // Next.js supplies the automatic JSX runtime for app builds. The standalone
  // tsx verifier needs React available before importing the TSX component.
  (globalThis as any).React = React;

  const { default: PortableArticleBody } = await import(
    "../components/blog/PortableArticleBody"
  );

  const markKey = "a67ee63b4042";
  const href =
    "https://tatkalclaims.com/blog/saral-jeevan-bima-affordable-term-insurance-protection-gap/";

  const value = [
    {
      _type: "block",
      _key: "34b7f1f0d27c",
      style: "h2",
      markDefs: [
        {
          _type: "link",
          _key: markKey,
          href,
        },
      ],
      children: [
        {
          _type: "span",
          _key: "phase8-link-span-1",
          text: "The",
          marks: [markKey],
        },
        {
          _type: "span",
          _key: "phase8-link-span-2",
          text: " Myth That Could Cost You Your Claim",
          marks: [],
        },
      ],
    },
  ];

  const html = renderToStaticMarkup(<PortableArticleBody value={value} />);

  assert(
    html.includes('<a href="' + href + '"'),
    "Portable Text link annotation did not render an anchor"
  );
  assert(
    html.includes(">The</a>"),
    "Portable Text link annotation did not wrap the marked span"
  );
  assert(
    html.includes("underline"),
    "Portable Text link did not retain visible link styling"
  );

  console.log(html);
  console.log("Portable Text Studio-generated link shape rendered successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
