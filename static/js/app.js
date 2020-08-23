// const { Console } = require("console");

function init() { 
  // const id_list = data.samples;
  var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      const names = data.names;
      names.forEach((item) => {
        selector
          .append("option")
          .text(item)
      });
    const default_names = names[0];
    // console.log("--- Initialized ---");
    buildMetadata(default_names); 
    buildGraph(default_names);
    // buildGraph_AllSamples();
    buildGraph_AllSampleTest2();
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
  // console.log("--- Metadata built ---");
};

function buildGraph(sample) {
  d3.json("samples.json").then(data => {
    //const names = data.names;
    const samples = data.samples;
    const sample_data = samples.filter(item => item.id == sample);
    
    // console.log(sample_data);
    
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
  // console.log("--- Graph built ---");
};

function buildGraph_AllSamples() {
  otu_ids_list = [];
  otu_genus = "";
  values = "";
  // id_lbl_combo = "";
  d3.json("samples.json").then(data => {
    const samples = data.samples;
    var otu_ids = samples.map(item => item.otu_ids);
    otu_ids_list.push(otu_ids);
    otu_labels_list = [];
    otu_labels_arr = [];
    values_list = [];
  
    function extract( array, newarray ){
      if( !newarray ) newarray = [] ;
      if( array ) for( var i = 0 ; i < array.length ; ++i )
      {if( array[i].constructor.name === "Array" ) extract( array[i], newarray ) ;
          else newarray.push( array[i] ) ;}
      return newarray ;
    }
    var new_ids_arr = extract(otu_ids_list);
    otu_ids_list = new_ids_arr;
    // console.log(otu_ids_list);
    // extract sample values
    var sample_values = samples.map(item => item.sample_values);
    values_list.push(sample_values);
    // console.log(sample_values);
    var new_values_arr = extract(values_list);
    values = new_values_arr;
    // console.log(values);
    // extract labels
    var otu_labels = samples.map(item => item.otu_labels);
    // console.log(otu_labels);
    otu_labels.forEach((item, i) => {
      // console.log(item);
      let genus_list = [];
      for (var i=0; i<item.length; i++) {
        // console.log(item[i]);
        var item_genus = item[i].split(";").slice(-1);
        // console.log(item_genus);
        genus_list.push(item_genus);
      }
      // console.log(genus_list);
      var new_lables_list = extract(genus_list);
      // console.log(new_lables_list);
      otu_labels_list.push(new_lables_list); 
      var new_labels_arr = extract(new_lables_list);
      // console.log(new_labels_arr);
      otu_labels_arr.push(new_labels_arr)
      var newArr = extract(otu_labels_arr);
      otu_genus = newArr;
      })
      // Create all samples object
      allSamples_obj = [];

      for (var i=0; i<otu_ids_list.length; i++) {
        var id = otu_ids_list[i];
        var lbl = otu_genus[i];
        var val = values[i];
        var id_lbl = `${id}: ${lbl}`
        allSamples_obj.push({id:id, lbl: lbl, id_lbl:id_lbl, value: val});
        }
        var aggObject = {};

        allSamples_obj.forEach((item) => {
          if (aggObject.hasOwnProperty(item.id)) {
            if (aggObject.hasOwnProperty(item.lbl)) {
              aggObject[item.lbl] = item.lbl;
              console.log(item.lbl);
            }
            aggObject[item.id] += item.value;
          
            
            
            
          } else {
            aggObject[item.id] = item.value;
            aggObject[item.lbl] = item.lbl;
            
          }
        })

        console.log(aggObject);

        otu_list = [];
        value_list = [];
        objectFinal = [];

        var unsortedArrAgg = Object.entries(aggObject).forEach((key, value) => {
          var otu_id = key[0];
          var value = key[1];
          otu_list.push(otu_id);
          value_list.push(value);
        });
        
        for (var i=0; i<value_list.length; i++) {
          var id = otu_list[i];
          var val = value_list[i];
          objectFinal.push({id:id, value: val});
          }
         
          var sortedFinal = objectFinal.sort(function(a, b) {
            return b.value - a.value;
          });
          
          // console.log(sortedFinal);
          
          const axisX = sortedFinal.map(item => item.value);
          const axisY = sortedFinal.map(item => `otu_${item.id}`);
          // console.log(axisX);
          // console.log(axisY);             
     
    const title = `Top 10 Bacteria - all samples`;
    const trace = {
      x: axisX.slice(0, 10).reverse(), //
      y: axisY.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
      title: title,
      text: axisY
    };
    var data = [trace];
    var layout = {
      title: title,
      xaxis: { title: "Sample values - all samples" },
      yaxis: axisY.slice(0, 10).reverse(),
      width: 600,
      margin: {
        l: 250,
        r: 50,
        b: 100,
        t: 100,
        pad: 10}
    };
    Plotly.newPlot("plot-all", data, layout);
  })
  
};

function buildGraph_AllSampleTest2() {
  otu_ids_list = [];
  otu_genus = "";
  values = "";
  
  // PART I - Read JSON file and create new object with ids and lables lerged
  d3.json("samples.json").then(data => {
    const samples = data.samples;
    var otu_ids = samples.map(item => item.otu_ids);
    otu_ids_list.push(otu_ids);
    otu_labels_list = [];
    otu_labels_arr = [];
    values_list = [];
    // Create extract function to flatten the arrays
    function extract( array, newarray ){
      if( !newarray ) newarray = [] ;
      if( array ) for( var i = 0 ; i < array.length ; ++i )
      {if( array[i].constructor.name === "Array" ) extract( array[i], newarray ) ;
          else newarray.push( array[i] ) ;}
      return newarray ;
    }
    // Create extract function to flatten the array
    var new_ids_arr = extract(otu_ids_list);
    otu_ids_list = new_ids_arr;
    var sample_values = samples.map(item => item.sample_values);
    values_list.push(sample_values);
    // Create extract function to flatten the array
    var new_values_arr = extract(values_list);
    values = new_values_arr;
    var otu_labels = samples.map(item => item.otu_labels);
    // Loop through otu lables to extract last value
    otu_labels.forEach((item, i) => {
      // console.log(item);
      let genus_list = [];
      for (var i=0; i<item.length; i++) {
        // console.log(item[i]);
        var item_genus = item[i].split(";").slice(-1);
        // console.log(item_genus);
        genus_list.push(item_genus);
      }
      // Create extract function to flatten the array
      var new_lables_list = extract(genus_list);
      // console.log(new_lables_list);
      otu_labels_list.push(new_lables_list); 
      var new_labels_arr = extract(new_lables_list);
      // console.log(new_labels_arr);
      otu_labels_arr.push(new_labels_arr)
      var newArr = extract(otu_labels_arr);
      otu_genus = newArr;
      })
      // Create and push the data to the object
      allSamples_obj = [];

      for (var i=0; i<otu_ids_list.length; i++) {
        var id = otu_ids_list[i];
        var lbl = otu_genus[i];
        var val = values[i];
        var id_lbl = `${id}: ${lbl}`
        allSamples_obj.push({id:id, lbl: lbl, id_lbl:id_lbl, value: val});
        }
        
        // Sort all samples data by otu id
        sum_value = 0;
        arrayLabel = [];
        array_values = [];
        currentID = 0;
        var sortedFinalObjSamples = allSamples_obj.sort(function(a, b) {
          return b.id - a.id;
        });
        
        // PART II - Group the data by otu ids
        const groupBy = (array, key) => {
          // Return the end result
          return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
              currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
          }, {}); // empty object is the initial value for result object
        };
        
        // Group by color as key to the person array
        const groupedByObj = groupBy(sortedFinalObjSamples, 'id');

        // PART III - Get values aggregated per otu id
        var total_ids = [];
        var total_lbls = [];
        var total_vals = [];
        Object.entries(groupedByObj).forEach((entry, i) => {
          var vals = entry[1]; // note: this is a list of values after grouping
          console.log(i);
          total_value = 0;
          // push ids to the array
          total_ids.push(entry[0]);
          var lbl = vals.map(item => item.lbl);
          // push labels to the list
          total_lbls.push(lbl[0]);
          // Loop throught the grouped values to accumulate them
          vals.forEach((item, key) => {
            value = item.value;
            total_value += value;
            return total_value;
          })
          var val = total_value;
          // push accumulated values to the list
          total_vals.push(val);
        })
        // Create a holder for the Total/final object
        totalAllSamples_obj = [];
        // iterate over id list and push ids, lables, id_lbl and values to the object
        for (var i=0; i<total_ids.length; i++) {
          var id = total_ids[i];
          var lbl = total_lbls[i];
          var val = total_vals[i];
          var id_lbl = `${id}: ${lbl}`
          totalAllSamples_obj.push({id:id, lbl: lbl, id_lbl:id_lbl, value: val});
          }
        
        console.log(totalAllSamples_obj);
        
        // PART IV - Sort the total arrays by values and plot
        var totalSortedFinal = totalAllSamples_obj.sort(function(a, b) {
          return b.value - a.value;
        });
        
        // Create the arrays to plot
        const totalX = totalSortedFinal.map(item => item.value);
        const totalY = totalSortedFinal.map(item => item.id_lbl);
        
        // Create trace and plot
        const title = `Top 10 Bacteria - all samples`;
        const trace = {
          x: totalX.slice(0, 10).reverse(), //
          y: totalY.slice(0, 10).reverse(),
          type: 'bar',
          orientation: 'h',
          title: title,
          text: totalY.slice(0, 10).reverse()
        };
        var data = [trace];
        var layout = {
          title: title,
          xaxis: { title: "Sample values - all samples" },
          yaxis: totalY.slice(0, 10).reverse(),
          width: 600,
          margin: {
            l: 250,
            r: 50,
            b: 100,
            t: 100,
            pad: 10}
        };
        Plotly.newPlot("plot-all", data, layout);
      })
      
    };

function optionChanged(sample) {
  buildMetadata(sample);
  buildGraph(sample);
}

init();