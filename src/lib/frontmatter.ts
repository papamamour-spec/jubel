import matter from "gray-matter";

const disabled = () => {
  throw new Error("Front matter engines other than YAML are disabled");
};

// The default gray-matter engines include a JavaScript engine that evals
// `---js` front matter; content is machine-generated, so only YAML is allowed.
export function parseFrontMatter(raw: string) {
  return matter(raw, {
    engines: {
      js: disabled,
      javascript: disabled,
      coffee: disabled,
      cson: disabled,
      toml: disabled,
    },
  });
}
