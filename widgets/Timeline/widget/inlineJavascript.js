// Timeline Widget - Main JavaScript

// Get the timeline data (array of timeline events)
var timelineData = this.getData().items;

// Get configuration options
var showDates = this.getOption("showDates") !== false; // Default true
var showIcons = this.getOption("showIcons") !== false; // Default true
var alternateLayout = this.getOption("alternateLayout") || false; // Default false
var compact = this.getOption("compact") || false; // Default false
var clickable = this.getOption("clickable") || false; // Default false

// Register event handler for click events
this.registerEventHandlingFunction(this, "eventClicked", "index");

// Get the timeline container elements
var timelineContainer = this.context.element.querySelector(".timeline_maincontentbox");
var timelineEvents = timelineContainer.querySelector(".timeline-events");

// Apply layout classes
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
		
		// Format as locale date and time
		return date.toLocaleString();
	} catch (e) {
		return dateValue.toString();
	}
}

// Function to create a timeline event
function createTimelineEvent(event, index) {
	var div = document.createElement("div");
	div.className = "timeline-event";
	
	// Determine event status
	var status = event.status || "pending";
	div.classList.add(status);
	
	// Add clickable class if enabled
	if (clickable) {
		div.classList.add("clickable");
	}
	
	// Create event marker (circle)
	var marker = document.createElement("div");
	marker.className = "event-marker";
	
	// Add icon to marker based on status
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
	
	// Create event content container
	var contentDiv = document.createElement("div");
	contentDiv.className = "event-content";
	
	// Create event date if showDates is enabled
	if (showDates && (event.date || event.timestamp)) {
		var dateDiv = document.createElement("div");
		dateDiv.className = "event-date";
		var dateValue = event.timestamp || event.date;
		dateDiv.textContent = formatDate(dateValue);
		contentDiv.appendChild(dateDiv);
	}
	
	// Create event title
	var titleDiv = document.createElement("div");
	titleDiv.className = "event-title";
	titleDiv.textContent = event.title || "Event " + (index + 1);
	contentDiv.appendChild(titleDiv);
	
	// Create event description if provided
	if (event.description) {
		var descDiv = document.createElement("div");
		descDiv.className = "event-description";
		descDiv.textContent = event.description;
		contentDiv.appendChild(descDiv);
	}
	
	// Create event metadata if provided
	if (event.metadata) {
		var metaDiv = document.createElement("div");
		metaDiv.className = "event-metadata";
		metaDiv.textContent = event.metadata;
		contentDiv.appendChild(metaDiv);
	}
	
	div.appendChild(contentDiv);
	
	// Add click event handler if clickable
	if (clickable) {
		div.addEventListener("click", function(e) {
			e.preventDefault();
			
			// Call custom onClick handler if provided
			if (event.onClick && typeof event.onClick === "function") {
				event.onClick(event, index);
			}
			
			// Fire boundary event for event click
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
	// If no data, show default timeline events
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