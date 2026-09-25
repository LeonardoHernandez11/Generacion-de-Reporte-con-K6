import express from "express";
import cors from 'cors';
import { 
  obtenerTodasLasPizzasAsync, 
  obtenerPizzaPorIdAsync,
  agregarPizzaAsync,
  actualizarPizzaAsync,
  eliminarPizzaAsync, 
} from './repositorios/pizza.repositorio.js';

const app = express();
app.use(cors());

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/pizzas", async (req, res) => {
  const pizzas = await obtenerTodasLasPizzasAsync();
  return res.status(200).json(pizzas);
});

app.get("/api/v1/pizzas/:id", async (req, res) => {
  const id = req.params.id;
  const pizza = await obtenerPizzaPorIdAsync(id);
  
  if (!pizza) {
    return res.status(404).json({ mensaje: "Pizza no encontrada" });
  }
  
  return res.status(200).json(pizza);
});

app.post("/api/v1/pizzas", async (req, res) => {
  const pizza = req.body;
  const id = await agregarPizzaAsync(pizza);

  return res.status(201).json({ id });
});

app.put("/api/v1/pizzas/:id", async (req, res) => {
  const id = req.params.id;
  const pizza = await obtenerPizzaPorIdAsync(id);
  
  if (!pizza) {
    return res.status(404).json({ mensaje: "No existe la pizza con ese id" });
  }

  const pizzaActualizar = req.body;
  await actualizarPizzaAsync(id, pizzaActualizar);

  return res.status(200).json({ mensaje: "Datos actualizados" });
});

app.delete("/api/v1/pizzas/:id", async (req, res) => {
  const id = req.params.id;
  const pizza = await obtenerPizzaPorIdAsync(id);

  if (!pizza) {
    return res.status(404).json({ mensaje: "No existe la pizza con ese id" });
  }

  await eliminarPizzaAsync(id);
  return res.status(200).json({ mensaje: "Datos eliminados" });
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});