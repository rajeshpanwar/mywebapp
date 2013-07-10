/**
 * Created with JetBrains WebStorm.
 * User: manusis
 * Date: 10/7/13
 * Time: 11:25 AM
 * To change this template use File | Settings | File Templates.
 */
/**
 * @author manusis
 */
var m = angular.module('loyakk-web-app', ['loyakk-services', 'loyakk-filters', 'ui.state', 'ui.compat']);
m.config(function ($routeProvider, $httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/' + 38383);

    $stateProvider
        .state('main', {
            abstract: true,
            templateUrl: 'main.html',
            controller: 'MainCtrl'
        })
        .state('venue', {
            url: '/{venueid}',
            parent: 'main',
            views: {
                'VenueConversations' : {templateUrl: 'venueConversations.html'}
            }
        });
});

m.directive('userBind', function ($rootScope) {
    return function (scope, element, attrs) {
        element.bind('click', function () {
            if (!$rootScope.currentUser.userId) {
                // show popup
                $('#sign-in-modal').foundation('reveal', 'open');
                return false;

            }
        });
    };
});

m.run(function ($rootScope, venueSvc, channelSvc, $state) {
    console.log("run called");
    $rootScope.currentVenue = {};
    // Watch venueId, channelId and currentUser
    $rootScope.$watch("venueId", function (newValue, oldValue) {
        console.log("venueId change called");
        if (!newValue) return;
        $rootScope.authenToken = '';

        // Venue id should always be there.
        venueSvc.getVenueById($rootScope.venueId).then(function (venue) {
            $rootScope.currentVenue = venue;
            var venueImage = null;
            for (var i in venue.mediaList) {
                var media = venue.mediaList[i];
                if (media.category.trim() == "webapp-splash") {
                    venueImage = media.keyname;
                    break;
                }
            }
            if (!venueImage) {
                for (var i in venue.mediaList) {
                    var media = venue.mediaList[i];
                    if (media.category.trim() == "welcome-screen-splash") {
                        venueImage = media.keyname;
                        break;
                    } else if (media.category.trim() == "welcome-screen") {
                        venueImage = media.keyname;
                        break;
                    } else {
                        media.category.trim() == "venue-banner-v2-bg";
                        venueImage = media.keyname;
                        break;
                    }
                }
            }
            if (venueImage) {
                $rootScope.venueStyle = {"background-image": "url('http://loyakk-ctnt-public.s3.amazonaws.com/" + venueImage + "')"};

            }
            // $state.transitionTo('venue');
            $rootScope.$broadcast("venueChanged");
        });
        $rootScope.$broadcast("venueIdChanged");
    });
});

m.controller('MainCtrl', function ($rootScope, $location, $state, $stateParams, $scope, $route,  $http, appSvc, venueSvc, conversationSvc, channelSvc, messageSvc, $routeParams) {
    console.log("HERE in MainCtrl");
    $rootScope.venueId = $stateParams.venueid;

    $scope.linkTo = function (venueId, channelId, conversationId) {
        var path = "/" + venueId;
        if (channelId) path += "/" + channelId;
        if (conversationId) path += "/" + conversationId;
        $location.path(path);
    } ;
});


m.controller("ConversationsCtrl", function ($scope, $rootScope, $stateParams,  appSvc, venueSvc, conversationSvc, channelSvc, messageSvc, $routeParams) {
    console.log("inside conversationsctrl");
    $rootScope.getMessages = function (conversation, type) {
        console.log("getMessage called");
        if (!conversation)
            return;
        $scope.loaderMessage = 1;
        if (type) {
            var maxCount = 20;
        } else {
            var maxCount = 3;
        }
        if ($rootScope.channelAccessStatus ? $rootScope.channelAccessStatus.status == 2 : false) {
            messageSvc.getPrivateChannelConvMessages($rootScope.currentUser.userId, conversation.conversationId,{authenToken:$rootScope.authenToken}).then(function (data) {
                for (var i in data.messages) {
                    if (data.messages[i].messageId == conversation.startMessageId) {
                        conversation.description = data.messages[i].description;
                    }
                    if (data.messages[i]) {
                        if ($rootScope.currentUser.userId == data.messages[i].userId) {
                            if (conversation.startMessageId == data.messages[i].messageId) {
                                data.messages[i].canDelete = false;
                            } else {
                                data.messages[i].canDelete = true;
                            }

                        } else {
                            data.messages[i].canDelete = false;
                        }
                        //console.log(data.messages[i].canDelete);
                    }
                }
                conversation.messages = data.messages;
                $scope.loaderMessage = 0;

            }, function (data) {
                $scope.loaderMessage = 0;
            });
        } else {
            messageSvc.getMessages(conversation.conversationId, {
                maxCount: maxCount,
                authenToken:$rootScope.authenToken
            }).then(function (data) {
                    for (var i in data.messages) {
                        if (data.messages[i].messageId == conversation.startMessageId) {
                            conversation.description = data.messages[i].description;
                        }
                        if (data.messages[i]) {
                            if ($rootScope.currentUser.userId == data.messages[i].userId) {
                                if (conversation.startMessageId == data.messages[i].messageId) {
                                    data.messages[i].canDelete = false;
                                } else {
                                    data.messages[i].canDelete = true;
                                }

                            } else {
                                data.messages[i].canDelete = false;
                            }
                        }
                    }
                    conversation.messages = data.messages;
                    $scope.loaderMessage = 0;

                }, function (data) {
                    $scope.loaderMessage = 0;
                });
        }
        ;
    }

    $scope.showComment = false;
    $scope.venueConversations = false;
    $scope.showConversations = function (conversations) {
        $scope.venueConversations = true;
        if (Object.keys(conversations).length == 0) {
            $scope.noConversations = true;
        }
        if (Object.keys(conversations).length
            < 20) {
            $scope.noOlderConversations = true;
        }
        else{
            $scope.noOlderConversations = false;
        }
        $scope.conversations = conversations;
        console.log($scope.conversations);
        $rootScope.loader = 0;
    }


    $scope.loadConversations = function () {
        $scope.conversations = null;
        $rootScope.loader = 1;
        $scope.loaderAfterPassword = 1;
        $scope.lastTimestamp = '';
        if ($rootScope.conversationId) return;
        if ($rootScope.channelId) {
            conversationSvc.getChannelConversations($rootScope.channelId, {authenToken:$rootScope.authenToken}).then(function (conversations) {
                $scope.venueConversations = true;
                $scope.noConversations = false;
                $scope.noOlderConversations = false;
                $scope.showConversations(conversations);
                $rootScope.loader = 0;
                $scope.loaderAfterPassword = 0;
            }, function () {
                $rootScope.loader = 0;
                $scope.loaderAfterPassword = 0;
            });
        } else {
            conversationSvc.getVenueConversations($scope.venueId, {authenToken:$rootScope.authenToken}).then(function (conversations) {
                $scope.venueConversations = true;
                $scope.noConversations = false;
                $scope.noOlderConversations = false;
                $scope.showConversations(conversations);
                $rootScope.loader = 0;
                $scope.loaderAfterPassword = 0;

            }, function () {
                $rootScope.loader = 0;
                $scope.loaderAfterPassword = 0;
            });
        }
    };
    $scope.loadOlderConversations = function () {
        if ($scope.loadingConversations || $scope.loader || $scope.noOlderConversations || $scope.errorMessage) return;
        // get last conversation
        var timestamp = '';
        for (var i in $scope.conversations) {
            var conversation = $scope.conversations[i];
            if (!timestamp) {
                timestamp = conversation.timestamp;
            }
            if (timestamp > conversation.timestamp) {
                timestamp = conversation.timestamp;
            }
        }
        $scope.loadingConversations = true;
        if ($rootScope.channelId) {
            conversationSvc.getChannelConversations($rootScope.channelId, {newOld: 'old', timestamp: timestamp, maxCount: 20, authenToken:$rootScope.authenToken}).then(function (conversations) {
                if (Object.keys(conversations).length < 20) {
                    $scope.noOlderConversations = true;
                }
                for (var i in conversations) {
                    $scope.conversations[i] = conversations[i];
                }
                $scope.loadingConversations = false;
            }, function () {
                $scope.loadingConversations = false;

            });
        }
        else {
            conversationSvc.getVenueConversations($rootScope.venueId, {newOld: 'old', timestamp: timestamp, maxCount: 20, authenToken:$rootScope.authenToken}).then(function (conversations) {
                if (Object.keys(conversations).length < 20) {
                    $scope.noOlderConversations = true;
                }
                for (var i in conversations) {
                    $scope.conversations[i] = conversations[i];
                }
                $scope.loadingConversations = false;
            }, function () {
                $scope.loadingConversations = false;

            });
        }
    }
});

m.controller("VenueChannels", function ($scope, $rootScope, conversationSvc, channelSvc, $location, appSvc) {
    console.log("Inside VenueChannels Controller");
    $rootScope.loadChannels = function (channelId) {
        if (!channelId) {
            channelId = $rootScope.channelId;
        }
        var params = {};


        channelSvc.getVariousChannels($scope.venueId, params).then(function (data) {

            $rootScope.channels = data;

            if ($rootScope.channels.length <= 5) {
                $("#moreChannel").addClass('moreChannelOpaque');
            } else {
                $("#moreChannel").removeClass('moreChannelOpaque');
            }
            if ($rootScope.channelId) {
                for (var i = 0; i < $rootScope.channels.length; i++) {
                    if ($rootScope.channels[i].channelId == $rootScope.channelId) {
                        $rootScope.currentChannel = $rootScope.channels[i];
                    }
                }
                var index = $rootScope.channels.indexOf($rootScope.currentChannel);
                $rootScope.channels.splice(index, 1);
                $rootScope.channels.splice(0, 0, $rootScope.currentChannel);
            }
        });
    }


    $scope.morechannels = false;
    $scope.toggleChannel = function () {
        if ($rootScope.channels.length <= 5) {
            $scope.morechannels = false;
        } else {
            $scope.morechannels = true;
        }
    };
    $scope.toggleLessChannel = function () {
        $scope.morechannels = false;
    };

    $scope.$watch("venueId", function (newValue, oldValue) {
        if(!newValue) return;
        $rootScope.loadChannels();
    });



});

m.controller("VenueConversationsCtrl", function ($scope, $rootScope, $state, $stateParams,  appSvc, venueSvc, conversationSvc, channelSvc, messageSvc, $routeParams) {
    console.log("In VenueConversationsCtrl");
    $rootScope.venueId = $stateParams.venueid;
    $scope.loadConversations();

});

