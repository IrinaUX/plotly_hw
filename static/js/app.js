function init() { 
  // const id_list = data.samples;
  var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      const names = data.names;
      names.forEach((item) => {
        selector
          .append("option")
          .text(item)
          .property("value", item.id);
      });
    const default_names = names[0];
    // console.log("--- Initialized ---");
    // buildMetadata(default_names); 
    // buildGraph(default_names);
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
    const names = data.names;
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
  new_otu_arr = "";
  values_list = [];
  d3.json("samples.json").then(data => {
    const samples = data.samples;
    var otu_ids = samples.map(item => item.otu_ids);
    otu_ids_list.push(otu_ids);
    otu_labels_list = [];
    otu_labels_arr = [];
  
    function extract( array, newarray ){
      if( !newarray ) newarray = [] ;
      if( array ) for( var i = 0 ; i < array.length ; ++i )
      {if( array[i].constructor.name === "Array" ) extract( array[i], newarray ) ;
          else newarray.push( array[i] ) ;}
      return newarray ;
    }
    var new_ids_arr = extract(otu_ids_list);
    console.log(new_ids_arr);
    // extract sample values
    var sample_values = samples.map(item => item.sample_values);
    values_list.push(sample_values);
    // console.log(sample_values);
    var new_values_arr = extract(values_list);
    console.log(new_values_arr);
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
      new_otu_arr = newArr;
      
    //   if (item.length = 1) {
    //     // console.log(bacteria_sample);
    //     bacteria_sample = item[i];}
    //   else if (item.length > 1) {
    //     var bacteria_sample = item[i].split(";");
    //     // console.log(bacteria_sample)}
    // };
    
    // Loop through array of objects then each object
    // var cleanArrLabels = samples.map((item, i) => {
    //   var otu_ids = sample_otu_ids[i];
    //   return (`${otu_ids}: ${item.split(";").slice(-1)[0]}`);
    // })
    // // extract the sample values
    // var cleanArrValues = sample_values.map((item, i) => {
    //   var otu_values = sample_values[i];
    //   return item;
    })
    console.log(new_otu_arr);
      
    // });

    // Extract otu_label -> genus
    // Extract the otu_ids
    // merge the arrays

    // var cleanArrLabels = sample_otu_labels.map((item, i) => {
    //   var otu_ids = sample_otu_ids[i];
    //   return (`${otu_ids}: ${item.split(";").slice(-1)[0]}`);
    // })
    // // extract the sample values
    // var cleanArrValues = sample_values.map((item, i) => {
    //   var otu_values = sample_values[i];
    //   return item;
    // })

  //   const title = `Sample id - ${sample_id}`;
  //   const trace = {
  //     x: cleanArrValues.slice(0, 10).reverse(),
  //     y: cleanArrLabels.slice(0, 10).reverse(),
  //     type: 'bar',
  //     orientation: 'h',
  //     title: title,
  //     text: cleanArrLabels.reverse()
  //   };
  //   var data = [trace];
  //   var layout = {
  //     title: title,
  //     xaxis: { title: "Sample values" },
  //     yaxis: cleanArrLabels,
  //     width: 600,
  //     margin: {
  //       l: 250,
  //       r: 50,
  //       b: 100,
  //       t: 100,
  //       pad: 10}
    // };
  //   Plotly.newPlot("plot-all", data, layout);
  })
  // console.log("--- Graph built ---");
};

function optionChanged(sample) {
  buildMetadata(sample);
  buildGraph(sample);
}

init();
// buildGraph_AllSamples();