import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ClientproxyService } from 'src/clientproxy/clientproxy.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';


@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(private clientProxyService: ClientproxyService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
        this.clientProxyService.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
    }
  
    @Get()
    consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {
      return this.clientProxyService.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
    }
  
    @Put('/:id')
    @UsePipes(ValidationPipe)
    async atualizarCategoria(
      @Param('id') _id: string, 
      @Body() atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
        this.clientProxyService.clientAdminBackend.emit(
          'atualizar-categoria', 
          {id: _id, categoria: atualizarCategoriaDto}
        )
    }

}
