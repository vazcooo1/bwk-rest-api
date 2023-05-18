import {
  compareArraysToMongo,
  compareArraysToMongoML,
  findAndUpdateMongo,
  findAndUpdateMongoML,
  getDataFromSheet,
} from "../utils/agnosticFunctions";
import { bwkLista21, atoLista1000, stockTotal, MeLiData } from "../config";
import { IProduct } from "../product";
import { emitDebouncedProgressUpdate, emitProgressUpdate } from "../socket";

interface IPartialProductWithSKU extends Partial<IProduct> {
    sku: string,
    regular_price_BWK: number,
    regular_price_ATO: number,
    stock_quantity_BWK: number,
    stock_quantity_ATO: number
  }

interface BwkPriceData {
  sku: string;
  regular_price_BWK: number;
}

interface BwkStockData {
  sku: string;
  stock_quantity_BWK: number;
}

interface AtoPriceData {
  sku: string;
  regular_price_ATO: number;
}

interface AtoStockData {
  sku: string;
  stock_quantity_ATO: number;
}

interface MeliPriceAndStockData {
  sku_ML: string;
  price_ML: number;
  stock_ML: number;
}

export async function upToDateToMongo(): Promise<void> {
  // Get the data from the first sheet
  const bwkPArr: BwkPriceData[] = await getDataFromSheet(
    bwkLista21.sheet,
    "price21!A2:B",
    (e) => {
      // Check if the value of e[1] is a valid number
      const regularPriceBWK = Number(e[1]);
      if (Number.isFinite(regularPriceBWK) && regularPriceBWK >= 0) {
        return {
          sku: String(e[0]),
          regular_price_BWK: regularPriceBWK,
        };
      }
      return {
        sku: String(e[0]),
        regular_price_BWK: 0,
      };
    }
  );
  console.log(bwkPArr.length + " OK");
  // Get the data from the second sheet
  const bwkSArr: BwkStockData[] = await getDataFromSheet(
    stockTotal.sheet,
    "BSAS!A2:B",
    (e) => {
      // Check if the value of e[1] is a valid number
      const stockQuantityBWK = Math.round(Number(e[1]));
      if (Number.isFinite(stockQuantityBWK) && stockQuantityBWK >= 0) {
        return {
          sku: String(e[0]),
          stock_quantity_BWK: stockQuantityBWK,
        };
      }
      return {
        sku: String(e[0]),
        stock_quantity_BWK: 0,
      };
    }
  );
  console.log(bwkSArr.length + " OK");
  // Get the data from the third sheet
  const atoPArr: AtoPriceData[] = await getDataFromSheet(
    atoLista1000.sheet,
    "price1000!A2:B",
    (e) => {
      // Check if the value of e[1] is a valid number
      const regularPriceATO = Number(e[1]);
      if (Number.isFinite(regularPriceATO) && regularPriceATO >= 0) {
        return {
          sku: String(e[0]),
          regular_price_ATO: regularPriceATO,
        };
      }
      return {
        sku: String(e[0]),
        regular_price_ATO: 0,
      };
    }
  );
  console.log(atoPArr.length + " OK");
  // Get the data from the fourth sheet
  const atoSArr: AtoStockData[] = await getDataFromSheet(
    stockTotal.sheet,
    "MDQ!A2:B",
    (e) => {
      // Check if the value of e[1] is a valid number
      const stockQuantityATO = Math.round(Number(e[1]));
      if (Number.isFinite(stockQuantityATO) && stockQuantityATO >= 0) {
        return {
          sku: String(e[0]),
          stock_quantity_ATO: stockQuantityATO,
        };
      }
      return {
        sku: String(e[0]),
        stock_quantity_ATO: 0,
      };
    }
  );
  console.log(atoSArr.length + " OK");
  // Create a hash map to store the data from the bwkSArr, atoPArr, and atoSArr arrays
  const bwkSData = new Map(
    bwkSArr.map((datapoint) => [datapoint.sku, datapoint.stock_quantity_BWK])
  );
  const atoPData = new Map(
    atoPArr.map((datapoint) => [datapoint.sku, datapoint.regular_price_ATO])
  );
  const atoSData = new Map(
    atoSArr.map((datapoint) => [datapoint.sku, datapoint.stock_quantity_ATO])
  );
  let counter = 0;

  // Use the Array.map() method to create the finalDataForMongo array
  const finalDataForMongo = bwkPArr.map((datapoint) => {

    const sku = datapoint.sku;
    const regularPriceBWK = datapoint.regular_price_BWK;
    const regularPriceATO = atoPData.get(sku) || 0;
    const stockQuantityBWK = bwkSData.get(sku) || 0;
    const stockQuantityATO = atoSData.get(sku) || 0;

    return {
      sku: sku,
      regular_price_BWK: regularPriceBWK,
      regular_price_ATO: regularPriceATO,
      stock_quantity_BWK: stockQuantityBWK,
      stock_quantity_ATO: stockQuantityATO,
    };
  });
  //console.log(finalDataForMongo)
  //deleteProductsInMongo(finalDataForMongo);
  //createProductsInMongo(finalDataForMongo);
  let final = await compareArraysToMongo(finalDataForMongo);
  let removeUndefined = final.filter(e => e.sku !== undefined && e.sku !== null) as IPartialProductWithSKU[]
  let filtered: IPartialProductWithSKU[] = removeUndefined.filter(
    (e) => Object.keys(e).length
  );
  if (filtered.length > 0) {
    findAndUpdateMongo(filtered);
  } else {
    emitDebouncedProgressUpdate(`${final.length} productos ya estaban actualizados - Buswork + Atopems`);
  }

  const meliPriceAndStock: MeliPriceAndStockData[] = await getDataFromSheet(
    MeLiData.sheet,
    "dataset!C2:E",
    (e) => {
      // Check if the value of e[1] is a valid number
      const priceMELI = Number(e[1]);
      const stockMELI = Math.round(Number(e[2]));
      if (
        Number.isFinite(priceMELI) &&
        priceMELI >= 0 &&
        Number.isFinite(stockMELI) &&
        stockMELI >= 0
      ) {
        return {
          sku_ML: String(e[0]),
          price_ML: priceMELI,
          stock_ML: stockMELI,
        };
      }
      return {
        sku_ML: String(e[0]),
        price_ML: 0,
        stock_ML: 0,
      };
    }
  );
  console.log(meliPriceAndStock.length + " OK");
  //createProductsInMongo(meliPriceAndStock);
  let meliMongo = await compareArraysToMongoML(meliPriceAndStock) as MeliPriceAndStockData[];

  let meliFilter = meliMongo.filter((e) => Object.keys(e).length);
  if (meliFilter.length > 0) {
    findAndUpdateMongoML(meliFilter);
  } else {
    emitDebouncedProgressUpdate(`${meliPriceAndStock.length} productos ya actualizados - MercadoLibre`);
  }
}