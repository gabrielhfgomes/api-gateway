import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientproxyService } from 'src/clientproxy/clientproxy.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { DesafioStatus } from './desafio-status.enum';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio, Partida } from './interfaces/desafio.interface';
import { DesafioStatusValidationPipe } from './pipes/desafio-status-validation.pipe';

@Controller('desafios')
export class DesafiosController {

    private logger = new Logger(DesafiosController.name)

    constructor(      
        private clientProxyService: ClientproxyService,
    ) {}
    
    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto) {

        const jogadores: Array<Jogador> = await this.clientProxyService.clientAdminBackend.send('consultar-jogadores', '').toPromise();
        
        criarDesafioDto.jogadores.map(jogadorDto => {
            const jogadorFilter: Array<Jogador> = jogadores.filter(jogador => jogador._id == jogadorDto._id) 

            this.logger.log(`jogadorFilter: ${JSON.stringify(jogadorFilter)}`);

            if (jogadorFilter.length == 0) {
                throw new BadRequestException(`O id ${jogadorDto._id} não é um jogador`);
            }

            if (jogadorFilter[0].categoria != jogadorDto.categoria) {
                throw new BadRequestException(`O jogador ${jogadorFilter[0]._id} não faz parte da categoria informada`);
            } 
        })

        const solicitanteEhJogadorDaPartida: Jogador[] = criarDesafioDto.jogadores.filter(jogador => jogador._id == criarDesafioDto.solicitante._id)

        this.logger.log(`solicitanteEhJogadorDaPartida: ${JSON.stringify(solicitanteEhJogadorDaPartida)}`);

        if (solicitanteEhJogadorDaPartida.length == 0) {
            throw new BadRequestException(`O solicitante deve ser um jogador da partida`)
        }

        const categoria = await this.clientProxyService.clientAdminBackend.send('consultar-categorias', criarDesafioDto.categoria);

        if (!categoria) {
            throw new BadRequestException(`Categoria informada não existe`);
        }

        await this.clientProxyService.clientDesafios.emit('criar-desafios', criarDesafioDto)
    }

    @Get()
    async consultarDesafios(@Query('idJogador') idJogador: string): Promise<any> {

        if (idJogador) {
            const jogador: Jogador = await this.clientProxyService.clientAdminBackend.send('consultar-jogadores', { idJogador: idJogador }).toPromise();

            if(!jogador) {
                throw new BadRequestException(`Jogador não cadastrado`);
            }
        }

        return this.clientProxyService.clientDesafios.send('consultar-desafios', { idJogador: idJogador, _id: ''}).toPromise();
    }

    @Put('/:desafio')
    async atualizarDesafio(
        @Body(DesafioStatusValidationPipe) atualizarDesafioDto: AtualizarDesafioDto,
        @Param('desafio') _id: string): Promise<void> {

        const desafio: Desafio = await this.clientProxyService.clientDesafios.send('consultar-desafios', {idJogador: '', _id: _id}).toPromise();

        this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

        if (!desafio) {
            throw new BadRequestException(`Desafio de id ${_id} não existe`);
        }

        if (desafio.status != DesafioStatus.PENDENTE) {
            throw new BadRequestException(`Somente desafios com status de pendet podem ser atualizados`);
        }
        
        await this.clientProxyService.clientDesafios.emit('atualizar-desafios', { id: _id, desafio: atualizarDesafioDto});
    }

    
    @Delete('/:desafio')
    async deletarDesafio(@Param('desafio') _id: string): Promise<void> {
        const desafio: Desafio = await this.clientProxyService.clientDesafios.emit('deletar-desafios', { idJogador: '', _id: _id}).toPromise();
        
        if (!desafio) {
            throw new BadRequestException(`Desafio não cadastrado`);
        }

        await this.clientProxyService.clientDesafios.emit('deletar-desafios', desafio);
    }

    @Post('/:desafio/partida')
    async atribuirDesafioPartida(
        @Param('desafio') _id: string,
        @Body(ValidationPipe) atribuirDesafioPartida: AtribuirDesafioPartidaDto): Promise<void> {
    
        const desafio: Desafio = await this.clientProxyService.clientDesafios.emit('deletar-desafios', { idJogador: '', _id: _id}).toPromise();
    
        if (!desafio) {
            throw new BadRequestException(`Desafio não cadastrado`);
        }

        if (desafio.status == DesafioStatus.REALIZADO) {
            throw new BadRequestException(`O desafio já foi realizado`);
        }   

        if (!desafio.jogadores.includes(atribuirDesafioPartida.def)) {
            throw new BadRequestException(`O jogador vencedor da partida deve fazer parte do desafio`);
        }

        const partida: Partida = {};
        partida.categoria = desafio.categoria;
        partida.def = atribuirDesafioPartida.def;
        partida.desafio = _id
        partida.jogadores = desafio.jogadores
        partida.resultado = atribuirDesafioPartida.resultado

        await this.clientProxyService.clientDesafios.emit('criar-partida', partida);
    }
}
