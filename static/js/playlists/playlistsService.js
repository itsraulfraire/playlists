app.factory("PlaylistsService", function(PlaylistsDAO, PlaylistFactory, PlaylistDecorator, $q) {
    return {
        obtenerPlaylists: function() {
            const deferred = $q.defer();

            PlaylistsDAO.buscar()
                .then(function(data) {
                    const playlistsDecoradas = data.map(p => {
                        let playlist = PlaylistFactory.create(p.idPlaylist, p.nombre, p.descripcion, p.url);
                        const popularidad = Math.floor(Math.random() * 100);

                        return PlaylistDecorator.decorate(playlist, { popularidad });
                    });
                    deferred.resolve(playlistsDecoradas);
                })
                .catch(err => deferred.reject(err));

            return deferred.promise;
        },

        crearPlaylist: function(payload) {
            return PlaylistsDAO.crear(payload);
        },

        actualizarPlaylist: function(id, payload) {
            return PlaylistsDAO.actualizar(id, payload);
        },

        eliminarPlaylist: function(id) {
            return PlaylistsDAO.eliminar(id);
        }
    };
});
