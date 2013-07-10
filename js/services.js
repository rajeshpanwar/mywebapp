/**
 * Created with JetBrains WebStorm.
 * User: manusis
 * Date: 10/7/13
 * Time: 11:14 AM
 * To change this template use File | Settings | File Templates.
 */
angular.module('loyakk-services', []).factory('appSvc', function ($http, $rootScope, $q) {
    var supportCors = $.support.cors ;
    //var supportCors = false;
    var svc = {
        baseUrl: supportCors? 'http://api.loyakk.com/' : 'http://www.loyakk.com/webapp/api/',
        baseUrlSecure: supportCors ? 'https://api.loyakk.com/' : 'https://www.loyakk.com/webapp/api/',
        maxCount: 20,
        authorizationHeader: ''

    };
    return svc;
});

angular.module('loyakk-services').factory('channelSvc', function ($rootScope, appSvc, $http, $q) {

    var svc = {
        getVariousChannels: function (venueId,params) {
            var deferred = $q.defer();
            if (!params) params = {};
            var api_url = appSvc.baseUrl + 'venues/' + venueId;
            $http.get(api_url,{params:params}).success(function (data) {
                deferred.resolve(data.channel);
            }).error(function (data) {
                    console.log(data);
                    deferred.reject();
                });
            return deferred.promise;
        },
        getChannelInfo: function (channelId, params) {
            var deferred = $q.defer();
            if (!params) params = {};
            var api_url = appSvc.baseUrl + 'channels/' + channelId + '/info';
            $http.get(api_url, {params:params}).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                    deferred.reject();
                });
            return deferred.promise;
        }
    };
    return svc;
});

angular.module('loyakk-services').factory('conversationSvc', function ($rootScope, appSvc, $http, $q) {
    var svc = {
        getVenueConversations: function (venueId, params) {
            var deferred = $q.defer();
            if (!params) params = {};
            var api_url = appSvc.baseUrl + 'venues/' + venueId + '/conversations';
            $http.get(api_url, {params: params}).success(function (data) {
                var output = {};
                for(var i in data.conversations) {
                    var c = data.conversations[i];
                    output[c.conversationId] = c;
                }
                deferred.resolve(output);
            }).error(function (data) {
                    deferred.reject();
                });
            return deferred.promise;
        }
    };
    return svc;
});

angular.module('loyakk-services').factory('messageSvc', function ($rootScope, appSvc, $http, $q) {
    var svc = {
        getMessages: function (conversationId, params) {
            var deferred = $q.defer();
            if (!params) params = {};
            var api_url = appSvc.baseUrl + 'conversations/' + conversationId + '/messages';
            $http.get(api_url, {params: params}).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                    deferred.reject();
                });
            return deferred.promise;
        }
    };
    return svc;
});

angular.module('loyakk-services').factory('venueSvc', function ($rootScope, appSvc, $http, $q) {
    var svc = {
        getVenueById: function (venueId) {
            var deferred = $q.defer();
            var api_url = appSvc.baseUrl + 'venues/' + venueId + "/info";
            $http.get(api_url).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                    deferred.reject();
                });
            return deferred.promise;
        }
    };
    return svc;
});

