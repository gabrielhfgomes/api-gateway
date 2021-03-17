import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ClientproxyService } from "src/clientproxy/clientproxy.service";


@Injectable()
export class JogadorValidationPipe implements PipeTransform {

    constructor(private clientProxyService: ClientproxyService) {}

    async transform(value: any) {
        const categoria = value.categoria;

        await this.validaCategoria(categoria) 

        return value;
    }

    async validaCategoria(categoria: string): Promise<void> {
        try {
            await this.clientProxyService.clientAdminBackend.send('consultar-categorias', categoria).toPromise();
        } catch(error) {
            throw new BadRequestException(`Categoria ${categoria} não cadastrada!`);
        }
    }  
}