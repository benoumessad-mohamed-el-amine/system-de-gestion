import { connectDB } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { requireAuth, requirePermission } from "@/lib/auth-helpers";
import { Settings } from "@/models/Settings";
import { settingsSchema } from "@/validations/settings.schema";

export async function GET() {
  try {
    await requireAuth();
    await connectDB();

    const settings = await Settings.findOne().lean();
    if (settings) {
      return apiSuccess(settings);
    }

    return apiSuccess({
      storeName: "RetailPOS Algérie",
      storeAddress: "12 Rue Didouche Mourad, Alger Centre",
      storePhone: "+213 21 63 00 00",
      storeEmail: "contact@retailpos.dz",
      logo: "",
      currency: "DZD",
      currencySymbol: "DA",
      taxRate: 19,
      taxName: "TVA",
      language: "fr",
      invoicePrefix: "FAC",
      invoiceFooter: "Merci pour votre confiance ! À bientôt.",
      lowStockAlert: true,
      theme: "system",
    });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Failed to load settings", 401);
  }
}

export async function PUT(req: Request) {
  try {
    await requirePermission("settings.manage");
    await connectDB();

    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid settings data");
    }

    await Settings.updateOne({}, parsed.data, { upsert: true });
    const updated = await Settings.findOne().lean();

    return apiSuccess(updated ?? parsed.data, "Settings saved");
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Failed to save settings", 400);
  }
}
