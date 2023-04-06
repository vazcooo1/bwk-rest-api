import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  sku_ML: string;
  regular_price_BWK: number;
  regular_price_ATO: number;
  stock_quantity_BWK: number;
  stock_quantity_ATO: number;
  price_ML: number;
  stock_ML: number;
}

const ProductSchema: Schema = new Schema({
  sku: {
    type: String,
    index: true,
  },
  sku_ML: {
    type: String,
    index: true,
  },
  regular_price_BWK: Number,
  regular_price_ATO: Number,
  stock_quantity_BWK: Number,
  stock_quantity_ATO: Number,
  price_ML: Number,
  stock_ML: Number,
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
