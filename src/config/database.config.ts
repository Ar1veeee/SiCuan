import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../config/logger.config';

// Conditional logging based on environment
const prismaClientOptions = {
    log: process.env.NODE_ENV === 'production' 
        ? [
            { level: 'error' as const, emit: 'event' as const },
            { level: 'warn' as const, emit: 'event' as const },
        ]
        : [
            { level: 'query' as const, emit: 'event' as const },
            { level: 'error' as const, emit: 'event' as const },
            { level: 'info' as const, emit: 'event' as const },
            { level: 'warn' as const, emit: 'event' as const },
        ],
    errorFormat: 'pretty' as const,
};

type PrismaClientWithEvents = PrismaClient<typeof prismaClientOptions>;

class DatabaseService {
    private static instance: PrismaClientWithEvents;
    private static isConnected: boolean = false;

    private constructor() {        
    }

    static getInstance(): PrismaClientWithEvents {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new PrismaClient(prismaClientOptions);
            
            // Only log queries in development
            if (process.env.NODE_ENV !== 'production') {
                DatabaseService.instance.$on('query', (e: Prisma.QueryEvent) => {
                    logger.debug(`Query: ${e.query}`);
                    logger.debug(`Duration: ${e.duration}ms`);
                });

                DatabaseService.instance.$on('info', (e: Prisma.LogEvent) => {
                    logger.info('Prisma info:', e.message);
                });
            }

            // Always log errors and warnings
            DatabaseService.instance.$on('error', (e: Prisma.LogEvent) => {
                logger.error('Prisma error:', e);
            });

            DatabaseService.instance.$on('warn', (e: Prisma.LogEvent) => {
                logger.warn('Prisma warning:', e.message);
            });
            
            DatabaseService.instance.$connect()
                .then(() => {
                    DatabaseService.isConnected = true;
                    logger.info('Database connected successfully');
                })
                .catch((error) => {
                    logger.error('Failed to connect to database:', error);
                    DatabaseService.isConnected = false;
                });
        }

        return DatabaseService.instance;
    }

    static async disconnect(): Promise<void> {
        if (DatabaseService.instance) {
            try {
                logger.info('Disconnecting from database...');
                await DatabaseService.instance.$disconnect();
                DatabaseService.isConnected = false;
                logger.info('Database disconnected successfully');
            } catch (error) {
                logger.error('Error disconnecting from database:', error);
                throw error;
            }
        }
    }

    static isReady(): boolean {
        return DatabaseService.isConnected;
    }

    static async healthCheck(): Promise<boolean> {
        if (!DatabaseService.instance) {
            return false;
        }

        try {
            await DatabaseService.instance.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            logger.error('Database health check failed:', error);
            return false;
        }
    }
}

export default DatabaseService;