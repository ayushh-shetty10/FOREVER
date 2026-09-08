require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const http = require("http");
const { app } = require("../src/app");
const { connectDB } = require("../src/db/db");
const { connectCloudinary } = require("../src/services/cloudinary");

async function runTest() {
  try {
    await connectDB();
    await connectCloudinary();
    
    const port = process.env.PORT || 4000;
    const server = app.listen(port, () => {
      console.log(`Verification server running on port ${port}`);
      
      http.get(`http://localhost:${port}/api/product/listProducts`, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            console.log(`API response status code: ${res.statusCode}`);
            console.log(`API success: ${parsed.success}`);
            console.log(`Number of products: ${parsed.products ? parsed.products.length : 0}`);
            
            let allHaveImages = true;
            if (parsed.products) {
              parsed.products.forEach(p => {
                if (!p.images || p.images.length === 0) {
                  allHaveImages = false;
                  console.error(`Product ${p.name} has empty images.`);
                }
              });
            }
            
            if (res.statusCode === 203 && parsed.success && parsed.products && parsed.products.length === 30 && allHaveImages) {
              console.log("API VERIFICATION PASSED SUCCESSFULLY!");
              server.close(() => {
                console.log("Server closed.");
                process.exit(0);
              });
            } else {
              console.error("API VERIFICATION FAILED!");
              server.close(() => {
                process.exit(1);
              });
            }
          } catch (e) {
            console.error("Failed to parse API response:", e);
            server.close(() => {
              process.exit(1);
            });
          }
        });
      }).on("error", (err) => {
        console.error("HTTP request error:", err);
        server.close(() => {
          process.exit(1);
        });
      });
    });
  } catch (error) {
    console.error("Verification startup error:", error);
    process.exit(1);
  }
}

runTest();
