import { Module } from '@nestjs/common';
import { ClientproxyModule } from 'src/clientproxy/clientproxy.module';
import { CategoriasController } from './categorias.controller';

@Module({
  controllers: [CategoriasController],
  imports: [ClientproxyModule]
})
export class CategoriasModule {}
