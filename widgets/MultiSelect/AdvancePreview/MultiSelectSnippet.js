/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * (C) Copyright IBM Corporation 2025-2026
 *
 * #END COPYRIGHT
 */

var mixObject = {

    createPreview: function (containingDiv, labelText, callback) {
        var previewLayerUri = this.context.getManagedAssetUrl(
            "BPMExt-Controls.preview.js",
            this.context.assetType_WEB,
            "SYSBPMUI"
        );

        require([previewLayerUri], this.lang.hitch(this, function () {
            require([
                "dojo/dom-construct",
                "dojo/dom-class",
                "dojo/dom-attr",
                "bpmui/preview/BPMExt-Core-Designer"
            ], this.lang.hitch(this, function (domConstruct, domClass, domAttr, bpmext) {

                bpmext.uidesign.css.ensureGlyphsLoaded(this);
                bpmext.uidesign.css.ensureSparkUIClass(containingDiv);

                this.context.coachViewData.containingDiv = containingDiv;

                // Form group
                var formGroupDiv = domConstruct.create("div", null, containingDiv);
                domClass.add(formGroupDiv, "form-group");
                this.context.coachViewData.formGroupDiv = formGroupDiv;

                // Label
                var label = domConstruct.create("span", null, formGroupDiv);
                domClass.add(label, "control-label");
                label.appendChild(document.createTextNode(labelText));
                this.context.coachViewData.label = label;

                // Input container
                var inputDiv = domConstruct.create("div", null, formGroupDiv);
                domClass.add(inputDiv, "input");
                this.context.coachViewData.inputDiv = inputDiv;

                // Generate preview multiselect
                this.generateSampleData(domConstruct, domClass, domAttr);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domClass, domAttr) {
        // Example selected values
        var selectedValues = ["option1", "option3"];
        var sampleOptions = [
            { value: "option1", name: "First Option" },
            { value: "option2", name: "Second Option" },
            { value: "option3", name: "Third Option" }
        ];

        // Create container
        var container = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(container, "multiselect-container");

        // Create wrapper
        var wrapper = domConstruct.create("div", null, container);
        domClass.add(wrapper, "multiselect-wrapper");

        // Create input wrapper
        var inputWrapper = domConstruct.create("div", null, wrapper);
        domClass.add(inputWrapper, "multiselect-input-wrapper");
        domAttr.set(inputWrapper, {
            "role": "combobox",
            "aria-expanded": "false",
            "aria-haspopup": "listbox",
            "aria-label": selectedValues.length + " items selected"
        });

        // Create selected items display
        var selectedItemsDiv = domConstruct.create("div", null, inputWrapper);
        domClass.add(selectedItemsDiv, "multiselect-selected-items");

        // Add placeholder (hidden when items selected)
        var placeholder = domConstruct.create("span", null, selectedItemsDiv);
        domClass.add(placeholder, "multiselect-placeholder");
        placeholder.textContent = "Select items...";
        placeholder.style.display = "none"; // Hidden because we have selections

        // Add selected tags
        selectedValues.forEach(function(value) {
            var option = sampleOptions.find(function(opt) {
                return opt.value === value;
            });
            
            if (!option) return;

            var tag = domConstruct.create("div", null, selectedItemsDiv);
            domClass.add(tag, "multiselect-tag");

            var tagText = domConstruct.create("span", null, tag);
            domClass.add(tagText, "multiselect-tag-text");
            tagText.textContent = option.name;

            var removeBtn = domConstruct.create("button", null, tag);
            domClass.add(removeBtn, "multiselect-tag-remove");
            domAttr.set(removeBtn, {
                "type": "button",
                "aria-label": "Remove " + option.name
            });
            removeBtn.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z"/></svg>';
        });

        // Create toggle button
        var toggleBtn = domConstruct.create("button", null, inputWrapper);
        domClass.add(toggleBtn, "multiselect-toggle");
        domAttr.set(toggleBtn, {
            "type": "button",
            "aria-label": "Toggle dropdown"
        });
        toggleBtn.innerHTML = '<svg class="multiselect-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"/></svg>';

        // Create dropdown (hidden in preview)
        var dropdown = domConstruct.create("div", null, wrapper);
        domClass.add(dropdown, "multiselect-dropdown");
        domAttr.set(dropdown, {
            "role": "listbox",
            "aria-multiselectable": "true"
        });

        // Create helper text
        var helperText = domConstruct.create("div", null, container);
        domClass.add(helperText, "multiselect-helper-text");
        helperText.textContent = "Select one or more items";
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle property changes in preview mode if needed
        // For now, static preview is sufficient
    },

    modelChanged: function (propertyName, propertyValue) {
        // Not required for preview
    }
};

// Made with Bob