const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10
// ``

module.exports = async (app) => {
    // para traer todos los usuarios
    app.get("/api/v1.0/personas/:docide", async (req, res, next) => {
        try {
            let query;
            const doc_ide = req.params.docide;
            if (doc_ide == "all") {
                query = `select * from fwconacc.sp_mostrar_usuari('')`;
            } else {
                query = `select * from fwconacc.sp_mostrar_usuari('${doc_ide}')`;
            }
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            // con esto muestro msj
            if (user.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", user }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", user }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })
}