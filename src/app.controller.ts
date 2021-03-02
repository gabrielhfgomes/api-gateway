import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
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
      this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }

  @Get('categorias')
  consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put('categorias/:id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Param('id') _id: string, 
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
      this.clientAdminBackend.emit(
        'atualizar-categoria', 
        {id: _id, categoria: atualizarCategoriaDto}
      )
  }


}
