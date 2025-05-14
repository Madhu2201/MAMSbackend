
import Transfer from '..//Models/AuthSchema.js';
import Asset from '../Models/AuthSchema.js';

export const createTransfer = async (req, res) => {
  const { assetId, quantity, fromBaseId, toBaseId } = req.body;
  try {
    if (req.user.role !== 'Admin') {
      if (fromBaseId !== req.user.baseId.toString()) {
        return res.status(403).json({ message: 'Cannot transfer from other bases' });
      }
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (asset.baseId.toString() !== fromBaseId) {
      return res.status(400).json({ message: 'Asset does not belong to source base' });
    }

    if (asset.closingBalance < quantity) {
      return res.status(400).json({ message: 'Insufficient asset balance for transfer' });
    }

    const transfer = new Transfer({
      assetId,
      quantity,
      fromBaseId,
      toBaseId,
      transferredBy: req.user._id
    });

    asset.closingBalance -= quantity;
    await asset.save();

    let targetAsset = await Asset.findOne({ 
      assetName: asset.assetName, 
      assetType: asset.assetType, 
      baseId: toBaseId 
    });

    if (!targetAsset) {
      targetAsset = new Asset({
        assetName: asset.assetName,
        assetType: asset.assetType,
        baseId: toBaseId,
        openingBalance: 0,
        closingBalance: quantity
      });
    } else {
      targetAsset.closingBalance += quantity;
    }

    await targetAsset.save();
    await transfer.save();

    res.status(201).json({ message: 'Transfer recorded successfully', transfer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransfersByBase = async (req, res) => {
  const { baseId } = req.params;
  try {
    if (req.user.role !== 'Admin' && baseId !== req.user.baseId.toString()) {
      return res.status(403).json({ message: 'Cannot access other base transfers' });
    }

    const transfers = await Transfer.find({ 
      $or: [{ fromBaseId: baseId }, { toBaseId: baseId }] 
    })
      .populate('assetId')
      .populate('fromBaseId', 'name')
      .populate('toBaseId', 'name')
      .populate('transferredBy', 'username role');

    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};