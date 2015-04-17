'use strict';

angular.module('hw14')
  .controller('mainCtrl', function () {
    this.inputVar = undefined;
    this.mask = '+38(999)999-99-99';
    this.testVar = '';

    this.clickChange = function () {
      this.inputVar = this.testVar;
    };
  });
