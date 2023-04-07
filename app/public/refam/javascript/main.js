const apiURl = getApiUrl()
const baseUrl = getServerUrl()
const instance = axios.create({
    baseURL: baseUrl,
    timeout: AXIOS_TOMEOUT,
    headers: {'Content-Type': 'application/json'}
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    // Set a loader before request is sent
    axios.defaults.headers.common['x-access-token'] = token;
    axios.defaults.headers['Authorization'] = token
    $('#loader').append('<td colspan="11" ></td>');
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

$(document).ready(function() {
    var pageNumber = $('#paginator').data('page-number');
    var itemsPerPage = $('#paginator').data('items-per-page');
    $('#first-user-page').attr('disabled',true);
    $('#prev-user-page').attr('disabled',true);

    instance.get('users/getPaginationAndData', {
        "reqPageNumber": pageNumber,
        "numItemsPerPage": itemsPerPage,
    }).then(function(response) {
        // Remove the loader
        $('#loader').empty();
        var status = response.data.status;
        var errorCode = response.data.errorCode;
        var message = response.data.message;
        var hasResponseData = response.data.hasResponseData;
        if (status !== 0) {
            // Seleccionar el elemento donde pintar el error
            // Retornar el codigo de error
            // insertar el mensaje de error en el elemento seleccionado
            /**
             * <div class="alert alert-warning alert-dismissible" role="alert">
                <strong>Lo sentimos!</strong> message <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
             */
            //return false
        } else if (!hasResponseData) {
            // Seleccionar el elemento donde pintar la leyenda
            // Sin Resultados

            //return false
        }

        var res = response.data;
        $('#total-items-users').text(res.totalOfItems + ' elementos');
        $('#total-user-pages').text(res.totalPages);
        $('#paginator').attr('data-total-pages', res.totalPages);
        $('#last-page').attr('data-last-page', res.totalPages);
    })
    .catch();
});

function get_next_user_page(identifier) {
    $('#table-content').empty();
    $('#table-content').append('<tr></tr>');
    var page = parseInt($('#paginator').data('page-number'));

    if ( identifier === 'first-user-page' ) {
        page = 1;
    } else if (identifier === 'prev-user-page') {
        page = parseInt($('#paginator').data('page-number')) - 1;
    } else if (identifier === 'next-user-page') {
        page = parseInt($('#paginator').data('page-number')) + 1;
    } else if (identifier === 'last-user-page') {
        page = parseInt($('#paginator').data('total-pages'));
    }

    $('#paginator').data('page-number', page );
    $('#current-user-pages').text(page);

    if (page > 1) {
        $('#first-user-page').removeAttr('disabled');
        $('#prev-user-page').removeAttr('disabled');
    } else {
        $('#first-user-page').attr('disabled',true);
        $('#prev-user-page').attr('disabled',true);
    }

    instance.post('/api/users/getPageData', {
        "reqPageNumber": page,
        "numItemsPerPage": 12,
    }).then(function(response) {
        // Remove the loader
        $('#loader').empty();
        var status = response.data.status;
        var errorCode = response.data.errorCode;
        var message = response.data.message;
        var hasResponseData = response.data.hasResponseData;

        if (status !== 0) {
            // Seleccionar el elemento donde pintar el error
            // Retornar el codigo de error
            // insertar el mensaje de error en el elemento seleccionado

            //return false
        } else if (!hasResponseData) {
            // Seleccionar el elemento donde pintar la leyenda
            // Sin Resultados

            //return false
        }

        let res = response.data.responseData;
        let trHTML;
        if ( res.isLastPage ) {
            $('#next-user-page').attr('disabled',true);
            $('#last-user-page').attr('disabled',true);
        } else {
            $('#next-user-page').removeAttr('disabled');
            $('#last-user-page').removeAttr('disabled');
        }
        res.users.map( user => {
            trHTML += '<tr>';
            if (user.status === 1  ) {
                trHTML += '<td colspan="2"><div class="form-check"><input type="checkbox" value="' + user.id + '" class="form-check-input" id="check-'+ user.enrollment+'"/>Activo</div></td>';
            } else {
                trHTML += '<td colspan="2"><div class="form-check"><input type="checkbox" value="' + user.id + '" class="form-check-input" id="check-'+ user.enrollment+'"/>Inactivo</div></td>';
            }

            trHTML += '<td>' + user.enrollment + '</td><td>' + user.email + '</td><td>' + user.grade + '</td><td>' + user.speciality + '</td><td>' + user.completeName + '</td><td>' + user.militarRegion + '</td><td>' + user.militarZone + '</td><td>' + user.militarUnity + '</td><td>' + user.birthDate + '</td>';

            if (user.gender === 'masculino') {
                trHTML += '<td>M</td>';
            } else {
                trHTML += '<td>F</td>';
            }
            trHTML += '</tr>';
        });

        $('#table-content').append(trHTML);
    });
}

function refresh_current_page(endpoint) {
    $('#table-content').empty();
    $('#table-content').append('<tr></tr>');

    instance.post(endpoint, {
        "reqPageNumber": $('#current-user-pages').text().trim(),
        "numItemsPerPage": 12
    }).then(function(response) {
        // Remove the loader
        $('#loader').empty();
        var status = response.data.status;
        var errorCode = response.data.errorCode;
        var message = response.data.message;
        var hasResponseData = response.data.hasResponseData;

        if (status !== 0) {
            // Seleccionar el elemento donde pintar el error
            // Retornar el codigo de error
            // insertar el mensaje de error en el elemento seleccionado

            //return false
        } else if (!hasResponseData) {
            // Seleccionar el elemento donde pintar la leyenda
            // Sin Resultados

            //return false
        }

        let res = response.data.responseData;
        let trHTML;

        res.users.map( user => {
            trHTML += '<tr>';
            if (user.status === 1  ) {
                trHTML += '<td colspan="2"><div class="form-check"><input type="checkbox" value="' + user.id + '" class="form-check-input" id="check-'+ user.enrollment+'"/>Activo</div></td>';
            } else {
                trHTML += '<td colspan="2"><div class="form-check"><input type="checkbox" value="' + user.id + '" class="form-check-input" id="check-'+ user.enrollment+'"/>Inactivo</div></td>';
            }

            trHTML += '<td>' + user.enrollment + '</td><td>' + user.email + '</td><td>' + user.grade + '</td><td>' + user.speciality + '</td><td>' + user.completeName + '</td><td>' + user.militarRegion + '</td><td>' + user.militarZone + '</td><td>' + user.militarUnity + '</td><td>' + user.birthDate + '</td>';

            if (user.gender === 'masculino') {
                trHTML += '<td>M</td>';
            } else {
                trHTML += '<td>F</td>';
            }
            trHTML += '</tr>';
        });

        $('#table-content').append(trHTML);
    });
}

var selected = [];

$('#check-all').click(function(){
    if($(this).prop("checked") == true){
        var checkboxes = $('#table-content input[type="checkbox"]');
        $(checkboxes).attr('checked', true);
    }
    else if($(this).prop("checked") == false){
        var checkboxes = $('#table-content input[type="checkbox"]');
        $(checkboxes).removeAttr('checked');
    }
});

var users_keys = [];

var change_status = function(users, status) {
    instance.post('/api/users/setUsersStatus', {
        "userIds": users,
        "newStatus": status
    }).then(function(response) {
        // Remove the loader
        $('#loader').empty();
    })
    .catch(function(response) {
        // catch error
        $('#loader').empty();
    });
};

var delete_users = function(users) {
    if (confirm("¿Esta usted seguro?")) {
        // your deletion code
        instance.post('/api/users/deleteUser', {
            "userIds": users,
            "newStatus": status
        }).then(function(response) {
            // Remove the loader
            $('#loader').empty();
        })
        .catch(function(response) {
            // catch error
            $('#loader').empty();
        });
        refresh_current_page('/api/users/getPageData')
    }
};
/**
 * Action
 */
$('#user-action').click(function(e) {
    e.preventDefault();
    //console.log($('select#user-actions').children('option:selected'));
    var action = $('select#user-actions').children('option:selected').val();
    var checkboxes = $('#table-content input[type="checkbox"]:checked');
    console.log(action);

    $.each(checkboxes, function(key, value) {
        users_keys.push(value['value']);
    });

    switch(action) {
        case 'activate':
            console.log("active");
            change_status(users_keys, 1);
            refresh_current_page('/api/users/getPageData')
            users_keys = [];
            break;
        case 'deactivate':
            console.log("deactive");
            change_status(users_keys, 0);
            refresh_current_page('/api/users/getPageData')
            users_keys = [];
            break;
        case 'delete':
            delete_users(users_keys);
            users_keys = [];
            break;
        default:
            return false;
            break;

    }

});


/**
 * Search query
 */
$('#search-action').click(function(e) {
    e.preventDefault();
    var search_text = $('#search-user').val();

    axios.post('/refam/api/users/searchByMailOrEnrollment', {
        "mailOrEnrollment": search_text,
    }).then(function(response) {
        // Remove the loader
        $('#loader').empty();

        var status = response.data.status;
        var errorCode = response.data.errorCode;
        var message = response.data.message;
        var hasResponseData = response.data.hasResponseData;

        if ( status !== 0) {
            // Seleccionar el elemento donde pintar el error
            // Retornar el codigo de error
            // insertar el mensaje de error en el elemento seleccionado

            //return false
        } else if (!hasResponseData) {
            // Seleccionar el elemento donde pintar la leyenda
            // Sin Resultados

            //return false
        }
        $('#table-content').empty();
        $('#table-content').append('<tr></tr>');

        var res = response.data.responseData;
        var trHTML;

        if (res.users.length > 0 ) {

            res.users.map( user => {
                trHTML += '<tr>';
                if (user.status === 1  ) {
                    trHTML += '<td colspan="2"><div class="form-check"><input type="checkbox" value="' + user.id + '" class="form-check-input" id="check-'+ user.enrollment+'"/>Activo</div></td>';
                } else {
                    trHTML += '<td colspan="2"><div class="form-check"><input type="checkbox" value="' + user.id + '" class="form-check-input" id="check-'+ user.enrollment+'"/>Inactivo</div></td>';
                }

                trHTML += '<td>' + user.enrollment + '</td><td>' + user.email + '</td><td>' + user.grade + '</td><td>' + user.speciality + '</td><td>' + user.completeName + '</td><td>' + user.militarRegion + '</td><td>' + user.militarZone + '</td><td>' + user.militarUnity + '</td><td>' + user.birthDate + '</td>';

                if (user.gender === 'masculino') {
                    trHTML += '<td>M</td>';
                } else {
                    trHTML += '<td>F</td>';
                }
                trHTML += '</tr>';
            });

        } else {
            trHTML += '<tr><td class="text-center" colspan="12">Sin resultados</td></tr>';
        }
        $('#table-content').append(trHTML);
    })

});

