import { Injectable } from '@nestjs/common';
import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientproxyService {

    public clientAdminBackend: ClientProxy

    private logger = new Logger(ClientproxyService.name);

    constructor() {
        if(this.clientAdminBackend == null) {
          this.clientAdminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ, 
            options: {
              urls: ['amqp://user:lv0gWT4Gh8JA@52.87.173.178:5672/smartranking'],
              queue: 'admin-backend'
            } 
          })
        }
    }    
}
