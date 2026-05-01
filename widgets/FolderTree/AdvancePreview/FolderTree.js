/*************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-I23
 * Copyright IBM Corp. 2024. All Rights Reserved.
 * U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *************************************************************************/
/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * Copyright IBM Corp. 2024. All Rights Reserved.
 * U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *
 * #END COPYRIGHT
 */

var mixObject = {
	createPreview: function(containingDiv, labelText, callback){
		var bpmextUri = this.context.getManagedAssetUrl("BPMExt-Core-Designer.js", this.context.assetType_WEB, "SYSBPMUI");
		require([ "dojo/dom-construct", "dojo/dom-class", "dojo/dom-attr", bpmextUri], this.lang.hitch(this, function(domConstruct, domClass, domAttr, bpmext) {
			bpmext.uidesign.css.ensureSparkUIClass(containingDiv);
			bpmext.uidesign.css.ensureGlyphsLoaded(this);
			
			this.context.coachViewData.containingDiv = containingDiv;
			
			var tempID;
			while(true) {
				tempID = dojox.uuid.generateRandomUuid();
				if (this.context.coachViewData.containingDiv.querySelector("div[data-temp-id='" + tempID + "']") == null) {
					break;
				}
			}
			
			this.context.coachViewData.containingDiv.setAttribute("data-temp-id", encodeURIComponent(tempID));
			domClass.add(this.context.coachViewData.containingDiv, "WYSIWYGContentList");
			
			// Initialize preview with sample folder structure
			this.initializePreviewContent();
			
			//Added for WYSIWYG for default width & height
			this.context.coachViewData.defaultWidth = "100%";
			this.context.coachViewData.defaultHeight = "400px";
			
			callback();
		}));
	},
	
	initializePreviewContent: function() {
		// Get the files list container
		var filesListContainer = this.context.coachViewData.containingDiv.querySelector(".ufm-files-list");
		
		if (filesListContainer) {
			// Clear existing content
			filesListContainer.innerHTML = "";
			
			// Create sample folder structure
			var sampleStructure = [
				{ type: 'folder', name: '📁 Documents', level: 0, expanded: true },
				{ type: 'file', name: '📄 Report.pdf', level: 1 },
				{ type: 'file', name: '📄 Summary.docx', level: 1 },
				{ type: 'folder', name: '📁 Legal Documents', level: 1, expanded: false },
				{ type: 'folder', name: '📁 Images', level: 0, expanded: true },
				{ type: 'file', name: '🖼️ Photo1.jpg', level: 1 },
				{ type: 'file', name: '🖼️ Photo2.png', level: 1 },
				{ type: 'folder', name: '📁 Archives', level: 0, expanded: false }
			];
			
			// Build the preview structure
			sampleStructure.forEach(function(item) {
				var itemDiv = document.createElement('div');
				itemDiv.className = 'ufm-file-item';
				itemDiv.setAttribute('role', 'listitem');
				itemDiv.style.marginLeft = (item.level * 20) + 'px';
				
				var checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.setAttribute('aria-label', 'Select ' + item.type);
				
				var label = document.createElement('span');
				label.textContent = item.name;
				label.style.marginLeft = '8px';
				
				itemDiv.appendChild(checkbox);
				itemDiv.appendChild(label);
				
				filesListContainer.appendChild(itemDiv);
			});
		}
		
		// Update file count
		var fileCountElement = this.context.coachViewData.containingDiv.querySelector(".ufm-file-count");
		if (fileCountElement) {
			fileCountElement.textContent = "8 items (preview)";
		}
	},
	
	propertyChanged: function(propertyName, propertyValue){
		var configHelperUri = this.context.getManagedAssetUrl("BPMExt-Core-ConfigHelper.js",this.context.assetType_WEB, "SYSBPMUI");
		require(["dojo/dom-style", "dojo/dom-class",  "dojo/dom-construct", configHelperUri], this.lang.hitch(this, function(domStyle, domClass, domConstruct, configHelper){
			
			if (propertyName == "@style") {
				var width = configHelper.getResponsiveConfigOptionValue(this, "width");
				var minWidth = configHelper.getResponsiveConfigOptionValue(this, "@minWidth");
				var finalWidth = width || minWidth || this.context.coachViewData.defaultWidth;
				if (!!finalWidth) {
					this.context.coachViewData.containingDiv.style.width = isNaN(finalWidth) ? finalWidth : (finalWidth + "px");
				} else {
					this.context.coachViewData.containingDiv.style.width = "";
				}
				
				var height = configHelper.getResponsiveConfigOptionValue(this, "height");
				var minHeight = configHelper.getResponsiveConfigOptionValue(this, "@minHeight");
				var finalHeight = height || minHeight || this.context.coachViewData.defaultHeight;
				if (!!finalHeight) {
					this.context.coachViewData.containingDiv.style.height = isNaN(finalHeight) ? finalHeight : (finalHeight + "px");
				} else {
					this.context.coachViewData.containingDiv.style.height = "";
				}
			} else if (propertyName == "allowMultiSelect") {
				console.log("FolderTree-Preview:propertyChanged() : Property Name: " + propertyName + ", value: " + propertyValue);
				// Update preview based on multi-select setting
				this.updateMultiSelectPreview(propertyValue);
			} else if (propertyName == "showFileActions") {
				console.log("FolderTree-Preview:propertyChanged() : Property Name: " + propertyName + ", value: " + propertyValue);
				// Update preview based on file actions setting
				this.updateFileActionsPreview(propertyValue);
			} else if (propertyName == "customFields") {
				console.log("FolderTree-Preview:propertyChanged() : Property Name: " + propertyName + ", value: " + propertyValue);
				// Update preview based on custom fields
				this.updateCustomFieldsPreview(propertyValue);
			}
		}));
	},
	
	updateMultiSelectPreview: function(allowMultiSelect) {
		var checkboxes = this.context.coachViewData.containingDiv.querySelectorAll(".ufm-file-item input[type='checkbox']");
		if (checkboxes) {
			checkboxes.forEach(function(checkbox) {
				if (allowMultiSelect === false) {
					checkbox.type = 'radio';
					checkbox.name = 'file-selection';
				} else {
					checkbox.type = 'checkbox';
				}
			});
		}
	},
	
	updateFileActionsPreview: function(showFileActions) {
		// File actions preview update - affects file item buttons
		console.log("FolderTree-Preview: File actions " + (showFileActions ? "enabled" : "disabled"));
	},
	
	updateCustomFieldsPreview: function(customFields) {
		// Custom fields preview update
		console.log("FolderTree-Preview: Custom fields configured: " + customFields);
	},
	
	modelChanged: function(propertyName, propertyValue) {
		console.log("FolderTree-Preview:modelChanged() : Property Name: " + propertyName);
		
		// Handle data model changes
		if (propertyName === "files") {
			console.log("FolderTree-Preview: Files data changed");
			// In preview mode, we show sample data
			// The actual widget will handle real data binding
			this.initializePreviewContent();
		}
	}
};

// Made with Bob
