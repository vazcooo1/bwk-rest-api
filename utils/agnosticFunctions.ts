import { Product } from '../src/product';

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


export function updateSKU(sku: String) {
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


  export function updatePriceAndStock(price: Number) {
    if (
      price === undefined ||
      price === null
    ) {
      return 0;
    }
  
    const priceAsNumber = Number(price);
    if (!Number.isFinite(priceAsNumber) || priceAsNumber < 0) {
      return 0;
    }
  
    return priceAsNumber;
  }


  export async function findAndUpdateMongo(data: ItemData[]): Promise<void> {
    await Promise.all(
      data.map(async (item) => {
        const updateData = {
          sku: item.sku,
          regular_price_BWK: item.regular_price_BWK,
          regular_price_ATO: item.regular_price_ATO,
          stock_quantity_ATO: item.stock_quantity_ATO,
          stock_quantity_BWK: item.stock_quantity_BWK,
        };
  
        const product = await Product.findOneAndUpdate({ sku: item.sku }, updateData, {
          new: true,
          upsert: true,
        });
  
        if (product) {
          console.log(`Producto: ${product.sku} correctamente actualizado.`);
        }
      }),
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
  
        const product = await Product.findOneAndUpdate({ sku_ML: item.sku_ML }, updateData, {
          new: true,
          upsert: true,
        });
  
        if (product) {
          console.log(`Producto: ${product.sku_ML} correctamente actualizado.`);
        }
      }),
    );
  }
