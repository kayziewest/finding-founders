import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const guests=sqliteTable('guests',{
 id:text('id').primaryKey(),name:text('name').notNull(),email:text('email').notNull(),dates:text('dates').notNull(),activities:text('activities').notNull(),topics:text('topics').notNull(),vibe:text('vibe').notNull(),about:text('about').notNull(),hopes:text('hopes').notNull(),pairing:integer('pairing').notNull().default(0),createdAt:text('created_at').notNull()
});
