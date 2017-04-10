
//-------------------------------------------------------------------------------------------------------------
// Utilities
//-------------------------------------------------------------------------------------------------------------

function pageToPDF(page) {
	var pageArray = [page];
	MSPDFBookExporter.exportPages_defaultFilename(pageArray, page.name() + ".pdf");
}


//-------------------------------------------------------------------------------------------------------------
// Export all pages to PDF
//-------------------------------------------------------------------------------------------------------------


function allPagesToPDF(context) {
	var doc = context.document;
	doc.exportPDFBook(doc);
}


//-------------------------------------------------------------------------------------------------------------
// Export current page to PDF
//-------------------------------------------------------------------------------------------------------------


function currentPageToPDF(context) {
	pageToPDF(context.document.currentPage());
}


//-------------------------------------------------------------------------------------------------------------
// Export only selected artboards to PDF
//-------------------------------------------------------------------------------------------------------------


function selectedArtboardsToPDF(context) {
	var doc = context.document;
	var selection = context.selection;
	
	// Check for slection
	
	if (selection.length <= 0) {
		NSApp.displayDialog("No artboards selected!");
		return;
	}
	
	// Creat temporary page to house selected artboards
	
	var tempPage = MSPage.new();
	doc.documentData().addPage(tempPage);
	tempPage.setName("PDF Export");
	
	// Loop through selection to check for artboards and symbols
	
	var selectedArtboards = [];
	
	for (var i = 0; i < selection.length; i++) {
		var layer = selection[i];
		if (layer.isMemberOfClass(MSArtboardGroup)) {
			selectedArtboards.push(layer.copy());
		} else if (layer.isMemberOfClass(MSSymbolMaster)) {
			var layerCopy = MSSymbolMaster.convertSymbolToArtboard(layer.copy());
			selectedArtboards.push(layerCopy);
		} else {
			NSApp.displayDialog("Only artboards can be exported.");
			return;
		}
	};
	
	// Add selected artboards to temporary page
	
	tempPage.addLayers(selectedArtboards);
	
	// Remove hidden layers
	
	var tempLayers = tempPage.children()
	for (var i = 0; i < tempLayers.length; i++) {
		var layer = tempLayers[i];
		if (layer.isVisible() == 0) {
			layer.removeFromParent();
		}
	};
	
	// Detach symbols to prevent display bug
	
	var pageChildren = tempPage.children();
	for (var i = 0; i < pageChildren.length; i++) {
		var layer = pageChildren[i];
		if (layer.isMemberOfClass(MSSymbolInstance)) {
			findAndDetachFromSymbol(layer);
		}
	};
	
	function findAndDetachFromSymbol(layer) {
		if (layer.isMemberOfClass(MSSymbolInstance)) {
			var group = layer.detachByReplacingWithGroup();
			var children = group.children();
			for (var i = 0; i < children.length; i++) {
				findAndDetachFromSymbol(children[i]);
			};
		}
	}
	
	// Export temporary page, then remove it from document
	
	pageToPDF(tempPage);
	tempPage.removeFromParent();
	doc.documentData().removePage(tempPage)
}
