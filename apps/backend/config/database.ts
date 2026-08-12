import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import env from '#start/env'

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION')!, // Должно быть 'postgres'
  connections: {
    postgres: {
      client: 'pg', // <-- Клиент для PostgreSQL
      connection: {
        host: env.get('PG_HOST'),
        port: 5432,
        user: env.get('PG_USER'),
        password: env.get('PG_PASSWORD'),
        database: env.get('PG_DB_NAME'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
    // sqlite можно оставить, но он не используется
  },
})

export default dbConfig
