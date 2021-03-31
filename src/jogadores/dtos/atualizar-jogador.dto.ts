import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class AtualizarJogadorDto {
    // @IsNotEmpty()
    // readonly telefoneCelular: string;
    // @IsNotEmpty()
    // nome: string;
    
    @IsOptional()
    categoria?: string;

    @IsOptional()
    urlFotoJogador?: string;
}