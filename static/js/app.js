function init() { 
  // const id_list = data.samples;
  var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      const names = data.names;
      names.forEach((item) => {
        selector
          .append("option")
          .text(item)
      });
    const default_names = names[0];
    // console.log("--- Initialized ---");
    buildMetadata(default_names); 
    buildGraph(default_names);
    buildGraph_AllSamples();
  });
};

function buildMetadata(sample) {
  const demoPanel = d3.select("#sample-metadata");
  d3.json("samples.json").then((data) => {
    const metadata = data.metadata;
    var sampleMetaData = metadata.filter(item => item.id == sample);
    const sampleData = sampleMetaData[0];
    demoPanel.html("");
    Object.entries(sampleData).forEach(([key, value]) => {
      demoPanel
        .append("p")
        .text(`${key}: ${value}`);
    })
  });
  // console.log("--- Metadata built ---");
};

function buildGraph(sample) {
  d3.json("samples.json").then(data => {
    //const names = data.names;
    const samples = data.samples;
    const sample_data = samples.filter(item => item.id == sample);
    
    // console.log(sample_data);
    
    const sample_id = sample_data[0].id;
    const sample_values = sample_data[0].sample_values;
    const sample_otu_ids = sample_data[0].otu_ids;
    const sample_otu_labels = sample_data[0].otu_labels;

    // Extract otu_label -> genus
    // Extract the otu_ids
    // merge the arrays

    var cleanArrLabels = sample_otu_labels.map((item, i) => {
      var otu_ids = sample_otu_ids[i];
      return (`${otu_ids}: ${item.split(";").slice(-1)[0]}`);
    })
    // extract the sample values
    var cleanArrValues = sample_values.map((item, i) => {
      var otu_values = sample_values[i];
      return item;
    })

    const title = `Sample id - ${sample_id}`;
    const trace = {
      x: cleanArrValues.slice(0, 10).reverse(),
      y: cleanArrLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
      title: title,
      text: cleanArrLabels.reverse()
    };
    var data = [trace];
    var layout = {
      title: title,
      xaxis: { title: "Sample values" },
      yaxis: cleanArrLabels,
      width: 600,
      margin: {
        l: 250,
        r: 50,
        b: 100,
        t: 100,
        pad: 10}
    };
    Plotly.newPlot("plot", data, layout);
  })
  // console.log("--- Graph built ---");
};

function buildGraph_AllSamples() {
  otu_ids_list = [];
  otu_genus = "";
  values = "";
  // id_lbl_combo = "";
  d3.json("samples.json").then(data => {
    const samples = data.samples;
    var otu_ids = samples.map(item => item.otu_ids);
    otu_ids_list.push(otu_ids);
    otu_labels_list = [];
    otu_labels_arr = [];
    values_list = [];
  
    function extract( array, newarray ){
      if( !newarray ) newarray = [] ;
      if( array ) for( var i = 0 ; i < array.length ; ++i )
      {if( array[i].constructor.name === "Array" ) extract( array[i], newarray ) ;
          else newarray.push( array[i] ) ;}
      return newarray ;
    }
    var new_ids_arr = extract(otu_ids_list);
    otu_ids_list = new_ids_arr;
    // console.log(otu_ids_list);
    // extract sample values
    var sample_values = samples.map(item => item.sample_values);
    values_list.push(sample_values);
    // console.log(sample_values);
    var new_values_arr = extract(values_list);
    values = new_values_arr;
    // console.log(values);
    // extract labels
    var otu_labels = samples.map(item => item.otu_labels);
    // console.log(otu_labels);
    otu_labels.forEach((item, i) => {
      // console.log(item);
      let genus_list = [];
      for (var i=0; i<item.length; i++) {
        // console.log(item[i]);
        var item_genus = item[i].split(";").slice(-1);
        // console.log(item_genus);
        genus_list.push(item_genus);
      }
      // console.log(genus_list);
      var new_lables_list = extract(genus_list);
      // console.log(new_lables_list);
      otu_labels_list.push(new_lables_list); 
      var new_labels_arr = extract(new_lables_list);
      // console.log(new_labels_arr);
      otu_labels_arr.push(new_labels_arr)
      var newArr = extract(otu_labels_arr);
      otu_genus = newArr;
      })
      // Create all samples object
      allSamples_obj = [];

      for (var i=0; i<otu_ids_list.length; i++) {
        var id = otu_ids_list[i];
        var lbl = otu_genus[i];
        var val = values[i];
        var id_lbl = `${id}: ${lbl}`
        allSamples_obj.push({id:id, lbl: lbl, id_lbl:id_lbl, value: val});
        }

        // console.log(allSamples_obj);

        // try to plot from all samples obj

        // const id_lbl = allSamples_obj.map(item => item.id_lbl);
        // console.log(id_lbl);
        // const ids_lbls = allSamples_obj.id_lbl;

        // var unique_ids = [];
        var aggObject = {};

        allSamples_obj.forEach((item) => {
          // console.log(item);
          if (aggObject.hasOwnProperty(item.id)) {

            aggObject[item.id] += item.value;
            // aggObject[item.lbl] = item.lbl;
            // console.log(item.value);
            // aggObject[item.id] += item.value;
            

            // console.log(holdAndAddMyOTUIDs[item.id]);
            // console.log(item.value);
            // aggObject[id_lbl] = item.id_lbl;
            // aggObject[label] = item.label;
          } else {
            // console.log(item.value);
            aggObject[item.id] = item.value;
            // aggObject[item.lbl] = item.lbl;
            // console.log(item.lbl);
            // aggObject[lbl] = item.label;
            // console.log(item.value);
            // console.log(item.label);
            
            // aggObject[id_lbl] = item.id_lbl;
            // aggObject[label] = item.label;
          }
        })

        // console.log(Object.entries(aggObject));
        otu_list = [];
        value_list = [];
        objectFinal = [];

        var unsortedArrAgg = Object.entries(aggObject).forEach((key, value) => {
          var otu_id = key[0];
          var value = key[1];
          otu_list.push(otu_id);
          value_list.push(value);
        });
        
        // console.log()
        for (var i=0; i<value_list.length; i++) {
          // console.log(otu_list[i]);
          var id = otu_list[i];
          // console.log(value_list[i])
          var val = value_list[i];
          objectFinal.push({id:id, value: val});
          }
         
          var sortedFinal = objectFinal.sort(function(a, b) {
            return b.value - a.value;
          });
          
          console.log(sortedFinal);
          
          const axisX = sortedFinal.map(item => item.value);
          const axisY = sortedFinal.map(item => `otu_${item.id}`);
          console.log(axisX);
          console.log(axisY);        

        // console.log(typeof(aggObject));
        // let finalData = []; // This will hold my final Data
        // for (let Key in aggObject) { 
        //   // console.log("Key:" + Key);
        //   finalData.push({ otu_ID: Key,  
        //                    Key: Key,
        //                    totalVal: aggObject[Key]});
        // }
        // var unsortedArray = finalData.map((item, i) => item.totalVal);
        // console.log(unsortedArray);
        // var unsortedArrayAgg = aggObject.values;
        // console.log(unsortedArrayAgg);

        // var sortedArray = unsortedArray.sort((a, z) => (z - a));
        // console.log(sortedArray);
        // var sortedArrayAgg = aggObject.sort((a, z) => (z - a));
        
        // const finalY3 = aggObject.map(item => item.);
        // const finalY2 = finalData.map(item => `otu_${item.otu_ID}`);
        // const finalY = finalY2;
        // console.log(finalY);
  
  //       // console.log(finalY);
        // const finalX = sortedArray;
  //       // console.log(finalX);
        
     
    const title = `Top 10 Bacteria - all samples`;
    const trace = {
      x: axisX.slice(0, 10).reverse(), //
      y: axisY.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
      title: title,
      text: axisY
    };
    var data = [trace];
    var layout = {
      title: title,
      xaxis: { title: "Sample values - all samples" },
      yaxis: axisY.slice(0, 10).reverse(),
      width: 600,
      margin: {
        l: 250,
        r: 50,
        b: 100,
        t: 100,
        pad: 10}
    };
    Plotly.newPlot("plot-all", data, layout);
  })
  
};

function optionChanged(sample) {
  buildMetadata(sample);
  buildGraph(sample);
}

init();
// buildGraph_AllSamples();


    //     for (var i = 0; i < allSamples_obj.length; i++) {

    //     var currentID = allSamples_obj[i].id;
    //     var sample_value = allSamples_obj[i].value;
    //     var label = allSamples_obj[i].label;
    //     var id_lbl = allSamples_obj[i].id_lbl;
    //     // console.log(sample_value);
        
    //     if (currentID in unique_ids) {
    //       // if current id is in unique ids
    //       // 

    //       newObject[i].id = currentID;
    //       newObject[i].value = sample_value;
    //       newObject[i].label
    //       console.log("IF condition");
    //       console.log(currentID);
    //       }
    //     else {
    //       // append id to unique_ids and value from the same object
    //       // unique_ids.push(currentID);
    //       console.log("-----");
    //       console.log("ELSE condition");
    //       console.log(currentID);
    //       newObject.push({
    //         id: currentID,
    //         label: label,
    //         id_lbl: id_lbl,
    //         sample_value: sample_value
    //       })
    //       console.log(newObject);
    //       }
    //     // console.log(unique_ids);
    //     }
    // console.log(i);