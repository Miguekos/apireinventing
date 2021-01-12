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

    //// Para mostrar reporte de Kardex
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

   //// Para mostrar inventario valorizado
   app.post("/api/v1.0/reportes/rep_invent_valori", async (req, res, next) => {
    try {            
        var cod_emp = req.body.cod_emp;
        var cod_alm = req.body.cod_alm;
        var nom_art = req.body.nom_art;

        if (cod_emp == null || cod_emp.trim() == ''){cod_emp = '';}
        if (cod_alm == null || cod_alm.trim() == ''){cod_alm = '';}
        if (nom_art == null || nom_art.trim() == ''){nom_art = '';}

        const query = `select * from wfalmace.fbmostrar_invent_valoriza(
            '${cod_emp}',
            '${cod_alm}',
            '${nom_art}'
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

   //// Para mostrar reporte diario
   //filtro (agrupamiento)
   app.get("/api/v1.0/reportes/tipo_agrupa", async (req, res, next) => {
    try {            
        const query = `select '0' co_catego, 'Grupo Reinventing' no_catego, 0 union 
            select '1', 'Tipo de Servicio', 1 union 
            select '2', 'Descripción Servicio', 2
            order by 3`;
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

   //filtro (fec_actualiza)
   app.get("/api/v1.0/reportes/fecha_actualizacion", async (req, res, next) => {
    try {            
        const query = `select to_char(fe_regist, 'YYYY-MM-DD HH24:MI:SS')fec_act
            from tmrepdia
            group by fe_regist 
            order by fe_regist desc`;
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
    // mostrar
   app.post("/api/v1.0/reportes/reporte_diario", async (req, res, next) => {
    try {            
        var tip_agr = req.body.tip_agr;
        var fec_act = req.body.fec_act;

        if (tip_agr == null || tip_agr.trim() == ''){tip_agr = '';}
        if (fec_act == null || fec_act.trim() == ''){fec_act = '';}

        const query = `select * from wfalmace.fbmostrar_reporte_diario(
            '${tip_agr}',
            '${fec_act}'
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

    // Para Mostrar  Produccion de Operaciones 
    app.post("/api/v1.0/reportes/produccion_operaciones", async (req, res, next) => {
        try {            
            var cod_ope = req.body.cod_ope;
            var pla_veh = req.body.pla_veh;            
            var fec_des = req.body.fec_des;
            var fec_has = req.body.fec_has;
            var tip_rep = req.body.tip_rep;            
            var query;
            
            if (cod_ope == null || cod_ope.trim() == ''){cod_ope = '';}
            if (pla_veh == null || pla_veh.trim() == ''){pla_veh = '';}
            
            if (fec_des == null || fec_des.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina Fecha inicio."}).status(500)
            }else if(fec_has == null || fec_has.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina Fecha Hasta."}).status(500)
            }else if(tip_rep == null || tip_rep.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina el tipo de reporte (R,D)"}).status(500)
            }else{
                if(tip_rep.toUpperCase() == 'D'){ // DETALLADO
                    query = `select 
                        fe_inipro, fe_finpro, co_operac, no_operac, no_person,
                        co_plaveh, no_marveh, no_modveh, nu_anomod, no_colveh, 
                        nu_serveh, nu_motveh, ti_servic, se_ventas, se_costos,
                        se_margen, se_rentab, ma_ventas, ma_costos, ma_margen,
                        ma_rentab, ma_sd, to_ventas, to_costos, to_margen, to_rentab
                    from reoperacfbmostrar_produccion_operaciones(
                        '${cod_ope}',
                        '${pla_veh}',
                        '${fec_des}',
                        '${fec_has}',
                        '${tip_rep}'
                    );`;
                }else if(tip_rep.toUpperCase() == 'R'){
                    query = `select 
                        no_period, se_ventas, se_costos,
                        se_margen, se_rentab, ma_ventas, ma_costos, ma_margen,
                        ma_rentab, ma_sd, to_ventas, to_costos, to_margen, to_rentab
                    from reoperacfbmostrar_produccion_operaciones(
                        '${cod_ope}',
                        '${pla_veh}',
                        '${fec_des}',
                        '${fec_has}',
                        '${tip_rep}'
                    );`;   
                }
                bitacora.control(query, req.url)
                const resultado = await BD.storePostgresql(query);
                if (resultado.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: "Success", resultado}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
                }
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado chamo", error }).status(500)
        }
    
    })
}