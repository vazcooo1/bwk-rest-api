import { Router } from 'express';
import {
  ecommerce1PriceUpdate,
  ecommerce1StockUpdate,
  ecommerce2PriceUpdate,
  ecommerce2StockUpdate,
  ecommerce3PriceUpdate,
  ecommerce3StockUpdate,
  omincommerceUpdate,
} from './controllers';

export const apiRoutes = Router();

apiRoutes.post('/ecommerce-1-price-update', ecommerce1PriceUpdate);
apiRoutes.post('/ecommerce-1-stock-update', ecommerce1StockUpdate);
apiRoutes.post('/ecommerce-2-price-update', ecommerce2PriceUpdate);
apiRoutes.post('/ecommerce-2-stock-update', ecommerce2StockUpdate);
apiRoutes.post('/ecommerce-3-price-update', ecommerce3PriceUpdate);
apiRoutes.post('/ecommerce-3-stock-update', ecommerce3StockUpdate);
apiRoutes.post('/omincommerce-update', omincommerceUpdate);
