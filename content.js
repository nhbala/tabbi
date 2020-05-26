//When content is first loaded function call
document.addEventListener('DOMContentLoaded', function() {

  // localStorage.clear();
  //Adding in tabs on start up? (do we need to include first tab could be removed later)
  chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
        var currElement = document.getElementById(tab.id)

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
          li.appendChild(a);
          li.setAttribute("id", "li" + currTabId.toString()); // added line
          ul.appendChild(li);
        });
      });
    });

    //Keeping category titles
    let currNumberDivs = localStorage.getItem("categoryNum");
    if (currNumberDivs != null){
      for (i = 1; i <= currNumberDivs; i++){
        let categoryTitle = JSON.parse(localStorage.getItem(i))["name"];
        let categoryDiv = document.getElementById("categoryList");
        let newDiv = document.createElement("div");
        newDiv.textContent = categoryTitle;
        categoryDiv.appendChild(newDiv);
      }
    }




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
      newDiv.textContent = categoryTitle;
      newDiv.setAttribute("id", "categoryId" + localStorage.getItem("categoryNum").toString());
      categoryDiv.appendChild(newDiv);
      let divDict = {};
      divDict["name"] = categoryTitle;
      divDict["tab_ids"] = [];
      localStorage.setItem(localStorage.getItem("categoryNum"), JSON.stringify(divDict));





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

// When a tab is closed/window is closed
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  var currElement = document.getElementById("li" + tabId)
  currElement.remove()

});


var clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', function(){
  localStorage.clear();
});


//When tabs are added/updated
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    //Checking all the current tabs open
    chrome.windows.getAll({populate:true},function(windows){
  windows.forEach(function(window){
    window.tabs.forEach(function(tab){
      var currElement = document.getElementById(tab.id)
      if (currElement == null){
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
        li.appendChild(a);
        li.setAttribute("id", "li" + currTabId.toString()); // added line
        ul.appendChild(li);
      }else{
        currElement.textContent = tab.title
      }


    });
  });
  });
  }
});
