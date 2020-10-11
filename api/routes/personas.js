const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10
// ``

module.exports = async (app) => {
    // para traer todos los usuarios
    app.get("/api/v1.0/personas/natural", async (req, res, next) => {
        try {
            let query;
            const doc_ide = req.params.docide;
            if (doc_ide == "all") {
                query = `select * from pbperson.tbpernat`;
            } else {
                query = `select * from pbperson.tbpernat limit 10`;
            }
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            console.log("chamex: " + user.length);
            // con esto muestro msj
            if (user.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", user}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", user }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // Para insertar o modificar personas naturales
    app.post("/api/v1.0/personas/natural", async (req, res, next) => {
        try {
            var doc_ide = req.body.doc_ide;
            var ape_pat = req.body.ape_pat;
            var ape_mat = req.body.ape_mat;
            var nombres = req.body.nombres;
            var telefon = req.body.telefo;
            var cod_per;

            const query = `select pbperson.f_co_pernat(
                '${doc_ide}', 
                '${ape_pat}', 
                '${ape_mat}', 
                '${nombres}'
            );`;
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            //console.log("chamex: " + user[0].f_co_pernat);
            cod_per = user[0].f_co_pernat;
            if (user.codRes == 99) {
                // con esto muestro msj
                res.json({ res: 'ko', message: "Error al insertar Persona.", user }).status(200)
            }
            const query2 = `select pbperson.pbpertel(
                cast( ${cod_per} as integer), 
                '${telefon}'
            );`;
            bitacora.control(query2, req.url)
            const telef = await BD.storePostgresql(query2);
            if (telef.codRes == 99) {
                // con esto muestro msj
                res.json({ res: 'ko', message: "Error al insertar Telefono.", telef }).status(200)
            }
            
            res.json({ res: 'ok', message: "Se registró datos correctamente" }).status(500)
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })
}