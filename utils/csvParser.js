const csv = require('csv-parser');
const { Readable } = require('stream');
const parseCSV = async (csvBuffer) => {
return new Promise((resolve, reject) => {
const results = [];
const bufferStream = new Readable();
bufferStream.push(csvBuffer);
bufferStream.push(null); // Indicates the end of the stream
bufferStream
.pipe(csv())
.on('data', (data) => {
//Basic Validation and Transformation
if(!data.name || !data.class || !data.studentId){
reject(new Error("Missing required fields: name, class, studentId"));
return; // Stop processing
}
results.push({
name: data.name,
class: data.class,
studentId: data.studentId
});
})
.on('end', () => {
resolve(results);
})
.on('error', (error) => {
reject(error);
});
});
};
module.exports = { parseCSV };