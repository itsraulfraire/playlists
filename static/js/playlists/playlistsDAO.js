app.service("PlaylistsDAO", function($q) {
    function request(method, url, data=null) {
        const deferred = $q.defer();
        $.ajax({
            url: url,
            method: method,
            data: data ? JSON.stringify(data) : null,
            contentType: "application/json"
        })
        .done(res => deferred.resolve(res))
        .fail(err => deferred.reject(err));
        return deferred.promise;
    }

    this.buscar = function() {
        return request("GET", "/playlists/buscar");
    };

    this.crear = function(payload) {
        return request("POST", "/playlists", payload);
    };

    this.actualizar = function(id, payload) {
        return request("PUT", `/playlists/${id}`, payload);
    };

    this.eliminar = function(id) {
        return request("DELETE", `/playlists/${id}`);
    };
});
