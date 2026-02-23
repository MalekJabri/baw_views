/*************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-I23
 * Copyright IBM Corp. 2019, 2020. All Rights Reserved.
 * U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *************************************************************************/
/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * Copyright IBM Corp. 2019 - 2022. All Rights Reserved.
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
			
			this.context.coachViewData.label = this.context.coachViewData.containingDiv.querySelector("div[data-temp-id='" + tempID + "']  .breadcrumb-title");
			this.context.coachViewData.labelTextDom = document.createTextNode(labelText);
			this.context.coachViewData.label.appendChild(this.context.coachViewData.labelTextDom);
			this.context.coachViewData.label.style.display = "none";
			
			//Added for WYSIWYG for default width & height
			this.context.coachViewData.defaultWidth = "100%";
			
			this.context.coachViewData.labelHandler = bpmext.uidesign.createLabelHandler(this.context.coachViewData.labelTextDom, undefined/*we handle label vis*/, this.context.coachViewData.containingDiv, false, true);
			
			callback();
		}));
	},
	
	getLabelDomElement: function() {
		return this.context.coachViewData.label;
	},
	
	propertyChanged: function(propertyName, propertyValue){
		var configHelperUri = this.context.getManagedAssetUrl("BPMExt-Core-ConfigHelper.js",this.context.assetType_WEB, "SYSBPMUI");
		require(["dojo/dom-style", "dojo/dom-class",  "dojo/dom-construct", configHelperUri], this.lang.hitch(this, function(domStyle, domClass, domConstruct, configHelper){
			this.context.coachViewData.labelHandler.propertyChanged(propertyName, propertyValue);

			if (propertyName == "@style") {
				var width = configHelper.getResponsiveConfigOptionValue(this, "width");
				var minWidth = configHelper.getResponsiveConfigOptionValue(this, "@minWidth");
				var finalWidth = width || minWidth || this.context.coachViewData.width;
				if (!!finalWidth) {
					this.context.coachViewData.containingDiv.style.width =  isNaN(finalWidth) ? finalWidth : (finalWidth + "px");
				} else {
					this.context.coachViewData.containingDiv.style.width = "";
				}
			} else if (propertyName == "breadcrumbCustomTitle") {
				console.log("Breadcrumb-Preview:propertyChanged() : Property Name: " + propertyName + ", value: " + propertyValue);
				if (propertyValue === null || propertyValue === undefined || propertyValue == "") {
					this.context.coachViewData.label.innerHTML = "Breadcrumb";
				} else {
					this.context.coachViewData.label.innerHTML = propertyValue;
				}
			} else if (propertyName == "breadcrumbHideTitle") {
				console.log("Breadcrumb-Preview:propertyChanged() : Property Name: " + propertyName + ", value: " + propertyValue);
				if (propertyValue === null || propertyValue === undefined || propertyValue == false) {
					this.context.coachViewData.label.style.display = "block";
				} else {
					this.context.coachViewData.label.style.display = "none";
				}
			}
		}));
    },
	
	modelChanged: function(propertyName, propertyValue) {
		this.context.coachViewData.labelHandler.modelChanged(propertyName, propertyValue);
	}
};

// Made with Bob
