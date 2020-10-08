const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

// ``

module.exports = async (app) => {
    // para traer todos los vehiculos
    app.get("/api/vehiculos/:plaveh", async (req, res, next) => {
        try {
            let query;
            const co_plaveh = req.params.plaveh;
            if (co_plaveh) {
                query = `select * from wfvehicu.sp_mostrar_vehicu('${co_plaveh}')`;
            } else {
                query = `select * from wfvehicu.sp_mostrar_vehicu('')`;
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

    // para agregar un vehiculo
    app.post("/api/vehiculos", async (req, res, next) => {
        try {
            const co_plaveh = req.body.co_plaveh;
            var co_modveh = req.body.co_modveh;
            var nu_anofab = req.body.nu_anofab;
            var nu_serveh = req.body.nu_serveh;
            var nu_motveh = req.body.nu_motveh;
            var no_colveh = req.body.no_colveh;

            const query = `select wfvehicu.sp_manten_vehicu(
                cast (null as integer),
                '${co_plaveh}',
                '${co_modveh}',
                '${nu_anofab}',
                '${nu_serveh}',
                '${nu_motveh}',
                '${no_colveh}'
            )`;
            // console.log(query);
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            if (user.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", user }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", user }).status(500)
            }
            
        } catch (error) {

        }
    })

    // para actualizar usuarios
    app.put("/api/vehiculos", async (req, res, next) => {
        try {

        } catch (error) {

        }

    })

    // para borrar DELETE asdasdasdfasdf
    app.delete("/api/vehiculos", async (req, res, next) => {
        try {

        } catch (error) {

        }

    })



}