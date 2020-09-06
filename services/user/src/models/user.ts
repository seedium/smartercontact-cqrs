import { viewDb } from '../lib';

export let user;

export const initUser = () => {
  user = viewDb.db('cqrs_view').collection('users');
};
