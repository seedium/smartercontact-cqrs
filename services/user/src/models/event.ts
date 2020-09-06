import { commandDb } from '../lib';

export let event;

export const initEvent = () => {
  event = commandDb.db('cqrs_command').collection('events')
}
