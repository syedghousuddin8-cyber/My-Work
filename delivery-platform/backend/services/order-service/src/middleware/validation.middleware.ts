import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const orderSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  vendorId: Joi.string().uuid().required(),
  category: Joi.string().valid('food', 'grocery', 'pharmacy', 'meat_seafood', 'retail').required(),
  deliveryAddressId: Joi.string().uuid().required(),
  deliveryAddress: Joi.object().required(),
  items: Joi.array().items(Joi.object()).min(1).required(),
  specialInstructions: Joi.string().allow(''),
  categorySpecificData: Joi.object(),
});

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { error } = orderSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }

  next();
};
