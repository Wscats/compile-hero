/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//http://stu.1000phone.net/student.php/Public/login\r\n\r\nconst GetRequest = () => {\r\n    //获取url中\"?\"符后的字串\r\n    var url = location.search;\r\n    var theRequest = new Object();\r\n    if (url.indexOf(\"?\") != -1) {\r\n        var str = url.substr(1);\r\n        strs = str.split(\"&\");\r\n        for (var i = 0; i < strs.length; i++) {\r\n            theRequest[strs[i].split(\"=\")[0]] = unescape(strs[i].split(\"=\")[1]);\r\n        }\r\n    }\r\n    return theRequest;\r\n}\r\n\r\nconst ajax = (type, url) => {\r\n    new Promise((resolve, reject) => {\r\n        let xhr = new XMLHttpRequest();\r\n        xhr.open(type, url, true);\r\n        xhr.onreadystatechange = function () {\r\n            if (xhr.readyState == 4) {\r\n                resolve(JSON.parse(xhr.responseText))\r\n            } else {\r\n                reject(xhr.responseText)\r\n            }\r\n        }\r\n        xhr.send();\r\n    })\r\n}\r\n\r\nlet stu = {\r\n\tcommit: [\"666\"]\r\n}\r\nlet host = \"http://stu.1000phone.net\";\r\nlet href = location.href.indexOf(\"?\") ? location.href.split(\"?\")[0] : location.href;\r\nlet Request = new Object();\r\nRequest = GetRequest();\r\n\r\nconst score = async () => {\r\n\tlet i = 0;\r\n\tlet inputs = document.querySelectorAll(\"input\");\r\n\tfor (; i < inputs.length;) {\r\n\t\tdocument.querySelectorAll(\"input\")[i].click();\r\n\t\ti += 4;\r\n\t}\r\n\tlet data = await ajax(\"GET\", \"https://wscats.github.io/angular-tutorial/control/core.json\");\r\n\tconsole.log(data);\r\n\tstu.commit = stu.commit.concat(data.commit);\r\n\tdocument.querySelectorAll(\"textarea\")[0].value = stu.commit[Math.floor(Math.random() * stu.commit.length)];\r\n\tdocument.querySelectorAll(\"textarea\")[1].value = stu.commit[Math.floor(Math.random() * stu.commit.length)];\r\n\tdocument.getElementById(\"addstudent\").click();\r\n}\r\n\r\nswitch (href) {\r\n\tcase `${host}/student.php/Public/login`:\r\n\t\tlet u = Request[\"u\"];\r\n\t\tlet p = Request[\"p\"];\r\n\t\tconsole.log(u, p);\r\n\t\tdocument.querySelector(\"[name='Account']\").value = u;\r\n\t\tdocument.querySelector(\"[name='PassWord']\").value = p;\r\n\t\tsetTimeout(() => {\r\n\t\t\tdocument.querySelector(\"[type='submit']\").click();\r\n\t\t}, 500);\r\n\t\tbreak;\r\n\tcase `${host}/student.php/index/index`:\r\n\t\tlocation.href = `${host}/student.php/Index/evaluate?autocommit=1`;\r\n\tcase `${host}/student.php/Index/index`:\r\n\t\tlocation.href = `${host}/student.php/Index/evaluate?autocommit=1`;\r\n\tcase `${host}/student.php/Index/evaluate`:\r\n\t\tlet autocommit = Request[\"autocommit\"];\r\n\t\tif (autocommit) {\r\n\t\t\tsetTimeout(() => {\r\n\t\t\t\tdocument.querySelector(\"[class='btn btn-xs btn-success']\").click();\r\n\t\t\t})\r\n\t\t}\r\n\t\tbreak;\r\n\tcase `${host}/student.php/Index/start_evaluate`:\r\n\t\tscore();\r\n\t\tbreak;\r\n\tcase `${host}/student.php/index/start_evaluate`:\r\n\t\tscore();\r\n\t\tbreak;\r\n\tdefault:\r\n\r\n}\r\n// 知识点测评\r\n// http://stu.1000phone.net/student.php/inquiry/index\r\n// http://stu.1000phone.net/student.php/inquiry/set_res/line_id/242/line_node_id/305/paper_id/12\r\nif (location.href.indexOf(\"inquiry/index\") >= 0) {\r\n\tlet singleSelect = document.querySelectorAll('[data-score=\"5.00\"]');\r\n\tfor (let i = 0; i < singleSelect.length; i++) {\r\n\t\tsingleSelect[i].click();\r\n\t}\r\n\tlet multiSelect = document.querySelectorAll('[type=\"checkbox\"]');\r\n\tfor (let j = 0; j < multiSelect.length; j++) {\r\n\t\tmultiSelect[j].click();\r\n\t}\r\n\t(async () => {\r\n\t\tlet data = await ajax(\"GET\", \"https://wscats.github.io/angular-tutorial/control/core.json\");\r\n\t\tconsole.log(data);\r\n\t\tstu.commit = stu.commit.concat(data.commit);\r\n\t\tdocument.querySelector('textarea').value = stu.commit[Math.floor(Math.random() * stu.commit.length)];\r\n\t\tdocument.querySelector('#submit_btn').click();\r\n\t})();\r\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });