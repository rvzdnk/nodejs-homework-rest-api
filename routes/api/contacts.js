const express = require("express");
const router = express.Router();
const contactController = require("../../controller/controllerContact");
const validate = require("../../middlewares/validationContact");
const authMiddleware = require("../../middlewares/jwt");

router.get("/", authMiddleware, contactController.getContacts);
router.get("/:contactId", contactController.getContactById);
router.post(
	"/",
	authMiddleware,
	validate.createContact,
	contactController.createNewContact,
);
router.delete("/:contactId", contactController.removeContact);
router.put("/:contactId", validate.updateContact, contactController.updateContact);
router.patch(
	"/:contactId/favorite",
	validate.updateStatusContact,
	contactController.updateFavoriteContact,
);

module.exports = router;