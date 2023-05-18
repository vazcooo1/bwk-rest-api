import { formatedStockAppendATO } from "../google/Format-stock-append";
import { formatedStockAppendBWK } from "../google/Format-stock-appendBW";
import { priceFormatAppendATO } from "../google/Price-format-append";
import { priceFormatAppendBWK } from "../google/Price-format-appendBW";
import { sheets } from "../auth/authGoogle";
import { updatePriceAndStock, updateSKU } from '../utils/agnosticFunctions'
import { emitDebouncedProgressUpdate, emitProgressUpdate } from "../socket";

export const toFormatPricesBWK: Array<[string, number]> = [];
export const toInsertStockBWK: Array<[string, number]> = [];
export const toFormatPricesATO: Array<[string, number]> = [];
export const toInsertStockATO: Array<[string, number]> = [];

interface FirstData {
    sku: string;
    regular_price: number;
    stock_quantity: number;
  }
  
  interface ToUpdate {
    sku: string;
    price: number;
    stock_quantity: number;
  }

export async function gecomUpdate() {
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.BWK_PRICE_FORMAT_SHEET_APPEND,
      range: "raw!A2:B",
    },
    async (err: any, res: any) => {
      if (err) return emitDebouncedProgressUpdate(`La API de Google tuvo un error: ${err}`);
      const rows = res.data.values;
      if (rows.length) {
        const firstData: FirstData[] = rows.map((e: any[]) => {
            return {
                sku: e[0],
                regular_price: Number(e[1])
            }
        })
        const toUpdate: ToUpdate[] = firstData.map(e => {
            let sku = updateSKU(e.sku);
            let price = updatePriceAndStock(e.regular_price);
          
            return {sku, price, stock_quantity: 0};
        });
        
        toUpdate.map(e => {
            toFormatPricesBWK.push([e.sku, e.price]);
        });
        await priceFormatAppendBWK()
        emitDebouncedProgressUpdate(`Lista 21 actualizada: ${toUpdate.length} SKUs procesados`)
      }
    }
  );  
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.STOCK_SHEET_APPEND,
      range: "RAWBSAS!A2:B",
    },
    async (err: any, res: any) => {
      if (err) return emitDebouncedProgressUpdate(`La API de Google tuvo un error: ${err}`);
      const rows = res.data.values;
      if (rows.length) {
        let firstData: FirstData[] = rows.map((e: any[]) => {
            return {
                sku: e[0],
                stock_quantity: Number(e[1])
            }
        })
        let toUpdate: ToUpdate[] = firstData.map((e: any) => {
            let sku = updateSKU(e.sku);
            let stock_quantity = updatePriceAndStock(e.stock_quantity);
          
            return {sku, stock_quantity, price: 0};
        });

        toUpdate.map(e => {
            toInsertStockBWK.push([e.sku, e.stock_quantity])
        })
        await formatedStockAppendBWK()
        emitDebouncedProgressUpdate(`Stock Depósito Buenos Aires actualizado: ${toUpdate.length} SKUs procesados`)
      }
    }
  );
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.ATO_PRICE_FORMAT_SHEET_APPEND,
      range: "raw!A2:B",
    },
    async (err: any, res: any) => {
      if (err) return emitDebouncedProgressUpdate(`La API de Google tuvo un error: ${err}`);
      const rows = res.data.values;
      if (rows.length) {
        let firstData: FirstData[] = rows.map((e: any[]) => {
            return {
                sku: e[0],
                regular_price: Number(e[1])
            }
        })
        let toUpdate: ToUpdate[] = firstData.map((e: any) => {
            let sku = updateSKU(e.sku);
            let price = updatePriceAndStock(e.regular_price);
          
            return {sku, price, stock_quantity: 0};
        });
        
        toUpdate.map(e => {
            toFormatPricesATO.push([e.sku, e.price]);
        });
        await priceFormatAppendATO()
        emitDebouncedProgressUpdate(`Lista 1000 actualizada: ${toUpdate.length} SKUs procesados`)
      }
    }
  );  
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.STOCK_SHEET_APPEND,
      range: "RAWMDQ!A2:B",
    },
    async (err: any, res: any) => {
      if (err) return emitDebouncedProgressUpdate(`La API de Google tuvo un error: ${err}`);
      const rows = res.data.values;
      if (rows.length) {
        let firstData: FirstData[] = rows.map((e: any) => {
            return {
                sku: e[0],
                stock_quantity: Number(e[1])
            }
        })
        let toUpdate: ToUpdate[] = firstData.map((e: any) => {
            let sku = updateSKU(e.sku);
            let stock_quantity = updatePriceAndStock(e.stock_quantity);
          
            return {sku, stock_quantity, price: 0};
        });

        toUpdate.map(e => {
            toInsertStockATO.push([e.sku, e.stock_quantity])
        })
        await formatedStockAppendATO()
        emitDebouncedProgressUpdate(`Stock Depósito MDQ actualizado: ${toUpdate.length} SKUs procesados`)
      }
    }
  );
}