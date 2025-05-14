
import express from 'express';
const router = express.Router();

import { createAsset, getAllAssets, getAssetsByBase } from '../Controllers/Asset1controller.js';
import { createPurchase, getPurchasesByBase } from '../Controllers/PurchaseController.js';
import { createTransfer, getTransfersByBase } from '../Controllers/TransferController.js';
import { loginUser, registerUser } from '../Controllers/UserController.js';
import { authenticate, authorize } from '../Middlewares/AuthMiddleware.js';

router.post('/register', authenticate, authorize(['Admin']), registerUser);
router.post('/login', loginUser);

router.post('/assets', authenticate, authorize(['Admin']), createAsset);
router.get('/assets', authenticate, getAllAssets);
router.get('/assets/:baseId', authenticate, getAssetsByBase);

router.post('/purchases', authenticate, authorize(['Admin', 'Logistics Officer']), createPurchase);
router.get('/purchases/:baseId', authenticate, getPurchasesByBase);

router.post('/transfers', authenticate, authorize(['Admin', 'Logistics Officer']), createTransfer);
router.get('/transfers/:baseId', authenticate, getTransfersByBase);

export default router;