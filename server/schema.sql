-- Ejecutar este script en el SQL Editor de Neon (una sola vez por proyecto).
-- https://console.neon.tech → tu proyecto → SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  edad INTEGER NOT NULL CHECK (edad >= 1 AND edad <= 120),
  altura_cm INTEGER NOT NULL CHECK (altura_cm >= 50 AND altura_cm <= 260),
  peso_inicial_kg NUMERIC(6, 2) NOT NULL CHECK (peso_inicial_kg > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS imc_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  peso_kg NUMERIC(6, 2) NOT NULL,
  altura_cm INTEGER NOT NULL,
  imc NUMERIC(7, 3) NOT NULL,
  categoria TEXT NOT NULL,
  modo TEXT NOT NULL CHECK (modo IN ('adulto', 'nino')),
  z_score NUMERIC(8, 4),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_imc_registros_user_recorded
  ON imc_registros (user_id, recorded_at DESC);
