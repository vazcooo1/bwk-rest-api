import { Request, Response } from 'express';
import { emitProgressUpdate } from './socket';
import { gecomUpdate } from './batch/gecom-data';
import { upToDateToMongo } from './batch/update-mongo';

export async function ecommerce1PriceUpdate(req: Request, res: Response) {
  emitProgressUpdate('Procesando precios Lista 21: Buswork');
  // Your business logic for eCommerce 1 price update
  res.status(200).json({ message: '200: Ok' });
}

export async function ecommerce1StockUpdate(req: Request, res: Response) {
  emitProgressUpdate('Procesando stock depósito: Buswork');
  // Your business logic for eCommerce 1 stock update
  res.status(200).json({ message: '200: Ok' });
}

export async function ecommerce2PriceUpdate(req: Request, res: Response) {
  emitProgressUpdate('Processing eCommerce 2 price update');
  // Your business logic for eCommerce 2 price update
  res.status(200).json({ message: '200: Ok' });
}

export async function ecommerce2StockUpdate(req: Request, res: Response) {
  emitProgressUpdate('Processing eCommerce 2 stock update');
  // Your business logic for eCommerce 2 stock update
  res.status(200).json({ message: '200: Ok' });
}

export async function ecommerce3PriceUpdate(req: Request, res: Response) {
  emitProgressUpdate('Processing eCommerce 3 price update');
  // Your business logic for eCommerce 3 price update
  res.status(200).json({ message: '200: Ok' });
}

export async function ecommerce3StockUpdate(req: Request, res: Response) {
  emitProgressUpdate('Processing eCommerce 3 stock update');
  // Your business logic for eCommerce 3 stock update
  res.status(200).json({ message: '200: Ok' });
}

export async function omincommerceUpdate(req: Request, res: Response) {
  emitProgressUpdate('Processing omnichannel update');
  // Your business logic for omnichannel update
  res.status(200).json({ message: '200: Ok' });
}

export async function updateGecom(req: Request, res: Response) {
  await gecomUpdate();
  res.status(200).json({ message: 'Sincronizando Gecom y Google DB' });
}

export async function updateMongoDB(req: Request, res: Response) {
  await upToDateToMongo();
  res.status(200).json({ message: 'Sincronizando MongoDB'})
}