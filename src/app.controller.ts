import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1')
export class AppController {
  
  private clientAdminBackend: ClientProxy

  private logger = new Logger(AppController.name);

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ, 
      options: {
        urls: ['amqp://user:lv0gWT4Gh8JA@52.87.173.178:5672/smartranking'],
        queue: 'admin-backend'
      } 
    })
  }


  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
      return await this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }




}
