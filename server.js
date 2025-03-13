const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Para que Express pueda entender JSON en el body

// Configuración de la base de datos
const dbConfig = {
  user: "Contacto",
  password: "1234",
  server: "LAPTOP-QKC6E3RU",
  database: "ContactFormDB",
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};

// Conexión a la base de datos
sql.connect(dbConfig)
  .then(() => {
    console.log("✅ Conectado a SQL Server");
  })
  .catch(err => {
    console.error("❌ Error de conexión:", err);
  });

// Ruta POST para el formulario
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  try {
    console.log("📩 Datos recibidos:", req.body); // Verifica si los datos llegan correctamente

    const request = new sql.Request();
    const query = `
      INSERT INTO contact_messages (name, email, phone, message)
      VALUES ('${name}', '${email}', '${phone}', '${message}')
    `;
    
    await request.query(query);

    res.json({ message: "✅ Mensaje guardado exitosamente" });
  } catch (err) {
    console.error("❌ Error al guardar mensaje:", err);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

// Ruta GET para ver los mensajes almacenados
app.get("/api/contact", async (req, res) => {
  try {
    const result = await new sql.Request().query("SELECT * FROM contact_messages");
    res.json(result.recordset); // Devuelve todos los registros
  } catch (err) {
    console.error("❌ Error al obtener mensajes:", err);
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM contact_messages");
    console.log("🔍 Solicitud GET recibida");
    res.json(result.recordset);  // Devuelve los registros como respuesta
  } catch (err) {
    console.error("❌ Error al obtener los mensajes:", err);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
