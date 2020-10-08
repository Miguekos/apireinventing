const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

// ``

module.exports = async (app) => {
    // para traer todos los vehiculos
    app.get("/api/vehiculos", async (req, res, next) => {
        try {
            let query;
            const pla_veh = req.params.plaveh;
            if (pla_veh) {
                query = `select * from fwconacc.sp_mostrar_vehicu('${pla_veh}')`;
            } else {
                query = `select * from fwconacc.sp_mostrar_vehicu('')`;
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

    // para agregar un usuario
    app.post("/api/vehiculos", async (req, res, next) => {
        try {
            res.json({ res: 'ok', message: "Esto mismo" }).status(200)
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