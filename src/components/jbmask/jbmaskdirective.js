'use strict';

angular.module('hw14')

  .directive('jbMask', function () {
    return {
      restrict: 'A',
      scope: {
        jbMask: '@'
      },
      require: 'ngModel',
      link: function ($scope, $elem, $attr, $controller) {

        var checkMaskedSymbol = function (sym, maskPos) {
          return ((((/[0-9]/).test(sym)) && ($scope.jbMask[maskPos] === '9')) ||
            (((/[a-z]/i).test(sym)) && ($scope.jbMask[maskPos] === 'a')));
        };

        var getMaskUniqueSymbol = function (curPosInMask) {
          return ($scope.jbMask.length !== curPosInMask &&
                  $scope.jbMask[curPosInMask] !== 'a' &&
                  $scope.jbMask[curPosInMask] !== '9') ?
            $scope.jbMask[curPosInMask] : '';
        };

        var getValidValue = function (data, mask) {
          var newModel = '';
          if (data.length !== mask.length) {
            return undefined;
          }
          for (var i = 0; i < data.length; ++i) {
            if (checkMaskedSymbol(data[i], i)) {
              newModel += data[i];
            } else if (data[i] !== mask[i]) {
              return undefined;
            }
          }
          return newModel;
        };

        var myParser = function (modelValue) {
          return getValidValue(modelValue, $scope.jbMask);
        };

        var myFormatter = function (value) {
          if (value !== undefined) {
            var formattedValue = '';
            var index = 0;
            for (var i = 0; i < $scope.jbMask.length; ++i) {
              formattedValue +=
                ($scope.jbMask[i] === 'a' || $scope.jbMask[i] === '9') ?
                value[index++] : $scope.jbMask[i];
            }
            if (index != value.length) {
              formattedValue = '';
            }
            return (getValidValue(formattedValue, $scope.jbMask) !== undefined) ?
              formattedValue : undefined;
          }
        };

        $controller.$parsers.push(myParser);
        $controller.$formatters.push(myFormatter);

        var updateInput = function (newVal) {
          $controller.$setViewValue(newVal, 'input');
          $controller.$render();
        };

        $elem.on('focus input', function () {
          var testStr = $controller.$viewValue;
          if (testStr === undefined) {
            testStr = '';
          }
          var validStr = '';
          var len = $scope.jbMask.length;
          for (var i = 0; i < len; ++i) {
            var maskUniqueSym = getMaskUniqueSymbol(i);
            if (maskUniqueSym) {      // автоматическое дописывание уникальных символов маски
              if (i === testStr.length || maskUniqueSym !== testStr[i]) {
                for (var j = i; j < len; ++j) {
                  maskUniqueSym = getMaskUniqueSymbol(j);
                  if (!maskUniqueSym) {
                    break;
                  }
                  validStr += maskUniqueSym;
                }
                break;
              } else {
                validStr += maskUniqueSym;
              }
            } else {                  // удаление символов, не удовлетворяющих маске
              if (checkMaskedSymbol(testStr[i], i)) {
                validStr += testStr[i];
              } else {
                break;
              }
            }
          }
          if (testStr !== validStr) { // если строку изменили, то обновляем
            updateInput(validStr);
          }
        });
      }
    }
  });
