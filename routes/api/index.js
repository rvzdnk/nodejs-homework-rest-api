const express = require('express');
const router = express.Router();
const contactController = require('../../controller/index');
const validate = require("../../tools/validation");

router.get("/contacts", contactController.getContacts);

router.get("/contacts/:contactId", contactController.getContactById);

router.post("/contacts", validate.createContact, contactController.createNewContact);

router.delete("/contacts/:contactId", contactController.removeContact);

router.put(
	"/contacts/:contactId",
	validate.updateContact,
	contactController.updateContact,
);

router.patch(
	"/contacts/:contactId/favorite",
	validate.updateStatusContact,
	contactController.updateFavoriteContact,
);

module.exports = router;