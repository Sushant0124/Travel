const Joi=require("joi");
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        image: Joi.string().uri().optional(),
        price: Joi.number().optional(),
        location: Joi.string().optional(),
        country: Joi.string().optional()
    }).required()
});
const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(0).max(5),
        comment:Joi.string().required(),


    }).required(),
});
module.exports=listingSchema;
module.exports=reviewSchema;
