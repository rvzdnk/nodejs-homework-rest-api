const fs = require('fs').promises;
const path = require('path');
const { nanoid } = require("nanoid");

const contactPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  try {
    const contactsList = await fs.readFile(contactPath);
    return JSON.parse(contactsList);
  } catch (error) {
    console.error(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.filter(({ id }) => id === contactId);
    return contact;
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactById = await getContactById(contactId);
    const updateContactsList = contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactPath, JSON.stringify(updateContactsList))
    return contactById;
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      ...body,
    }
    const addNewContact = [newContact, ...contacts];
    await fs.writeFile(contactPath, JSON.stringify(addNewContact));
    return newContact;
  } catch (error) {
    console.error(error);
  }
};


const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(({ id }) => id === contactId);
    if (index === -1) return;
    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
