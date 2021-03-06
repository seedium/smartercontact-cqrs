import { createMongoConnection } from 'core';

export const commandDb = createMongoConnection(process.env.MONGODB_URI_COMMAND);
export const viewDb = createMongoConnection(process.env.MONGODB_URI_VIEW);
