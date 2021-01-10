const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {
  /// LISTAR PRODUCTOS QUE INGRESARÁN DE ORDEN DE COMPRA O TRAMITE DOCUMENTARIO
  app.post("/api/v1.0/almace/listar_produc_ordtra_ingres", async (req, res, next) => {
    try {
      let query1;
      

      var fe_regdes = req.body.fe_regdes;
      var fe_reghas = req.body.fe_reghas;
      var no_provee = req.body.no_provee;
      var nu_ordtra = req.body.nu_ordtra;
      var co_barras = req.body.co_barras;
      var il_ordtra = req.body.il_ordtra;

      // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
      // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
      // else {
        query1 = `select * from wfalmace.fb_listar_produc_ordtra_ingres(
            ${fe_regdes},
            ${fe_reghas},
            '${no_provee}',
            '${nu_ordtra}',
            '${co_barras}',
            '${il_ordtra}'
        )`;

      bitacora.control(query1, req.url);
      const operac = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (operac.codRes != 99) {
        // con esto muestro msj
        if (operac[0].co_respue == "-1") {
          res.json({ res: "ko", message: operac[0].no_respue }).status(500);
        }
        res.json({ res: "ok", message: operac[0].no_respue }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", operac })
          .status(500);
      }
      // }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// AGREGA PRODUCTOS A LA TRANSACCIÓN ///
  app.post("/api/v1.0/almace/agrega_produc_transa", async (req, res, next) => {
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

      bitacora.control(query1, req.url);
      const operac = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (operac.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", operac }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", operac })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  
};
