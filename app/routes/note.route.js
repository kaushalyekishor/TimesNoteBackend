var express = require('express');
const router = express.Router();
expressValidator = require('express-validator');
//var noteController = require('../controller/note.controller');
const NoteController = require('../controller/note.controller');
//const { model } = require('../model/note.model');
router.use(expressValidator());
var noteController = new NoteController();
router.post('/creatNote', noteController.addNote);

module.exports = router
//module.exports = NoteController;