const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

// ``

module.exports = async (app) => {
    // para traer todos los usuarios
    app.get("/api/vehiculos", async (req, res, next) => {
        try {
            res.json({ res: 'ok', message: "Hola Benja" }).status(200)
        } catch (error) {

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