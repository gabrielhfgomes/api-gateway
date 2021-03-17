import { IsEmail, IsNotEmpty } from 'class-validator';

export class CriarJogadorDto {
    @IsNotEmpty()
    readonly telefoneCelular: string;
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    nome: string;
    @IsNotEmpty()
    categoria: string;
}