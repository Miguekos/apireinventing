const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10
// ``

module.exports = async (app) => {
    // para traer todos los usuarios
    app.get("/api/v1.0/users/:docide", async (req, res, next) => {
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

    app.get("/api/v1.0/users/:cousuari", async (req, res, next) => {
        try {
            let query;
            const doc_ide = req.params.cousuari;
            query = `select * from fwconacc.sp_mostrar_usuari('') where co_usuari = ${doc_ide}`;
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

    app.post("/api/v1.0/usuario/:tipo", async (req, res, next) => {
        try {
            const tipo = req.params
            console.log(tipo);
            console.log(req.body)
            res.json({
                "codRes": "00",
                "message": "Test Correcto"
            })
            // console.log(req.body);
            // const email = req.body.email;
            // const password = req.body.password;
            // const query = `SELECT * from fwconacc.tbusuari`;
            // bitacora.control(query, req.url)
            // const user = await BD.storePostgresql(query);
            // con esto muestro msj
            // respuesta.json({ res: 'ok', message: "Session cerrada correctamente" }).status(200)
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para agregar un usuario
    app.post("/api/v1.0/users", async (req, res, next) => {
        try {
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            console.log(hash);
            //const codigo = req.body.codigo;
            const id = req.body.id;
            // var password = hash;
            var password = hash;
            var doc_ide = req.body.doc_ide;
            var ape_pat = req.body.ape_pat;
            var ape_mat = req.body.ape_mat;
            var nombres = req.body.nombres;
            const swt_emp = req.body.swt_emp;
            const swt_act = req.body.swt_act;
            const query = `select fwconacc.sp_manten_usuari(
                cast (null as integer),
                '${id}',
                '${password}',
                '${doc_ide}',
                '${ape_pat}',
                '${ape_mat}',
                '${nombres}',
                ${swt_emp},
                ${swt_act}
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
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para actualizar usuarios
    app.put("/api/v1.0/users", async (req, res, next) => {
        try {
            const codigo = req.body.codigo;
            const id = req.body.id;
            //var password = req.body.password;
            var doc_ide = req.body.doc_ide;
            var ape_pat = req.body.ape_pat;
            var ape_mat = req.body.ape_mat;
            var nombres = req.body.nombres;
            const swt_emp = req.body.swt_emp;
            const swt_act = req.body.swt_act;
            if (codigo == 'undefined') {
                miExcepcionUsuario = new ExceptionUsuario("Falta definir código de usuario.");
                throw miExcepcionUsuario;
            }
            const query = `select fwconacc.sp_manten_usuari(
                cast (${codigo} as integer),
                '${id}',
                'y',
                '${doc_ide}',
                '${ape_pat}',
                '${ape_mat}',
                '${nombres}',
                ${swt_emp},
                ${swt_act}
            )`;
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
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