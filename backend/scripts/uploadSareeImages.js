const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Normalization function: returns string with only lowercase alphanumeric characters
function normalizeName(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

// Product list from seed.js
const productNames = [
  "Royal Maroon Kanjivaram Silk Saree",
  "Emerald Heritage Kanjivaram Saree",
  "Midnight Blue Banarasi Silk Saree",
  "Rose Gold Banarasi Silk Saree",
  "Mustard Mysore Silk Saree",
  "Plum Royal Silk Saree",
  "Natural Beige Handloom Saree",
  "Indigo Loom Cotton Saree",
  "Rust Orange Handloom Saree",
  "Forest Green Chanderi Saree",
  "Dusty Rose Chanderi Saree",
  "Deep Teal Handloom Saree",
  "Ivory Mulmul Cotton Saree",
  "Bengal White Cotton Saree",
  "Sky Blue Kota Cotton Saree",
  "Terracotta Cotton Saree",
  "Champagne Embroidered Saree",
  "Burgundy Evening Designer Saree",
  "Sage Contemporary Saree",
  "Black Midnight Designer Saree",
  "Crimson Festive Silk Saree",
  "Royal Blue Wedding Saree",
  "Peach Occasion Saree",
  "Emerald Festive Saree",
  "Plum Wedding Zari Saree",
  "Ivory Floral Printed Saree",
  "Lavender Botanical Printed Saree",
  "Terracotta Block Print Saree",
  "Midnight Floral Digital Print Saree",
  "Sage Garden Printed Saree"
];

const IMAGES_DIR = "C:\\Users\\ayush\\OneDrive\\Documents\\SareeImages";
const MAPPING_FILE = path.join(__dirname, "uploaded-images.json");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function runUpload() {
  // Read existing mappings
  let mappings = {};
  if (fs.existsSync(MAPPING_FILE)) {
    try {
      mappings = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
      console.log(`Loaded ${Object.keys(mappings).length} existing mappings from ${MAPPING_FILE}`);
    } catch (err) {
      console.error("Error reading mapping file, starting fresh", err);
    }
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Images directory does not exist at: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGES_DIR);
  console.log(`Found ${files.length} files in ${IMAGES_DIR}`);

  const imageExtensions = [".webp", ".jpg", ".jpeg"];
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
  console.log(`Filtered to ${imageFiles.length} image files`);

  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const file of imageFiles) {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext); // e.g. RoyalMaroonKanjivaramSilkSaree_image1 or IvoryMulmulCottonSaree_iamge1
    
    // Clean name by removing _image(\d+) or _iamge(\d+) suffix
    const cleanBaseName = baseName.replace(/_(image|iamge)\d+$/i, "");
    const normalizedBase = normalizeName(cleanBaseName);
    
    // Find matching product name
    const matchedProductName = productNames.find(name => normalizeName(name) === normalizedBase);
    
    if (!matchedProductName) {
      console.warn(`[WARNING] Could not match file "${file}" (normalized: "${normalizedBase}") to any product name. Skipping.`);
      failedCount++;
      continue;
    }
    
    // Generate deterministic public ID
    const productSlug = matchedProductName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const suffixMatch = baseName.match(/_(image|iamge)(\d+)$/i);
    const imageNum = suffixMatch ? `image${suffixMatch[2]}` : "image1";
    const publicId = `saree-store/products/${productSlug}_${imageNum}`;
    const filePath = path.join(IMAGES_DIR, file);

    // Skip if already in mappings file with a valid URL
    if (mappings[matchedProductName] && mappings[matchedProductName].length > 0) {
      console.log(`[SKIPPED] "${matchedProductName}" already uploaded: ${mappings[matchedProductName][0]}`);
      skippedCount++;
      continue;
    }

    console.log(`[UPLOADING] "${matchedProductName}" from "${file}"...`);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        resource_type: "image",
      });
      
      console.log(`[SUCCESS] Uploaded "${file}". URL: ${result.secure_url}`);
      
      mappings[matchedProductName] = [result.secure_url];
      
      // Update mappings file in real-time
      fs.writeFileSync(MAPPING_FILE, JSON.stringify(mappings, null, 2), "utf-8");
      successCount++;
    } catch (error) {
      console.error(`[FAILED] Upload of "${file}" failed:`, error.message);
      failedCount++;
    }
  }

  console.log("\n=================================");
  console.log("UPLOAD SUMMARY:");
  console.log(`Total Image Files Found: ${imageFiles.length}`);
  console.log(`Successfully Uploaded  : ${successCount}`);
  console.log(`Skipped (Already Done) : ${skippedCount}`);
  console.log(`Failed / Unmatched     : ${failedCount}`);
  console.log("=================================\n");
}

runUpload();
