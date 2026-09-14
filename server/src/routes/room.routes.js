const express = require('express');

const roomController = require('../controllers/room.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const {
  idParamValidation,
  listRoomsValidation,
  createRoomValidation,
  updateRoomValidation,
} = require('../validators/room.validators');

const router = express.Router();

// ---- Public (guests can browse) ----
router.get('/', listRoomsValidation, validate, roomController.getRooms);
router.get('/:id', idParamValidation, validate, roomController.getRoom);

// ---- Admin / manager only ----
router.post(
  '/',
  protect,
  authorize('admin', 'manager'),
  createRoomValidation,
  validate,
  roomController.createRoom
);
router.put(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  idParamValidation,
  updateRoomValidation,
  validate,
  roomController.updateRoom
);
router.delete(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  idParamValidation,
  validate,
  roomController.deleteRoom
);

module.exports = router;