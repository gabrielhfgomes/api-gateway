import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileURLToPath } from 'node:url';
import { Observable } from 'rxjs';
import { ClientproxyService } from 'src/clientproxy/clientproxy.service';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadorValidationPipe } from './pipes/jogador.validation.pipe';
import { AwsService } from '../aws/aws.service';


@Controller('api/v1/jogadores')
export class JogadoresController {


    private logger = new Logger(JogadoresController.name);

    constructor(
      private clientProxyService: ClientproxyService,
      private awsService: AwsService
      ) {}

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

    @Post('/:id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadArquivo(@UploadedFile() file, @Param('id') _id: string) {

      const jogador = await this.clientProxyService.clientAdminBackend.send('consultar-jogadores', _id).toPromise();

      if(!jogador) {
        throw new BadRequestException(`Jogador não encontrado!`);
      }

      const urlFotoJogador = await this.awsService.uploadArquivo(file, _id);

      const atualizarJogadorDto: AtualizarJogadorDto = { };
      atualizarJogadorDto.urlFotoJogador = urlFotoJogador.url;

      await this.clientProxyService.clientAdminBackend.emit('atualizar-jogador', {
        id: _id, jogador: atualizarJogadorDto
      }); 

      return this.clientProxyService.clientAdminBackend.send('consultar-jogadores', _id);
      //  return data;
    }


}
