angular.module('loyakk-filters', []).filter('toArray',function () {
    return function (obj) {
        if (!( obj instanceof Object)) return obj;

        var arr = [];
        for (var i in obj) arr.push(obj[i]);

        return arr;
    }
    }).filter('parseUrlFilter',function () {
        //var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
        var urlPattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
        return function (text, target, otherProp) {
            if(!text) return "";
            angular.forEach(text.match(urlPattern), function (url) {
                var url1 = url;
                if(!url.match(/^http/)){
                    url1 = "http://" + url;
                }
                text = text.replace(url, "<a onclick=\"stop(event)\" class=\"external\" target=\"" + target + "\" href=" + url1   + ">" + url + "</a>");
            });
            return text;
        };
    }).filter('thumbnail',function () {
        return function (ml, cat) {
            if (typeof ml == 'undefined') return;
            var keyname = null;
            if (cat) {
                for (var i in ml) {
                    var category = ml[i].category.trim();
                    if (category == cat) {
                        keyname = ml[i].keyname;
                        break;
                    }
                }
            }
            else {
                if (ml.length != 0) {
                    keyname = ml[0].keyname;
                }
            }

            if (!keyname) {
                if (cat == "profile-cover" || cat == "profile") {
                    return "img/profile-default.png";
                }
                else if (cat == "channel-v2-bg" || cat == "welcome-screen") {
                    return "img/channel-default.jpg";
                }
            }
            else {
                return   encodeURI('http://loyakk-ctnt-public.s3.amazonaws.com/' + keyname).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");;
            }
        }
    }).filter('channelCount',function () {
        return function (channel_counts, venueId) {
            if (Object.keys(channel_counts).length == 0) return;


            var channel_count = 0;

            channel_count = channel_counts[venueId];

            if (typeof channel_count == 'undefined') return;

            return channel_count;
        }
    }).filter('formatTime', function () {
        return function (timestamp) {
            var ageInSeconds = parseInt((new Date()).getTime() / 1000) - timestamp;
            var sPerMinute = 60;
            var sPerHour = sPerMinute * 60;
            var sPerDay = sPerHour * 24;
            var sPerWeek =  sPerDay * 7;
            var sPerMonth = sPerDay * 30;
            var sPerYear = sPerDay * 365;
            var elapsed = ageInSeconds;
            var output = '';

            if (elapsed < sPerMinute) {
                output = Math.round(elapsed) + ' S';
            } else if (elapsed < sPerHour) {
                output = Math.round(elapsed / sPerMinute) + ' M';
            } else if (elapsed < sPerDay) {
                output = Math.round(elapsed / sPerHour) + ' H   ';
            } else if (elapsed < sPerWeek) {
                output = Math.round(elapsed / sPerDay) + ' D';
            } else if (elapsed < sPerMonth) {
                output = Math.round(elapsed / sPerWeek) + ' Week+';
            }else if (elapsed < sPerYear) {
                output = Math.round(elapsed / sPerMonth) + ' Mo';
            } else {
                output = Math.round(elapsed / sPerYear) + ' Y';
            }
            return output;
        }
    });

