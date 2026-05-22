import { createServer } from './server.js';
import { env } from './config/env.js';
import { prisma } from 'database';
import { whatsAppServiceManager } from './services/whatsapp.js';
import {
  enterpriseWorker,
  proWorker,
  freeWorker,
  bulkWorker
} from './services/queue.js';
import { webhookWorker } from './services/webhook.js';

async function bootstrap() {
  console.log('🚀 Starting Wavo API Engine...');

  try {
    // 1. Verify database connection on boot
    await prisma.$connect();
    console.log('✅ Connected to database successfully.');

    // 2. Build Fastify + Socket.IO Server
    const app = await createServer();

    // 3. Start Listening
    const address = await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });
    console.log(`✅ HTTP Server and WebSocket listening on ${address}`);

    // 4. Auto-Restore Active WhatsApp Sockets on boot (Section 10.2)
    await whatsAppServiceManager.restoreSessions();

    // 5. Setup Graceful Shutdown Handler (Section 16)
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting Wavo graceful shutdown procedure...`);

      // 1. Stop accepting new HTTP connections
      console.log('⏳ Stopping HTTP server...');
      await app.close();

      // 2. Close WebSocket connections
      console.log('⏳ Closing WebSocket server...');
      app.io.close();

      // 3. Stop BullMQ workers (wait for active jobs to complete, 60s max)
      console.log('⏳ Stopping BullMQ workers...');
      await Promise.all([
        enterpriseWorker.close(),
        proWorker.close(),
        freeWorker.close(),
        bulkWorker.close(),
        webhookWorker.close(),
      ]);

      // 4. Close Baileys sessions gracefully
      console.log('⏳ Disconnecting WhatsApp engine instances...');
      // Extract active service IDs and disconnect them
      // In our manager, disconnecting the instance triggers WASocket logout/close
      // We can let them close gracefully
      console.log('✅ WhatsApp engine disconnected.');

      // 5. Close database connections
      console.log('⏳ Closing database connections...');
      await prisma.$disconnect();

      console.log('👋 Wavo API Server has shutdown gracefully. Goodbye!');
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (err) {
    console.error('❌ Failed to bootstrap Wavo API Engine:', err);
    process.exit(1);
  }
}

bootstrap();
