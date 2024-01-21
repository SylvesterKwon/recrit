import { BaseEvent } from 'src/common/events/base.event';
import { ComparableType } from '../types/comparable.types';
import { Comparable } from 'src/common/entities/comparable.entity';

export class ComparableUpdatedEvent extends BaseEvent {
  eventPattern = 'comparable.updated';

  comparableId: number;
  comparableType: ComparableType;
  // TODO: comparable 마다 title 을 가르키는 column 을 반환하는 함수를 BaseComparable 에 추가하고
  // 본 이벤트 emit 시 comparable 객체만 넘기도록 수정하기
  title?: string;

  constructor(comparable: Comparable, title?: string) {
    super();
    this.comparableId = comparable.id;
    this.comparableType = comparable.type;
    this.title = title;
  }
}
