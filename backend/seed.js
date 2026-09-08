require("dotenv").config();
const mongoose = require("mongoose");
const { productModel } = require("./src/models/productModel");

// 30 saree products based on specifications
const productsData = [
  {
    name: "Royal Maroon Kanjivaram Silk Saree",
    category: "Silk Sarees",
    subCategory: "Kanjivaram",
    price: 8499,
    description: "A rich maroon silk saree featuring an elegant antique-gold border and subtle traditional motifs. A sophisticated choice for weddings and festive celebrations.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Emerald Heritage Kanjivaram Saree",
    category: "Silk Sarees",
    subCategory: "Kanjivaram",
    price: 9299,
    description: "An elegant emerald green silk saree with a refined gold zari-inspired border and understated woven motifs, designed for sophisticated wedding occasions.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Midnight Blue Banarasi Silk Saree",
    category: "Silk Sarees",
    subCategory: "Banarasi",
    price: 7899,
    description: "A deep midnight blue silk saree featuring intricate gold-inspired woven patterns and a graceful traditional border.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Rose Gold Banarasi Silk Saree",
    category: "Silk Sarees",
    subCategory: "Banarasi",
    price: 8799,
    description: "A softly luminous rose-gold silk saree with delicate traditional motifs and a refined metallic border, balancing classic elegance with a contemporary feel.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Mustard Mysore Silk Saree",
    category: "Silk Sarees",
    subCategory: "Mysore Silk",
    price: 6499,
    description: "A warm mustard silk saree with a clean traditional border and understated detailing, perfect for festive daytime occasions.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Plum Royal Silk Saree",
    category: "Silk Sarees",
    subCategory: "Mysore Silk",
    price: 7249,
    description: "A sophisticated deep plum silk saree with subtle woven detailing and a graceful contrasting border for evening celebrations.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Natural Beige Handloom Saree",
    category: "Handloom Sarees",
    subCategory: "Handloom Cotton",
    price: 3299,
    description: "A minimal natural beige handloom cotton saree with a delicate contrasting border, offering an understated and timeless everyday look.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Indigo Loom Cotton Saree",
    category: "Handloom Sarees",
    subCategory: "Handloom Cotton",
    price: 2899,
    description: "A deep indigo handloom cotton saree with a clean woven border and relaxed drape, combining everyday comfort with refined craftsmanship-inspired styling.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Rust Orange Handloom Saree",
    category: "Handloom Sarees",
    subCategory: "Handloom Cotton",
    price: 3499,
    description: "A warm rust-orange cotton saree with subtle woven texture and a contrasting border, ideal for relaxed festive dressing.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Forest Green Chanderi Saree",
    category: "Handloom Sarees",
    subCategory: "Chanderi",
    price: 4699,
    description: "A graceful forest green Chanderi saree with a lightweight appearance and delicate traditional border detailing.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Dusty Rose Chanderi Saree",
    category: "Handloom Sarees",
    subCategory: "Chanderi",
    price: 4499,
    description: "A soft dusty-rose Chanderi saree with delicate woven detailing and a subtle border for graceful daytime occasions.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Deep Teal Handloom Saree",
    category: "Handloom Sarees",
    subCategory: "Handloom Cotton",
    price: 3799,
    description: "A rich deep-teal handloom cotton saree with a restrained border and naturally textured appearance.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Ivory Mulmul Cotton Saree",
    category: "Cotton Sarees",
    subCategory: "Mulmul Cotton",
    price: 1899,
    description: "A lightweight ivory cotton saree with a clean minimal border and effortless drape, designed for comfortable everyday elegance.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Bengal White Cotton Saree",
    category: "Cotton Sarees",
    subCategory: "Bengal Cotton",
    price: 2299,
    description: "A classic white cotton saree accented with a traditional red border, bringing a timeless Indian aesthetic to festive and cultural occasions.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Sky Blue Kota Cotton Saree",
    category: "Cotton Sarees",
    subCategory: "Kota Cotton",
    price: 2499,
    description: "A light sky-blue Kota cotton saree with subtle texture and a clean border, ideal for graceful daytime dressing.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Terracotta Cotton Saree",
    category: "Cotton Sarees",
    subCategory: "Handloom Cotton",
    price: 2799,
    description: "A warm terracotta cotton saree with understated woven detailing and a refined contrasting border.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Champagne Embroidered Saree",
    category: "Designer Sarees",
    subCategory: "Embroidered",
    price: 6999,
    description: "A sophisticated champagne-toned saree featuring delicate embroidered detailing and an elegant flowing drape for evening occasions.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Burgundy Evening Designer Saree",
    category: "Designer Sarees",
    subCategory: "Party Wear",
    price: 5999,
    description: "A deep burgundy designer saree with subtle tonal embellishment and a sleek contemporary silhouette.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Sage Contemporary Saree",
    category: "Designer Sarees",
    subCategory: "Contemporary",
    price: 5499,
    description: "A modern sage-green organza saree with minimal detailing and a clean contemporary finish.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Black Midnight Designer Saree",
    category: "Designer Sarees",
    subCategory: "Party Wear",
    price: 6299,
    description: "A refined black designer saree featuring subtle tonal detailing and an elegant flowing silhouette for evening occasions.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Crimson Festive Silk Saree",
    category: "Festive Sarees",
    subCategory: "Festive",
    price: 6799,
    description: "A vibrant crimson saree with an elegant traditional border and subtle woven motifs, created for festive celebrations.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Royal Blue Wedding Saree",
    category: "Festive Sarees",
    subCategory: "Wedding",
    price: 7499,
    description: "A rich royal-blue saree with refined gold-inspired detailing and a graceful traditional drape suitable for wedding celebrations.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Peach Occasion Saree",
    category: "Festive Sarees",
    subCategory: "Occasion Wear",
    price: 4999,
    description: "A soft peach organza saree with delicate detailing and an airy drape, perfect for elegant daytime celebrations.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Emerald Festive Saree",
    category: "Festive Sarees",
    subCategory: "Festive",
    price: 5899,
    description: "A rich emerald festive saree with a refined contrasting border and subtle traditional motifs.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Plum Wedding Zari Saree",
    category: "Festive Sarees",
    subCategory: "Wedding",
    price: 8299,
    description: "A deep plum wedding saree with intricate zari-inspired border detailing and a rich traditional appearance.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Ivory Floral Printed Saree",
    category: "Printed Sarees",
    subCategory: "Floral",
    price: 2499,
    description: "An ivory saree decorated with delicate floral prints in soft pink tones, offering a graceful contemporary look.",
    sizes: ["Free Size"],
    bestseller: true
  },
  {
    name: "Lavender Botanical Printed Saree",
    category: "Printed Sarees",
    subCategory: "Floral",
    price: 2699,
    description: "A graceful lavender chiffon saree featuring a subtle botanical print and lightweight flowing drape.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Terracotta Block Print Saree",
    category: "Printed Sarees",
    subCategory: "Block Print",
    price: 2899,
    description: "A warm terracotta and beige cotton saree featuring a tasteful block-print-inspired pattern and understated border.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Midnight Floral Digital Print Saree",
    category: "Printed Sarees",
    subCategory: "Digital Print",
    price: 3299,
    description: "A midnight-blue crepe saree featuring an elegant floral digital print and smooth contemporary drape.",
    sizes: ["Free Size"],
    bestseller: false
  },
  {
    name: "Sage Garden Printed Saree",
    category: "Printed Sarees",
    subCategory: "Floral",
    price: 2799,
    description: "A soft sage-green chiffon saree featuring a subtle garden-inspired floral print and an effortless flowing silhouette.",
    sizes: ["Free Size"],
    bestseller: false
  }
];

// Add timestamps and map Cloudinary images from uploaded-images.json
const fs = require("fs");
const path = require("path");

let uploadedImages = {};
const mappingFilePath = path.join(__dirname, "scripts", "uploaded-images.json");
if (fs.existsSync(mappingFilePath)) {
  try {
    uploadedImages = JSON.parse(fs.readFileSync(mappingFilePath, "utf-8"));
    console.log(`Successfully loaded ${Object.keys(uploadedImages).length} image mappings.`);
  } catch (err) {
    console.error("Failed to parse uploaded-images.json:", err);
  }
} else {
  console.warn(`Warning: '${mappingFilePath}' not found. Seeding products with empty images arrays.`);
}

const now = Date.now();
const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
const DEFAULT_TOTAL_STOCK = 10;

const seededProducts = productsData.map((prod, index) => {
  // Generate a timestamp where each subsequent product has a more recent timestamp
  const dateTimestamp = thirtyDaysAgo + index * 24 * 60 * 60 * 1000;
  const images = uploadedImages[prod.name] || [];
  const totalStock = prod.totalStock !== undefined ? prod.totalStock : DEFAULT_TOTAL_STOCK;
  const reservedStock = prod.reservedStock !== undefined ? prod.reservedStock : 0;
  const availableStock = prod.availableStock !== undefined ? prod.availableStock : (totalStock - reservedStock);

  return {
    ...prod,
    images: images,
    totalStock,
    reservedStock,
    availableStock,
    date: dateTimestamp
  };
});

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the backend .env file");
    }

    console.log("Connecting to MongoDB database...");
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully.");

    // Delete existing products
    console.log("Deleting existing products in collection...");
    const deleteCount = await productModel.deleteMany({});
    console.log(`Deleted ${deleteCount.deletedCount} existing products.`);

    // Insert new products
    console.log(`Seeding ${seededProducts.length} new saree products...`);
    const insertResult = await productModel.insertMany(seededProducts);
    console.log(`Successfully seeded ${insertResult.length} products!`);

    // Verify insertion
    const count = await productModel.countDocuments({});
    console.log(`Verification: Total products in database = ${count}`);

    // Print Category Distribution
    const categoryStats = await productModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    console.log("\nCategory Distribution:");
    categoryStats.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count} products`);
    });

    // Print Bestseller Count
    const bestsellerCount = await productModel.countDocuments({ bestseller: true });
    console.log(`\nBestseller Count: ${bestsellerCount}`);

    // Print Price Range
    const prices = seededProducts.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    console.log(`Price Range: ₹${minPrice} - ₹${maxPrice}`);

  } catch (error) {
    console.error("Seeding failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDatabase();
