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
    
function buildGraph_AllSamples() {
  d3.json("samples.json").then(data => {
    console.log(data);
    const samples = data.samples;
    console.log(samples);
    let sample_ids = [];
    let sample_value_ids_list = [];
    let sample_values_list = [];
    samples.forEach((sample, i) => {
      console.log("--------------");
      console.log(sample);
      const sample_id = sample.id;
      const sample_otu_ids = sample.otu_ids;
      const sample_values = sample.sample_values;
      console.log(sample_id);
      console.log(sample_otu_ids);
      console.log(sample_values);
      sample_ids.push(sample_id);
      sample_value_ids_list.push(sample_otu_ids);
      sample_values_list.push(sample_values);
      // console.log(typeof(entry));
      });
    const trace = {
      x: sample_values_list.slice(0, 10).reverse(),
      y: sample_value_ids_list.slice(0, 10),
      type: 'bar',
      orientation: 'h',
      title: "All Samples - Top 10 Bacteria",
      text: sample_value_ids_list.slice(0, 10).reverse()
    };
    var data = [trace];
    var layout = {
      title: "samples",
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
};

function optionChanged(sample) {
  buildMetadata(sample);
  buildGraph(sample);
}

init();
buildGraph_AllSamples();