import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventManagerService } from './event-manager.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'RECRIT_SERVICE',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'recrit',
                brokers: [configService.get<string>('kafka.url') as string], // TODO(deploy): make it list of urls
              },
              consumer: {
                groupId: 'recrit-consumer',
              },
            },
          }),
        },
      ],
    }),
  ],
  providers: [EventManagerService],
  exports: [EventManagerService],
})
export class EventManagerModule {}
