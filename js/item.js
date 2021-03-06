var userID;
var app = angular.module("app", []);
var scope;

var app = angular.module("item_app", ["serverModule", "utilsModule"])

$('#myTabs a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
});


    // Facebook Login code -----------------------------------
window.fbAsyncInit = function() {
    FB.init({
        appId      : '228917890846081',
        xfbml      : true,
        cookie     : true,
        version    : 'v2.8'
    });   

    // Check whether the user already logged in
    FB.getLoginStatus(function(response) {
        if (response.status != 'connected') {
            document.getElementById('loginMessage').innerHTML = 'Please login before you can see items';
            document.getElementById('login').innerHTML = 'Login';
            $("#signInMessage").show();    
            showLoginPopup();
        }
    });
};


//Code modified from https://www.w3schools.com/howto/howto_js_tabs.asp
function changeTab(titleID, id) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace(" active", "");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(titleID).className += " active";
    document.getElementById(id).className += " active";
}

app.controller("itemController", ["$scope", "$location", "serverGet", "serverPost", "winnerFunction", "$rootScope", function($scope, $location, serverGet, serverPost, winnerFunction, $rootScope) {
    var searchObject = $location.search();
    var id = searchObject['id'];
    scope = $scope;

    $rootScope.$watch(function() {
        return $location.search()['id'];
    },
    function(a) {
        if (a != null && a != undefined && a != id) {
            id = a;
            serverGet.getItem(id, $scope, userID)
        }
    });

    scope.getSuggestions = function() {
        serverGet.getSuggestions(accessToken, $scope)
    }

    scope.markRead = function() {
        serverGet.markRead(accessToken, $scope);
    }

    $scope.images = []
    $scope.notificationLength = 0;

    scope.getNotifications = function(accessToken) {
        serverGet.getNotifications(accessToken, $scope);
    }


    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {
        serverPost.bid(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document, "item");
    }

    serverGet.getReviewsOfSeller(id, $scope)


    $scope.deleteItem = function() {
        serverPost.deleteItem(id, accessToken, $scope)
    }

    scope.getItem = function() {
        serverGet.getItem(id, $scope, userID)
    }

    $scope.displayWinner = function(winner) {
        var winnerPopup = $('#winnerPopup');
        var winnerForModal = $("#winnerForModal");
        var canvasEl = $("#canvas");
        var canvas = document.getElementById("canvas")
        var width = window.innerWidth;
        var height = window.innerHeight
        var temp = winner;

        winnerFunction.displayWinner($scope, winnerPopup, winnerForModal, canvas, width, height, temp, canvasEl)
    }

}])

function showLoginPopup() {
    $('#loginPopup').modal({
        keyboard: false
    })
};