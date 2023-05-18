import { Product, IProduct } from "../product";
import { emitDebouncedProgressUpdate, emitProgressUpdate } from '../socket';
import { sheets } from "../auth/authGoogle";
import { trackProgress } from "../progressTracker";

type Item = Partial<IProduct>;

type MapFn<T> = (row: any[]) => T;

interface ItemData {
  sku: string;
  regular_price_BWK: number;
  regular_price_ATO: number;
  stock_quantity_ATO: number;
  stock_quantity_BWK: number;
}

interface ItemDataML {
  sku_ML: string;
  price_ML: number;
  stock_ML: number;
}

export function updateSKU(sku: string) {
  switch (true) {
    case sku.startsWith("PD-1000"):
      sku = sku.replace("PD-1000", "PD-1000-");
      break;
    case sku.startsWith("PD-1007"):
      sku = sku.replace("PD-1007", "PD-1007-");
      break;
    case sku.startsWith("PD-1042"):
      sku = sku.replace("PD-1042", "PD-1042-");
      break;
  }
  return sku.startsWith("PD-")
    ? sku.replace("S/A", "").trim()
    : sku.startsWith("KL")
    ? sku.replace(".", "").trim()
    : sku.startsWith("BD")
    ? sku.replace("-50", "").trim()
    : sku;
}

export function updatePriceAndStock(price: number) {
  if (price === undefined || price === null) {
    return 0;
  }

  const priceAsNumber = Number(price);
  if (!Number.isFinite(priceAsNumber) || priceAsNumber < 0) {
    return 0;
  }

  return priceAsNumber;
}

export async function findAndUpdateMongo(data: ItemData[]): Promise<void> {
  const totalItems = data.length;

  await Promise.all(
    data.map(async (item, index) => {
      const updateData = {
        sku: item.sku,
        regular_price_BWK: item.regular_price_BWK,
        regular_price_ATO: item.regular_price_ATO,
        stock_quantity_ATO: item.stock_quantity_ATO,
        stock_quantity_BWK: item.stock_quantity_BWK,
      };

      const product = await Product.findOneAndUpdate(
        { sku: item.sku },
        updateData,
        {
          new: true,
          upsert: true,
        }
      );

      trackProgress({ currentStep: index + 1, totalSteps: totalItems, baseMessage: 'Actualizando productos en MongoDB...' });

      if (product) {
        emitProgressUpdate(`Producto: ${product.sku} correctamente actualizado.`)
        console.log(`Producto: ${product.sku} correctamente actualizado.`);
      }
    })
  );
}

export async function findAndUpdateMongoML(data: ItemDataML[]): Promise<void> {
  await Promise.all(
    data.map(async (item) => {
      const updateData = {
        sku_ML: item.sku_ML,
        price_ML: item.price_ML,
        stock_ML: item.stock_ML,
      };

      const product = await Product.findOneAndUpdate(
        { sku_ML: item.sku_ML },
        updateData,
        {
          new: true,
          upsert: true,
        }
      );

      if (product) {
        emitProgressUpdate(`Producto: ${product.sku_ML} correctamente actualizado.`)
        console.log(`Producto: ${product.sku_ML} correctamente actualizado.`);
      }
    })
  );
}


export async function compareArraysToMongo(callData: Item[]): Promise<Item[]> {
  emitDebouncedProgressUpdate(`Productos a procesar: ${callData.length}`)
  const totalItems = callData.length;
  // Retrieve all products from the database using the `Product` model
  const baseData: IProduct[] = await Product.find();

  // Create a hash map to store the base data
  const baseDataMap = new Map(baseData.map((item: IProduct) => [item.sku, item]));

  // Use the map function to process each item in the `callData` array
  const processedArray: Item[] = callData.map((item1: Item, index: number) => {
    trackProgress({ currentStep: index + 1, totalSteps: totalItems, baseMessage: 'Actualizando productos en MongoDB...' });

    // Find the matching product in the hash map using the `sku` property
    const matchingItem: IProduct | undefined = baseDataMap.get(item1.sku!);
    let result: Item = {};

    if (matchingItem) {
      // Compare all properties of the `matchingItem` and `item1` objects
      // and add any mismatched properties to the result object
      for (const [key, value] of Object.entries(item1)) {
        if (matchingItem[key as keyof IProduct] !== value) {
          // If there is a mismatched property, add the entire item1 object to the result
          result = item1;
          break; // Stop processing the rest of the object
        }
      }
    }

    // Return the result object
    return result;
  });

  // Return the processed array containing all the mismatched data
  return processedArray;
}




export async function compareArraysToMongoML(callData: Item[]): Promise<Item[]> {
  emitDebouncedProgressUpdate(`Productos a procesar: ${callData.length}`)
  const totalItems = callData.length;
  // Retrieve all products from the database using the `Product` model
  const baseData: IProduct[] = await Product.find();

  // Create a hash map to store the base data
  const baseDataMap = new Map(baseData.map((item: IProduct) => [item.sku_ML, item]));

  // Use the map function to process each item in the `callData` array
  const processedArray: Item[] = callData.map((item1: Item, index: number) => {
    trackProgress({ currentStep: index + 1, totalSteps: totalItems, baseMessage: 'Actualizando productos en MongoDB...' });

    // Find the matching product in the hash map using the `sku` property
    const matchingItem: IProduct | undefined = baseDataMap.get(item1.sku_ML!);
    let result: Item = {};

    if (matchingItem) {
      // Compare all properties of the `matchingItem` and `item1` objects
      // and add any mismatched properties to the result object
      for (const [key, value] of Object.entries(item1)) {
        if (matchingItem[key as keyof IProduct] !== value) {
          // If there is a mismatched property, add the entire item1 object to the result
          result = item1;
          break; // Stop processing the rest of the object
        }
      }
    }

    // Return the result object
    return result;
  });

  // Return the processed array containing all the mismatched data
  return processedArray;
}

export async function getDataFromSheet<T>(
  spreadsheetId: string,
  range: string,
  mapFn: MapFn<T>
): Promise<T[]> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    // Specify the valueRenderOption parameter to get unformatted values
    valueRenderOption: 'UNFORMATTED_VALUE',
  });
  const rows = res.data.values;
  const filter = rows?.filter(e => e !== undefined && e !== null) as any
  return filter.map(mapFn);
}