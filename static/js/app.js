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
    // return sample;
    const namesDefault = names[0];
    buildMetadata(namesDefault); 
  });
};

function buildMetadata(sample) {
  const demoPanel = d3.select("#sample-metadata");
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);
    var sampleMetaData = metadata.filter(item => item.id == sample);
    const sampleData = sampleMetaData[0];
    console.log(sampleData);
    demoPanel.html("");
    Object.entries(sampleData).forEach(([key, value]) => {
      demoPanel
        .append("p")
        .text(`${key}: ${value}`);
    })
  });
};

function buildGraph(sample) {
  const graphPane = d3.select("#plot");
  d3.json("samples.json").then(data => {
      var sampleData = data.samples[0];
      // console.log(sample940);
      // const title = `Sample id - ${sample940.id}`;
      // const sample_values = sample940.sample_values;
      // const otu_ids = `OTU IDS: ${sample940.otu_ids}`;
      // const otu_labels = `OTU labels: ${sample940.otu_labels}`;
      // const text_labels = ["1167: Porphyromonas", "2859: Peptoniphilus","482: Bacteria","2264: IncertaeSedisXI","41: Bacteria","1189: Porphyromonas","352: Bacteria","189: Bacteria","2318: Anaerococcus","1977: Clostridiales"]
      
      // const trace = {
      //   x: sample_values.slice(0, 10), //data.samples[0].sample_values, //.map(val => Math.sqrt(val)),
      //   y: text_labels,

      //   type: 'bar',
      //   orientation: 'h',
      //   title: title,
      // };
      // var data = [trace];
      // var layout = {
      //   title: "Test subject ID 940 - Top 10 Bacteria",
      //   xaxis: { title: "Sample values" },
      //   yaxis: text_labels,
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
  demographics940();
  buildSelDatasetList();
};

function optionChanged(sample) {
  buildMetadata(sample);
}

init();