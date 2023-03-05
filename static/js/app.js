// Declare a constant variable 'url' that holds a URL string for fetching JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use D3 to retrieve the JSON data from the URL and print it to the console
d3.json(url).then(function(data) {
console.log(data);
});

// Define the 'init' function that will initialize the dashboard
function init() {
    
    // Use D3 to select the dropdown menu and assign it to a variable
    let dropdownMenu = d3.select("#selDataset");
    
    // Use D3 to retrieve the JSON data from the URL and populate the drop-down selector with sample names
    d3.json(url).then((data) => {
        
        // Retrieve the sample names
        let names = data.names;
    
        // Add each sample to the dropdown menu
        names.forEach((id) => {
    
            // Log the value of id for each iteration of the loop
            console.log(id);
    
            // Append an 'option' element to the dropdown menu and set its text and value attributes to the sample name
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });
    
        // Set the first sample from the list
        let sample_one = names[0];
    
        // Log the value of sample_one
        console.log(sample_one);
    
        // Build the initial metadata, bar chart, and bubble chart for the first sample
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
    });
};

// Define the 'buildMetadata' function that will populate the metadata info
function buildMetadata(sample) {

    // Use D3 to retrieve all of the JSON data from the URL
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter the metadata based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after it has been filtered
        console.log(value);

        // Get the first index from the array
        let valueData = value[0];

        // Clear out any existing metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            // Append an 'h5' element to the metadata panel with the key/value pair as text
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Define the 'buildBarChart' function that will build the bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the JSON data from the URL
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter the sample data based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Retrieve the otu_ids, otu_labels, and sample_values for the sample
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {

    // Retrieve all data from API using D3
    d3.json(url).then((data) => {
    
        // Get sample data
        let sampleInfo = data.samples;

        // Filter sample data based on selected sample value
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Extract necessary data points from selected sample
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console for debugging
        console.log(otu_ids,otu_labels,sample_values);
    
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout for bubble chart
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Plot the bubble chart using Plotly
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) {

    // Log the new sample value to the console
    console.log(value); 

    // Call all functions to update dashboard
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

// Call the initialize function to set up the dashboard
init();





    