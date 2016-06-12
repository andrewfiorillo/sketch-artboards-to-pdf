var app = [NSApplication sharedApplication];

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

function selectedArtboardsToPDF(context){
	var doc = context.document;
	var page = doc.currentPage();
	var pageName = page.name();

	// Check document for selected artboards
	var selectionLayers = context.selection;

	var hasSelectedArtboards = false;
	if (doc.hasArtboards() && selectionLayers){
		log(selectionLayers.count());
		for (var i=0; i < selectionLayers.count(); i++){
			if (selectionLayers[i].className() == "MSArtboardGroup"){
				hasSelectedArtboards = true;
				break;
			}
		}
	}

	if (!hasSelectedArtboards){
		[app displayDialog:"Please select an artboard" withTitle:"We couldn't find any selected artboards"];
		return;
	}

	// Allow the user to specify filename and location to save
	var saveDialog = NSSavePanel.savePanel();
	[saveDialog setNameFieldStringValue:pageName];
	saveDialog.setAllowedFileTypes(["pdf"]);

	if(saveDialog.runModal() == NSOKButton) {
		var fileURL = saveDialog.URL();
		log(fileURL);

		var artboards = doc.artboards();
		var selectedArtboardsCount = artboards.count();

		var pdf = PDFDocument.alloc().init();

		for (var i=0; i < selectedArtboardsCount; i++){
			var artboard = artboards[i];
		    if (artboard.isSelected()){

		    	// To ensure that the filename will be safe
		    	var name = cleanString(artboard.name());

		    	// To avoid issues with artboards with the same name
		    	var artboardId = artboard.objectID();
		       
		       	// It is quicker and a smaller filesize to export artboards as PDF rather than PNG.
		       	// However the quality of the PNG export is better.
		        var path = NSTemporaryDirectory() + artboardId + '/' + name + '.png';
		        doc.saveArtboardOrSlice_toFile(artboard,path);

		        var image = [[NSImage alloc] initByReferencingFile:path];
		        var page = [[PDFPage alloc] initWithImage:image];

		        [pdf insertPage:page atIndex:[pdf pageCount]];
		    }
		}

		[pdf writeToURL: fileURL];
	}
}

function cleanString(string){
	var notAllowedChars = [NSCharacterSet characterSetWithCharactersInString:@"\\<>=,!#$&'()*+/:;=?@[]%"];
	var cleanString = [[string componentsSeparatedByCharactersInSet:notAllowedChars] componentsJoinedByString:@""];
	return cleanString;	
}