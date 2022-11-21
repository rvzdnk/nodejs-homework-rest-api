const Contact = require("./schemas/contact");
const mongoose = require("mongoose");

const getAllContacts = async () => Contact.find({}).lean();
  
const getContactById = async (contactId) => {
	let objectIdContactId;
	try {
		objectIdContactId = ObjectId(contactId);
	} catch (error) {
		return null;
	}
	return Contact.findOne({ _id: objectIdContactId }).lean();
};

const createContact = async (body) => Contact.create(body);
  
const removeContact = async (contactId) => {
	let objectIdContactId;
	try {
		objectIdContactId = ObjectId(contactId);
	} catch (error) {
		return null;
	}
	return Contact.deleteOne({ _id: objectIdContactId });
};
  
const updateContact = async (contactId, body) => {
	let objectIdContactId;
	try {
		objectIdContactId = ObjectId(contactId);
	} catch (error) {
		return null;
	}
	return Contact.findOneAndUpdate(
		{
			_id: objectIdContactId,
		},
		{ $set: body },
		{
			new: true,
			runValidators: true,
			strict: "throw",
		}
	);
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
  };