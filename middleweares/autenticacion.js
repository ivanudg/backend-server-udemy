var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ============================================================================================
// Verificar Token
// ============================================================================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

}

// ============================================================================================
// Verifica ADMIN
// ============================================================================================
exports.verificaAdminRole = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es adminnistrador',
            errors: { message: 'No es administrador' }
        });
    }
}

// ============================================================================================
// Verifica Admin o Mismo Usuario
// ============================================================================================
exports.verificaAdminRoleMismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es adminnistrador ni es tu usuario',
            errors: { message: 'No es administrador' }
        });
    }
}