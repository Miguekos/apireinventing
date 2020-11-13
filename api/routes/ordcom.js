const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {
    /////////////// MOSTRAR LISTA DE ORDENES DE COMPRA
    app.post("/api/v1.0/ordcom/mostrar_ordcom", async (req, res, next) => {
        try {
            let query1;
            var fec_ini = req.body.fec_ini;
            var fec_fin = req.body.fec_fin;

            if(fec_ini == null || fec_ini.trim() == ''){
                fec_ini = '';
            }
            if(fec_fin == null || fec_fin.trim() == ''){
                fec_fin = '';
            }

            query1 = `select * from reordcom.fb_mostrar_ordcom(
                '${fec_ini}', 
                '${fec_fin}'
            )`;
            bitacora.control(query1, req.url)
            const operac = await BD.storePostgresql(query1);
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

    /////////////// MOSTRAR DETALLE DE CADA ORDEN DE COMPRA
    app.get("/api/v1.0/ordcom/mostrar_detalle_ordcom/:cod_ord", async (req, res, next) => {
        try {
            let query1;
            var cod_ord = req.params.cod_ord;

            query1 = `
                select 
                    pr.co_articu, pr.no_articu, 
                    dc.ca_articu, dc.im_preuni,
                    (dc.ca_articu * dc.im_preuni) as im_pretot
                from reordcom.tbordcom oc, reordcom.tbarticu dc, wfarticu.tbarticu pr
                where oc.co_ordcom = dc.co_ordcom
                and dc.co_articu = pr.co_articu 
                and oc.co_ordcom::varchar = '${cod_ord}'
            `;
            bitacora.control(query1, req.url)
            const operac = await BD.storePostgresql(query1);
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

    /////////////// LISTA CATALOGO PROVEEDOR
    app.get("/api/v1.0/ordcom/catalogo/tcprovee", async (req, res, next) => {
        try {
            let query1;
            //var cod_ord = req.params.cod_ord;

            query1 = `
                select pj.co_perjur, pj.no_razsoc
                from pbperson.tbperjur pj, reordcom.tbprovee pr
                where pj.co_perjur = pr.pj_provee
                and pr.il_activo
                order by 1 desc
            `;
            bitacora.control(query1, req.url)
            const operac = await BD.storePostgresql(query1);
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

   /////////////// LISTA TIPO DE MONEDA
   app.get("/api/v1.0/ordcom/catalogo/tcmoneda", async (req, res, next) => {
        try {
            let query1;
            //var cod_ord = req.params.cod_ord;

            query1 = `
                select mo.co_moneda, mo.no_moneda
                from wfpublic.tcmoneda mo
                where mo.co_moneda in (15, 28)
                order by mo.co_moneda desc
            `;
            bitacora.control(query1, req.url)
            const operac = await BD.storePostgresql(query1);
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

    /////////////////////INSERTAR ORDEN DE COMPRA
    app.post("/api/v1.0/ordcom/insertar_ordcom", async (req, res, next) => {
        try {
            let query1;
            var cod_per = req.body.cod_per;
            var cod_pro = req.body.cod_pro;
            var tip_mon = req.body.tip_mon;
            var motivo  = req.body.motivo;
            var tip_pag = req.body.tip_pag;

            if (cod_per == null || cod_per.trim() == ''){
                res.json({ res: 'ko', message: "El código de persona NO esta definido."}).status(500)
            }
            if (cod_pro == null || cod_pro.trim() == ''){
                res.json({ res: 'ko', message: "El código de proveedor NO esta definido."}).status(500)
            }
            if (tip_mon == null || tip_mon.trim() == ''){
                res.json({ res: 'ko', message: "El tipo de moneda NO esta definido."}).status(500)
            }
            if (motivo == null || motivo.trim() == ''){
                res.json({ res: 'ko', message: "El comentario de la O.C. NO esta definido."}).status(500)
            }
            if (tip_pag == null || tip_pag.trim() == ''){
                res.json({ res: 'ko', message: "El tipo de pago NO esta definido."}).status(500)
            }
    
            query1 = `select * from reordcom.fb_insertar_ordcom(
                cast (${cod_per} as integer),
                cast (${cod_pro} as integer),
                cast (${tip_mon} as integer),
                '${motivo}',
                cast (${tip_pag} as integer)
             )`;

            bitacora.control(query1, req.url)
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                if (operac[0].co_respue == '-1'){
                    res.json({ res: 'ko', message: operac[0].no_respue }).status(500)
                }
                res.json({ res: 'ok', message: operac[0].no_respue }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    
    })

    ///////////////////////////////////////////// TCSERVIC ///////////////////////////////////
    // mostrar tcservic
    app.get("/api/v1.0/ordcom/tcservic/:nom_ser", async (req, res, next) => {
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