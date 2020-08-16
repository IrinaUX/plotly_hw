
console.log("Hello");

// var jsonSample = samples;
// console.log(campl);

// var trace = {
//     x: samples.samples.sample_values,
//     y: samples.names,

// }

function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}
let sampleValues = '', names = '';
d3.json("samples.json").then((jsonData) => {
  var data = jsonData;
  function filterId940(id){
    const jsonId = data.samples[0].id;
    console.log(`jsonID - 0: ${jsonId}`);
    return id === 940;
  };
  filterId940(940);
  var id940Data = samples.filter(filterId940);
  console.log(`id 940 data - 1: ${id940Data}`);
  // console.log(`Typeof 0 - ${data}`);
    //  Create the Traces
    // console.log(data.samples[0].id);
    // console.log(data.samples[0].otu_ids); // 
    // console.log(data.samples[0].sample_values);
    // console.log(data.samples[0].sample_values);
    const name1 = unpack(data.samples[0].otu_labels, 0)[-1];
    // const name2 = unpack(data.samples[0].otu_labels, 1)[-1];
    sampleValues = data.samples[0].sample_values;
    // ids = data.samples[0].otu_ids.slice(0, 10);
    // names = data.samples[0].otu_labels[-1];//.slice(0, 10); // .slice(0, 10);
    console.log(`Typeof - 1: ${name1}`);
    // console.log(`Inside the json.then ${names1}`);
    const trace = {
      x: sampleValues, //data.samples[0].sample_values, //.map(val => Math.sqrt(val)),
      y: name1,
      type: "bar",
      orientation: 'h',
      name: "Cancer Survival",
    };

console.log(`Names: ${names}`);
// var samples = samples;
// console.log(samples.samples.sample_values)

var data = [trace];
// Use `layout` to define a title
var layout = {
    title: "Test subject ID 940"
};

// Render the plot to the `plot1` div
Plotly.newPlot("plot", data, layout);
})