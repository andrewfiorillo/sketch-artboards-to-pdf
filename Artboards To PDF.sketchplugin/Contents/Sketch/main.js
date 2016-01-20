
function currentPageToPDF(context) {
	var doc = context.document;
	var page = doc.currentPage();
	var pageArray = MSArray.dataArrayWithArray([page]);
	MSPDFBookExporter.exportPages(pageArray);	
}

function allPagesToPDF(context) {
	var doc = context.document;
	// var page = doc.currentPage();
	// var pageArray = MSArray.dataArrayWithArray([page]);
	doc.exportPDFBook(doc);
}