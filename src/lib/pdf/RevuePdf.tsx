import path from "path";
import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { fromMarkdown } from "mdast-util-from-markdown";
import type { Content, PhrasingContent, Root } from "mdast";
import { SITE_URL, TAGLINE } from "@/lib/site";

const fontDir = path.join(process.cwd(), "assets", "fonts");

Font.register({
  family: "Playfair",
  fonts: [
    { src: path.join(fontDir, "playfair-display-latin-400-normal.woff") },
    { src: path.join(fontDir, "playfair-display-latin-400-italic.woff"), fontStyle: "italic" },
    { src: path.join(fontDir, "playfair-display-latin-600-normal.woff"), fontWeight: 600 },
  ],
});
Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(fontDir, "inter-latin-400-normal.woff") },
    { src: path.join(fontDir, "inter-latin-500-normal.woff"), fontWeight: 500 },
    { src: path.join(fontDir, "inter-latin-600-normal.woff"), fontWeight: 600 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const C = {
  cream: "#FAFAF7",
  noir: "#1A1A1A",
  gris: "#555555",
  or: "#C9A84C",
  orTexte: "#7A6120",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.cream,
    color: C.noir,
    fontFamily: "Inter",
    fontSize: 10.5,
    lineHeight: 1.6,
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 64,
  },
  runningHead: {
    position: "absolute",
    top: 32,
    left: 64,
    right: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: C.gris,
    borderBottomWidth: 0.5,
    borderBottomColor: C.or,
    paddingBottom: 6,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 64,
    right: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: C.gris,
  },
  cover: {
    backgroundColor: C.cream,
    padding: 64,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  frame: {
    position: "absolute",
    top: 28,
    left: 28,
    right: 28,
    bottom: 28,
    borderWidth: 0.75,
    borderColor: C.noir,
  },
  kicker: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: C.orTexte,
    fontWeight: 500,
  },
  coverTitle: {
    fontFamily: "Playfair",
    fontSize: 38,
    lineHeight: 1.15,
    marginTop: 18,
  },
  coverSub: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 14,
    lineHeight: 1.5,
    color: C.gris,
    marginTop: 18,
  },
  rule: { width: 64, height: 2, backgroundColor: C.or, marginVertical: 22 },
  rubrique: {
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: C.orTexte,
    fontWeight: 600,
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1.5,
    borderTopColor: C.or,
  },
  h3: {
    fontFamily: "Playfair",
    fontSize: 19,
    lineHeight: 1.25,
    marginTop: 10,
    marginBottom: 12,
  },
  h4: { fontFamily: "Playfair", fontSize: 13, marginTop: 12, marginBottom: 6 },
  p: { marginBottom: 9, textAlign: "justify" },
  lead: { fontFamily: "Playfair", fontSize: 12.5, lineHeight: 1.55, marginBottom: 10 },
  quote: {
    borderLeftWidth: 2,
    borderLeftColor: C.or,
    paddingLeft: 12,
    marginVertical: 10,
    fontFamily: "Playfair",
    fontStyle: "italic",
    color: C.gris,
  },
  li: { flexDirection: "row", marginBottom: 5 },
  bullet: { width: 12, color: C.orTexte },
  hr: { alignSelf: "center", width: 40, height: 0.75, backgroundColor: C.or, marginVertical: 14 },
  link: { color: C.orTexte, textDecoration: "none" },
  caption: {
    marginTop: 18,
    padding: 12,
    borderWidth: 0.75,
    borderColor: C.or,
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 11,
  },
});

function Inline({ nodes }: { nodes: PhrasingContent[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.type) {
          case "text":
            return n.value;
          case "strong":
            return (
              <Text key={i} style={{ fontWeight: 600 }}>
                <Inline nodes={n.children} />
              </Text>
            );
          case "emphasis":
            return (
              <Text key={i} style={{ fontFamily: "Playfair", fontStyle: "italic" }}>
                <Inline nodes={n.children} />
              </Text>
            );
          case "link":
            return (
              <Link key={i} src={n.url} style={s.link}>
                <Inline nodes={n.children} />
              </Link>
            );
          case "inlineCode":
            return n.value;
          case "break":
            return "\n";
          default:
            return "children" in n ? <Inline key={i} nodes={(n as { children: PhrasingContent[] }).children} /> : null;
        }
      })}
    </>
  );
}

function Blocks({ nodes, breakRubriques = false }: { nodes: Content[]; breakRubriques?: boolean }) {
  let firstParagraphAfterTitle = false;
  let seenRubrique = false;
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.type) {
          case "heading": {
            if (n.depth <= 2) {
              firstParagraphAfterTitle = false;
              const pageBreak = breakRubriques && seenRubrique;
              seenRubrique = true;
              return (
                <Text key={i} break={pageBreak} style={[s.rubrique, pageBreak ? { marginTop: 0 } : {}]} minPresenceAhead={120}>
                  <Inline nodes={n.children} />
                </Text>
              );
            }
            firstParagraphAfterTitle = true;
            return (
              <Text key={i} style={n.depth === 3 ? s.h3 : s.h4} minPresenceAhead={80}>
                <Inline nodes={n.children} />
              </Text>
            );
          }
          case "paragraph": {
            const lead = firstParagraphAfterTitle;
            firstParagraphAfterTitle = false;
            return (
              <Text key={i} style={lead ? s.lead : s.p}>
                <Inline nodes={n.children} />
              </Text>
            );
          }
          case "blockquote":
            return (
              <View key={i} style={s.quote}>
                <Blocks nodes={n.children as Content[]} />
              </View>
            );
          case "list":
            return (
              <View key={i} style={{ marginBottom: 8 }}>
                {n.children.map((item, j) => (
                  <View key={j} style={s.li} wrap={false}>
                    <Text style={s.bullet}>{n.ordered ? `${j + 1}.` : "•"}</Text>
                    <View style={{ flex: 1 }}>
                      {item.children.map((c, k) =>
                        c.type === "paragraph" ? (
                          <Text key={k}>
                            <Inline nodes={c.children} />
                          </Text>
                        ) : (
                          <Blocks key={k} nodes={[c as Content]} />
                        )
                      )}
                    </View>
                  </View>
                ))}
              </View>
            );
          case "thematicBreak":
            return breakRubriques ? null : <View key={i} style={s.hr} />;
          default:
            return null;
        }
      })}
    </>
  );
}

export interface RevuePdfProps {
  kicker: string;
  label: string;
  title: string;
  subtitle?: string;
  dateLabel: string;
  body: string;
  url: string;
  legende?: string;
  breakRubriques?: boolean;
}

export function RevuePdf({ kicker, label, title, subtitle, dateLabel, body, url, legende, breakRubriques }: RevuePdfProps) {
  const tree = fromMarkdown(body) as Root;
  const fullUrl = `${SITE_URL}${url}`;

  return (
    <Document title={`${title} | Institut Jubël`} author="Institut Jubël" subject={kicker} creator="jubel.sn" language="fr">
      <Page size="A4" style={{ backgroundColor: C.cream }}>
        <View style={s.frame} fixed />
        <View style={s.cover}>
          <View>
            <Text style={s.kicker}>Institut Jubël</Text>
            <Text style={[s.kicker, { color: C.gris, marginTop: 6 }]}>{kicker}</Text>
          </View>
          <View>
            <Text style={[s.kicker, { fontSize: 9 }]}>{label}</Text>
            <Text style={s.coverTitle}>{title}</Text>
            <View style={s.rule} />
            {subtitle ? <Text style={s.coverSub}>{subtitle}</Text> : null}
            {dateLabel.toLowerCase() !== title.toLowerCase() ? (
              <Text style={{ marginTop: 22, fontSize: 9, letterSpacing: 1, color: C.gris }}>{dateLabel}</Text>
            ) : null}
          </View>
          <View>
            <Text style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 10, lineHeight: 1.5, color: C.gris, maxWidth: 380 }}>
              {TAGLINE}
            </Text>
            <Text style={{ fontSize: 8, marginTop: 10, color: C.orTexte }}>jubel.sn</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.runningHead} fixed>
          <Text>Institut Jubël · {kicker}</Text>
          <Text>{dateLabel}</Text>
        </View>
        {legende ? (
          <View style={s.caption}>
            <Text style={[s.kicker, { fontStyle: "normal", fontFamily: "Inter", marginBottom: 6 }]}>Le dessin de Jubël</Text>
            <Text>{legende}</Text>
          </View>
        ) : null}
        <Blocks nodes={tree.children as Content[]} breakRubriques={breakRubriques} />
        <View style={{ marginTop: 36, paddingTop: 14, borderTopWidth: 0.5, borderTopColor: C.or }} wrap={false}>
          <Text style={{ fontSize: 8.5, color: C.gris, lineHeight: 1.6 }}>
            Texte intégral en ligne :{" "}
            <Link src={fullUrl} style={s.link}>
              {fullUrl.replace("https://", "")}
            </Link>
            . Lecture libre, partage encouragé, reproduction avec mention de la source.
          </Text>
          <Text style={{ fontSize: 8.5, color: C.gris, marginTop: 4 }}>
            Institut Jubël, Dakar, Sénégal · contact@jubel.sn
          </Text>
        </View>
        <View style={s.footer} fixed>
          <Text>jubel.sn</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
