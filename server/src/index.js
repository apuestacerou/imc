import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pg from "pg";

const { Pool } = pg;

const PORT = Number(process.env.PORT) || 3000;
const LISTEN_HOST = process.env.LISTEN_HOST || "0.0.0.0";
const JWT_SECRET = process.env.JWT_SECRET;

/** Evita cuelgues con algunos clientes; `pg` usa TCP y suele ir bien con sslmode=require. */
function normalizeNeonDatabaseUrl(url) {
  if (!url || typeof url !== "string") return url;
  try {
    const u = new URL(url);
    if (u.searchParams.has("channel_binding")) {
      u.searchParams.delete("channel_binding");
      console.warn(
        "[env] Se quitó channel_binding de DATABASE_URL (recomendado con node-postgres)."
      );
    }
    return u.href;
  } catch {
    return url.replace(/([?&])channel_binding=[^&]*/gi, (m, sep) => sep).replace(/\?&/g, "?");
  }
}

const DATABASE_URL = normalizeNeonDatabaseUrl(process.env.DATABASE_URL);

if (!JWT_SECRET || !DATABASE_URL) {
  console.error("Faltan JWT_SECRET o DATABASE_URL en server/.env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 15_000,
  // Neon exige TLS; la URL suele llevar sslmode=require
  ssl: DATABASE_URL.includes("sslmode=disable") ? false : { rejectUnauthorized: true },
});

pool.on("error", (err) => {
  console.error("[pg] Error inesperado en el pool:", err.message);
});

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

function signToken(userId, email) {
  return jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: "30d" });
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado" });
  }
  try {
    const payload = jwt.verify(h.slice(7), JWT_SECRET);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function mapUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    nombre: row.nombre,
    edad: row.edad,
    alturaCm: row.altura_cm,
    pesoInicialKg: Number(row.peso_inicial_kg),
    createdAt: row.created_at,
  };
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, nombre, edad, alturaCm, pesoInicialKg } = req.body || {};
    const em = String(email || "")
      .trim()
      .toLowerCase();
    const pw = String(password || "");
    const nom = String(nombre || "").trim();
    const ed = parseInt(String(edad), 10);
    const alt = parseInt(String(alturaCm), 10);
    const peso = parseFloat(String(pesoInicialKg).replace(",", "."));

    if (!em || !pw || pw.length < 6) {
      return res.status(400).json({ error: "Email y contraseña (mín. 6 caracteres) requeridos." });
    }
    if (!nom || !Number.isFinite(ed) || ed < 1 || ed > 120) {
      return res.status(400).json({ error: "Nombre y edad válidos requeridos." });
    }
    if (!Number.isFinite(alt) || alt < 50 || alt > 260 || !Number.isFinite(peso) || peso <= 0) {
      return res.status(400).json({ error: "Altura (cm) y peso inicial no válidos." });
    }

    const hash = await bcrypt.hash(pw, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, nombre, edad, altura_cm, peso_inicial_kg)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, nombre, edad, altura_cm, peso_inicial_kg, created_at`,
      [em, hash, nom, ed, alt, peso]
    );
    const user = mapUserRow(rows[0]);
    const token = signToken(user.id, user.email);
    return res.status(201).json({ token, user });
  } catch (e) {
    if (String(e?.message || "").includes("unique") || e?.code === "23505") {
      return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
    }
    console.error(e);
    return res.status(500).json({ error: "Error al registrar." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const em = String(email || "")
      .trim()
      .toLowerCase();
    const pw = String(password || "");
    if (!em || !pw) {
      return res.status(400).json({ error: "Email y contraseña requeridos." });
    }
    const { rows } = await pool.query(
      `SELECT id, email, nombre, edad, altura_cm, peso_inicial_kg, created_at, password_hash
       FROM users WHERE email = $1 LIMIT 1`,
      [em]
    );
    const row = rows[0];
    if (!row || !(await bcrypt.compare(pw, row.password_hash))) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }
    const user = mapUserRow({
      id: row.id,
      email: row.email,
      nombre: row.nombre,
      edad: row.edad,
      altura_cm: row.altura_cm,
      peso_inicial_kg: row.peso_inicial_kg,
      created_at: row.created_at,
    });
    const token = signToken(user.id, user.email);
    return res.json({ token, user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al iniciar sesión." });
  }
});

app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, nombre, edad, altura_cm, peso_inicial_kg, created_at
       FROM users WHERE id = $1 LIMIT 1`,
      [req.userId]
    );
    const user = mapUserRow(rows[0]);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al cargar perfil." });
  }
});

app.patch("/api/me", authMiddleware, async (req, res) => {
  try {
    const { nombre, edad, alturaCm, pesoInicialKg } = req.body || {};
    const { rows: curRows } = await pool.query(
      `SELECT id, email, nombre, edad, altura_cm, peso_inicial_kg, created_at FROM users
       WHERE id = $1 LIMIT 1`,
      [req.userId]
    );
    const cur = curRows[0];
    if (!cur) return res.status(404).json({ error: "Usuario no encontrado." });

    const nom = nombre != null ? String(nombre).trim() : cur.nombre;
    const ed = edad != null ? parseInt(String(edad), 10) : cur.edad;
    const alt = alturaCm != null ? parseInt(String(alturaCm), 10) : cur.altura_cm;
    const peso =
      pesoInicialKg != null
        ? parseFloat(String(pesoInicialKg).replace(",", "."))
        : Number(cur.peso_inicial_kg);

    if (!nom || !Number.isFinite(ed) || ed < 1 || ed > 120) {
      return res.status(400).json({ error: "Datos no válidos." });
    }
    if (!Number.isFinite(alt) || alt < 50 || alt > 260 || !Number.isFinite(peso) || peso <= 0) {
      return res.status(400).json({ error: "Altura o peso no válidos." });
    }

    const { rows: updated } = await pool.query(
      `UPDATE users SET
         nombre = $1,
         edad = $2,
         altura_cm = $3,
         peso_inicial_kg = $4
       WHERE id = $5
       RETURNING id, email, nombre, edad, altura_cm, peso_inicial_kg, created_at`,
      [nom, ed, alt, peso, req.userId]
    );
    return res.json(mapUserRow(updated[0]));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al actualizar perfil." });
  }
});

app.get("/api/imc-registros", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, peso_kg, altura_cm, imc, categoria, modo, z_score, recorded_at
       FROM imc_registros
       WHERE user_id = $1
       ORDER BY recorded_at DESC
       LIMIT 200`,
      [req.userId]
    );
    const list = rows.map((r) => ({
      id: r.id,
      pesoKg: Number(r.peso_kg),
      alturaCm: r.altura_cm,
      imc: Number(r.imc),
      categoria: r.categoria,
      modo: r.modo,
      zScore: r.z_score != null ? Number(r.z_score) : undefined,
      recordedAt: r.recorded_at,
    }));
    return res.json(list);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al listar registros." });
  }
});

app.post("/api/imc-registros", authMiddleware, async (req, res) => {
  try {
    const { pesoKg, alturaCm, imc, categoria, modo, zScore, recordedAt } = req.body || {};
    const peso = parseFloat(String(pesoKg).replace(",", "."));
    const alt = parseInt(String(alturaCm), 10);
    const imcN = parseFloat(String(imc).replace(",", "."));
    const cat = String(categoria || "").trim();
    const mod = modo === "nino" ? "nino" : "adulto";
    const zs =
      zScore === undefined || zScore === null ? null : parseFloat(String(zScore));
    const ts = recordedAt ? new Date(recordedAt) : new Date();

    if (!Number.isFinite(peso) || !Number.isFinite(alt) || !Number.isFinite(imcN) || !cat) {
      return res.status(400).json({ error: "Datos de registro incompletos." });
    }

    const { rows: ins } = await pool.query(
      `INSERT INTO imc_registros (user_id, peso_kg, altura_cm, imc, categoria, modo, z_score, recorded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, peso_kg, altura_cm, imc, categoria, modo, z_score, recorded_at`,
      [
        req.userId,
        peso,
        alt,
        imcN,
        cat,
        mod,
        Number.isFinite(zs) ? zs : null,
        ts.toISOString(),
      ]
    );
    const r = ins[0];
    return res.status(201).json({
      id: r.id,
      pesoKg: Number(r.peso_kg),
      alturaCm: r.altura_cm,
      imc: Number(r.imc),
      categoria: r.categoria,
      modo: r.modo,
      zScore: r.z_score != null ? Number(r.z_score) : undefined,
      recordedAt: r.recorded_at,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al guardar registro." });
  }
});

app.delete("/api/imc-registros", authMiddleware, async (req, res) => {
  try {
    await pool.query(`DELETE FROM imc_registros WHERE user_id = $1`, [req.userId]);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al borrar historial." });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1 AS ping");
    return res.json({ ok: true, api: true, database: true });
  } catch (e) {
    const msg = e?.message || String(e);
    console.error("[health] Error conectando a la base (pg):", msg);
    return res.status(503).json({
      ok: false,
      api: true,
      database: false,
      error: msg,
    });
  }
});

const server = app.listen(PORT, LISTEN_HOST, () => {
  console.log(
    `Vitality API + Neon (pg pool) en http://${LISTEN_HOST}:${PORT} — conexión TCP al pooler`
  );
});

async function shutdown() {
  try {
    await pool.end();
  } catch (e) {
    console.error(e);
  }
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
