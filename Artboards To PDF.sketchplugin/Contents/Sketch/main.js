
function currentPageToPDF(context) {
    pageToPDF(context.document.currentPage())
}

function selectedArtboardsToPDF(context) {
    var doc = context.document
    var selection = context.selection
    
    if (selection.count() <= 0) {
        print(selection)
        document.showMessage("Please select any artboards to proceed")
        return
    }
    
    var tempPage = MSPage.new()
    doc.documentData().addPage(tempPage)
    tempPage.setName("PDF Export")
    
    var selectionLoop = selection.objectEnumerator()
    var selectedArtboards = NSMutableArray.array()
    while (layer = selectionLoop.nextObject()) {
        if (layer.isMemberOfClass(MSArtboardGroup)) {
            selectedArtboards.addObject(layer.copy())
        } else if (layer.isMemberOfClass(MSSymbolMaster)) {
            var layerCopy = MSSymbolMaster.convertSymbolToArtboard(layer.copy())
            selectedArtboards.addObject(layerCopy)
        } else {
            doc.showMessage("Only artboards allowed to proceed PDF export")
            return
        }
    }
    tempPage.addLayers(selectedArtboards)
    
    var pageChildrenLoop = tempPage.children().objectEnumerator()
    while (pageLayer = pageChildrenLoop.nextObject()) {
        if (pageLayer.isMemberOfClass(MSSymbolInstance)) {
            findAndDetachFromSymbol(pageLayer)
        }
    }
    function findAndDetachFromSymbol(layer) {
        if (layer.isMemberOfClass(MSSymbolInstance)) {
            layer = layer.detachByReplacingWithGroup()
            var layerChildrenLoop = layer.children().objectEnumerator()
            while (innerLayer = layerChildrenLoop.nextObject()) {
                findAndDetachFromSymbol(innerLayer)
            }
        }
    }
    
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
