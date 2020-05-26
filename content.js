document.addEventListener('DOMContentLoaded', function() {


//   chrome.windows.getAll({populate:true},function(windows){
// windows.forEach(function(window){
//   window.tabs.forEach(function(tab){
//     //collect all of the urls here, I will just log them instead
//     console.log(tab.url);
//     console.log(tab.id)
//     var ul = document.getElementById("myUL");
//     var li = document.createElement("li");
//     var a = document.createElement("a");
//     a.textContent = tab.title;
//     a.setAttribute('href', tab.url);
//     li.appendChild(a);
//     li.setAttribute("id", tab.id); // added line
//     ul.appendChild(li);
//   });
// });
// });

    var link = document.getElementById('searchBar');
    link.addEventListener('keydown', function() {

          var input, filter, ul, li, a, i, txtValue;
          input = document.getElementById("searchBar");
          filter = input.value.toUpperCase();
          ul = document.getElementById("myUL");
          li = ul.getElementsByTagName("li");
          for (i = 0; i < li.length; i++) {
              a = li[i].getElementsByTagName("a")[0];
              txtValue = a.textContent || a.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  li[i].style.display = "";
              } else {
                  li[i].style.display = "none";
              }
          }
    });
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    chrome.windows.getAll({populate:true},function(windows){
  windows.forEach(function(window){
    window.tabs.forEach(function(tab){
      //collect all of the urls here, I will just log them instead
      console.log(tab.url);
      console.log(tab.id)
      let currTabId = tab.id
      var ul = document.getElementById("myUL");
      var li = document.createElement("li");
      var a = document.createElement("button");
      a.textContent = tab.title;
      a.setAttribute("id", tab.id);
      a.addEventListener('click', function(){
        chrome.tabs.update(tab.id, {selected: true})
      })
      li.appendChild(a);
      // li.setAttribute("id", tab.id); // added line
      ul.appendChild(li);

    });
  });
  });
  }
});
