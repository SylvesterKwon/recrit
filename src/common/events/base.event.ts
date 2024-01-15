export abstract class BaseEvent {
  public abstract eventPattern: string;

  // https://docs.nestjs.com/microservices/kafka#outgoing
  // payload serilaize 할 때, class 객체를 toString() 으로 serialize 하는 버그가 있어
  // JSON.stringify() 로 serialize 하도록 method override 함.
  public toString(): string {
    return JSON.stringify(this);
  }
}
