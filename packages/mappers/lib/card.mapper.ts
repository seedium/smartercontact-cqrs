import { DataMapper } from 'core';
import { Card } from 'protos/billing/entities/card.entity_pb';
import type { Card as CardDto } from 'protos/billing/entities/card.entity_pb';

// TODO example of idea how to avoid a lot of duplication for mappers
/*
* ```ts
* @Mapper(Card, {
*   Id: 'id',
*   CardNumber: 'card_number',
*   CardCvc: 'card_cvc',
*   CardExp: 'card_exp',
*   user: 'user',
* });
* export class CardMapper extends DataMapper<Card> {
*
* }
* ```
* */
export class CardMapper extends DataMapper<Card, CardDto.AsObject> {
  public readonly map = {
    Id: 'id',
    CardNumber: 'card_number',
    CardCvc: 'card_cvc',
    CardExp: 'card_exp',
    User: 'user',
  };
  public readonly entity = Card;
}
