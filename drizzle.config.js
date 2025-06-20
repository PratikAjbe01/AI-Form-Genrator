import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_nILPE0eO2cXR@ep-round-hat-a8imlycu-pooler.eastus2.azure.neon.tech/AI-Form-Generator?sslmode=require',
  }
});
