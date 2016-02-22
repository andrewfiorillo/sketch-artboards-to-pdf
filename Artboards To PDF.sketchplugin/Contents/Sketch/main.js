
function currentPageToPDF(context) {
	var doc = context.document;
	var page = doc.currentPage();
	var pageName = page.name();
	var pageArray = MSArray.dataArrayWithArray([page]);
	
	MSPDFBookExporter.exportPages_defaultFilename(pageArray, pageName +".pdf");
}

function allPagesToPDF(context) {
	var doc = context.document;
	doc.exportPDFBook(doc);
}