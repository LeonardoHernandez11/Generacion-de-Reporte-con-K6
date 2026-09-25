import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DATABASE_NAME = process.env.MONGO_DB_NAME || 'pizzeria';
const COLLECTION_NAME = 'pizzas';

const client = new MongoClient(MONGO_URI);

let dbInstance = null;

async function obtenerColeccionAsync() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db(DATABASE_NAME);
  }
  return dbInstance.collection(COLLECTION_NAME);
}

function construirFiltroId(id) {
  const idNumerico = Number(id);
  if (!isNaN(idNumerico)) {
    return { id: idNumerico };
  }
  if (typeof id === 'string' && ObjectId.isValid(id)) {
    return { _id: new ObjectId(id) };
  }
  return { id: id };
}

export async function obtenerTodasLasPizzasAsync() {
  const coleccion = await obtenerColeccionAsync();
  return await coleccion.find({}).toArray();
}

export async function obtenerPizzaPorIdAsync(id) {
  const coleccion = await obtenerColeccionAsync();
  const filtro = construirFiltroId(id);
  return await coleccion.findOne(filtro);
}

export async function agregarPizzaAsync(pizza) {
  const coleccion = await obtenerColeccionAsync();
  if (pizza.id) {
    pizza.id = Number(pizza.id);
  }
  const resultado = await coleccion.insertOne(pizza);
  return pizza.id || resultado.insertedId.toString();
}

export async function actualizarPizzaAsync(id, pizza) {
  const coleccion = await obtenerColeccionAsync();
  const filtro = construirFiltroId(id);
  
  const datosAActualizar = {};
  if (pizza.nombre) datosAActualizar.nombre = pizza.nombre;
  if (pizza.descripcion) datosAActualizar.descripcion = pizza.descripcion;
  if (pizza.precio) datosAActualizar.precio = pizza.precio;

  return await coleccion.updateOne(filtro, { $set: datosAActualizar });
}

export async function eliminarPizzaAsync(id) {
  const coleccion = await obtenerColeccionAsync();
  const filtro = construirFiltroId(id);
  return await coleccion.deleteOne(filtro);
}