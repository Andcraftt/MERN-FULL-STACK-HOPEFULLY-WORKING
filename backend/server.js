const express = require("express");
const colors = require('colors');
const dotenv = require("dotenv").config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const path = require('path'); // Importa 'path' para manejar rutas de archivos
const port = process.env.PORT || 5001;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de la API
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Serve frontend (archivos estáticos de React) en producción
if (process.env.NODE_ENV === 'production') {
  // Servir los archivos estáticos desde la carpeta build de React
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Redirigir cualquier otra ruta a index.html (React maneja el frontend)
  app.get('*', (req, res) => 
    res.sendFile(path.resolve(__dirname, 'client', 'build'))
  );
} else {
  // Mensaje de bienvenida para cuando no está en producción
  app.get('/', (req, res) => res.send('Please set to production'));
}

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => console.log(`Server started on port ${port}`));
