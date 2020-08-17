console.log("Hello");
function init() {
  // Grab a reference to the dropdown select element
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then(data => {
      var sample940 = data.samples[0];
      console.log(sample940);
      const title = `Sample id - ${sample940.id}`;
      const sample_values = sample940.sample_values;
      const otu_ids = `OTU IDS: ${sample940.otu_ids}`;
      const otu_labels = `OTU labels: ${sample940.otu_labels}`;
      const text_labels = ["1167: Porphyromonas", "2859: Peptoniphilus","482: Bacteria","2264: IncertaeSedisXI","41: Bacteria","1189: Porphyromonas","352: Bacteria","189: Bacteria","2318: Anaerococcus","1977: Clostridiales"]
      
      const trace = {
        x: sample_values.slice(0, 10), //data.samples[0].sample_values, //.map(val => Math.sqrt(val)),
        // y: otu_labels.slice(0, 10),
        y: text_labels,

        type: 'bar',
        orientation: 'h',

        // text: otu_labels.slice(0, 10),
        // name: "Bacteria",
        title: title,
      };
      var data = [trace];
    // Use `layout` to define a title
      var layout = {
        title: "Test subject ID 940 - Top 10 Bacteria",
        xaxis: { title: "Sample values" },
        yaxis: text_labels,
        width: 600,
        margin: {
          l: 250,
          r: 50,
          b: 100,
          t: 100,
          pad: 10}
        // yaxis: { title: otu_labels}
      };

      // Render the plot to the `plot1` div
      Plotly.newPlot("plot", data, layout);
      })
  demographics940();
  buildSelDatasetList();
};

function demographics940(data) {
  // Use `d3.json` to fetch the metadata for 940 sample
  d3.json("samples.json").then((data) => {
    var sample940 = data.metadata[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");
    Object.entries(sample940).forEach(([key, value]) => {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    });
  }
)};

function buildSelDatasetList() {
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    const id_list = data.samples;
    var selector = d3.select("#selDataset");
    console.log(id_list);
    id_list.forEach((id_list) => {
      // const id_list = data.samples;
      selector
        .append("option")
        .text(`ID: ${id_list.id}`)
        .property("value", id_list.id);
        console.log(id_list.id);
    });
  });
};

init();
buildSelDatasetList();