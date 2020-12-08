import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { helmet } from './utils/express.plugins'

import { server } from '../config.json'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)
  console.table({
    port: server.port,
    prefix: server.prefix
  })

  app.use(helmet)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.setGlobalPrefix(server.prefix)
  await app.listen(server.port)
}

//! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
// eslint-disable-next-line no-void
void bootstrap()

// * NOTAS DO DESENVOLVEDOR:
// ! EM DIVERSOS MOMENTOS FOI UTILIZADO VERIFICAÇÃO ÚNICA DE ESTADO "UNDEFINED"
// ! POIS ERA O SEGUNDO RETORNO DA VARIÁVEL, PORÉM TEMO QUE ELA RETORNE ALGO INVÁLIDO
// ! ALÉM DE UNDEFINED E ISSO CAUSE PROBLEMAS NA EXECUÇÃO DO SISTEMA
// TODO: PERMANECER DE OLHO NESSE CASO
