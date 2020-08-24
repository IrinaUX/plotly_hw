// const { Console } = require("console");

// const { group } = require("console");

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
    buildBubblePlot(default_names)
    buildGraph_AllSampleTest();
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
      title: {
        text: title,
        font: {
          size: 12
        },
      }, 
      font: {
        size: 8,
      },
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

function buildBubblePlot(sample) {
  // read and hold json promise
  d3.json("samples.json").then(data => {
    const samples = data.samples;
    const sample_data = samples.filter(item => item.id == sample)[0];
    
    // Extract sample id and an object with key values from sample_data
    const id = sample_data.id;
    const selected_data = (({ sample_values, otu_ids, otu_labels }) => ({ sample_values, otu_ids, otu_labels }))(sample_data);
    
    // Extract label data and modify to get the family string - slice(0, 5)
    var labels_array = selected_data.otu_labels;
    var fam_lbl_list = [];
    for (var i = 0; i<labels_array.length; i++) {
      var split_join_arr = labels_array[i].split(";").slice(0,5).join(";");
      fam_lbl_list.push(split_join_arr);
    }
    
    // Add otu family labels array to the selected dataset
    selected_data.family_labels = fam_lbl_list;
    
    // Delete otu lables from selected dataset
    delete selected_data.otu_labels;
    
    // Extract values and labels into arrays 
    var vals = selected_data.sample_values;
    var labels = selected_data.family_labels;

    // Create new array of objects - iterate through list
    arrObj = [];
    for (var i=0; i<vals.length; i++) {
      var lbl = labels[i];
      var val = vals[i];
      arrObj.push({lbl: lbl, value: val});
    }
    
    // Sort the array of object based on the family lables
    var sortedObj = arrObj.sort(function(a,b) {return (a.lbl > b.lbl) ? 1 : ((b.lbl > a.lbl) ? -1 : 0);} );

    // Extract unique families into a list
    var flags = [], unique_families = [], l = sortedObj.length, i;
    for( i=0; i<l; i++) {
        if( flags[sortedObj[i].lbl]) continue;
        flags[sortedObj[i].lbl] = true;
        unique_families.push(sortedObj[i].lbl);
    }
    // console.log(unique_families);

    // Use filter method to sum up the values based on unique families
    total_values_list = [];
    for (var i=0; i < unique_families.length; i++) {
      // console.log(unique_families[i]);
      const filtered_family_data = sortedObj.filter(item => item.lbl == unique_families[i]);
      // sum_value = item.value;
      // console.log(filtered_family_data);
      total_value = 0;
      filtered_family_data.forEach(item => {
        val = item.value;
        total_value += val;
      })
      total_values_list.push(total_value);
    }
    // console.log(total_values_list);
    totalValObj = [];
    for (var i=0; i<unique_families.length; i++) {
      var lbl = unique_families[i];
      var val = total_values_list[i];
      totalValObj.push({lbl: lbl, value: val});
    }
    console.log(totalValObj);

    // PART IV - Sort the total arrays by values and plot
    var totalSorted = totalValObj.sort(function(a, b) {
      return b.value - a.value;
    });
    console.log(totalSorted);

    // Create the x and y-axis values for plotting
    const totalX = totalSorted.map(item => item.value);
    const totalY = totalSorted.map(item => item.lbl);
    const totalX_bubble_size = totalSorted.map(item => (item.value)/10);
    const totalX_size_sqrt = totalSorted.map(item => (Math.sqrt(item.value)));

    // console.log(totalX_size_sqrt);
    const title = `Bubble Plot for Selected Sample ID - ${id}`;
    const trace = {
      x: totalX,
      y: totalY,
      mode: 'markers',
      marker: {
        size: totalX_size_sqrt
      }
    };

    var data = [trace];
    var layout = {
      title: {
        text: title,
        font: {
          size: 12
        },
      },  
      font: {
        size: 8,
      },
      xaxis: { title: "Sample values" },
      yaxis: { 
        
      },
      width: 600,
      margin: {
        l: 400,
        r: 50,
        b: 100,
        t: 100,
        pad: 10}
    };
    Plotly.newPlot("bubble", data, layout);
  })
};

function buildGraph_AllSampleTest() {
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
  // Extract to flatten the array
  var new_ids_arr = extract(otu_ids_list);
  otu_ids_list = new_ids_arr;
  var sample_values = samples.map(item => item.sample_values);
  values_list.push(sample_values);
  // Extract to flatten the array
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
    
    // Use extract flatten the array
    var new_lables_list = extract(genus_list);
    otu_labels_list.push(new_lables_list); 
    
    // Use extract flatten the array
    var new_labels_arr = extract(new_lables_list);
    otu_labels_arr.push(new_labels_arr)
    
    // Use extract flatten the array
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
    // console.log(allSamples_obj);

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
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
      }, {}); // empty object is the initial value for result object
      };
      
    // Group by id
    const groupedByObj = groupBy(sortedFinalObjSamples, 'id');

    // PART III - Get values aggregated per otu id
    var total_ids = [];
    var total_lbls = [];
    var total_vals = [];
    
    Object.entries(groupedByObj).forEach((entry, i) => {
      var vals = entry[1]; // note: this is a list of values after grouping
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
      
    // console.log(totalAllSamples_obj);
    
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
      title: {
        text: title,
        font: {
          size: 12
        },
      }, 
      font: {
        size: 8,
      },
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
  buildBubblePlot(sample);
}

init();