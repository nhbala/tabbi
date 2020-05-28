//When content is first loaded function call
document.addEventListener('DOMContentLoaded', function() {




  //Adding in tabs on start up? (do we need to include first tab could be removed later)
  chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
        var currElement = document.getElementById(tab.id)
        let currNumberDivs = localStorage.getItem("categoryNum");
        if (currNumberDivs != null){
          let existsFlag = false;
          for (i = 1; i <= currNumberDivs; i++){
            let curr_tabs = JSON.parse(localStorage.getItem("categoryId" + i))["tab_ids"];
            if (curr_tabs.includes(tab.id.toString()) == true){
              existsFlag = true
              break;
            }
          }
          if (existsFlag == false){
            tabButtonCreator(tab, currElement);
          }
        }else{
          tabButtonCreator(tab, currElement);
        }


        });
      });
    });

    //Keeping category titles
    let currNumberDivs = localStorage.getItem("categoryNum");
    if (currNumberDivs != null){
      for (i = 1; i <= currNumberDivs; i++){
        let currDict = JSON.parse(localStorage.getItem("categoryId" + i))
        let categoryTitle = currDict["name"];
        let categoryDiv = document.getElementById("categoryList");
        let newDiv = document.createElement("div");
        categoryCreator(newDiv, false);
        newDiv.textContent = categoryTitle;
        newDiv.setAttribute("id", "categoryId" + i);
        categoryDiv.appendChild(newDiv);
        //add back the moved tabs under their respective categories here
        let current_tabs = currDict["tab_ids"]
        current_tabs.forEach(function(item){
          chrome.tabs.get(parseInt(item, 10), function(tab){
            let currTabId = tab.id
            // var ul = document.getElementById("myUL");
            // var li = document.createElement("li");
            var a = document.createElement("button");
            a.textContent = tab.title;
            a.setAttribute("id", tab.id);
            a.addEventListener('click', function(){
              chrome.windows.update(tab.windowId, {focused: true});
              chrome.tabs.update(tab.id, {selected: true});
            })
            var dragSpan = document.createElement("span");
            dragSpan.addEventListener("dragstart", function(){
              event
                .dataTransfer
                .setData('text/plain', event.target.id);
            })
            dragSpan.setAttribute("id", "drag" + tab.id);
            dragSpan.setAttribute("draggable", "true");
            dragSpan.appendChild(a);
            newDiv.appendChild(dragSpan);
          });

        })
      }
    }



    //creating category elements
    var createButton = document.getElementById('createButton');
    createButton.addEventListener('click', function(){
      if (localStorage.getItem("categoryNum") === null) {
        localStorage.setItem("categoryNum", 1);
      }else{
        //increase number for categoryNum
        let curr_num = parseInt(localStorage.getItem("categoryNum"),10) + 1;
        localStorage.setItem("categoryNum", curr_num);
      }
      let categoryTitle = document.getElementById("newCategoryText").value;
      let categoryDiv = document.getElementById("categoryList");
      let newDiv = document.createElement("div");
      categoryCreator(newDiv, true);
      newDiv.textContent = categoryTitle;
      newDiv.setAttribute("id", "categoryId" + localStorage.getItem("categoryNum").toString());
      categoryDiv.appendChild(newDiv);
      let divDict = {};
      divDict["name"] = categoryTitle;
      divDict["tab_ids"] = [];
      localStorage.setItem("categoryId" +localStorage.getItem("categoryNum"), JSON.stringify(divDict));




    })



    //Creating search Bar logic (change later?)
    var link = document.getElementById('searchBar');
    link.addEventListener('keydown', function() {
          var input, filter, ul, li, a, i, txtValue;
          input = document.getElementById("searchBar");
          filter = input.value.toUpperCase();
          ul = document.getElementById("myUL");
          li = ul.getElementsByTagName("li");
          for (i = 0; i < li.length; i++) {
              a = li[i].getElementsByTagName("button")[0];
              txtValue = a.textContent || a.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  li[i].style.display = "";
              } else {
                  li[i].style.display = "none";
              }
          }
    });
});



function categoryCreator(newDiv, needRefresh){
  newDiv.addEventListener("dragover", function(event){
    event
      .dataTransfer
      .setData('text/plain', event.target.id);
    //
    // event
    //   .currentTarget
    //   .style
    //   .backgroundColor = 'yellow';
    console.log("draggingover");
    event.preventDefault();
  })
  newDiv.addEventListener("drop", function(event){
    const id = event
      .dataTransfer
      .getData('text');


    const draggableElement = document.getElementById(id);
    //need to change event.target
    let dropzone = event.target;
    if (dropzone.id.includes("category") != true){
      let currNumberDivs = localStorage.getItem("categoryNum");
      for (i = 1; i <= currNumberDivs; i++){
        let curr_categoryDict = JSON.parse(localStorage.getItem("categoryId" + i));
        let curr_tabs = JSON.parse(localStorage.getItem("categoryId" + i))["tab_ids"];
        //moving new tab to correct category
        if (curr_tabs.includes(dropzone.id.replace('drag', '')) == true){
          dropzone = document.getElementById("categoryId" + i);
          let currCategorydict = JSON.parse(localStorage.getItem(dropzone.id));
          currCategorydict['tab_ids'].push(draggableElement.id.replace('drag', ''));
          localStorage.setItem(dropzone.id, JSON.stringify(currCategorydict));
          }
        //moving new tab out of old category if needed
        if (curr_tabs.includes(draggableElement.id.replace('drag', '')) == true){
          const index = curr_tabs.indexOf(draggableElement.id.replace('drag', ''));
          if (index > -1){
            curr_tabs.splice(index,1);
            curr_categoryDict['tab_ids'] = curr_tabs;
            localStorage.setItem("categoryId" + i, JSON.stringify(curr_categoryDict));
          }
        }

        }

    }else{
      let currCategorydict = JSON.parse(localStorage.getItem(dropzone.id));
      currCategorydict['tab_ids'].push(draggableElement.id.replace('drag', ''));
      let currElement = document.getElementById("li" + draggableElement.id.replace('drag', ''));
      //check if element is in list or in another category change to helper funciton we already have something like this?
      if (currElement == null){
        let currNumberDivs = localStorage.getItem("categoryNum");
        chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
          window.tabs.forEach(function(tab){
            for (i = 1; i <= currNumberDivs; i++){
              let curr_categoryDict = JSON.parse(localStorage.getItem("categoryId" + i));
              let curr_tabs = JSON.parse(localStorage.getItem("categoryId" + i))["tab_ids"];
              if (curr_tabs.includes(draggableElement.id.replace('drag', '')) == true){
                const index = curr_tabs.indexOf(draggableElement.id.replace('drag', ''));
                if (index > -1){
                  curr_tabs.splice(index,1);
                  curr_categoryDict['tab_ids'] = curr_tabs;
                  localStorage.setItem("categoryId" + i, JSON.stringify(curr_categoryDict));
                  localStorage.setItem(dropzone.id, JSON.stringify(currCategorydict));
                }
              }
            }
          });
        });
      });
      }else{
        currElement.remove();
        localStorage.setItem(dropzone.id, JSON.stringify(currCategorydict));
      }
    }

    dropzone.appendChild(draggableElement);

    event
      .dataTransfer
      .clearData();
    refreshTabs()
  })
  if (needRefresh == true){
    refreshTabs()
  }
}

// When a tab is closed/window is closed
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  var currElement = document.getElementById("li" + tabId)
  if (currElement == null){
    let currNumberDivs = localStorage.getItem("categoryNum");
    chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
        for (i = 1; i <= currNumberDivs; i++){
          let curr_categoryDict = JSON.parse(localStorage.getItem("categoryId" + i));
          let curr_tabs = JSON.parse(localStorage.getItem("categoryId" + i))["tab_ids"];
          if (curr_tabs.includes(tabId.toString()) == true){
            const index = curr_tabs.indexOf(tabId.toString());
            if (index > -1){
              curr_tabs.splice(index,1);
            }
            curr_categoryDict['tab_ids'] = curr_tabs;
            localStorage.setItem("categoryId" + i, JSON.stringify(curr_categoryDict));
            var currDrag = document.getElementById("drag" + tabId)
            currDrag.remove();
          }
        }
      });
    });
  });
  }else{
    currElement.remove();
  }
  refreshTabs();
});

//Clears all categories currently
var clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', function(){
  localStorage.clear();
  var node= document.getElementById("categoryList");
  node.querySelectorAll('*').forEach(n => n.remove());
  // refreshTabs();
});


//refresh tab functions
function refreshTabs(){
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    let curr_tab = tabs[0]
    chrome.windows.getAll({populate:true},function(windows){
      windows.forEach(function(window){
        window.tabs.forEach(function(tab){
              if (tab.id != curr_tab.id && tab.url == "chrome://newtab/"){
                chrome.tabs.reload(tab.id);
              }
          });
        });
      });
  });
}

//create tabbuttons
function tabButtonCreator(tab, currElement){
  let currTabId = tab.id
  var ul = document.getElementById("myUL");
  var li = document.createElement("li");
  var a = document.createElement("button");
  a.textContent = tab.title;
  a.setAttribute("id", tab.id);
  a.addEventListener('click', function(){
    chrome.windows.update(tab.windowId, {focused: true});
    chrome.tabs.update(tab.id, {selected: true});
  })
  var dragSpan = document.createElement("span");
  dragSpan.addEventListener("dragstart", function(){
    event
      .dataTransfer
      .setData('text/plain', event.target.id);
  })
  dragSpan.setAttribute("id", "drag" + tab.id);
  dragSpan.setAttribute("draggable", "true");
  dragSpan.appendChild(a)
  li.appendChild(dragSpan);
  li.setAttribute("id", "li" + currTabId.toString()); // added line
  ul.appendChild(li);
}

//When tabs are added/updated/reloaded
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    //Checking all the current tabs open
    chrome.windows.getAll({populate:true},function(windows){
  windows.forEach(function(window){
    window.tabs.forEach(function(tab){
      var currElement = document.getElementById(tab.id)
      if (currElement == null){
        console.log("lets see")
        let currNumberDivs = localStorage.getItem("categoryNum");
        if (currNumberDivs != null){
          let existsFlag = false;
          for (i = 1; i <= currNumberDivs; i++){
            let curr_tabs = JSON.parse(localStorage.getItem("categoryId" + i))["tab_ids"];
            if (curr_tabs.includes(tab.id.toString()) == true){
              existsFlag = true
              break;
            }
          }
          if (existsFlag == false){
            tabButtonCreator(tab, currElement);
          }
        }
      }else{
        currElement.textContent = tab.title
      }
    });
  });
  });
  //freshing in an infinite loop need to fix this
  // refreshTabs();
});
