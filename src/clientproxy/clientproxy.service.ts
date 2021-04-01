import { Injectable } from '@nestjs/common';
import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class ClientproxyService {

    public clientAdminBackend: ClientProxy

    public clientDesafios: ClientProxy

    private logger = new Logger(ClientproxyService.name);

    constructor(private configService: ConfigService) {
        if(this.clientAdminBackend == null) {
          this.clientAdminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ, 
            options: {
              urls: [`amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_URL')}`],
              queue: 'admin-backend'
            } 
          })
        }

        if(this.clientDesafios == null) {
          this.clientDesafios = ClientProxyFactory.create({
            transport: Transport.RMQ, 
            options: {
              urls: [`amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_URL')}`],
              queue: 'desafios'
            } 
          })
        }
    }
}
