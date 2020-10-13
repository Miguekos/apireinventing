const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10
// ``

module.exports = async (app) => {
    // para traer todos los usuarios
    app.get("/api/v1.0/personas/natural/:docide", async (req, res, next) => {
        try {
            let query;
            const doc_ide = req.params.docide;
            if (doc_ide == "all") {
                query = `select * from pbperson.sp_mostrar_pernat('');`;
            } else {
                query = `select * from pbperson.sp_mostrar_pernat('${doc_ide}');`;
            }
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            //console.log("chamex: " + user.length);
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
            //obtengo el codigo de persona generado para enlazar telefono
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

    // Para insertar o modificar personas juridicas
    app.post("/api/v1.0/personas/juridica", async (req, res, next) => {
        try {
            var doc_ide = req.body.doc_ide;
            var raz_soc = req.body.raz_soc;
            var nom_com = req.body.nom_com;
            var swt_pro = req.body.swt_pro;

            var cod_per;

            if (doc_ide.length != 11){
                res.json({ res: 'ko', message: "RUC debe contener 11 dígitos."}).status(200)
            }
            const query = `select pbperson.f_co_perjur(
                '${doc_ide}', 
                '${raz_soc}', 
                '${nom_com}'
            );`;
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            //obtengo el codigo de persona generado para enlazar telefono
            cod_per = user[0].f_co_perjur;
            if (user.codRes == 99) {
                // con esto muestro msj
                res.json({ res: 'ko', message: "Error al insertar Persona.", user }).status(200)
            }
            if (swt_pro == 1 || swt_pro == 0) {
                const query2 = `select reordcom.insert_provee(
                    cast(${cod_per} as integer), '${swt_pro}'
                );`;
                bitacora.control(query2, req.url)
                const prov = await BD.storePostgresql(query2);
                if (prov.codRes == 99) {
                    // con esto muestro msj
                    res.json({ res: 'ko', message: "Error al insertar Switch proveedor.", prov }).status(200)
                }
            }
            res.json({ res: 'ok', message: "Se registró datos correctamente" }).status(500)
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error NO controlado", error }).status(500)
        }

    })
}