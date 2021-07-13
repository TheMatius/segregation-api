const Risk = require('../models/Risk');

const getAll = async (req, res, next) => {
  try {
    const risks = await Risk.find({});
    res.json({
      ok: true,
      risks
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const risk = req.body;
    if (!risk) {
      return res.status(400).json({
        ok: false,
        error: 'No se ha recibido el riesgo.'
      });
    }

    const { transactionOne, transactionTwo, name, description } = risk;
    const riskDB = new Risk({
      transactionOne,
      transactionTwo,
      name,
      description
    });

    const savedRisk = await riskDB.save();
    res.json({
      ok: true,
      risk: savedRisk
    });
  } catch (err) {
    next(err);
  }
  
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const risk = req.body;
    if (!risk) {
      return res.status(400).json({
        ok: false,
        error: 'No se ha recibido el riesgo.'
      });
    }
    const { name, description } = risk;
    const updatedRisk = await Risk.findOneAndUpdate(id, {  name, description }, { new: true });
    res.json({
      ok: true,
      risk: updatedRisk
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Risk.findById(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getAll,
  create,
  update,
  remove
};