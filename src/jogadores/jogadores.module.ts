import { Module } from '@nestjs/common';
import { ClientproxyModule } from 'src/clientproxy/clientproxy.module';
import { JogadoresController } from './jogadores.controller';

@Module({
  imports: [ClientproxyModule],
  controllers: [JogadoresController]
})
export class JogadoresModule {}
