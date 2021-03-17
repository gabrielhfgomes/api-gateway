import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ClientproxyModule } from './clientproxy/clientproxy.module';
@Module({
  imports: [CategoriasModule, JogadoresModule, ClientproxyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
