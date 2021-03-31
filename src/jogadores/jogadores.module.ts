import { Module } from '@nestjs/common';
import { AwsModule } from '../aws/aws.module';
import { ClientproxyModule } from 'src/clientproxy/clientproxy.module';
import { JogadoresController } from './jogadores.controller';

@Module({
  imports: [ClientproxyModule, AwsModule],
  controllers: [JogadoresController]
})
export class JogadoresModule {}
