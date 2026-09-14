const express = require('express');

const roomController = require('../controllers/room.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { HOUSEKEEPING_ROLES } = require('../constants/roles');
const {
  idParamValidation,
  listRoomsValidation,
  createRoomValidation,
  updateRoomValidation,
  roomStatusValidation,
} = require('../validators/room.validators');

const router = express.Router();

// ---- Public (guests can browse) ----
router.get('/', listRoomsValidation, validate, roomController.getRooms);
// Must be defined BEFORE /:id so "to-clean" is not treated as a room id.
router.get(
  '/to-clean',
  protect,
  authorize(...HOUSEKEEPING_ROLES),
  roomController.toCleanRooms
);
router.get('/:id', idParamValidation, validate, roomController.getRoom);

// ---- Housekeeping family: quick status changes ----
router.patch(
  '/:id/status',
  protect,
  authorize(...HOUSEKEEPING_ROLES),
  idParamValidation,
  roomStatusValidation,
  validate,
  roomController.updateRoomStatus
);

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