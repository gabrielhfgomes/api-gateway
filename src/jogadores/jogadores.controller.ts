import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientproxyService } from 'src/clientproxy/clientproxy.service';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadorValidationPipe } from './pipes/jogador.validation.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private clientProxyService: ClientproxyService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(@Body(JogadorValidationPipe) criarJogadorDto: CriarJogadorDto) {
        this.clientProxyService.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
    }

    @Get()
    consultarCategorias(@Query('idJogador') _id: string): Observable<any> {
      return this.clientProxyService.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
      @Param('id') _id: string, 
      @Body() atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
        this.clientProxyService.clientAdminBackend.emit(
          'atualizar-jogador', 
          {id: _id, categoria: atualizarJogadorDto}
        )
    }

    @Delete('/:id')
    @UsePipes(ValidationPipe)
    async deletarJogador(@Param('id') _id: string) {
        this.clientProxyService.clientAdminBackend.emit('deletar-jogador', _id);
    }


}
