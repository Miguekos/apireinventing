const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {
    // Para combo de almacén
    app.get("/api/v1.0/reportes/combo_almacen", async (req, res, next) => {
        try {            
            const query = `select co_almace, no_almace
            from wfalmace.tcalmace;`;
            bitacora.control(query, req.url)
            const resultado = await BD.storePostgresql(query);
            if (resultado.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", resultado}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado chamo", error }).status(500)
        }

    })

    // Para mostrar reporte de Kardex
    app.post("/api/v1.0/reportes/rep_kardex", async (req, res, next) => {
        try {            
            var fec_des = req.body.fec_des;
            var fec_has = req.body.fec_has;
            var cod_emp = req.body.cod_emp;
            var cod_alm = req.body.cod_alm;
            var cod_art = req.body.cod_art;
            var nom_art = req.body.nom_art;
            var operaci = req.body.operaci;

            if (fec_des == null || fec_des.trim() == ''){fec_des = '';}
            if (fec_has == null || fec_has.trim() == ''){fec_has = '';}
            if (cod_emp == null || cod_emp.trim() == ''){cod_emp = '';}
            if (cod_alm == null || cod_alm.trim() == ''){cod_alm = '';}
            if (cod_art == null || cod_art.trim() == ''){cod_art = '';}
            if (nom_art == null || nom_art.trim() == ''){nom_art = '';}
            if (operaci == null || ope_mat.trim() == ''){operaci = '';}

            const query = `select * from wfalmace.fbmostrar_lista_kardex(
                '${fec_des}',
                '${fec_has}',
                '${cod_emp}',
                '${cod_alm}',
                '${cod_art}',
                '${nom_art}',
                '${operaci}'
             );`;
            bitacora.control(query, req.url)
            const resultado = await BD.storePostgresql(query);
            if (resultado.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", resultado}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado chamo", error }).status(500)
        }

    })

}