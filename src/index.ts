import app from './app';
import { connectToDatabase } from './db';
import { initSocket } from './socket';
import { AddressInfo } from 'net';

(async () => {
  await connectToDatabase();

  const server = app.listen(process.env.PORT || 3000, () => {
    const address = server.address() as AddressInfo;
    console.log('Server is running on port', address.port);
  });

  initSocket(server);
})();
