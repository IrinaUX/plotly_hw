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
      // // add demographics info:
      // var demographics940 = data.metadata[0];
      // const ethnicity940 = demographics940.ethnicity;
      // const gender940 = demographics940.gender;
      // const age940 = demographics940.age;
      // const loc940 = demographics940.location;
      // const bbtype940 = demographics940.bbtype;
      // const wfreq40 = demographics940.wfreq;
      // console.log(demographics940);
      // console.log(ethnicity940);
      // console.log(gender940);
      // console.log(age940);
      // console.log(loc940);
      // console.log(bbtype940);
      // console.log(wfreq40);
      // const metadata = d3.select("#sample-metadata");
      // metadata.property("value", `Ethnicity: ${ethnicity940}`)

      
      // console.log(title);
      // console.log(otu_ids);
      // console.log(otu_labels);

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

init();
demographics940();