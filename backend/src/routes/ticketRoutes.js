const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');

router.route('/').get(getAllTickets).post(createTicket);
router.route('/:id').get(getTicketById).put(updateTicket).delete(deleteTicket);

module.exports = router;
