const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dob: String,
  gender: String,
  address: String,
  city: String,
  state: String,
  pincode: String,

  program: String,
  qualification: String,
  school: String,
  board: String,
  passingYear: String,
  percentage: String,

  hostelRequired: String,
  howDidYouHear: String,
  questions: String,

  agreeToTerms: String,
  confirmInformation: String,

  uniqueKey: {
    type: String,
    unique: true
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Admission", AdmissionSchema);
