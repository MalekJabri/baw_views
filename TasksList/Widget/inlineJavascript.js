var cv = this;

function renderTasks(tasks) {
    var container = document.getElementById("taskContainer");
    container.innerHTML = "";	
	
    if (tasks.length === 0) {
        container.innerHTML = "<p>No tasks available.</p>";
        return;
    }

    tasks.forEach(function(task) {

        var div = document.createElement("div");
        div.className = "task-item " + task.status.toLowerCase();

        var icon = "";

        if (task.status === "Complete") {
            icon = `
                <svg width="20" height="20" fill="#1ba348">
                    <path d="M8.5 13.5l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4z"/>
                </svg>`;
        }
        else if (task.status === "Pending") {
            icon = `
                <svg width="20" height="20" fill="#777">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 9H9V5h2v6zM9 13h2v2H9v-2z"/>
                </svg>`;
        }
        else if (task.status === "Processing") {
            icon = `
                <svg width="20" height="20" class="spinner" fill="#1d61ff">
                    <path d="M10 2v2a6 6 0 110 12v2a8 8 0 000-16z"/>
                </svg>`;
        }
        else if (task.status === "Failed") {
            icon = `
               <svg width="20" height="20" viewBox="0 0 20 20" fill="#d32f2f">
  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 9H9V5h2v6zM9 13h2v2H9v-2z"/>
</svg>

`;
        }

        div.innerHTML = `
            <div class="task-content">
                <div class="task-icon">${icon}</div>
                <span class="task-title">${task.label}</span>
            </div>
            <span class="task-status">${task.status}</span>
        `;

        container.appendChild(div);
    });
}