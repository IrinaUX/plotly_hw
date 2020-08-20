console.log("Hello");

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
};

function buildGraph(sample) {
  d3.json("samples.json").then(data => {
    const names = data.names;
    const samples = data.samples;
    const sample_data = samples.filter(item => item.id == sample);
    // console.log(data);
    // console.log(sample_data);
    const sample_id = sample_data[0].id;
    const sample_values = sample_data[0].sample_values;
    const sample_otu_ids = sample_data[0].otu_ids;
    const sample_otu_labels = sample_data[0].otu_labels;
    // console.log(`Sample id type: ${typeof(sample_id)}:`);
    // console.log(sample_id);
    // console.log(`Sample values type: ${typeof(sample_values)}:`);
    // console.log(sample_values);
    // console.log(`Sample otu ids type: ${typeof(sample_otu_ids)}:`);
    // console.log(sample_otu_ids);
    // console.log(`Sample otu labels: ${typeof(sample_otu_labels)}:`);
    console.log(sample_otu_labels)
    console.log(sample_otu_labels.length);
    const newObjList = [];
    for (var i=0; i < sample_otu_labels.length; i++) {
      // console.log(sample_otu_labels[i]);
      // console.log(typeof(sample_otu_labels[i]));
      // console.log("------");
      const string_label = sample_otu_labels[i];
      // console.log(string_label);
      // console.log("------");
      const split_label_string = string_label.split(";");
      // console.log(split_label_string);
      // console.log(typeof(split_label_string));
      // console.log(split_label_string.slice(0));
      const sliced_string = split_label_string.slice(-1);
      console.log(typeof(sliced_string));
      console.log(sliced_string);
      console.log("------");
      newObjList.push(sliced_string);

    }
    console.log("~~~~~~~~~~~~~~~~~~");
    console.log(typeof(newObjList));
    console.log(newObjList.length);
    console.log(newObjList);

    var mergedLabels = [].concat.apply([], newObjList);
    console.log(mergedLabels);
    
    const title = `Sample id - ${sample_id}`;
    const trace = {
      x: sample_values.slice(0, 10), //data.samples[0].sample_values, //.map(val => Math.sqrt(val)),
      y: sample_otu_ids.slice(0, 10),
      type: 'bar',
      orientation: 'h',
      title: title,
    };
    var data = [trace];
    var layout = {
      title: title,
      xaxis: { title: "Sample values" },
      yaxis: sample_otu_ids,
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
