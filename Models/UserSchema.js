import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['Admin', 'Base Commander', 'Logistics Officer'],
    required: true
  },
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: false 
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User