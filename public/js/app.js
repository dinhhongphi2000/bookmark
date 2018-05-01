function showBookmark(index = '1') {
    $.ajax({
        url: "/api/bookmark/" + index,
        success: renderBookmarks
    });
}

function renderBookmarks(result) {
    if(result.status === 'failed'){
        alert("Error");
        return;
    }
    result = result.results;
    var pannel = $('#pannel');
    pannel.empty();
    for (var i = 0; i < result.length; i++) {
        var html = "";
        if (result[i].isFolder) {
            html = '<li class="list-group-item bookmark-folder" ' +
                'parent="' + result[i].parent + '" ' +
                'index="' + result[i].index + '" ' +
                'onclick="folderClick(this)" ' + '>' +
                result[i].name +
                '</li>'
        } else {
            html = '<li class="list-group-item bookmark-link" ' +
                'parent="' + result[i].parent + '" ' +
                'index="' + result[i].index + '" ' + '>' +
                result[i].name +
                '</li>'
        }
        pannel.append(html);
    }
}

/**
 * Add new navigation on path
 * @param {*} selector 
 */
function navigationRemoveElementAfter(selector) {
    var next = $(selector).next();
    do {
        next.remove();
        next = $(selector).next();
    } while (next.length)

}

/**
 * onclick event when we click on folder bookmark item
 * @param {*} sender 
 */
function folderClick(sender) {
    var index = $(sender).attr('index');
    var name = $(sender).text();
    addNavigation({ name: name, index: index });
    showBookmark(index);
}

/**
 * onclick event when we click on navigation
 * @param {*} sender 
 */
function navigationClick(sender) {
    navigationRemoveElementAfter(sender)
    var index = $(sender).attr('index');
    showBookmark(index);
}

/*
input = {name, index}
*/
function addNavigation(data) {
    var html = '<a href="#" ' +
        'index="' + data.index + '" ' +
        'onclick="navigationClick(this)" ' + '>' +
        data.name +
        '</a>'
    $('#navigation').append(html);
}

function getCurrentIndex(){
    var element = $('#navigation > a').last();
    return $(element).attr('index');
}

/**
 * callback when we call api add bookmark success
 * @param {*} data 
 */
function addBookmarkSuccess(data){
    console.log(data);
    if(data.status === 'success'){
        console.log('success');
        showBookmark(getCurrentIndex());
        $('#addModel').modal('toggle');
    }else{
        alert("Error");
    }
}

/**
 * onclick event when click add button
 * @param {*} event 
 */
function addNewBookmark(event){
    event.preventDefault();
    
    var form = $("#bookmarkForm");
    var bookmarkObject = {
        name : $(form).find('input[id="name"]').val(),
        description : $(form).find('input[id="description"]').val(),
        isFolder : $(form).find('input[type="checkbox"]').is(':checked')
    }
    if(!form.isFolder){
        bookmarkObject.url = $(form).find('input[id="url"]').val();
    }
    $.post('/api/bookmark/' + getCurrentIndex(),
        bookmarkObject,
        addBookmarkSuccess);
}

$(document).ready(function () {
    addNavigation({ name: "Root", index: "1" });
    showBookmark();
})