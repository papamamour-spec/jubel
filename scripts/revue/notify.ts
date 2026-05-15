export async function notifyAdmin(
  date: string,
  success: boolean,
  details: string
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!adminEmail || !resendKey) {
    console.log("[notify] No ADMIN_EMAIL or RESEND_API_KEY, skipping notification");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Jubël Bot <bot@jubel.sn>",
      to: adminEmail,
      subject: success
        ? `Revue du ${date} publiée`
        : `ALERTE : Revue du ${date} en échec`,
      text: details,
    });

    console.log(`[notify] Email sent to ${adminEmail}`);
  } catch (err) {
    console.error(`[notify] Failed to send email: ${err}`);
  }
}
