#websocket com nestjs redis em microserviços

Com certeza! Utilizar WebSockets com NestJS, Redis e microserviços é uma combinação poderosa para criar aplicações em tempo real escaláveis e robustas. O Redis atua como uma camada de comunicação entre os microserviços, permitindo que os eventos de WebSocket sejam propagados para todos os gateways em tempo real, independentemente do serviço que os gerou.

Por que usar Redis para WebSockets em Microserviços?
Em uma arquitetura de microserviços, você pode ter várias instâncias do seu serviço de WebSocket rodando. Se um cliente se conecta a uma instância e outro cliente a outra, um evento emitido na primeira instância não será recebido pelo segundo cliente.

É aí que o Redis entra em cena. O Redis, com seu sistema de Pub/Sub (Publish/Subscribe), permite que todas as instâncias do serviço de WebSocket se comuniquem. Quando um evento é recebido por uma instância, ela o "publica" em um canal do Redis. Todas as outras instâncias, que estão "inscritas" nesse mesmo canal, recebem a mensagem e a retransmitem para seus clientes conectados. Isso garante que todos os clientes recebam a mensagem em tempo real, independentemente da instância a qual estão conectados.

Como implementar com NestJS e Redis
A implementação é dividida em algumas etapas: a configuração do Redis, a criação do gateway WebSocket e a integração do sistema Pub/Sub.

1. Instalação das dependências
   Primeiro, você precisa instalar o pacote do Redis e o adaptador @nestjs/platform-socket.io. Embora platform-ws seja uma opção, socket.io é mais popular e tem um ecossistema mais rico para trabalhar com microserviços e Redis.

Bash

npm install --save @nestjs/platform-socket.io
npm install --save socket.io redis
npm install --save-dev @types/redis 2. Configurando o Adaptador do Redis
O NestJS permite criar adaptadores personalizados para WebSockets. Crie um adaptador que se conecta ao Redis e utiliza o Pub/Sub para a comunicação entre as instâncias.

TypeScript

// src/common/redis-io.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
private adapter: any;

constructor(private app) {
super(app);
}

async connectToRedis(): Promise<void> {
const pubClient = createClient({ url: `redis://localhost:6379` });
const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapter = createAdapter(pubClient, subClient);

}

createIOServer(port: number, options?: ServerOptions) {
const server = super.createIOServer(port, options);
server.adapter(this.adapter);
return server;
}
}
createClient: Cria um cliente para se conectar ao servidor Redis.

duplicate: O Redis Pub/Sub requer clientes separados para publicar e se inscrever, por isso duplicamos o cliente.

createAdapter: A biblioteca @socket.io/redis-adapter é a peça central. Ela substitui o adaptador padrão do socket.io, usando o Redis para gerenciar a comunicação e a sincronização entre as instâncias.

createIOServer: Este método sobrescrito aplica o adaptador do Redis ao servidor socket.io do NestJS.

3. Usando o Adaptador no Módulo Principal
   Agora, aplique este adaptador no seu main.ts para que ele seja usado por toda a aplicação.

TypeScript

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './common/redis-io.adapter';

async function bootstrap() {
const app = await NestFactory.create(AppModule);

const redisIoAdapter = new RedisIoAdapter(app);
await redisIoAdapter.connectToRedis();
app.useWebSocketAdapter(redisIoAdapter);

await app.listen(3000);
}
bootstrap();
Com esta configuração, qualquer gateway WebSocket que você criar agora estará usando o Redis para a comunicação entre as instâncias, garantindo que as mensagens sejam distribuídas corretamente em uma arquitetura de microserviços.

4. Criando o Gateway WebSocket
   A partir daqui, o gateway se comporta de forma padrão, mas a mágica da escalabilidade está por trás das cenas, no adaptador que você configurou.

TypeScript

// src/events/events.gateway.ts
import {
WebSocketGateway,
WebSocketServer,
OnGatewayConnection,
OnGatewayDisconnect,
SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
cors: {
origin: '\*',
},
})
export class EventsGateway
implements OnGatewayConnection, OnGatewayDisconnect
{
@WebSocketServer()
server: Server;

handleConnection(client: Socket, ...args: any[]) {
console.log(`Cliente conectado: ${client.id}`);
}

handleDisconnect(client: Socket) {
console.log(`Cliente desconectado: ${client.id}`);
}

@SubscribeMessage('sendMessage')
handleMessage(client: Socket, payload: string): void {
// Quando uma mensagem é recebida, ela é enviada para todas as instâncias via Redis
this.server.emit('messageToClient', `[${client.id}]: ${payload}`);
}
}
Neste exemplo, o método handleMessage recebe uma mensagem de um cliente. Quando this.server.emit é chamado, o adaptador do Redis é usado para publicar a mensagem no canal apropriado. Todas as outras instâncias do serviço de WebSocket se inscrevem neste canal, recebem a mensagem e a retransmitem para seus próprios clientes, garantindo que todos os clientes recebam a notificação em tempo real, independentemente da instância a que estão conectados.

Vantagens dessa abordagem
Escalabilidade: Você pode rodar múltiplas instâncias do seu serviço de WebSocket, distribuindo a carga e garantindo alta disponibilidade. O Redis se encarrega de sincronizar o estado entre elas.

Confiabilidade: O uso de Redis como um ponto de comunicação centralizado torna o sistema mais robusto e menos propenso a falhas de comunicação entre serviços.

Decoupling: O gateway WebSocket não precisa saber nada sobre as outras instâncias ou como elas estão rodando. Ele apenas se comunica com o Redis, que lida com o resto.

Essa arquitetura é ideal para qualquer aplicação que precise de comunicação em tempo real e precise escalar horizontalmente, como plataformas de chat, dashboards em tempo real ou sistemas de notificação.
