const mongoose = require("mongoose");
const { productModel } = require("../src/models/productModel");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

async function validate() {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("Connecting database...");
    await mongoose.connect(mongoUri);
    
    const products = await productModel.find({});
    console.log(`Count: ${products.length} products found.`);
    
    let validCount = 0;
    let emptyCount = 0;
    
    for (const p of products) {
      if (p.images && p.images.length > 0) {
        const hasValidUrls = p.images.every(url => url.startsWith("https://res.cloudinary.com/"));
        if (hasValidUrls) {
          validCount++;
        } else {
          console.error(`[INVALID URL] Product: "${p.name}", images:`, p.images);
        }
      } else {
        console.error(`[EMPTY IMAGES] Product: "${p.name}" has no images.`);
        emptyCount++;
      }
    }
    
    console.log("=================================");
    console.log(`Verification:`);
    console.log(`- Total products in DB : ${products.length}`);
    console.log(`- Valid Cloudinary URLs: ${validCount}`);
    console.log(`- Empty images arrays  : ${emptyCount}`);
    console.log("=================================");
    
    if (products.length === 30 && validCount === 30 && emptyCount === 0) {
      console.log("DATABASE VERIFICATION PASSED SUCCESSFULLY!");
    } else {
      console.error("DATABASE VERIFICATION FAILED!");
    }
  } catch (error) {
    console.error("Validation script failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}
validate();
