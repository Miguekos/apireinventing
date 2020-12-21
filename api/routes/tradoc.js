const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {
    
    /// INSERTAR TRAMITE DOCUMENTARIO
    app.post("/api/v1.0/tradoc/insert_tradoc", async (req, res, next) => {
        try {
            let query1;
            
            var pn_regist = req.body.pn_regist; 
			var pn_solici = req.body.pn_solici; 
			var co_perjur = req.body.co_perjur; 
			var co_moneda = req.body.co_moneda; 
			var de_mottra = req.body.de_mottra; 
			var fe_tradoc = req.body.fe_tradoc; 
			var il_conigv = req.body.il_conigv;
			var ti_docume = req.body.ti_docume;
            var co_arcadj = req.body.co_arcadj;
            

            if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
            else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
            else {
                query1 = `select * from retradoc.fb_insert_tradoc(
                    cast (${pn_regist} as integer),
                    cast (${pn_solici} as integer),
                    cast (${co_perjur} as integer),
                    cast (${co_moneda} as integer),
                    '${de_mottra}',
                    '${fe_tradoc}',
                    cast (${il_conigv} as integer),
                    cast (${ti_docume} as integer),
                    cast (${co_arcadj} as integer)
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
            }   
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    
    })
    
    /// ACTUALIZAR TRAMITE DOCUMENTARIO
    app.post("/api/v1.0/tradoc/update_tradoc", async (req, res, next) => {
        try {
            let query1;
            
            var co_tradoc = req.body.co_tradoc;
            var co_solici = req.body.co_solici;
            var co_provee = req.body.co_provee;
            var co_moneda = req.body.co_moneda;
            var no_motcom = req.body.no_motcom;
            var co_conigv = req.body.co_conigv;

            if (no_motcom == null || no_motcom.trim() == ''){res.json({ res: 'ko', message: "Motivo de compra NO está definido."}).status(500)}
            
            query1 = `select * from retradoc.fb_update_tradoc(
                cast (${co_tradoc} as integer),
                cast (${co_solici} as integer),
                cast (${co_provee} as integer),
                cast (${co_moneda} as integer),
                '${no_motcom}',
                cast (${co_conigv} as integer)
                
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

    /// ELIMINAR TRÁMITE DOCUMENTARIO
    app.post("/api/v1.0/tradoc/delete_tradoc", async (req, res, next) => {
        try {
            let query1;
            
            var co_tradoc = req.body.co_tradoc;
            var co_person = req.body.co_person;
            

            if (co_tradoc == null || co_tradoc.trim() == ''){res.json({ res: 'ko', message: "Código de TD NO está definido."}).status(500)}
            if (co_person == null || co_person.trim() == ''){res.json({ res: 'ko', message: "Código de persona NO está definido."}).status(500)}
            
            query1 = `select * from retradoc.fb_delete_tradoc(
                cast (${co_tradoc} as integer),
                cast (${co_person} as integer)
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


    /// LISTA DE TRÁMITE DOCUMENTARIO ///
    app.post("/api/v1.0/tradoc/listar_tradoc", async (req, res, next) => {
        try {
            let query1;
            var fe_emides = req.body.fe_emides;
            var fe_emihas = req.body.fe_emihas;
            var no_provee = req.body.no_provee;
            var nu_tramit = req.body.nu_tramit;
            var co_barras = req.body.co_barras;

            if(fe_emides == null || fe_emides.trim() == ''){fe_emides = '';}
            if(fe_emihas == null || fe_emihas.trim() == ''){fe_emihas = '';}
            if(no_provee == null || no_provee.trim() == ''){no_provee = '';}
            if(nu_tramit == null || nu_tramit.trim() == ''){nu_tramit = '';}
            if(ti_estado == null || ti_estado.trim() == ''){ti_estado = '';}
            if(co_barras == null || co_barras.trim() == ''){co_barras = '';}

            query1 = `select * from retradoc.fb_listar_tradoc(
                '${fe_emides}', 
                '${fe_emihas}',
                '${no_provee}', 
                '${nu_tramit}', 
                '${co_barras}'
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

    /// LISTAR PENDIENTE DE VISADO TRÁMITE DOCUMENTARIO ///
    app.post("/api/v1.0/tradoc/listar_pendie_visado", async (req, res, next) => {
        try {
            let query1;
            var co_tradoc = req.params.co_tradoc;
            var co_tipvis = req.params.co_tipvis;
            
            query1 = `select * from retradoc.fb_listar_pendie_visado(
                '${co_tradoc}',
                '${co_tipvis}'
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


    /// DETALLE DE CADA TRAMITE DOCUMENTARIO ///
    app.get("/api/v1.0/tradoc/listar_detall_tradoc", async (req, res, next) => {
        try {
            let query1;
            var co_tradoc = req.params.co_tradoc;

            query1 = `select * from retradoc.fb_listar_detall_tradoc( '${co_tradoc}' )`;

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
    
    /// LISTAR PRODUCTOS ENCOTRADOS TRAMITE DOCUMENTARIO ///
    app.post("/api/v1.0/tradoc/listar_produc_encont", async (req, res, next) => {
        try {
            let query1;

            var co_tradoc = req.params.co_tradoc;
            var co_catego = req.params.co_catego;
            var co_subcat = req.params.co_subcat;
            var no_produc = req.params.no_produc;
            
            query1 = `select * from retradoc.fb_listar_produc_encont(
                cast (${co_tradoc} as integer),
                cast (${co_catego} as integer),
                cast (${co_subcat} as integer),
                '${no_produc}'
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

    /// MANTENIMIENTO DE PRODUCTOS TRAMITE DOCUMENTARIO ///
    app.post("/api/v1.0/tradoc/manten_produc_tradoc", async (req, res, next) => {
        try {
            let query1;
            
            var co_tradoc = req.params.co_tradoc;
            var co_articu = req.params.co_articu;
            var ca_articu = req.params.ca_articu;
            var co_moneda = req.params.co_moneda;
            var im_preuni = req.params.im_preuni;
            var ti_accion = req.params.ti_accion;
            
            query1 = `select * from retradoc.fb_manten_produc_tradoc(
                cast (${co_tradoc} as integer),
                cast (${co_articu} as integer),
                cast (${ca_articu} as numeric),
                cast (${co_moneda} as integer),
                cast (${im_preuni} as numeric),
                '${ti_accion}'
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

    /// CATALOGO PROVEEDOR ///
    app.get("/api/v1.0/ordcom/catalogo/tcprovee", async (req, res, next) => {
        try {
            let query1;
            
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

   /// TIPO DE MONEDA
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

}