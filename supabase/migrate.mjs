import { createClient } from "@supabase/supabase-js"
import fs from "fs"

const supabase = createClient(
  "https://hvmctiqzjbqsghuwhquk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bWN0aXF6amJxc2dodXdocXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEyOTYwOCwiZXhwIjoyMDk3NzA1NjA4fQ.RqR8FPN6dUUviSAppbtMMpM8wTyO42hnZ_1iZLq0sgE"
)

const sql = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8")

const { error } = await supabase.sql(sql)
if (error) console.error("❌", error.message)
else console.log("✅ Schema creado exitosamente")
