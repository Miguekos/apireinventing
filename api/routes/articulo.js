const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10
// ``

module.exports = async (app) => {
    // para traer todos los articulos
    app.get("/api/v1.0/articulo/:nombre/:barras", async (req, res, next) => {
        try {
            let query;
            var nom_art = req.params.nombre;
            var cod_bar = req.params.barras;

            nom_art = nom_art.toUpperCase() == 'ALL' ? '' : nom_art;
            cod_bar = cod_bar.toUpperCase() == 'ALL' ? '' : cod_bar;

            query = `select * from wfarticu.fb_mostrar_articu(
                '${nom_art}',
                '${cod_bar}'
            )`;
            console.log(req.params.nombre);
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


    // Para insertar o modificar ARTICULOS
    app.post("/api/v1.0/articulo", async (req, res, next) => {
        try {
            let query;
            var cod_art = req.body.cod_art;
            var nom_art = req.body.nom_art;
            var cod_bar = req.body.cod_bar;

            if (cod_art == null) { // para insertar 
                query = `select wfarticu.fbinserta_articu(
                    '${nom_art}'
                )`;
            } else { // para modificar
                query = `select wfarticu.pbarticu(
                    '${nom_art}',
                    '${cod_bar}',
                    cast (${cod_art} as integer)
                 )`;           
            }
            
            bitacora.control(query, req.url)
            const articulo = await BD.storePostgresql(query);
            //obtengo el codigo de persona generado para enlazar telefono
            if (articulo.codRes == 99) {
                // con esto muestro msj
                res.json({ res: 'ko', message: "Error al insertar o actualizar Articulo.", articulo }).status(200)
            }

            res.json({ res: 'ok', message: "Se registró datos correctamente" }).status(500)
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado...", error }).status(500)
        }

    })
}