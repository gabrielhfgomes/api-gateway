import { Module } from '@nestjs/common';
import { ClientproxyService } from './clientproxy.service';

@Module({
  providers: [ClientproxyService],
  exports: [ClientproxyService]
})
export class ClientproxyModule {}
