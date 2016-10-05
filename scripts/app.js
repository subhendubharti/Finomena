var animateApp = angular.module('animateApp', ['ngRoute', 'ngAnimate']);

animateApp.config(function($routeProvider) {
    $routeProvider
    	.when('/', {
    		templateUrl: 'templates/page-home.html',
            controller: 'mainController'
    	})
    	.when('/about', {
    		templateUrl: 'templates/page-about.html',
            controller: 'aboutController'
    	})
    	.when('/quiz', {
    		templateUrl: 'templates/page-quiz.html',
            controller: 'quizController'
    	}).when('/score', {
    		templateUrl: 'templates/page-score.html',
            controller: 'scoreController'
    	});

});
animateApp.controller('mainController', function($scope) {
    $scope.pageClass = 'page-home';
});

animateApp.controller('aboutController',['$scope','$rootScope' ,function($scope,$rootScope) {
    $scope.pageClass = 'page-about';
    $scope.saveName=function(){
        if($scope.name){
       $scope.isNameSaved=true;
        $scope.nameInvalid=false;
       $rootScope.name=$scope.name;
       $rootScope.$broadcast('NewData',{});
      // alert($scope.name+" : "+$rootScope.name);
        }else{
        $scope.nameInvalid=true;
        $scope.isNameSaved=false;
        }
    }
   
}]);
animateApp.controller('scoreController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.pageClass = 'page-score';
    $scope.item = 0;
    $scope.$on('NewData', function (event, args) {
        $scope.name = $rootScope.name;
    });
    $scope.$on('ResultSubmitted', function (event, args) {
        $scope.questions = $rootScope.questions;
        $scope.right = $rootScope.right;
        $scope.wrong = $rootScope.wrong;

    });
    $scope.showChart = function () {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable([
          ['Questions', 'Answers Count'],
          ['Correct', $scope.right],
          ['Wrong', $scope.wrong]
          ]);

            var options = {
                title: 'Result Graph',
                pieHole: 0.4
            };

            var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
            chart.draw(data, options);
        }
    }

    $scope.setItem = function (val) {
        $scope.item = val;
        if (val == 2) {
            $scope.showChart();
        }
    }
    $scope.isSet = function (val) {
        return val === $scope.item;
    }

} ]);

animateApp.controller('quizController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.pageClass = 'page-quiz';
    $scope.$on('NewData', function (event, args) {
        $scope.name = $rootScope.name;
    });
    $scope.questions = [
        {
            number: 1,
            question: "Which one of the following is an input device?",
            options: [
                "Microphone", "Speaker","Printer"
            ],
            correctAnswer: "Microphone"
        },
         {
             number: 2,
             question: "Which one of the following is a sports equipment?",
             options: [
                "Football", "Guitar","Lunch box"
            ],
             correctAnswer: "Football"
         },
         {
             number: 3,
             question: "Which one of the following is an Indian city?",
             options: [
                "Bangkok", "Bangalore","Goa"
            ],
             correctAnswer: "Bangalore"
         },
         {
             number: 4,
             question: "What color shares the name with a fruit?",
             options: [
                "Orange", "Cyan","Lemon"
            ],
             correctAnswer: "Orange"
         },
         {
             number: 5,
             question: "The largest continent in the world is",
             options: [
                 "Russia","Mars","Asia"
            ],
             correctAnswer: "Asia"
         }

    ];
    $scope.currQ = 0;
    $scope.right=0;
    $scope.wrong=0;
    
    $scope.submit = function () {
        // alert("submitted");
        $scope.questions[$scope.currQ].isCorrect = ($scope.questions[$scope.currQ].answer === $scope.questions[$scope.currQ].correctAnswer) ? 'right' : 'wrong';
        if($scope.questions[$scope.currQ].isCorrect==='right'){
            $scope.right=$scope.right+1;
        }else{
             $scope.wrong=$scope.wrong+1;
        }
       // alert($scope.questions[$scope.currQ].isCorrect + ":cor ans:" + $scope.questions[$scope.currQ].correctAnswer + ":givn ans:" + $scope.questions[$scope.currQ].answer);
        if ($scope.currQ < $scope.questions.length - 1) {
            $scope.currQ = $scope.currQ + 1;
            // alert($scope.currQ);
         } else if ($scope.currQ == $scope.questions.length - 1) {
            $rootScope.questions=$scope.questions;
            $rootScope.right=$scope.right;
            $rootScope.wrong=$scope.wrong;
            $rootScope.$broadcast('ResultSubmitted',{});
            $scope.message = "Answers Submitted Successfully";
            $scope.checkResult = true;
        }
    }
} ]);