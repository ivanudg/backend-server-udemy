// imports
var mongosse = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongosse.Schema;
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

var usuarioSchema = new Schema({
    "nombre": { type: String, required: [true, 'El nombre es necesario'] },
    "email": { type: String, unique: true, required: [true, 'El correo es necesario'] },
    "password": { type: String, required: [true, 'La contraseña es necesaria'] },
    "img": { type: String, required: false },
    "role": { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongosse.model('Usuario', usuarioSchema);