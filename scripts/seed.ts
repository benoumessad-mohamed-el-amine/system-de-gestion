/**
 * Run: npx tsx scripts/seed.ts
 * Seeds admin user, branch, categories, brands, and sample products.
 */
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/pos_system";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const { User } = await import("../src/models/User");
  const { Branch } = await import("../src/models/Branch");
  const { Category } = await import("../src/models/Category");
  const { Brand } = await import("../src/models/Brand");
  const { Product } = await import("../src/models/Product");
  const { Settings } = await import("../src/models/Settings");
  const { Role } = await import("../src/models/Role");
  const { Customer } = await import("../src/models/Customer");
  const { Supplier } = await import("../src/models/Supplier");
  const { Sale } = await import("../src/models/Sale");
  const { Purchase } = await import("../src/models/Purchase");
  const { Expense } = await import("../src/models/Expense");
  const { Notification } = await import("../src/models/Notification");

  await Promise.all([
    User.deleteMany({}),
    Branch.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Product.deleteMany({}),
    Settings.deleteMany({}),
    Role.deleteMany({}),
    Customer.deleteMany({}),
    Supplier.deleteMany({}),
    Sale.deleteMany({}),
    Purchase.deleteMany({}),
    Expense.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // 1. Branches
  const branchMain = await Branch.create({
    name: "Magasin Principal (Alger)",
    code: "ALG-01",
    address: "12 Rue Didouche Mourad, Alger Centre",
    phone: "+213 21 63 00 00",
    isMain: true,
  });

  const branchOran = await Branch.create({
    name: "Succursale Oran",
    code: "ORN-02",
    address: "Boulevard de la Soummam, Oran",
    phone: "+213 41 33 22 11",
    isMain: false,
  });

  // 2. Roles
  await Role.create({
    name: "Administrateur",
    slug: "admin",
    permissions: [],
    isSystem: true,
  });

  // 3. Users
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@pos.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);
  const hashedCashierPassword = await bcrypt.hash("Cashier@123", 12);

  const userAdmin = await User.create({
    name: "Mohamed Amine",
    email: adminEmail,
    password: hashedAdminPassword,
    role: "admin",
    branchId: branchMain._id,
    isActive: true,
  });

  const userCashier = await User.create({
    name: "Karim Benali",
    email: "cashier@pos.local",
    password: hashedCashierPassword,
    role: "cashier",
    branchId: branchMain._id,
    isActive: true,
  });

  await User.create({
    name: "Sarah Mansouri",
    email: "sarah@pos.local",
    password: hashedCashierPassword,
    role: "manager",
    branchId: branchMain._id,
    isActive: true,
  });

  await User.create({
    name: "Youcef Ziani",
    email: "youcef@pos.local",
    password: hashedCashierPassword,
    role: "cashier",
    branchId: branchOran._id,
    isActive: true,
  });

  // 4. Store Settings
  await Settings.create({
    storeName: "RetailPOS Algérie",
    storeAddress: "12 Rue Didouche Mourad, Alger Centre",
    storePhone: "+213 21 63 00 00",
    storeEmail: "contact@retailpos.dz",
    currency: "DZD",
    currencySymbol: "DA",
    taxRate: 19,
    taxName: "TVA",
    language: "fr",
    invoicePrefix: "FAC",
    invoiceFooter: "Merci pour votre confiance ! À bientôt.",
    lowStockAlert: true,
    theme: "system",
    branchId: branchMain._id,
  });

  // 5. Categories
  const catTech = await Category.create({ name: "Informatique & Laptops", slug: "informatique-laptops", branchId: branchMain._id });
  const catMobile = await Category.create({ name: "Smartphones & Tablettes", slug: "smartphones-tablettes", branchId: branchMain._id });
  const catAccessory = await Category.create({ name: "Accessoires Mobile", slug: "accessoires-mobile", branchId: branchMain._id });
  const catAudio = await Category.create({ name: "Audio & Casques", slug: "audio-casques", branchId: branchMain._id });
  const catStorage = await Category.create({ name: "Stockage & Disques", slug: "stockage-disques", branchId: branchMain._id });
  const catOffice = await Category.create({ name: "Fournitures de Bureau", slug: "fournitures-bureau", branchId: branchMain._id });

  // 6. Brands
  const brandLogitech = await Brand.create({ name: "Logitech", slug: "logitech" });
  const brandSamsung = await Brand.create({ name: "Samsung", slug: "samsung" });
  const brandAnker = await Brand.create({ name: "Anker", slug: "anker" });
  const brandApple = await Brand.create({ name: "Apple", slug: "apple" });
  const brandDell = await Brand.create({ name: "Dell", slug: "dell" });
  const brandXiaomi = await Brand.create({ name: "Xiaomi", slug: "xiaomi" });
  const brandCondor = await Brand.create({ name: "Condor", slug: "condor" });
  const brandGeneric = await Brand.create({ name: "Générique", slug: "generique" });

  // 7. Products
  const productsData = [
    { name: "Souris Sans Fil Logitech M185", price: 2800, cost: 1800, stock: 45, categoryId: catTech._id, brandId: brandLogitech._id },
    { name: "Clavier Mécanique Redragon K552", price: 6500, cost: 4200, stock: 12, categoryId: catTech._id, brandId: brandGeneric._id },
    { name: "Laptop Dell Vostro 3520 i5 12th", price: 92000, cost: 78000, stock: 6, categoryId: catTech._id, brandId: brandDell._id },
    { name: "Samsung Galaxy A55 5G (128Go)", price: 58000, cost: 46000, stock: 15, categoryId: catMobile._id, brandId: brandSamsung._id },
    { name: "Xiaomi Redmi Note 13 Pro (256Go)", price: 42000, cost: 33000, stock: 22, categoryId: catMobile._id, brandId: brandXiaomi._id },
    { name: "Condor Allure M3 (Local)", price: 18500, cost: 12000, stock: 8, categoryId: catMobile._id, brandId: brandCondor._id },
    { name: "Câble USB-C Rapide Anker 1.8m", price: 1200, cost: 650, stock: 100, categoryId: catAccessory._id, brandId: brandAnker._id },
    { name: "Pochette Silicone Anti-Choc Galaxy", price: 1500, cost: 600, stock: 85, categoryId: catAccessory._id, brandId: brandGeneric._id },
    { name: "Film Verre Trempé Incassable", price: 800, cost: 250, stock: 3, categoryId: catAccessory._id, brandId: brandGeneric._id }, // Low stock
    { name: "Écouteurs Bluetooth Samsung Buds FE", price: 14500, cost: 9800, stock: 18, categoryId: catAudio._id, brandId: brandSamsung._id },
    { name: "AirPods Pro 2ème Génération", price: 38000, cost: 29000, stock: 5, categoryId: catAudio._id, brandId: brandApple._id },
    { name: "Power Bank Anker 20000mAh", price: 6800, cost: 4200, stock: 30, categoryId: catAccessory._id, brandId: brandAnker._id },
    { name: "Disque Dur Externe WD Elements 1To", price: 8500, cost: 6000, stock: 25, categoryId: catStorage._id, brandId: brandGeneric._id },
    { name: "Disque SSD NVMe Kingston 1To", price: 11000, cost: 7800, stock: 16, categoryId: catStorage._id, brandId: brandGeneric._id },
    { name: "Support PC Portable Aluminium", price: 4200, cost: 2600, stock: 14, categoryId: catTech._id, brandId: brandGeneric._id },
    { name: "Câble HDMI 4K High-Speed 2m", price: 1800, cost: 900, stock: 50, categoryId: catTech._id, brandId: brandGeneric._id },
    { name: "Rame de Papier A4 80g (500 feuilles)", price: 1100, cost: 750, stock: 2, categoryId: catOffice._id, brandId: brandGeneric._id }, // Low stock
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const sku = `SKU-${slug.toUpperCase().slice(0, 8)}`;
    const product = await Product.create({
      name: p.name,
      slug,
      sku,
      barcode: `${Date.now()}${Math.floor(Math.random() * 999)}`.slice(0, 13),
      categoryId: p.categoryId,
      brandId: p.brandId,
      costPrice: p.cost,
      sellingPrice: p.price,
      stock: p.stock,
      lowStockThreshold: 5,
      taxRate: 19,
      branchId: branchMain._id,
      isActive: true,
    });
    createdProducts.push(product);
  }

  // 8. Customers
  const customerPassager = await Customer.create({ name: "Client Passager", phone: "0550 00 00 00", loyaltyPoints: 0 });
  const customerYacine = await Customer.create({ name: "Yacine Brahimi", email: "yacine.brahimi@mail.dz", phone: "+213 550 12 34 56", loyaltyPoints: 340, dueBalance: 0 });
  const customerHamidi = await Customer.create({ name: "EURL Hamidi Commerce (Biskra)", email: "hamidi.grossiste@mail.dz", phone: "+213 661 98 76 54", loyaltyPoints: 1450, dueBalance: 45000 });
  const customerSofiane = await Customer.create({ name: "Sofiane Feghouli", email: "sofiane.f@mail.dz", phone: "+213 770 45 67 89", loyaltyPoints: 120, dueBalance: 0 });
  const customerAmel = await Customer.create({ name: "Amel Larbaoui", email: "amel.larbaoui@mail.dz", phone: "+213 555 88 99 00", loyaltyPoints: 90, dueBalance: 1200 });

  // 9. Suppliers
  const supplierAHT = await Supplier.create({ name: "SARL Algérie High Tech", company: "AHT Distribution", email: "contact@hightech.dz", phone: "+213 23 45 67 89" });
  const supplierAffroun = await Supplier.create({ name: "Grossiste Informatique El Affroun", company: "El Affroun Import", email: "ventes@elaffroun-import.dz", phone: "+213 25 34 12 00" });
  const supplierBMS = await Supplier.create({ name: "EURL Biskra Multi-Services", company: "BMS Algérie", email: "bms.algerie@mail.dz", phone: "+213 33 70 11 22" });

  // 10. Sales (Past 30 Days)
  const salesToCreate = [
    {
      invoiceNumber: "FAC-2408-0001",
      customer: customerYacine,
      cashier: userCashier,
      items: [
        { product: createdProducts[3], qty: 1 }, // Galaxy A55
        { product: createdProducts[6], qty: 1 }, // Cable Anker
        { product: createdProducts[7], qty: 1 }, // Pochette
      ],
      method: "Carte Edahabia / CIB",
      daysAgo: 12,
    },
    {
      invoiceNumber: "FAC-2408-0002",
      customer: customerPassager,
      cashier: userCashier,
      items: [
        { product: createdProducts[0], qty: 2 }, // Souris Logitech
        { product: createdProducts[15], qty: 1 }, // Cable HDMI
      ],
      method: "Espèces",
      daysAgo: 10,
    },
    {
      invoiceNumber: "FAC-2408-0003",
      customer: customerHamidi,
      cashier: userAdmin,
      items: [
        { product: createdProducts[2], qty: 1 }, // Dell Vostro
        { product: createdProducts[12], qty: 2 }, // Disque Dur 1To
      ],
      method: "Chèque Bancaire",
      daysAgo: 8,
    },
    {
      invoiceNumber: "FAC-2408-0004",
      customer: customerSofiane,
      cashier: userCashier,
      items: [
        { product: createdProducts[9], qty: 1 }, // Buds FE
        { product: createdProducts[11], qty: 1 }, // Power Bank
      ],
      method: "Espèces",
      daysAgo: 5,
    },
    {
      invoiceNumber: "FAC-2408-0005",
      customer: customerAmel,
      cashier: userCashier,
      items: [
        { product: createdProducts[4], qty: 1 }, // Redmi Note 13
        { product: createdProducts[8], qty: 1 }, // Verre trempe
      ],
      method: "Carte Edahabia / CIB",
      daysAgo: 2,
    },
    {
      invoiceNumber: "FAC-2408-0006",
      customer: customerPassager,
      cashier: userCashier,
      items: [
        { product: createdProducts[0], qty: 1 }, // Souris Logitech
        { product: createdProducts[13], qty: 1 }, // SSD NVMe
      ],
      method: "Espèces",
      daysAgo: 1,
    },
  ];

  for (const s of salesToCreate) {
    let subtotal = 0;
    const saleItems = s.items.map((it) => {
      const itemSubtotal = it.product.sellingPrice * it.qty;
      subtotal += itemSubtotal;
      return {
        productId: it.product._id,
        name: it.product.name,
        sku: it.product.sku,
        quantity: it.qty,
        price: it.product.sellingPrice,
        discount: 0,
        tax: Math.round(itemSubtotal * 0.19),
        subtotal: itemSubtotal,
      };
    });

    const taxTotal = Math.round(subtotal * 0.19);
    const total = subtotal + taxTotal;
    const date = new Date(Date.now() - s.daysAgo * 24 * 60 * 60 * 1000);

    await Sale.create({
      invoiceNumber: s.invoiceNumber,
      items: saleItems,
      subtotal,
      discount: 0,
      tax: taxTotal,
      total,
      payments: [{ method: s.method, amount: total }],
      customerId: s.customer._id,
      cashierId: s.cashier._id,
      branchId: branchMain._id,
      status: "completed",
      createdAt: date,
      updatedAt: date,
    });
  }

  // 11. Purchases (Supplier Orders)
  await Purchase.create([
    {
      purchaseNumber: "ACH-2408-01",
      supplierId: supplierAHT._id,
      items: [
        { productId: createdProducts[3]._id, name: createdProducts[3].name, quantity: 10, cost: 46000, subtotal: 460000 },
        { productId: createdProducts[9]._id, name: createdProducts[9].name, quantity: 15, cost: 9800, subtotal: 147000 },
      ],
      subtotal: 607000,
      tax: 115330,
      total: 722330,
      paid: 722330,
      status: "received",
      branchId: branchMain._id,
      notes: "Livraison conforme reçue à Alger Centre.",
      receivedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      purchaseNumber: "ACH-2408-02",
      supplierId: supplierAffroun._id,
      items: [
        { productId: createdProducts[0]._id, name: createdProducts[0].name, quantity: 50, cost: 1800, subtotal: 90000 },
        { productId: createdProducts[13]._id, name: createdProducts[13].name, quantity: 20, cost: 7800, subtotal: 156000 },
      ],
      subtotal: 246000,
      tax: 46740,
      total: 292740,
      paid: 292740,
      status: "received",
      branchId: branchMain._id,
      notes: "Commande d'accessoires et stockage.",
      receivedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  // 12. Expenses
  await Expense.create([
    { title: "Loyer Local Didouche Mourad", category: "Loyer", amount: 120000, date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), description: "Loyer mensuel du magasin principal", branchId: branchMain._id, createdBy: userAdmin._id },
    { title: "Facture Sonelgaz Électricité", category: "Services Publics", amount: 18500, date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), description: "Facture électricité bimestrielle", branchId: branchMain._id, createdBy: userAdmin._id },
    { title: "Abonnement Fibre Algérie Télécom", category: "Internet & Télécom", amount: 12000, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), description: "Abonnement mensuel Idoom Fibre Pro", branchId: branchMain._id, createdBy: userAdmin._id },
    { title: "Salaire Caissier Karim Benali", category: "Salaires", amount: 48000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), description: "Salaire du mois en cours", branchId: branchMain._id, createdBy: userAdmin._id },
    { title: "Fournitures d'Entretien & Produits", category: "Maintenance", amount: 4500, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), description: "Produits de nettoyage et sacs emballage", branchId: branchMain._id, createdBy: userAdmin._id },
  ]);

  // 13. Notifications
  await Notification.create([
    { title: "Alerte Stock Bas", message: "Le produit 'Film Verre Trempé Incassable' est à 3 unités restantes.", type: "low_stock", isRead: false, branchId: branchMain._id },
    { title: "Alerte Stock Bas", message: "Le produit 'Rame de Papier A4 80g' est à 2 unités restantes.", type: "low_stock", isRead: false, branchId: branchMain._id },
    { title: "Vente Enregistrée", message: "Facture FAC-2408-0005 d'un montant de 50 932 DA effectuée par Karim Benali.", type: "sale", isRead: true, branchId: branchMain._id },
    { title: "Livraison Reçue", message: "Commande ACH-2408-02 reçue de Grossiste Informatique El Affroun.", type: "success", isRead: true, branchId: branchMain._id },
  ]);

  console.log("\n✅ Seed complete!");
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
  console.log("   Cashier: cashier@pos.local / Cashier@123");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
