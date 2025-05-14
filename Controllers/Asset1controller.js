

import Asset from "../Models/AuthSchema.js";
import Base from "../Models/AuthSchema.js";

export const createAsset = async (req, res) => {
  const { assetName, assetType, baseId, openingBalance, closingBalance } = req.body;
  console.log('Request User:', req.user); 
  console.log('Request Body:', req.body); 

  try {
    const base = await Base.findById(baseId);
    if (!base) return res.status(404).json({ message: 'Base not found' });

    const newAsset = new Asset({
      assetName,
      assetType,
      baseId,
      openingBalance,
      closingBalance: openingBalance
    });

    await newAsset.save();
    res.status(201).json({ message: 'Asset created successfully', asset: newAsset });
  } catch (error) {
    console.log('Error creating asset:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllAssets = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      const assets = await Asset.find().populate('baseId');
      return res.json(assets);
    }
    
    const assets = await Asset.find({ baseId: req.user.baseId }).populate('baseId');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssetsByBase = async (req, res) => {
  const { baseId } = req.params;
  try {
    if (req.user.role !== 'Admin' && baseId !== req.user.baseId.toString()) {
      return res.status(403).json({ message: 'Cannot access other base assets' });
    }

    const assets = await Asset.find({ baseId }).populate('baseId');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};