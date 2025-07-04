import { integer } from "drizzle-orm/gel-core";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const JsonForms = pgTable('jsonForms', {
  id: serial('id').primaryKey(),
  jsonform: text('jsonform').notNull(),
  theme:varchar('theme'),
  background:varchar('background'),
  style:varchar('style'),
 createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt').notNull(),
});
export const userResponses=pgTable('userResponses',{
   id: serial('id').primaryKey(),
  jsonResponse: text('jsonResponse').notNull(),
   createdBy: varchar('createdBy').default('anonymus'),
  createdAt: varchar('createdAt').notNull(),
  formRef:integer('formRef').references(()=>JsonForms.id)
});

export const User = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  credit: integer('credit').notNull().default(5),
})