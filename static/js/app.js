console.log("Hello");

// d3.json("samples.json").then(data => {
// //   console.log(data);
//   const sample_values = data.samples[0].sample_values;
//   const otu_id = data.samples[0].otu_ids;
//   const otu_labels = data.samples[0].otu_labels; //.slice(0, 10);
//   console.log(`sample_values typeof - ${typeof(sample_values)}: ${sample_values.slice(0, 10)}`);
//   console.log(`otu_id typeof - ${typeof(otu_id)}: ${otu_id.slice(0, 10)}`);
//   console.log(`otu_labels typeof - ${typeof(otu_labels)}: ${otu_labels.slice(0, 10)}`);
    // const trace = {
    //   x: sample_values, //data.samples[0].sample_values, //.map(val => Math.sqrt(val)),
    //   y: otu_ids,
    //   type: 'bar',
    //   text: otu_labels,
    //   orientation: 'h',
    //   name: "Bacteria",
    // };
// })

// var data = [trace];
// // Use `layout` to define a title
// var layout = {
//     title: "Test subject ID 940"
// };

// // Render the plot to the `plot1` div
// Plotly.newPlot("plot", data, layout);
// })

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
        
      console.log(title);
      console.log(otu_ids);
      console.log(otu_labels);

      const trace = {
        x: sample_values.slice(0, 10), //data.samples[0].sample_values, //.map(val => Math.sqrt(val)),
        y: otu_ids.slice(0, 10),
        type: 'bar',
        orientation: 'h',
        // text: otu_labels.slice(0, 10),
        name: "Bacteria",
        title: title,
      };
      var data = [trace];
    // Use `layout` to define a title
      var layout = {
        title: "Test subject ID 940 - Top 10 Bacteria"
      };

      // Render the plot to the `plot1` div
      Plotly.newPlot("plot", data, layout);
      })
      
    // Use the first sample from the list to build the initial plots
    // const firstSample = sampleNames[0];
    // buildCharts(firstSample);
    // buildMetadata(firstSample);

};


init();