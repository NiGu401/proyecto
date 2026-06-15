const express = require("express");
const db = require("../db");
const mercadopago = require("mercadopago");
require("dotenv").config();

const router = express.Router();

// Importar MercadoPago SDK nuevo
const { MercadoPagoConfig, Preference } = mercadopago;

// Configurar MercadoPago
const token = process.env.MP_TOKEN || process.env.MP_CLIENT_SECRET || "TEST-456329737082726-2026042-55a188c5c4203f71895830e231e50458-259213549";

const client = new MercadoPagoConfig({
  token: token,
});

/**
 * @route POST /api/pago/crear
 * @description Crear un pago con MercadoPago
 */
router.post("/api/pago/crear", async (req, res) => {
  try {
    const { items, nombre, email, telefono } = req.body;

    // Validar items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: "❌ Debes agregar al menos un producto" });
    }

    // Calcular total
    const total = items.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);

    if (total <= 0) {
      return res.status(400).json({ mensaje: "❌ El total debe ser mayor a 0" });
    }

    // Preparar items para MercadoPago
    const mpItems = items.map((item) => ({
      title: item.nombre,
      unit_price: parseFloat(item.precio),
      quantity: item.cantidad,
      currency: "ARS", // Peso argentino
    }));

    // Crear preferencia de pago
    const preference = new Preference(client);
    
    const body = {
      items: mpItems,
      payer: {
        email: email || "",
        first_name: nombre || "",
        last_name: "",
        phone: telefono || "",
      },
      external_reference: `PEDIDO_${Date.now()}`,
      back_url: "http://localhost:5173",
      metadata: {
        carrito_id: Date.now(),
      },
      // Opciones de pago
      payment_methods: {
        installation_fee_min: 0,
      },
    };

    const response = await preference.create(body);

    // Guardar en DB
    const sql = `
      INSERT INTO pagos (
        tipo_pago, monto, estado, nombre, email, telefono,
        detalles, respuesta_mercado_pago, id_presupuesto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        "mercado_pago",
        total,
        "pendiente",
        nombre || null,
        email || null,
        telefono || null,
        JSON.stringify({ items: mpItems }),
        JSON.stringify(response),
        null,
      ],
      (error) => {
        if (error) {
          console.error("Error al guardar el pago en DB:", error);
        }
      }
    );

    // Retornar la URL de pago
    res.json({
      success: true,
      id: response.id,
      urlPago: response.sandbox_init_point,
      urlApi: response.api_runner_url,
      mensaje: "✅ Pago creado exitosamente"
    });

  } catch (error) {
    console.error("Error al crear el pago:", error);
    res.status(500).json({
      mensaje: "❌ Error al crear el pago",
      error: error.message,
    });
  }
});

/**
 * @route GET /api/pagos
 * @description Obtener todos los pagos
 */
router.get("/api/pagos", (req, res) => {
  const sql = `
    SELECT * FROM pagos 
    ORDER BY fecha_registro DESC
  `;

  db.query(sql, [], (error, resultado) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener los pagos",
      });
    }
    res.json({ pagos: resultado });
  });
});

/**
 * @route PUT /api/pago/:id/actualizar
 * @description Actualizar el estado de un pago
 */
router.put("/api/pago/:id/actualizar", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const validos = ["pendiente", "aprobado", "rechazado", "reembolsado", "en_transito", "devolucion_montototal", "debitado"];
  if (!validos.includes(estado)) {
    return res.status(400).json({
      mensaje: "Estado no válido. Usa: pendiente, aprobado, rechazado, reembolsado, en_transito, devolucion_montototal, debitado",
    });
  }

  const sql = `UPDATE pagos SET estado = ? WHERE id = ?`;

  db.query(sql, [estado, id], (error) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al actualizar el pago",
        error: error.message,
      });
    }
    res.json({ mensaje: "✅ Estado de pago actualizado" });
  });
});

/**
 * @route POST /api/pago/manual
 * @description Registrar pago manual (efectivo/tarjeta en local)
 */
router.post("/api/pago/manual", (req, res) => {
  const { items, nombre, email, telefono, metodo_pago, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ mensaje: "❌ Debes agregar al menos un producto" });
  }

  const sql = `
    INSERT INTO pagos (
      tipo_pago, monto, estado, nombre, email, telefono,
      detalles, respuesta_mercado_pago, id_presupuesto
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      metodo_pago || "efectivo",
      parseFloat(total),
      "aprobado",
      nombre || null,
      email || null,
      telefono || null,
      JSON.stringify({ items }),
      JSON.stringify({ metodo: metodo_pago }),
      null,
    ],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          mensaje: "❌ Error al registrar el pago manual",
          error: error.message,
        });
      }
      res.json({
        mensaje: "✅ Pago manual registrado exitosamente",
        id: result.insertId,
      });
    }
  );
});

module.exports = router;
