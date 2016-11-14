
function currentPageToPDF(context) {
    pageToPDF(context.document.currentPage())
}

function selectedArtboardsToPDF(context) {
    var doc = context.document
    var handler = doc.eventHandlerManager().normalHandler()
    
    var tempPage = MSPage.new()
    doc.documentData().addPage(tempPage)
    tempPage.setName("PDF Export")
    
    var selectionLoop = context.selection.objectEnumerator()
    var selectedArtboards = NSMutableArray.array()
    while (layer = selectionLoop.nextObject()) {
        if (layer.isMemberOfClass(MSArtboardGroup)) {
            selectedArtboards.addObject(layer.copy())
        }
    }
    tempPage.addLayers(selectedArtboards)
    
    doc.documentData().setCurrentPage(tempPage)
    pageToPDF(tempPage)

    doc.documentData().removePage(tempPage)
}

function allPagesToPDF(context) {
	var doc = context.document
	doc.exportPDFBook(doc)
}

function pageToPDF(page) {
    var pageArray = [page]
    MSPDFBookExporter.exportPages_defaultFilename(pageArray, page.name() + ".pdf")
}
