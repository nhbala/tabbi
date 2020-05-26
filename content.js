document.addEventListener('DOMContentLoaded', function() {
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




  chrome.windows.getAll({populate:true},function(windows){
windows.forEach(function(window){
  window.tabs.forEach(function(tab){
    //collect all of the urls here, I will just log them instead
    console.log(tab.url);
    console.log(tab.id)
    var ul = document.getElementById("myUL");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.textContent = tab.title;
    a.setAttribute('href', tab.url);
    li.appendChild(a);
    li.setAttribute("id", tab.id); // added line
    ul.appendChild(li);
  });
});
});
