import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';
import services from './services/persons';

const App = () => {
 
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: '', number: '' });
  const [filter, setfilter] = useState('');
  const [message, setMessage] = useState({
    body: '',
    type: '',
  });

  const isNewName = persons.find(
    (person) =>
      person.name.toLocaleLowerCase() === newPerson.name.toLocaleLowerCase()
  );

  const serchPersonDelect = persons.filter(
    (person) =>
      person.name.toLocaleLowerCase() === newPerson.name.toLocaleLowerCase()
  );

  //Función de persona nueva
  const addNewName = (event) => {
    event.preventDefault();

    const personObject = {
      name: newPerson.name,
      number: newPerson.number,
    };

    if (!isNewName) {
      services.createPerson(personObject).then(() => {
        setPersons(persons.concat(personObject));
        setNewPerson({ name: '', number: '' });
        getPersons();

        const mesageObject = {
          body: `Added ${personObject.name}`,
          type: 'success',
        };

        setMessage(mesageObject);

        
      });
    } else {
      const confirm = window.confirm(
        `${newPerson.name} is already added to phonebook, replace the old number whit a new one?`
      );

      const id = serchPersonDelect[0].id;

      confirm &&
        services
          .updateNumber(id, personObject)
          .then((response) => {
            setPersons(
              persons.map((person) => (person.id !== id ? person : response))
            );
            setNewPerson({ name: '', number: '' });
            getPersons();
          })
          .catch((error) => {
            console.error(`Update number failed: ${error}`);

            const mesageObject = {
              body: `information of ${personObject.name} has already been removed from server`,
              type: 'error',
            };

            setMessage(mesageObject);
          });
    }
  };

  ///Control para agregar nueva persona
  const handleNewName = (event) =>
    setNewPerson({ ...newPerson, name: event.target.value });

  //Control para agregar nuevo numero de otra persona
  const handleNewPhone = (event) =>
    setNewPerson({ ...newPerson, number: event.target.value });

  //Filtro de control
  const handleFilter = (event) => setfilter(event.target.value);

  //Control para eliminar
  const deletedPerson = (name, id) => {
    const confirmDeleted = window.confirm(`Detele ${name} ?`);
    confirmDeleted &&
      services.deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
  };

  
  const personToShow =
    filter === ''
      ? persons
      : persons.filter(
          (person) =>
            person.name
              .toLocaleLowerCase()
              .indexOf(filter.toLocaleLowerCase()) > -1
        );
        
  // Get persons
  const getPersons = () => {
    services.getPersons().then((response) => {
      return setPersons(response);
    });
  };

  // UseEffect
  useEffect(() => {
    getPersons();
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      {message.body !== '' && <Notification message={message} />}
      <Filter handleFilter={handleFilter} />
      <div>
        <h2>add a new</h2>
      </div>
      <PersonForm
        addNewName={addNewName}
        handleNewName={handleNewName}
        handleNewPhone={handleNewPhone}
        newPerson={newPerson}
      />
      <h2>Numbers</h2>
      <Persons personToShow={personToShow} handleButton={deletedPerson} />
    </div>
  );
};

export default App;