app.factory("FavoritosDAO", function($q) {

    function ajaxRequest(method, url, data = null) {
        const deferred = $q.defer();

        $.ajax({
            url: url,
            method: method,
            data: data ? JSON.stringify(data) : null,
            contentType: data ? "application/json" : undefined
        })
        .done(res => deferred.resolve(res))
        .fail(err => deferred.reject(err));

        return deferred.promise;
    }

    return {

        obtener: function() {
            return ajaxRequest("GET", "/api/favoritos");
        },

        crear: function(payload) {
            return ajaxRequest("POST", "/api/favoritos", payload);
        },

        actualizar: function(id, payload) {
            return ajaxRequest("PUT", `/api/favoritos/${id}`, payload);
        },

        eliminar: function(id) {
            return ajaxRequest("DELETE", `/api/favoritos/${id}`);
        }

    };
});
