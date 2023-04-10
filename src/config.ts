import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodbUri: process.env.MONGODB_URI || '',
};

export const bwkLista21 = {
  sheet: process.env.BWK_PRICE_FORMAT_SHEET_APPEND || '',
}

export const atoLista1000 = {
  sheet: process.env.ATO_PRICE_SHEET || '',
}

export const stockTotal = {
  sheet: process.env.STOCK_SHEET_APPEND || '',
}

export const MeLiData = {
  sheet: process.env.MELI_SHEET || '',
}