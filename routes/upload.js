// imports
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// Modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// inicializar vairbales
var app = express();

// default options
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleciones
    var tiposValidos = ['usuarios', 'medicos', 'hospitales'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiónes aceptamos
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiónes válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
    // Mover el arhcivo del temporal a un path
    var path = `./uploads/${ tipo }/`;
    var pathMover = path + nombreArchivo;

    archivo.mv(pathMover, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, path, nombreArchivo, res);

    });

});

function subirPorTipo(tipo, id, path, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (err) {

                // Eliminar archivo temporal
                eliminarImagen(path + nombreArchivo);

                return res.status(500).json({
                    ok: false,
                    mensaje: 'No se encontró el usuario',
                    errors: err
                });
            }

            if (!usuario) {

                // Eliminar archivo temporal
                eliminarImagen(path + nombreArchivo);

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró el usuario con el ID ' + id,
                    errors: err
                });
            }

            // Si existe, elimina la imagen anterior
            eliminarImagen(path + usuario.img);
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                if (err) {

                    eliminarImagen(path + nombreArchivo);

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar el usuario',
                        errors: err
                    });
                }

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (err) {

                // Eliminar archivo temporal
                eliminarImagen(path + nombreArchivo);

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró el medico',
                    errors: err
                });
            }

            if (!medico) {

                // Eliminar archivo temporal
                eliminarImagen(path + nombreArchivo);

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró el medico con el ID ' + id,
                    errors: err
                });
            }

            // Eliminar la imagen anterior
            eliminarImagen(path + medico.img);
            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                if (err) {

                    eliminarImagen(path + nombreArchivo);

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar el medico',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (err) {

                // Eliminar archivo temporal
                eliminarImagen(path + nombreArchivo);

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró el hospital',
                    errors: err
                });
            }

            if (!hospital) {

                // Eliminar archivo temporal
                eliminarImagen(path + nombreArchivo);

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró el hospital con el ID ' + id,
                    errors: err
                });
            }

            // Eliminar la imagen anterior
            eliminarImagen(path + hospital.img);
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalctualizado) => {

                if (err) {

                    eliminarImagen(path + nombreArchivo);

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar el hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalctualizado
                });
            });
        });
    }
}

function eliminarImagen(pathViejo) {

    if (fs.existsSync(pathViejo)) {

        fs.unlink(pathViejo, err => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pudo eliminar la imagen',
                    errors: err
                });
            }
        });

    }

}

module.exports = app;