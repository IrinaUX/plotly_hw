console.log("Hello");

function init() { 
  // const id_list = data.samples;
  var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      const names = data.names;
      const samples = data.samples;
      names.forEach((item) => {
        selector
          .append("option")
          .text(item)
          .property("value", item.id);
      });
    // return sample;
    const default_names = names[0];
    const default_sample_values = samples[0].sample_values;
    const default_sample_otu_ids = samples[0].otu_ids;
    const default_sample_otu_labels = samples[0].otu_labels;
    let default_sample = [];
    default_sample.push(default_sample_values, default_sample_otu_ids, default_sample_otu_labels);
    console.log(default_sample[2].slice(-1));
    buildMetadata(default_names); 
    buildGraph(default_sample);
  });
};

function buildGraph(sample) {
  const graphPanel = d3.select("#plot");
  d3.json("samples.json").then(data => {
      const sampleData = data.samples;
      // console.log(sampleData);
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

function optionChanged(sample) {
  buildMetadata(sample);
}

init();
