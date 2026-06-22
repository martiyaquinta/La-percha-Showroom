const { Pool } = require("pg")
const fs = require("fs")

const pool = new Pool({
  host: "aws-1-us-east-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.hvmctiqzjbqsghuwhquk",
  password: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bWN0aXF6amJxc2dodXdocXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEyOTYwOCwiZXhwIjoyMDk3NzA1NjA4fQ.RqR8FPN6dUUviSAppbtMMpM8wTyO42hnZ_1iZLq0sgE",
  ssl: { rejectUnauthorized: false },
  options: "-c search_path=public",
})

const sql = fs.readFileSync(__dirname + "/schema.sql", "utf8")

pool.query(sql).then(() => {
  console.log("✅ Schema creado exitosamente")
  pool.end()
}).catch(err => {
  console.error("❌ Error:", err.message)
  pool.end()
})
