import { Module } from '@nestjs/common';
import { ClientproxyModule } from 'src/clientproxy/clientproxy.module';
import { DesafiosController } from './desafios.controller';

@Module({
  imports: [ClientproxyModule],
  controllers: [DesafiosController]
})
export class DesafiosModule {}
