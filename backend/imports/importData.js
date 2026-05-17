const XLSX = require("xlsx");

const workbook = XLSX.readFile("../dataset/villages.xlsx");

const sheetName = workbook.SheetNames[0];

const data = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetName]
);

console.log(data);