app.controller("playlistsCtrl", function($scope, PlaylistsService, SesionService, ObserverService, MensajesService) {
    $scope.SesionService = SesionService;
    $scope.playlists = [];
    $scope.nueva = { nombre: "", descripcion: "", url: "" };

    function cargar() {
        PlaylistsService.obtenerPlaylists().then(function(data) {
            $scope.playlists = data;
            $scope.$applyAsync();
        });
    }

    $scope.crear = function() {
        PlaylistsService.crearPlaylist($scope.nueva)
            .then(res => {
                MensajesService.toast("Playlist creada");
                cargar();
            })
            .catch(err => MensajesService.pop("Error al crear playlist"));
    };

    $scope.actualizar = function(p) {
        PlaylistsService.actualizarPlaylist(p.idPlaylist, {
            nombre: p.nombre,
            descripcion: p.descripcion,
            url: p.url
        })
        .then(() => MensajesService.toast("Playlist actualizada"))
        .catch(() => MensajesService.pop("Error al actualizar"));
    };

    $scope.eliminar = function(p) {
        if (!confirm("¿Eliminar playlist?")) return;

        PlaylistsService.eliminarPlaylist(p.idPlaylist)
            .then(() => {
                MensajesService.toast("Playlist eliminada");
                cargar();
            })
            .catch(() => MensajesService.pop("Error al eliminar"));
    };

    // Evento desde estado de ánimo
    ObserverService.subscribe("playlistRecomendada", function(playlist) {
        $scope.playlists.push(playlist);
        $scope.$apply();
    });

    cargar();
});
