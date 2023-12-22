import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommandService } from './command/command.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const commandService = app.get(CommandService);
  commandService.commandHandler('input.json', 'output.json');
}
bootstrap();
