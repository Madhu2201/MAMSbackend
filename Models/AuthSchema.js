import mongoose from 'mongoose'
const baseSchema = new mongoose.Schema({
  baseName: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

const Base = mongoose.model('Base', baseSchema);

const assetSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  assetType: { type: String, enum: ['Weapon', 'Vehicle', 'Ammunition'], required: true },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  openingBalance: { type: Number, default: 0 },
  closingBalance: { type: Number, default: 0 },
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);

const purchaseSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  quantity: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);
const transferSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  quantity: { type: Number, required: true },
  fromBaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  toBaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  transferDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Transfer = mongoose.model('Transfer', transferSchema);

const assignmentSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  assignmentDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);

const expenditureSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  quantity: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expenditureDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Expenditure = mongoose.model('Expenditure', expenditureSchema);

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default {Base, Asset, Purchase, Transfer, Assignment, Expenditure, AuditLog}
