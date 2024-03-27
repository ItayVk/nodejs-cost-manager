//require everything we need to define the cost modal
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define the cost schema
const CostSchema = new Schema({
    user_id: {
        type: Number
    },
    year: {
        type: Number
    },
    month: {
        type: Number
    },
    day: {
        type: Number
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    sum: {
        type: Number
    },
    id: {
      type: mongoose.Types.ObjectId,
      require: true,
      default: function () {
          return this._id
      }
    }
}, {versionKey: false});

//create the cost modal
const Cost = mongoose.model('Costs', CostSchema, 'Costs');

//export the cost modal
module.exports = Cost;