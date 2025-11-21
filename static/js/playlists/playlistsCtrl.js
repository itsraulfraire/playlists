app.controller("playlistsCtrl", function($scope, PlaylistsService, SesionService, ObserverService, MensajesService) {
    $scope.SesionService = SesionService;
    $scope.playlists = [];
    $scope.nueva = { nombre: "", descripcion: "", url: "" };
    $scope.form = {};
    $scope.editando = false;
    $scope.tituloFormulario = $scope.editando ? "Actualizar Playlist" : "Crear Playlist";
    $scope.boton = $scope.editando ? "Actualizar" : "Crear";

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

    // Crear o actualizar
    $scope.guardarPlaylist = function () {
        if ($scope.editando) {
            PlaylistFacade.actualizarPlaylist($scope.form).then(() => {
                alert("Playlist actualizada");
                location.reload();
            });
        } else {
            PlaylistFacade.crearPlaylist($scope.form).then(() => {
                alert("Playlist creada");
                location.reload();
            });
        }
    };

    $scope.editarPlaylist = function (playlist) {
        $scope.editando = true;
        $scope.form = angular.copy(playlist.getInfo());
    };
    
    $scope.cancelarEdicion = function () {
        $scope.editando = false;
        $scope.form = {};
    };

    // Eliminar
    $scope.eliminarPlaylist = function (idPlaylist) {
        if (confirm("¿Seguro que deseas eliminar esta playlist?")) {
            PlaylistFacade.eliminarPlaylist(idPlaylist).then(() => {
                alert("Playlist eliminada");
                location.reload();
            });
        }
    };
    
    // Evento desde estado de ánimo
    ObserverService.subscribe("playlistRecomendada", function(playlist) {
        $scope.playlists.push(playlist);
        $scope.$apply();
    });

    cargar();
});
