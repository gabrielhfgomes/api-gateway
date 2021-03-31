import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ClientproxyModule } from './clientproxy/clientproxy.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CategoriasModule, 
    JogadoresModule, 
    ClientproxyModule, 
    AwsModule,
    ConfigModule.forRoot({isGlobal: true})
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
