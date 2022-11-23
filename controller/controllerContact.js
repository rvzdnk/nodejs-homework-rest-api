const service = require("../service/contact");

const getContacts = async (req, res, next) => {
	try {
		const contactsList = await service.getAllContacts();
		res.json({
			status: "success",
			code: 200,
			data: contactsList,
		});
	} catch (error) {
		next(error);
	}
};

const getContactById = async (req, res, next) => {
	const { contactId } = req.params;
	try {
		const contactById = await service.getContactById(contactId);
		if (contactById) {
			res.json({
				status: "success",
				code: 200,
				data: contactById,
			});
		} else {
			res.json({
				status: "failure",
				code: 404,
				message: "Not found",
			});
		}
	} catch (error) {
		next(error);
	}
};

const createNewContact = async (req, res, next) => {
	try {
		const newContact = await service.createContact(req.body);
		res.json({
			status: "success",
			code: 201,
			message: "New user has been created",
			data: newContact,
		});
	} catch (error) {
		next(error);
	}
};

const removeContact = async (req, res, next) => {
	const { contactId } = req.params;
	try {
		const contact = await service.removeContact(contactId);
		if (contact) {
			res.json({
				status: "success",
				code: 200,
				message: "Contact has been deleted",
			});
		} else {
			res.json({
				status: "failure",
				code: 404,
				message: "Not found",
			});
		}
	} catch (error) {
		next(error);
	}
};

const updateContact = async (req, res, next) => {
	const { contactId } = req.params;
	try {
		const contact = await service.updateContact(contactId, req.body);
		if (contact) {
			return res.json({
				status: "success",
				code: 200,
				message: "Contact has been updated",
				data: contact,
			});
		} else {
			return res.status(404).json({
				status: "failure",
				code: 404,
				message: "Not Found",
			});
		}
	} catch (error) {
		next(error);
	}
};

const updateFavoriteContact = async (req, res, next) => {
	const { contactId } = req.params;
	const { favorite } = req.body;
	try {
		const contact = await service.updateContact(contactId, { favorite });
		if (contact) {
			if (favorite) {
				return res.json({
					status: "success",
					code: 200,
					message: "Contact has been added to favorite",
					data: contact,
				});
			}
			return res.json({
				status: "success",
				code: 200,
				message: "Contact has been removed from favorite",
				data: contact,
			});
		} else {
			return res.status(404).json({
				status: "failure",
				code: 404,
				message: "Not Found",
			});
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getContacts,
	getContactById,
	createNewContact,
	removeContact,
	updateContact,
	updateFavoriteContact,
};