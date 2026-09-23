import { renderToBuffer } from "@react-pdf/renderer";
import { RevuePdf, RevuePdfProps } from "./RevuePdf";

export async function pdfResponse(props: RevuePdfProps, filename: string): Promise<Response> {
  const buffer = await renderToBuffer(<RevuePdf {...props} />);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
