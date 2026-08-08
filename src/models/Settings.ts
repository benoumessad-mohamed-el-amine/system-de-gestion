import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISettings extends Document {
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  logo?: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  taxName: string;
  language: string;
  invoicePrefix: string;
  invoiceFooter?: string;
  lowStockAlert: boolean;
  theme: "light" | "dark" | "system";
  branchId?: mongoose.Types.ObjectId;
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, default: "Gestion de Stock POS" },
    storeAddress: String,
    storePhone: String,
    storeEmail: String,
    logo: String,
    currency: { type: String, default: "DZD" },
    currencySymbol: { type: String, default: "DA" },
    taxRate: { type: Number, default: 19 },
    taxName: { type: String, default: "TVA" },
    language: { type: String, default: "fr" },
    invoicePrefix: { type: String, default: "FAC" },
    invoiceFooter: String,
    lowStockAlert: { type: Boolean, default: true },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch" },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings ??
  mongoose.model<ISettings>("Settings", SettingsSchema);
