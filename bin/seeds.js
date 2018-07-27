const mongoose = require('mongoose');
const Procedure = require('../models/procedure');

const dbName = 'lux-concierge';
mongoose.connect(`mongodb://localhost/lux-concierge`);

const procedures = [
  {
    title: "Juvederm Filler",
    provider: "Juliet Urbina",
    review: String,
  },
  {
    title: "Restylane Fillers",
    provider: "Juliet Urbina",
    review: String,
  },
  {
    title: "Sculptra Fillers",
    provider: "Juliet Urbina",
    review: String,
  },
  {
    title: "Vampire Facial",
    provider: "Juliet Urbina",
    review: String,
  },
  {
    title: "Dermabrasion",
    provider: "Juliet Urbina",
    review: String,
  },
  {
    title: "Permanent Makeup",
    provider: "Juliet Urbina",
    review: String,
  },
  {
    title: "Eyelash Extensions",
    provider: "Juliet Urbina",
    review: String,

  },
  {
    title: "Microblading Eyebrow Tattoo",
    provider: "Juliet Urbina",
    review: String,
  },
  {
    title: "Botox Injections",
    provider: "Heidi Schuler",
    review: String,
  },
  {
    title: "Specialist Procedures",
    provider: "Juliet Urbina",
    review: String,
  },
];

Procedure.create(procedures, (err) => {
    if (err) { throw(err); }
    console.log(`Created ${procedures.length} procedures`);
    mongoose.connection.close();
  });