const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {
    ///////////////////////////////////////////// TCSERVIC ///////////////////////////////////
    // mostrar tcservic
    app.get("/api/v1.0/ordcom/:nom_ser", async (req, res, next) => {
        try {
            let query;
            var nom_ser = req.params.nom_ser;

            query = `select *, 'A' base from wfpublic.tcunimed`;
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            console.log('chamex:' + operac[0]);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", operac}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

}