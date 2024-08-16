//ye likh rahe rahe validate karne ke liye matlb agar ham miss kar dete hai title lina,des lihna ,country likhna toh us case me error show karna chaiye isliye isko likh rahe hai hamloh if condition se v kar skate hai lekin uske liye bahut if conditon likhna parega so hamlog ye method use kar rahe hai

const Joi = require("joi");

const listingSchema = Joi.object({  //joi ke andar obj hoga uske andar listing hoga
    listing: Joi.object({
        title: Joi.string().required(),  //iska matlab hai ki title string hona chaiye and required field hai
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),  //ye reured field nhi hai qki mongo automatic image laga de raha hai
    }).required(),
});

module.exports = { listingSchema };