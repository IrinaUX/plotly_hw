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
    console.log("--- Initialized ---");
    buildMetadata(default_names); 
    buildGraph(default_names);
    // buildGraph_AllSamples();
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
  console.log("--- Metadata built ---");
};

function buildGraph_wrong(sample) {
  d3.json("samples.json").then(data => {
    const names = data.names;
    const samples = data.samples;
    const sample_data = samples.filter(item => item.id == sample);
    const sample_id = sample_data[0].id;
    const sample_values = sample_data[0].sample_values;
    const sample_otu_ids = sample_data[0].otu_ids;
    const sample_otu_labels = sample_data[0].otu_labels;
    // console.log(sample_otu_labels)
    // console.log(sample_otu_labels.length);
    const newObjList = [];
    for (var i=0; i < sample_otu_labels.length; i++) {
      const string_label = sample_otu_labels[i];
      const split_label_string = string_label.split(";");
      const sliced_string = split_label_string.slice(-1);
      newObjList.push(sliced_string);
    }
    let mergedGenus = [].concat.apply([], newObjList);
    merged_ids_genus = [];
    Object.values(sample_otu_ids).forEach((item, i) => {
      let item_ids = item;
      let item_genus = mergedGenus[i];
      let merged_item = `${item_ids}: ${item_genus}`;
      merged_ids_genus.push(merged_item);
    });
    const title = `Sample id - ${sample_id}`;
    const trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: merged_ids_genus.slice(0, 10),
      type: 'bar',
      orientation: 'h',
      title: title,
      text: sample_otu_labels.reverse()
    };
    var data = [trace];
    var layout = {
      title: title,
      xaxis: { title: "Sample values" },
      yaxis: merged_ids_genus,
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
  console.log("--- Graph built ---");
};

function buildGraph(sample) {
  d3.json("samples.json").then(data => {
    const names = data.names;
    const samples = data.samples;
    const sample_data = samples.filter(item => item.id == sample);
    
    console.log(sample_data);
    
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
  console.log("--- Graph built ---");
};

function buildGraph_AllSamples() {
  d3.json("samples.json").then(data => {
    console.log(data);
    const samples = data.samples;
    console.log(samples);
    let otu_ids = [];
    let otu_labels = [];
    let otu_values = [];
    samples.forEach((entry, i) => {
      console.log("--------------");
      const otu_id = entry.otu_ids;
      const otu_label = entry.otu_labels;
      const otu_value = entry.sample_values;
      console.log(entry);
      // console.log(otu_id);
      // console.log(otu_value);
      let entry_otu_id_list = [];
      let entry_otu_lable_list = [];
      Object.values(entry).forEach((itu_id, i) => {
        entry_otu_id_list.push(otu_id);
        // console.log(otu_id);
        // console.log(i);
      });
      // console.log("---------");
      // console.log(entry_otu_id_list);
      // console.log(entry_otu_lable_list);
    // sample_ids.push(sample_id);
      // sample_value_ids_list.push(sample_otu_ids);
      // sample_values_list.push(sample_values);
      // sample_otu_label_list.push(sample_otu_label);
      // console.log(typeof(entry));
      // const newObjList = [];
      // for (var i=0; i < sample_otu_label.length; i++) {
      // const string_label = sample_otu_label[i];
      // const split_label_string = string_label.split(";");
      // const sliced_string = split_label_string.slice(-1);
      // newObjList.push(sliced_string);
      // }
      // let mergedGenus = [].concat.apply([], newObjList);
      // merged_ids_genus = [];
      // Object.values(sample_value_ids_list).forEach((item, i) => {
      //   let item_ids = item;
      //   let item_genus = mergedGenus[i];
      //   let merged_item = `${item_ids}: ${item_genus}`;
      //   merged_ids_genus.push(merged_item);
      // });
    });
    // const trace = {
    //   x: otu_value.slice(0, 10).reverse(),
    //   y: merged_ids_genus.slice(0, 10),
    //   type: 'bar',
    //   orientation: 'h',
    //   text: otu_value.slice(0, 10).reverse()
    // };
    // var data = [trace];
    // var layout = {
    //   title: "All Samples - Top 10 Bacteria",
    //   xaxis: { title: "Sample values" },
    //   yaxis: merged_ids_genus,
    //   width: 600,
    //   margin: {
    //     l: 250,
    //     r: 50,
    //     b: 100,
    //     t: 100,
    //     pad: 10}
    // };
    // Plotly.newPlot("plot", data, layout);
  })
};

function optionChanged(sample) {
  buildMetadata(sample);
  buildGraph(sample);
}

init();
// buildGraph_AllSamples();