$(function() {
      $(document).foundation();

      let searchParams = new URLSearchParams(window.location.search)
      if (searchParams.has("code")) {
        $(".footer-left").css("background", "black");
        let code = searchParams.get("code");
        let tr = $("td:contains(" + code + ")").parent();
        let name = $(tr).children().first().text();
        if (name !== "") {
          $("#frame").load(code + ".html");
          $("#related").load(code + "-related.html", function() {
            $("#related-table tr:lt(10)")
                .addClass("active")
                .show()
          })
          $(tr).children().first().attr("style", "background:#1779ba;color:white");
          let synonyms = $(tr).children().eq(1).text();
          $(document).attr("title", name);
          $(".title-bar-title").text(name);
          if (synonyms) {
            $("#synonyms").text("(" + synonyms + ")");
          }
          $(tr).children().first().get(0).scrollIntoView();
        }
        else {
          $(".callout").show()
        }
      } else {
        $("#related-button").hide();
        $("#frame").load("all.html");
      }

      $('#offCanvas-left').on('openedEnd.zf.offCanvas', () => {
        $('#searchbar').focus();
      });

      $(".footer-left").on("click", function () {
        $(document).attr("title", "Rare diseases");
        $("#related-button").hide();
        $("td").removeAttr("style");
        $(".footer-left").css("background", "#1779ba");
        $(".title-bar-title").text("Rare diseases");
        $("#synonyms").text("");
        $("#frame").load("all.html");
        window.history.pushState({}, document.title, "/");
      })

      $("#table tr").on("click", function () {
        $("#frame").empty();
        let name = this.getElementsByTagName("td")[0].textContent;
        let synonyms = this.getElementsByTagName("td")[1].textContent;
        let orphacode = this.getElementsByTagName("td")[2].textContent;
        $("#synonyms").text("");
        $(".footer-left").css("background", "black");
        $("td").removeAttr("style");
        let td = this.getElementsByTagName(("td"))[0];
        td.setAttribute("style", "background: #1779ba; color: white");
        $("#frame").load(orphacode + ".html");
        $(".title-bar-title").text(name);
        if (synonyms) {
          $("#synonyms").text("(" + synonyms + ")");
        }
        $(document).attr("title", name);
        window.history.pushState({}, document.title, "?code=" + orphacode);
        $("#related-button").show();
        $("#related").load(orphacode + "-related.html", function() {
          $("#related-table tr:lt(10)")
              .addClass("active")
              .show()
        })
      })

    $("#related").on("click", "#related-table tr", function () {
      $("#frame").empty();
      let name = $(this).children("td").eq(1).text().trim()
      let synonyms = $("#table td:contains(" + name + ")").parent().children().eq(1).text().trim()
      let orphacode = $(this).children("td").eq(2).text().trim()
      $("#synonyms").text("");
      $(".footer-left").css("background", "black");
      $("td").removeAttr("style");
      $("#frame").load(orphacode + ".html");
      $("#related").load(orphacode + "-related.html", function() {
        $("#related-table tr:lt(10)")
            .addClass("active")
            .show()
      })
      $(".title-bar-title").text(name);
      if (synonyms) {
        $("#synonyms").text("(" + synonyms + ")");
      }
      $(document).attr("title", name);
      window.history.pushState({}, document.title, "?code=" + orphacode);
      $("#related-button").show();
    })


      $("#searchbar").on('keydown click', function (event) {
        if (event.key === "Escape" && $(this).get(0).value != "") {
          event.stopPropagation();
          $(this).val("");
        }
        search();
        })

      function search() {
        setTimeout(function() {
          let input, filter, table, tr, td, i, txtValue1, txtValue2;
          input = document.getElementById("searchbar");
          filter = input.value.toUpperCase();
          table = document.getElementById("table");
          tr = table.getElementsByTagName("tr");

          // Loop through all table rows, and hide those who don't match the search query
          for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            if (td[0]) {
              txtValue1 = td[0].textContent || td[0].innerText;
              if (txtValue1.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
              } else if (td[1]) {
                txtValue2 = td[1].textContent || td[1].innerText;
                if (txtValue2.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                } else {
                  tr[i].style.display = "none";
                }
              } else {
                tr[i].style.display = "none";
              }
            }
          }
        }, 1)
      }

      $("#related-button").on("keydown", function(event) {
        $("#offCanvas-right").foundation("close", event, this);
      })

      $("#load-more").on("click", function(event){
        event.preventDefault();
        let $rows = $("#related-table tr");
        let lastActiveIndex = $rows.filter('.active:last').index();
        $rows.filter(':lt(' + (lastActiveIndex + 11) + ')')
            .addClass('active')
            .show();
        if ($rows.filter(':hidden').length === 0) {
          $("#load-more").hide()
        }
      })
})