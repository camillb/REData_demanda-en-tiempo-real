console.log("¡Funciona!");

(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    const cols = [
      {
        id: "type",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "id",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "percentage",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "value",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "datetime",
        dataType: tableau.dataTypeEnum.string,
      },
    ];

    let apiTableSchema = {
      id: "REData",
      alias: "Datos de la REData API",
      columns: cols,
    };

    schemaCallback([apiTableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    let tableData = [];
    var i = 0;
    var j = 0;
    var h = 0;

    $.getJSON(
      "https://apidatos.ree.es/es/datos/balance/balance-electrico?start_date=2021-04-27T00:00&end_date=2021-04-27T22:00&time_trunc=day",
      function (resp) {
        var apiData = resp.included;
        // Iterate over the JSON object
        for (i = 0, len = apiData.length; i < len; i++) {
          for (j = 0; j < apiData[i].attributes.content.length; j++) {
            var dic =apiData[i].attributes.content[j];
            for (h = 0; h < dic.attributes.values.length; h++) {
              var dic2 = dic.attributes.values[h];
            //var nestedData = apiData[i].attributes.values[j];
            tableData.push({
              datetime: dic2.datetime,
              percentage: dic2.percentage,
              value: Number(dic2.value),
              fecha_de_ultima_actualizacion: resp.data.attributes["last-update"],
              type: dic.type,
              id: dic.id,
            });
          }    
        }
        table.appendRows(tableData);
        doneCallback();
      }
    });
  };

  tableau.registerConnector(myConnector);
})();

document.querySelector("#getData").addEventListener("click", getData);

function getData() {
  tableau.connectionName = "REData";
  tableau.submit();
}
