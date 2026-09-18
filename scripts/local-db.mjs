import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
export function database(file=':memory:'){const db=new DatabaseSync(file);db.exec(fs.readFileSync('drizzle/0000_absent_midnight.sql','utf8').replace('CREATE TABLE','CREATE TABLE IF NOT EXISTS'));return {prepare(sql){return {bind(...args){return {run:async()=>db.prepare(sql).run(...args),all:async()=>({results:db.prepare(sql).all(...args)})}},all:async()=>({results:db.prepare(sql).all()})}},close:()=>db.close()};}
