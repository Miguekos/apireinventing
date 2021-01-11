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
            '${fe_regdes}',
            '${fe_reghas}',
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
          res.json({ res: "ko", message: operac }).status(500);
        }
        res.json({ res: "ok", message: operac }).status(200);
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

  /// INSERTAR PRODUCTOS QUE INGRESAN O SALES DE ORDEN DE COMPRA, TRAMITE DOCUMENTARIO y OPERACIONES
  app.post("/api/v1.0/almace/insert_produc_ingsal", async (req, res, next) => {
    try {
      let query1;
      
      var co_person = req.body.co_person;
      var fe_regist = req.body.fe_regist;
      var co_prikey = req.body.co_prikey;
      var co_articu = req.body.co_articu;
      var ca_articu = req.body.ca_articu;
      var il_unineg = req.body.il_unineg;
      var ti_ingsal = req.body.ti_ingsal;


      // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
      // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
      // else {
        query1 = `select * from wfalmace.fb_insert_produc_ingsal(
            ${co_person},
            '${fe_regist}',
            ${co_prikey},
            ${co_articu},
            ${ca_articu}
            '${il_unineg}',
            ${ti_ingsal}
        )`;

      bitacora.control(query1, req.url);
      const operac = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (operac.codRes != 99) {
        // con esto muestro msj
        if (operac[0].co_respue == "-1") {
          res.json({ res: "ko", message: operac }).status(500);
        }
        res.json({ res: "ok", message: operac }).status(200);
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


  
};
