// Timeline Widget - Change Event Handler
// Executed when the widget data changes

var _this = this;

// Get the updated timeline data
var timelineData = _this.getData().items;

// Get configuration options
var showDates = _this.getOption("showDates") !== false;
var showIcons = _this.getOption("showIcons") !== false;
var alternateLayout = _this.getOption("alternateLayout") || false;
var compact = _this.getOption("compact") || false;
var clickable = _this.getOption("clickable") || false;

console.log('Timeline data changed:', timelineData);

// Get the timeline container elements
var timelineContainer = _this.context.element.querySelector(".timeline_maincontentbox");
var timelineEvents = timelineContainer.querySelector(".timeline-events");

// Apply layout classes based on options
if (alternateLayout) {
	timelineContainer.classList.add("alternate");
} else {
	timelineContainer.classList.remove("alternate");
}

if (compact) {
	timelineContainer.classList.add("compact");
} else {
	timelineContainer.classList.remove("compact");
}

// Clear existing timeline events
timelineEvents.innerHTML = "";

// Function to format date
function formatDate(dateValue) {
	if (!dateValue) return "";
	
	try {
		var date;
		if (dateValue instanceof Date) {
			date = dateValue;
		} else if (typeof dateValue === "string") {
			date = new Date(dateValue);
		} else {
			return dateValue.toString();
		}
		
		return date.toLocaleString();
	} catch (e) {
		return dateValue.toString();
	}
}

// Function to create a timeline event
function createTimelineEvent(event, index) {
	var div = document.createElement("div");
	div.className = "timeline-event";
	
	var status = event.status || "pending";
	div.classList.add(status);
	
	if (clickable) {
		div.classList.add("clickable");
	}
	
	// Create event marker
	var marker = document.createElement("div");
	marker.className = "event-marker";
	
	if (showIcons) {
		var iconDiv = document.createElement("div");
		
		if (status === "completed") {
			iconDiv.className = "timeline_icon_completed";
		} else if (status === "current") {
			iconDiv.className = "timeline_icon_current";
		} else if (status === "error") {
			iconDiv.className = "timeline_icon_error";
		} else if (status === "warning") {
			iconDiv.className = "timeline_icon_warning";
		} else {
			iconDiv.className = "timeline_icon_pending";
		}
		
		marker.appendChild(iconDiv);
	}
	
	div.appendChild(marker);
	
	// Create event content
	var contentDiv = document.createElement("div");
	contentDiv.className = "event-content";
	
	// Add date if enabled
	if (showDates && (event.date || event.timestamp)) {
		var dateDiv = document.createElement("div");
		dateDiv.className = "event-date";
		var dateValue = event.timestamp || event.date;
		dateDiv.textContent = formatDate(dateValue);
		contentDiv.appendChild(dateDiv);
	}
	
	// Add title
	var titleDiv = document.createElement("div");
	titleDiv.className = "event-title";
	titleDiv.textContent = event.title || "Event " + (index + 1);
	contentDiv.appendChild(titleDiv);
	
	// Add description if provided
	if (event.description) {
		var descDiv = document.createElement("div");
		descDiv.className = "event-description";
		descDiv.textContent = event.description;
		contentDiv.appendChild(descDiv);
	}
	
	// Add metadata if provided
	if (event.metadata) {
		var metaDiv = document.createElement("div");
		metaDiv.className = "event-metadata";
		metaDiv.textContent = event.metadata;
		contentDiv.appendChild(metaDiv);
	}
	
	div.appendChild(contentDiv);
	
	// Add click handler if clickable
	if (clickable) {
		div.addEventListener("click", function(e) {
			e.preventDefault();
			
			if (event.onClick && typeof event.onClick === "function") {
				event.onClick(event, index);
			}
			
			if (typeof me !== "undefined" && me.ui && me.ui.fireEvent) {
				me.ui.fireEvent("eventClicked", {
					index: index,
					event: event
				});
			}
		});
	}
	
	return div;
}

// Render timeline events
if (timelineData && Array.isArray(timelineData) && timelineData.length > 0) {
	timelineData.forEach(function(event, index) {
		var timelineEvent = createTimelineEvent(event, index);
		timelineEvents.appendChild(timelineEvent);
	});
} else {
	// Show default timeline if no data
	var defaultEvents = [
		{
			title: "Project Started",
			description: "Initial project kickoff and planning phase",
			date: "2026-01-15",
			status: "completed"
		},
		{
			title: "Development Phase",
			description: "Active development and implementation",
			date: "2026-03-01",
			status: "current"
		},
		{
			title: "Testing & QA",
			description: "Quality assurance and testing phase",
			date: "2026-05-01",
			status: "pending"
		},
		{
			title: "Production Release",
			description: "Final deployment to production",
			date: "2026-06-15",
			status: "pending"
		}
	];
	
	defaultEvents.forEach(function(event, index) {
		var timelineEvent = createTimelineEvent(event, index);
		timelineEvents.appendChild(timelineEvent);
	});
}

// Made with Bob