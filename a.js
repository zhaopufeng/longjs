
var pageData = {
    id: '',
    page: '',
    limit: ''
}


function getData(id, page, limit, callback) {
    $.ajax({
        url: 'url',
        data: {
            id: id,
            page: page,
            limit, limit
        },
        success(d) {
            callback(d)
        },
        error() {
            callback(e)
        }
    })
}


function submit() {
    getData(pageData.id, pageData.limit, pageData.page, function(e) {

    })
}