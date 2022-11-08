const express = require('express');

const actions = require("../../models/contacts");
const { validationAddContact, validationUpdateContact } = require("../../tools/validation");

const router = express.Router();

router.get('/', async (req, res, next) => {
    const contacts = await actions.listContacts();
    res.json({
			  status: "success",
			  code: 200,
			  data: { contacts },
		});
})

router.get('/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await actions.getContactById(contactId);
    if (contact) {
			  res.json({
				    status: "success",
				    code: 200,
				    data: { contact },
			  });
		} else {
			  res.json({
				    status: "failure",
				    code: 404,
				    message: "Not found",
			  });
		}
})

router.post('/', async (req, res, next) => {
    const body = req.body;
  if (validationAddContact(body).error) {
    return res.json({
      status: "failure",
      code: 400,
      message: `Missing required field name`,
    });
  } else {
    const newContact = await actions.addContact(body);
    return res.json({
      status: "success",
      code: 201,
      data: { newContact },
    });
  };
  });

router.delete('/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
		const contact = await actions.removeContact(contactId);
		if (contact) {
			  res.json({
				    status: "success",
				    code: 200,
				    message: "Contact deleted",
			  });
		} else {
			  res.json({
				    status: "failure",
				    code: 404,
				    message: "Not found",
			  });
		}
})

router.put('/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const body = req.body;
	if (validationUpdateContact.error(body)) {
		return res.json({
			status: "failure",
			code: 400,
			message: `Missing field`,
		});
	}
    const contact = await actions.updateContact(contactId, body);
		if (contact) {
			  return res.json({
				    status: "success",
				    code: 200,
				    data: {
					      contact,
				    },
			  });
		} else {
			  return res.status(404).json({
				    status: "failure",
				    code: 404,
				    message: "Not Found",
			  });
  }
})

module.exports = router;
