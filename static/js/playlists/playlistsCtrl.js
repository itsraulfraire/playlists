app.controller("playlistsCtrl", function($scope, PlaylistsService, SesionService, ObserverService, MensajesService) {
    $scope.SesionService = SesionService;
    $scope.playlists = [];
    $scope.form = {};
    $scope.editando = false;
    $scope.tituloFormulario = "Crear Playlist";
    $scope.boton = "Crear";

    function cargar() {
        PlaylistsService.obtenerPlaylists().then(function(data) {
            $scope.playlists = data;
            $scope.$applyAsync();
        });
    }

    // GUARDAR (crear o actualizar)
    $scope.guardarPlaylist = function () {
        if ($scope.editando) {

            PlaylistsService.actualizarPlaylist($scope.form.idPlaylist, {
                nombre: $scope.form.nombre,
                descripcion: $scope.form.descripcion,
                url: $scope.form.url
            }).then(() => {
                MensajesService.toast("Playlist actualizada");
                $scope.cancelarEdicion();
                cargar();
            }).catch(() => MensajesService.pop("Error al actualizar"));

        } else {

            PlaylistsService.crearPlaylist({
                nombre: $scope.form.nombre,
                descripcion: $scope.form.descripcion,
                url: $scope.form.url
            }).then(() => {
                MensajesService.toast("Playlist creada");
                $scope.form = {};
                cargar();
            }).catch(() => MensajesService.pop("Error al crear"));

        }
    };

    // EDITAR
    $scope.editarPlaylist = function (playlist) {
        $scope.editando = true;
        $scope.form = angular.copy(playlist.getInfo());
        $scope.tituloFormulario = "Actualizar Playlist";
        $scope.boton = "Actualizar";
    };
    
    $scope.cancelarEdicion = function () {
        $scope.editando = false;
        $scope.form = {};
        $scope.tituloFormulario = "Crear Playlist";
        $scope.boton = "Crear";
    };

    // ELIMINAR
    $scope.eliminarPlaylist = function (idPlaylist) {
        if (confirm("¿Seguro que deseas eliminar esta playlist?")) {
            PlaylistsService.eliminarPlaylist(idPlaylist).then(() => {
                MensajesService.toast("Playlist eliminada");
                cargar();
            }).catch(() => MensajesService.pop("Error al eliminar"));
        }
    };
    
    // Estado de ánimo
    ObserverService.subscribe("playlistRecomendada", function(playlist) {
        $scope.playlists.push(playlist);
        $scope.$apply();
    });

    cargar();
});
