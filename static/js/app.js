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

function buildGraph(sample) {
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
      x: sample_values.slice(0, 10),
      y: merged_ids_genus.slice(0, 10),
      type: 'bar',
      orientation: 'h',
      title: title,
      text: sample_otu_labels
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

function optionChanged(sample) {
  buildMetadata(sample);
  buildGraph(sample);
}

init();
