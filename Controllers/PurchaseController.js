
import Purchase from '../Models/AuthSchema.js';
import Asset from '../Models/AuthSchema.js';

export const createPurchase = async (req, res) => {
  const { assetId, quantity, baseId } = req.body;
  try {
    if (req.user.role !== 'Admin' && baseId !== req.user.baseId.toString()) {
      return res.status(403).json({ message: 'Cannot record purchases for other bases' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (asset.baseId.toString() !== baseId) {
      return res.status(400).json({ message: 'Asset does not belong to specified base' });
    }

    const purchase = new Purchase({
      assetId,
      quantity,
      baseId,
      recordedBy: req.user._id
    });

    asset.closingBalance += quantity;
    await asset.save();

    await purchase.save();
    res.status(201).json({ message: 'Purchase recorded successfully', purchase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchasesByBase = async (req, res) => {
  const { baseId } = req.params;
  try {
    if (req.user.role !== 'Admin' && baseId !== req.user.baseId.toString()) {
      return res.status(403).json({ message: 'Cannot access other base purchases' });
    }

    const purchases = await Purchase.find({ baseId })
      .populate('assetId')
      .populate('recordedBy', 'username role');
      
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};