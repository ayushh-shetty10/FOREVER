const { productModel } = require("../models/productModel");

const cloudinary = require("cloudinary").v2;

/**
 * @router POST:api/product/addProduct
 * @description 
 * adds a new product.
 */
const addProduct = async(req,res)=>{
  try{
    const {name,description,price,category,subCategory,sizes,bestseller,totalStock}= req.body;

    const files = req.files || {};
    const images = [
      files.image1 && files.image1[0],
      files.image2 && files.image2[0],
      files.image3 && files.image3[0],
      files.image4 && files.image4[0],
    ].filter((item) => item !== undefined);

    if (images.length === 0) {
      return res.status(400).json({
        message:
          "No product images were received. Send multipart/form-data files named image1, image2, image3, and/or image4.",
      });
    }

    let imagesUrl = await Promise.all(
        images.map(async(image)=>{
            if (!image.path) {
                throw new Error(`Uploaded file ${image.originalname} is missing a local path`);
            }
            let result = await cloudinary.uploader.upload(image.path,{
                resource_type:"image"
            })  
            return result.secure_url;
  }))

  const stockVal = totalStock !== undefined ? Number(totalStock) : 10;

  const product  = await productModel.create({
    name,
    description,
    price:Number(price),
    category,
    subCategory,
    sizes:JSON.parse(sizes),
    bestseller:bestseller==="true"?true:false,
    images:imagesUrl,
    totalStock: stockVal,
    reservedStock: 0,
    availableStock: stockVal,
    date:Date.now()
  })

  return res.status(201).json({
    message:"Product added successfully!",
    product,
  })
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
        message:err.message,
    })
  }
}

/**
 * @router GET api/product/listProducts
 * @description getting all the products from db.
 * 
 */
const listProducts = async(req,res)=>{
  try{
    const products = await productModel.find({});
    

    return res.status(203).json({
        message:"Products fetched successfully",
        success:true,
        products,
    })
  }catch(error){
    console.log(error.message);
    return res.status(403).json({
      message:"Error fetching products",
    })
  }
}

/**
 * @router POST api/product/removeProduct
 * @description deletes the product from the db using its id.
 */
const removeProduct = async(req,res)=>{
  try{
   const product = await productModel.findByIdAndDelete(req.body.id);
  
   if(!product){
    return res.status(404).json({
      message:"Product not found",
    })
   }

    return res.status(203).json({
      message:"Product removed successfully",
    })
  }catch(error){
    console.log(error.message);
    return res.status(403).json({
      message:"Error removing product",
    })
  }
}

/**
 * @router POST api/product/getProductInfo
 * @description gets a product details based on its id.
 */
const getProduct = async(req,res)=>{
  try{
    const product = await productModel.findById(req.body.id);
    
    if(!product){
      return res.status(404).json({
        message:"Product not found",
      })
    }
    return res.status(203).json({
      message:"product fetched successfully",
      product
    })
  }catch(error){
    console.log(error.message);
    return res.status(403).json({
      message:"Error fetching product details",
    })
  }
} 

/**
 * @router POST api/product/updateBestseller
 * @description updates the bestseller boolean status of a product by ID.
 */
const updateBestseller = async (req, res) => {
  try {
    const { id, bestseller } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (typeof bestseller !== "boolean") {
      return res.status(400).json({
        message: "Bestseller status must be a boolean",
      });
    }

    const product = await productModel.findByIdAndUpdate(
      id,
      { bestseller },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Bestseller status updated successfully!",
      product,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Error updating bestseller status",
    });
  }
};

module.exports={addProduct,listProducts,removeProduct,getProduct,updateBestseller};