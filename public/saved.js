$.getJSON("/articles/saved", function (data) {

    if (data.length >= 1) {
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").prepend(
          "<div class='card'>"
          + "<a href='https://www.nytimes.com/" + data[i].link + "'>" + "<div class='card-header'>" + data[i].title + " " + "</a>"
          + "<div class='float-right'>"
          + "<button class='btn btn-danger deleteArticle' data-id='" + data[i]._id + "'>" + "Delete Saved" + "</button>" + '&nbsp;'
          + "<button class='btn btn-primary articleNotes' data-id='" + data[i]._id + "'>" + "Notes" + "</button>"
          + "</div>"
          + "</div>"
          + "<div class='card-body'>" + data[i].text
          + "</div>"
          + "</div>"
        )
      }
    } else {
      $("#articles").append("<h1 style='text-align: center'>No Articles Saved! You should hit the Scrape New button and save some articles!!</h1>")
    }
    // For each one
  
  });

  $(document).on("click", ".articleNotes", function () {
    $("#notes").empty();
    $('#exampleModal').modal("show")
    var thisId = $(this).attr("data-id");
    $(".saveNote").attr("data-id", thisId)
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId,
    }).then(function(response) {
      if (response.note.length >= 1){
        for (var j = 0; j < response.note.length; j++ ){
          $("#notes").append(
            "<div id=" + response.note[j]._id + ">" +
            "<div>" +
            "<h3>Note: " + response.note[j].body  
          
          + "<button style='float: right' class='btn btn-danger deleteNote'" + " data-id='" + response.note[j]._id + "'>" 
          + "X</button>" 
          + "</h3>" 
          + "</div>"
          + "</div>")
        }
      } else {
        $("#notes").append("<h3>No Notes Found</h3>")
      }
    })
  })

  $(document).on("click", ".saveNote", function () {
    var thisId = $(this).attr("data-id");
    var note = $("#typedNote").val().trim()
    $.ajax({
      method: "POST",
      url: "/notes/" + thisId,
      data: {
        body: note
      }
    }).then(function(response) {
    })
    $("#typedNote").val("");
    $('#exampleModal').modal("hide")
  })

  $(document).on("click", ".deleteNote", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
      method: "GET",
      url: "/deletenote/" + thisId,
    }).then(function(response) {
      $("#" + thisId).empty()
    })
  })

  $(document).on("click", ".deleteArticle", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
      method: "POST",
      url: "/articles/unsave/" + thisId,
      data: {
        saved: false
      }
    }).then(window.location.href = "/saved.html")
  })