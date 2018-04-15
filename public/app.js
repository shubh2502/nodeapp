var billApp = angular.module('billing', []);

billApp.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0; i < files.length; i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }
            });
        }
    };
});

billApp.controller('mainController', ['$scope', '$http', function ($scope, $http) {

    $scope.showLoader = false;

    var localUrl = location.origin;

    $scope.val = 'Hello world';



    $scope.inserBulkData = function () {
        $scope.showLoader = true;
        $http.post(localUrl + '/bulkInsert').then(function (res) {
            console.log('Received', res);
            $scope.getAllData();
            $scope.showLoader = false;
        });
    };

    $scope.getAllData = function () {
        $scope.showLoader = true;
        $http.get(localUrl + '/getAllData').then(function (res) {
            if (res.status === 200) {
                $scope.items = res.data.data.recordset;
                $scope.showLoader = false;
            }
        });
    };

  
    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {
            //add the file object to the scope's files collection
            var formData = new FormData();
            formData.append('File',args.file);
            
            $http({ url: localUrl + '/uploadData', data: formData, method: 'POST', transformRequest: angular.identity, headers: { 'Content-Type': undefined } }).then(function (res) {
                console.log(res);
                alert('Uploaded Successfully');
            });
        });
    });

        // get data
        $scope.getAllData();

}]);

