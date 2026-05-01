// ============================================================
// FileNetBrowser Widget Preview — Mock Implementation
// Simulates FileNet GraphQL API responses for preview mode
// ============================================================



  // Mock data structure
  var mockData = {
    "/": {
      folders: [
        { id: "{ROOT-FOLDER-1}", name: "Folder for Browsing", pathName: "/Folder for Browsing" }
      ],
      documents: []
    },
    "/Folder for Browsing": {
      folders: [
        { id: "{FOLDER-1}", name: "Documents", pathName: "/Folder for Browsing/Documents" },
        { id: "{FOLDER-2}", name: "Images", pathName: "/Folder for Browsing/Images" },
        { id: "{FOLDER-3}", name: "Reports", pathName: "/Folder for Browsing/Reports" }
      ],
      documents: [
        { 
          id: "{DOC-1}", 
          name: "Project Proposal.pdf", 
          majorVersionNumber: 1, 
          minorVersionNumber: 0,
          mimeType: "application/pdf",
          contentSize: 245760
        },
        { 
          id: "{DOC-2}", 
          name: "Meeting Notes.docx", 
          majorVersionNumber: 2, 
          minorVersionNumber: 1,
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          contentSize: 102400
        }
      ]
    },
    "/Folder for Browsing/Documents": {
      folders: [
        { id: "{FOLDER-4}", name: "Contracts", pathName: "/Folder for Browsing/Documents/Contracts" },
        { id: "{FOLDER-5}", name: "Specifications", pathName: "/Folder for Browsing/Documents/Specifications" }
      ],
      documents: [
        { 
          id: "{DOC-3}", 
          name: "Technical Specification.pdf", 
          majorVersionNumber: 3, 
          minorVersionNumber: 0,
          mimeType: "application/pdf",
          contentSize: 512000
        },
        { 
          id: "{DOC-4}", 
          name: "User Manual.pdf", 
          majorVersionNumber: 1, 
          minorVersionNumber: 2,
          mimeType: "application/pdf",
          contentSize: 1048576
        },
        { 
          id: "{DOC-5}", 
          name: "Requirements.xlsx", 
          majorVersionNumber: 2, 
          minorVersionNumber: 0,
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          contentSize: 204800
        }
      ]
    },
    "/Folder for Browsing/Images": {
      folders: [],
      documents: [
        { 
          id: "{DOC-6}", 
          name: "logo.png", 
          majorVersionNumber: 1, 
          minorVersionNumber: 0,
          mimeType: "image/png",
          contentSize: 51200
        },
        { 
          id: "{DOC-7}", 
          name: "banner.jpg", 
          majorVersionNumber: 1, 
          minorVersionNumber: 0,
          mimeType: "image/jpeg",
          contentSize: 153600
        }
      ]
    },
    "/Folder for Browsing/Reports": {
      folders: [
        { id: "{FOLDER-6}", name: "2024", pathName: "/Folder for Browsing/Reports/2024" },
        { id: "{FOLDER-7}", name: "2025", pathName: "/Folder for Browsing/Reports/2025" }
      ],
      documents: [
        { 
          id: "{DOC-8}", 
          name: "Annual Report 2025.pdf", 
          majorVersionNumber: 1, 
          minorVersionNumber: 0,
          mimeType: "application/pdf",
          contentSize: 2097152
        }
      ]
    },
    "/Folder for Browsing/Documents/Contracts": {
      folders: [],
      documents: [
        { 
          id: "{DOC-9}", 
          name: "Service Agreement.pdf", 
          majorVersionNumber: 2, 
          minorVersionNumber: 0,
          mimeType: "application/pdf",
          contentSize: 307200
        },
        { 
          id: "{DOC-10}", 
          name: "NDA.pdf", 
          majorVersionNumber: 1, 
          minorVersionNumber: 0,
          mimeType: "application/pdf",
          contentSize: 102400
        }
      ]
    },
    "/Folder for Browsing/Documents/Specifications": {
      folders: [],
      documents: [
        { 
          id: "{DOC-11}", 
          name: "API Specification.pdf", 
          majorVersionNumber: 4, 
          minorVersionNumber: 2,
          mimeType: "application/pdf",
          contentSize: 409600
        }
      ]
    },
    "/Folder for Browsing/Reports/2024": {
      folders: [],
      documents: [
        { 
          id: "{DOC-12}", 
          name: "Q1 Report.pdf", 
          majorVersionNumber: 1, 
          minorVersionNumber: 0,
          mimeType: "application/pdf",
          contentSize: 512000
        },
        { 
          id: "{DOC-13}", 
          name: "Q2 Report.pdf", 
          majorVersionNumber: 1, 
          minorVersionNumber: 0,
          mimeType: "application/pdf",
          contentSize: 524288
        }
      ]
    },
    "/Folder for Browsing/Reports/2025": {
      folders: [],
      documents: [
        { 
          id: "{DOC-14}", 
          name: "Q1 Report.pdf", 
          majorVersionNumber: 1, 
          minorVersionNumber: 0,
          mimeType: "application/pdf",
          contentSize: 614400
        }
      ]
    }
  };

  // Mock widget context
  function createMockContext() {
    return {
      element: document.getElementById('fnbrowser-widget-container'),
      getOption: function(name) {
        switch(name) {
          case 'graphqlEndpoint':
            return 'https://filenet-host/content-services-graphql/graphql';
          case 'repositoryIdentifier':
            return 'OS1';
          case 'rootFolderPath':
            return '/Folder for Browsing';
          case 'showDocumentDetails':
            return true;
          case 'allowMultiSelect':
            return false;
          case 'showBreadcrumb':
            return true;
          default:
            return undefined;
        }
      },
      getData: function() {
        return this._eventData;
      },
      registerEventHandlingFunction: function(context, eventName, handler) {
        // Event registered
      },
      executeEventHandlingFunction: function(context, eventName, data) {
        this._eventData = data;
      }
    };
  }

  // Mock fetch for GraphQL queries
  var originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Check if this is a GraphQL request
    if (options && options.body) {
      try {
        var body = JSON.parse(options.body);
        if (body.query && body.variables) {
          // Simulate network delay
          return new Promise(function(resolve) {
            setTimeout(function() {
              var path = body.variables.path;
              var data = mockData[path];
              
              if (data) {
                resolve({
                  json: function() {
                    return Promise.resolve({
                      data: {
                        folder: {
                          id: "{FOLDER-" + Math.random().toString(36).substr(2, 9) + "}",
                          name: path.split('/').pop() || 'Root',
                          pathName: path,
                          subFolders: {
                            folders: data.folders
                          },
                          containedDocuments: {
                            documents: data.documents,
                            pageInfo: {
                              totalCount: data.documents.length
                            }
                          }
                        }
                      }
                    });
                  }
                });
              } else {
                resolve({
                  json: function() {
                    return Promise.resolve({
                      errors: [{
                        message: "Folder not found: " + path
                      }]
                    });
                  }
                });
              }
            }, 300);
          });
        }
      } catch (e) {
        // Not a JSON body, fall through to original fetch
      }
    }
    
    // Fall back to original fetch for non-GraphQL requests
    return originalFetch.apply(this, arguments);
  };

  // Load widget files
  function loadWidget() {
    var container = document.getElementById('fnbrowser-widget-container');
    
    // Load CSS
    var cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '../widget/InlineCSS.css';
    document.head.appendChild(cssLink);
    
    // Load HTML layout
    fetch('../widget/Layout.html')
      .then(function(response) { return response.text(); })
      .then(function(html) {
        container.innerHTML = html;
        
        // Load and execute JavaScript
        return fetch('../widget/inlineJavascript.js');
      })
      .then(function(response) { return response.text(); })
      .then(function(js) {
        // Create mock context
        var mockContext = createMockContext();
        
        // Execute widget JavaScript in context
        var widgetFunction = new Function('context', 
          'var this = context; ' +
          'this.context = { element: context.element }; ' +
          'this.getOption = context.getOption.bind(context); ' +
          'this.getData = context.getData.bind(context); ' +
          'this.registerEventHandlingFunction = context.registerEventHandlingFunction.bind(context); ' +
          'this.executeEventHandlingFunction = context.executeEventHandlingFunction.bind(context); ' +
          js
        );
        
        widgetFunction(mockContext);
      })
      .catch(function(error) {
        console.error('Error loading widget:', error);
        container.innerHTML = '<div style="color: red; padding: 20px;">Error loading widget: ' + error.message + '</div>';
      });
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }