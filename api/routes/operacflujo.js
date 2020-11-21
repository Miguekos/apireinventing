const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {

///////////////////////////////// MODULO NUEVA OPERACIÓN/////////////////
    //mostrar ingresos de vehiculos
    app.post("/api/v1.0/operacflujo/mostrar_ingreso", async (req, res, next) => {
        try {
            let query;
            var fec_ini = req.body.fec_ini;
            var fec_fin = req.body.fec_fin;
            var pla_veh = req.body.pla_veh;

            if (fec_ini == null || fec_ini.trim() =='') { 
                fec_ini = '';
            };
            if (fec_fin == null || fec_fin.trim() =='') {
                fec_fin = '';
            }
            if (pla_veh == null || pla_veh.trim() =='') {
                pla_veh = '';
            }
            query = `select * from readuana.fbmostrar_ing_veh(
                '${fec_ini}',
                '${fec_fin}',
                '${pla_veh}'
            )`;

            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
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

    ///// para ingresar nueva operación

    //combo cliente
    app.get("/api/v1.0/operacflujo/combo_cliente", async (req, res, next) => {
        try {
            let query1 = `
                select 
                    pe.co_person, 
                    (
                    (
                    case 
                        when pe.ti_person = 1 then pn.no_apepat || '  ' || pn.no_apemat || '  ' || pn.no_nombre
                        when pe.ti_person = 2 then pj.no_razsoc
                    end
                    )
                    || '  -  ' || pe.co_docide
                    )  as no_person
                from pbperson.tbperson pe
                left join pbperson.tbpernat pn on pe.co_person = pn.co_pernat 
                left join pbperson.tbperjur pj on pe.co_person = pj.co_perjur
                where pe.co_person not in (4,3)
                order by 2
            `;
            bitacora.control(query1, req.url)
            const client = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (client.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", client}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", client }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // listado que muestra vehiculos enlazados al ingreso VEH. 
    app.get("/api/v1.0/operacflujo/lista_vehiculo_ingreso/:cod_adu", async (req, res, next) => {
        try {
            var cod_adu = req.params.cod_adu;
            let query1 = `
                select 
                    tv.co_aduana, tb.fe_aduana, vh.co_plaveh, vma.no_marveh, vm.no_modveh, 
                    vh.nu_anomod, vh.no_colveh, vh.nu_serveh, vh.nu_motveh
                from readuana.tbaduana tb
                left join readuana.tbaduveh tv on tb.co_aduana = tv.co_aduana
                left join wfvehicu.tbvehicu vh on tv.co_vehicu = vh.co_vehicu
                left join wfvehicu.tcverveh vv on vh.co_verveh = vv.co_verveh
                left join wfvehicu.tcmodveh vm on vv.co_modveh = vm.co_modveh
                left join wfvehicu.tcmarveh vma on vm.co_marveh = vma.co_marveh
                where tb.co_aduana = cast ('${cod_adu}' as integer);
            `;
            bitacora.control(query1, req.url)
            const vehic = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (vehic.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", vehic}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", vehic }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    //// nueva operacion
    app.post("/api/v1.0/operacflujo/nueva_operacion", async (req, res, next) => {
        try {
            let query1;
            var cod_adu = req.body.cod_adu;
            var cod_per = req.body.cod_per;
            var cod_usu = req.body.cod_usu;

            if (cod_adu == null || cod_adu.trim() == ''){
                res.json({ res: 'ko', message: "El código aduana NO esta definido."}).status(500)
            }
            if (cod_per == null || cod_per.trim() == ''){
                res.json({ res: 'ko', message: "El código de persona NO esta definido."}).status(500)
            }
            if (cod_usu == null || cod_usu.trim() == ''){
                res.json({ res: 'ko', message: "El codigo de usuario NO esta definido."}).status(500)
            }
    
            query1 = `select * from readuana.fb_genera_opera(
                cast ('${cod_adu}' as integer),
                cast ('${cod_per}' as integer),
                cast ('${cod_usu}' as integer)
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

    //////////////////// mostrar info de operacion (ABRIR OPERACION)

    // listado que muestra vehiculos enlazados al ingreso VEH. 
    app.get("/api/v1.0/operacflujo/abrir_operacion/:cod_ope", async (req, res, next) => {
        try {
            var cod_ope = req.params.cod_ope;
            let q_opera = `select * from reoperac.fbmostrar_datos_operac(
                cast ('${cod_ope}' as integer)
            );`;
            let q_vehic = `
                select 
                    ve.co_plaveh, ma.no_marveh,
                    mo.no_modveh, vv.no_verveh,
                    ve.nu_anomod, ve.no_colveh,
                    ve.nu_serveh, ve.nu_motveh
                from reoperac.tbopeveh op, wfvehicu.tbvehicu ve
                left join wfvehicu.tcverveh vv on ve.co_verveh = vv.co_verveh
                left join wfvehicu.tcmodveh mo on vv.co_modveh = mo.co_modveh
                left join wfvehicu.tcmarveh ma on mo.co_marveh = ma.co_marveh
                where op.co_vehicu = ve.co_vehicu
                and op.co_operac = cast ('${cod_ope}' as integer)
            `;
            let q_clien = `
                select tp.ti_person, tp.no_tipper, pe.co_person, 
                    pbperson.f_no_person(pe.co_person) no_person, pe.co_docide
                from reoperac.tbopecli op, pbperson.tbperson pe, pbperson.tcdocide td, pbperson.tctipper tp
                where op.co_client = pe.co_person
                and pe.ti_docide = td.ti_docide
                and pe.ti_person = tp.ti_person
                and op.co_operac = cast ('${cod_ope}' as integer)
            `; 
            let q_servi = `select * from reoperac.fbmostrar_servicios_operac(
                cast ('${cod_ope}' as integer)
            )`; 
            let q_mater = `select * from reoperac.fbmostrar_materiales_operac(
                cast ('${cod_ope}' as integer)
            )`; 
            bitacora.control(q_opera, req.url)
            bitacora.control(q_vehic, req.url)
            bitacora.control(q_clien, req.url)
            bitacora.control(q_servi, req.url)
            bitacora.control(q_mater, req.url)
            const operac = await BD.storePostgresql(q_opera);
            const vehicu = await BD.storePostgresql(q_vehic);
            const client = await BD.storePostgresql(q_clien);
            const servic = await BD.storePostgresql(q_servi);
            const materi = await BD.storePostgresql(q_mater);
            // con esto muestro msj
            if (operac.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query operacio", operac }).status(500)
            };
            if (vehicu.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query vehiculos", vehicu }).status(500)
            };
            if (client.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query cliente", client }).status(500)
            };
            if (servic.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query servicio", servic }).status(500)
            };
            if (materi.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query material", materi }).status(500)
            };

            res.json({ res: 'ok', message: "Success", operac, vehicu, client, servic, materi}).status(200)
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })
    

}