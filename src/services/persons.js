import axios from 'axios';

//const urlBase = 'http://localhost:3001/api/persons';
const urlBase = '/api/persons';
const getPersons = () => {
  const request = axios.get(urlBase);
  return request.then((response) => response.data);
};

const createPerson = (personObject) => {
  const request = axios.post(urlBase, personObject);
  return request.then((response) => response.data);
};

//Funcion para eliminar el contacto de una persona
const deletePerson = (id) => axios.delete(`${urlBase}/${id}`);

//Funcion para actualizar los numeros
const updateNumber = (id, personObject) => {
  const request = axios.put(`${urlBase}/${id}`, personObject);
  return request.then((response) => response.data);
};

const services = {
  getPersons,
  createPerson,
  deletePerson,
  updateNumber,
};

export default services;

