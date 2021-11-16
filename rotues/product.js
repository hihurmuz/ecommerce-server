const router = require('express').Router();
const Product = require("../models/product");

router.post("/product", async (req,res)=>{
  try {
      if(req.body.multiData){
        Product.insertMany(req.body.multiData, (err) =>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    success:true,        
                    message:"products are saved succesfully ..",
                    products: req.body.multiData
                });
            }
        })
      } else{
        let product = new Product();
        product.title = req.body.title;
        product.price = req.body.price;
        product.stockNumber =  req.body.stockNumber;
        product.summary =  req.body.summary;
        product.rating = req.body.rating,
        product.features =  req.body.features;
        product.description= req.body.description;
        product.photo = req.body.photo;
        product.mainCategory = req.body.mainCategory;
        product.subCategory = req.body.subCategory;

        await product.save();
        res.json({
            success:true,        
            message:"product is saved succesfully ..",
            product:product
        });
      }      
  } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    })
  }
 }
);

router.get("/product/list",async (req,res)=>{
    try {
        const pageOptions = {
            page: parseInt(req.query.page) || 0,
            limit: parseInt(req.query.limit) || 10,
        }
        await Product.find()
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit)
            .exec((err, result) => {
                Product.countDocuments().exec((err, count) => {
                    res.json({
                        success:true,         
                        ...pageOptions,
                        allProductNumber: count,
                        totalPageNumber: Math.ceil( count/ pageOptions.limit), 
                        result,
                    });
                })
            })
            
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
});

router.get("/product/:id",async (req,res)=>{
    try {
        let product = await Product.findOne({_id:req.params.id});
        res.json({
            success:true,            
            product:product
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
});

router.put("/product/:id",async (req,res)=>{
    try {
        await Product.findOneAndUpdate({_id:req.params.id},{
            $set:{
                title : req.body.title,
                price : req.body.price,
                stockNumber :  req.body.stockNumber,
                description : req.body.description,
                summary :  req.body.summary,
                rating: req.body.rating,
                features :  req.body.features,
                photo : req.body.photo,
                mainCategory : req.body.mainCategory,
                subCategory : req.body.subCategory,
            }
        },{upsert:true});
        res.json({
            success: true,            
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
});

router.delete("/product/:id",async (req,res)=>{
    try {
        await Product.findOneAndDelete({_id:req.params.id});
        res.json({
            success:true,            
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
});

module.exports = router;