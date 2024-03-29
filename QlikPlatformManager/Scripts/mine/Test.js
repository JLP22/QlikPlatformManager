﻿"use strict";
var _get = function e(t, n, i) {
    null === t && (t = Function.prototype);
    var a = Object.getOwnPropertyDescriptor(t, n);
    if (void 0 === a) {
        var o = Object.getPrototypeOf(t);
        return null === o ? void 0 : e(o, n, i)
    }
    if ("value" in a) return a.value;
    var r = a.get;
    return void 0 !== r ? r.call(i) : void 0
},
    _createClass = function () {
        function i(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }
        return function (e, t, n) {
            return t && i(e.prototype, t), n && i(e, n), e
        }
    }(),
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    },
    _slicedToArray = function (e, t) {
        if (Array.isArray(e)) return e;
        if (Symbol.iterator in Object(e)) return function (e, t) {
            var n = [],
                i = !0,
                a = !1,
                o = void 0;
            try {
                for (var r, s = e[Symbol.iterator](); !(i = (r = s.next()).done) && (n.push(r.value), !t || n.length !== t); i = !0);
            } catch (e) {
                a = !0, o = e
            } finally {
                try {
                    !i && s.return && s.return()
                } finally {
                    if (a) throw o
                }
            }
            return n
        }(e, t);
        throw new TypeError("Invalid attempt to destructure non-iterable instance")
    };

function _possibleConstructorReturn(e, t) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !t || "object" != typeof t && "function" != typeof t ? e : t
}

function _inherits(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
    e.prototype = Object.create(t && t.prototype, {
        constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
}

function _classCallCheck(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function _toConsumableArray(e) {
    if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n
    }
    return Array.from(e)
}
define("extensions/cl-custom-report/feature-flags", [], function () {
    var t = {};
    return (function (e, t) {
        t || (t = window.location.href), e = e.replace(/[[\]]/g, "\\$&");
        var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
        return n ? n[2] ? decodeURIComponent(n[2].replace(/\+/g, " ")) : "" : null
    }("feature") || "").split("+").forEach(function (e) {
        e && (t[e.toUpperCase()] = !0)
    }), t
}), define("extensions/cl-custom-report/utils", [], function () {
    var t = {
        pivotTable: "pivot-table",
        table: "table",
        combochart: "combochart"
    },
        n = {
            "pivot-table": "pivotTable",
            table: "table",
            combochart: "combochart"
        };
    return {
        addStyleSheet: function (e) {
            var t, n, i, a, o = (t = "link", a = document.createElement(t), n && (a.className = n), void 0 !== i && (a.innerHTML = i), a);
            o.rel = "stylesheet", o.type = "text/css", o.href = require.toUrl(e), document.head.appendChild(o)
        },
        generateId: function () {
            var n = Date.now();
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                var t = (n + 16 * Math.random()) % 16 | 0;
                return ("x" === e ? t : 3 & t | 8).toString(16)
            })
        },
        hyphensToCamelCase: function (e) {
            return e.replace(/-([a-z])/g, function (e) {
                return e[1].toUpperCase()
            })
        },
        camelCaseToHyphens: function (e) {
            return e.replace(/([A-Z])/g, function (e) {
                return "-" + e[0].toLowerCase()
            })
        },
        getVisualizationType: function (e) {
            return n[e]
        },
        getQType: function (e) {
            return t[e]
        },
        deepClone: function (e) {
            return JSON.parse(JSON.stringify(e))
        },
        isJsonString: function (e) {
            try {
                JSON.parse(e)
            } catch (e) {
                return !1
            }
            return !0
        }
    }
}), define("text!extensions/cl-custom-report/lib/partials/template.html", [], function () {
    return '<div qv-extension ng-attr-id="{{ \'cl-custom-report-container-\' + qId }}" style="height: 100%; position: relative; overflow: visible;">\r\n  <div qv-requirements="" ng-show="showRequirements()" class="requirements-wrapper ng-scope" ng-class="{\'incomplete\': !showAdd}"\r\n    aria-hidden="false">\r\n    <div class="requirements">\r\n      <h2 class="header">\r\n        <i class="object-icon lui-icon lui-icon--table"></i>\r\n      </h2>\r\n      <p class="incomplete-text ng-scope" ng-if="showIncomplete" q-translation="Visualization.Requirements.IncompleteVisualization"></p>\r\n      <p class="incomplete-text ng-scope" ng-if="showIncompleteEditMode">\r\n        This app doesn\'t have any table master items visualizations.\r\n        <br>Create 1 one and then add it as a Data Set to the Climber Custom Report\r\n      </p>\r\n      <ul ng-if="showAdd">\r\n        <li class="item missing" tid="missing-report">\r\n          <button class="add-button lui-button ng-binding" ng-class="{ \'lui-active\': d.active }" ng-click="showAddReport($event)" tid="add-report">Add Data Set</button>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n  <div ng-hide="showRequirements()">\r\n    <div ng-show="options.collapsed">\r\n      <div class="containerlabel">\r\n        <i style="padding-right: 10px; padding-left: 10px" class="lui-icon lui-icon--table icon-table"></i>\r\n        <span ng-bind="layout.props.collapseText" />\r\n      </div>\r\n    </div>\r\n    <div ng-hide="options.collapsed" style="height: 100%">\r\n      <div ng-show="showFields()" class="container_left" ng-style="getContainerWidth(\'left\')">\r\n        <div style="margin-right: 12px;">\r\n          <div class="form-group">\r\n            <div class="containerlabel">\r\n              <span>Data Sets\r\n                <span>\r\n                  <span title="Settings" class="cl-icon cl-icon--cogwheel cl-icon-right-align" ng-click="showSettingsMenu($event)" />\r\n            </div>\r\n            <form name="myForm">\r\n              <button class="lui-select select" ng-click="showChangeReport($event)">\r\n                {{reportManager.report.title}}\r\n              </button>\r\n            </form>\r\n          </div>\r\n          <div>\r\n            <div class="containerlabel">\r\n              <span q-translation="Common.Dimensions"></span>\r\n              <span title="Search dimensions" class="cl-icon cl-icon--search" style="margin-left: 4px;" ng-click="openDimensionSearch()"\r\n              />\r\n              <span title="Clear dimensions" class="lui-icon lui-icon--clear-selections cl-icon-right-align" ng-click="clearDimensions()"\r\n              />\r\n              <div ng-show="search.showDimensionInput" class="lui-search dimension-search">\r\n                <span class="lui-icon  lui-icon--search  lui-search__search-icon"></span>\r\n                <input ng-model="search.dimensions" class="lui-search__input dimension-search--input" maxlength="255" spellcheck="false"\r\n                  type="text" placeholder="Filter dimensions" />\r\n                <button ng-click="closeDimensionSearch()" class="lui-search__clear-button">\r\n                  <span class="lui-icon  lui-icon--small  lui-icon--close" />\r\n                </button>\r\n              </div>\r\n            </div>\r\n            <div class="dimension-scroller">\r\n              <ul id="dimensionSortable" class="lui-list dimension-list" ng-style="getListMaxHeight(\'dimension\')" style="overflow-y: auto; overflow-x:hidden; position: relative">\r\n                <li qv-swipe="swipe($event)" ng-class="{selected: dimension.selected}" class="lui-list__item" ng-click="selectItem(dimension, $event)"\r\n                  title="{{dimension.title +\'\\n\' + dimension.description}}" on-last-repeat="dimension" ng-repeat="dimension in reportManager.report.dimensions | filter:searchFilterDimensions | orderBy:(options.sortOrder)">\r\n                  <div class="lui-list__text">\r\n                    <span qve-highlight text="{{dimension.title}}" title="{{dimension.title}}" query="search.dimensions" class="lui-list__text lui-list__text--ellipsis"></span>\r\n                  </div>\r\n                  <span ng-title="dimension.action.title()" ng-class="dimension.action.class(dimension)" class="cl-list-icon list-action" ng-if="dimension.action"\r\n                    ng-click="dimension.action.onClick($event)"></span>\r\n                </li>\r\n              </ul>\r\n            </div>\r\n          </div>\r\n          <div class="containerlabel">\r\n            <span q-translation="Common.Measures"></span>\r\n            <span title="Search measures" class="cl-icon cl-icon--search" style="margin-left: 4px;" ng-click="openMeasureSearch()" />\r\n            <span title="Clear measures" class="lui-icon lui-icon--clear-selections cl-icon-right-align" ng-click="clearMeasures()" />\r\n            <div ng-show="search.showMeasureInput" class="lui-search measure-search">\r\n              <span class="lui-icon  lui-icon--search  lui-search__search-icon"></span>\r\n              <input ng-model="search.measures" class="lui-search__input measure-search--input" maxlength="255" spellcheck="false" type="text"\r\n                placeholder="Filter measures" />\r\n              <button ng-click="closeMeasureSearch()" class="lui-search__clear-button">\r\n                <span class="lui-icon  lui-icon--small  lui-icon--close" />\r\n              </button>\r\n            </div>\r\n          </div>\r\n          <div class="measure-scroller">\r\n            <ul id="measureSortable" class="lui-list measure-list scroller" ng-style="getListMaxHeight(\'measure\')" style="overflow-y: auto; overflow-x:hidden; position: relative">\r\n              <li class="lui-list__item" ng-class="{selected: measure.selected}" ng-click="selectItem(measure, $event)" title="{{measure.title +\'\\n\' + measure.description}}"\r\n                on-last-repeat="measure" ng-repeat="measure in reportManager.report.measures | filter:searchFilterMeasures | orderBy:(options.sortOrder)">\r\n                <div class="lui-list__text">\r\n                  <span qve-highlight text="{{measure.title}}" title="{{measure.title}}" query="search.measures" class="lui-list__text lui-list__text--ellipsis"></span>\r\n                </div>\r\n                <span ng-title="measure.action.title()" ng-class="measure.action.class(measure)" class="cl-list-icon list-action" ng-if="measure.action"\r\n                  ng-click="measure.action.onClick($event)"></span>\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="container_right" ng-style="getContainerWidth(\'right\')">\r\n        <div ng-show="showToolbar()" class="containerlabel" style="margin: 1px 0px">{{reportManager.report.title}}\r\n          <button ng-disabled="disableSwitchVisualization()" title="Switch visualization" class="lui-select switch-visualization" style="width:auto"\r\n            ng-click="reportManager.switchVisualization($event)">\r\n            <i class="lui-icon lui-icon--{{reportManager.switchIcon()}}"></i>\r\n          </button>\r\n        </div>\r\n        <ul ng-show="showSortbar()" ng-attr-id="{{ \'reportSortable-\' + qId }}" ng-class="{\'plain\':!options.tagColor, \'no-interactions\': noInteractions()}"\r\n          class="sortablelist">\r\n          <li class="sortablelist-item" ng-class="item.type==\'dimension\' ? \'label-dimension\' : \'label-measure\'" title="{{item.title +\'\\n\' + item.description}}"\r\n            ng-repeat="item in reportManager.report.items | filter: reportManager.reportFilter">\r\n            <div class="icon-vtabs-delete sortablelist-icon" ng-click="removeItem(item)"></div>\r\n            <div class="sortablelist-item-container">{{item.title}}</div>\r\n          </li>\r\n        </ul>\r\n        <div ng-hide="showDeferLayoutUpdate()">\r\n          <div ng-hide="reportManager.showRequirementMessage()" ng-style="getTableStyle()" ng-mousemove="onMouseMove($event)" ng-mouseenter="onMouseEnter()"\r\n            , ng-mouseleave="onMouseLeave()">\r\n            <div ng-attr-id="{{ \'cl-custom-report-id-\' + qId }}" class="qvobject custom-report-vizualization"></div>\r\n          </div>\r\n        </div>\r\n        <div qv-requirements="" ng-show="showDeferLayoutUpdate()" class="defer-layout-update requirements-wrapper incomplete" aria-hidden="false"\r\n          ng-style="getTableStyle()">\r\n          <div class="requirements">\r\n            <h2 class="header">\r\n              <i class="object-icon lui-icon lui-icon--pause"></i>\r\n            </h2>\r\n            <ul>\r\n              <li class="item missing">\r\n                <button class="add-button lui-button" ng-click="updateLayout($event)" tid="update-layout">Update layout</button>\r\n              </li>\r\n              <li class="item missing">\r\n                <button class="add-button lui-button" ng-click="cancelDeferLayoutUpdate($event)" tid="cancel-defer">Cancel</button>\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n        <div ng-hide="showDeferLayoutUpdate()">\r\n          <div ng-show="reportManager.showRequirementMessage()" class="overlay-no-selections requirements-wrapper incomplete" ng-style="getTableStyle()">\r\n            <div class="loader-text ng-scope qv-loader-huge qv-fade-in" ng-class="ngClasses">\r\n              {{reportManager.visualizationRequirementMessage()}}\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <img ng-if="showClimberLogo" class="climber-logo" ng-src="../{{climberLogoSrc}}cl-custom-report/climber.jpg">\r\n    </div>\r\n\r\n  </div>\r\n  <textarea class="cl-cr-clipboard">\r\n    <textarea>\r\n</div>\r\n'
}), define("extensions/cl-custom-report/initial-properties", [], function () {
    return {
        showTitles: !1,
        title: "Climber Custom Report",
        qHyperCubeDef: {
            qDimensions: [],
            qMeasures: [],
            qInitialDataFetch: [{
                qWidth: 0,
                qHeight: 0
            }]
        },
        props: {
            reports: [],
            presets: [],
            visualizationSettings: {
                table: {},
                pivotTable: {},
                combochart: {}
            },
            stateExpression: ""
        },
        masterLibraryLists: {
            masterObjects: {
                qInfo: {
                    qType: "MasterObjectList"
                },
                qAppObjectListDef: {
                    qType: "masterobject",
                    qData: {
                        title: "/qMetaDef/title",
                        description: "/qMetaDef/description",
                        id: "/qInfo/qId",
                        visualization: "/visualization"
                    }
                }
            },
            masterDimensions: {
                qInfo: {
                    qType: "DimensionList"
                },
                qDimensionListDef: {
                    qType: "dimension",
                    qData: {
                        title: "/title",
                        tags: "/tags",
                        grouping: "/qDim/qGrouping",
                        info: "/qDimInfos"
                    }
                }
            },
            masterMeasures: {
                qInfo: {
                    qType: "MeasureList"
                },
                qMeasureListDef: {
                    qType: "measure",
                    qData: {
                        title: "/title",
                        tags: "/tags"
                    }
                }
            }
        }
    }
}), define("extensions/cl-custom-report/support", [], function () {
    return {
        snapshot: !1,
        export: !1,
        exportData: !0
    }
}), define("extensions/cl-custom-report/lib/js/directives/register-on-last-repeat", [], function () {
    return function (e) {
        e.qvangular.directive("onLastRepeat", function () {
            return function (e, t, n) {
                e.$last && setTimeout(function () {
                    e.$emit("onRepeatLast", t, n)
                }, 1)
            }
        })
    }
}), define("extensions/cl-custom-report/lib/js/factories/make-controller", [], function () {
    return function (e) {
        var s = e.qvangular,
            l = e.stateUtil,
            u = e.environmentUtil,
            p = e.constants,
            d = e.$q,
            f = e.$,
            m = e.qlik,
            h = e.util,
            g = e._,
            v = e.sortable,
            q = e.PerfectScrollbar,
            b = e.exportService,
            D = e.cacheService,
            O = e.makeVariableCache,
            y = e.makeReportManager,
            I = e.registerVisualization,
            _ = e.visualizationTypes,
            E = e.patchService,
            C = e.addPopover,
            N = e.changePopover,
            R = e.touche,
            S = e.extendScope;
        return ["$scope", "$element", "$timeout", "$window", function (c, e, t, n) {
            var i = m.currApp(c.$parent);
            "App" !== i.model.constructor.name && (i = m.currApp()), c.app = i, c.appIsPublished = Boolean(i.model.layout.published), Object.prototype.hasOwnProperty.call(c.component.model, "enigmaModel") ? c.enigmaModel = c.component.model.enigmaModel : c.enigmaModel = c.component.model, c.qId = c.layout.qInfo.qId, c.cacheTokenId = c.layout.qExtendsId || c.qId, c.cacheTokenId = c.cacheTokenId.replace(/-/g, ""), u.isDesktop().then(function (e) {
                c.isDesktop = e
            });
            c.enigmaModel.app.global.engineVersion().then(function (e) {
                var t = e.qComponentVersion.split("."),
                    n = _slicedToArray(t, 2),
                    i = n[0],
                    a = n[1];
                i = parseInt(i, 10), a = parseInt(a, 10);
                var o = !1,
                    r = !1,
                    s = !1;
                return i < 12 && (r = o = !0), 12 === i && a < 108 && (o = !0), 12 === i && a < 145 && (r = !0), 12 === i && 170 <= a && (s = !0), 12 < i && (s = !0), void 0, {
                    beforeFeb2018: o,
                    beforeApril2018: r,
                    june2018orAfter: s,
                    major: i,
                    minor: a
                }
            }).then(function (e) {
                c.engineVersion = e, c.reportManager.setEngineVersion(e)
            }), c.size = {
                width: e[0].offsetWidth,
                height: e[0].offsetHeight
            }, c.perfectScrollbars = {
                dimensions: new q(e.find("#dimensionSortable")[0]),
                measures: new q(e.find("#measureSortable")[0])
            }, c.rainText = !1, c.minWidthCollapsed = 200, c.minHeightCollapsed = 200, c.initialized = !1, c.options = {
                tag: null,
                tagColor: !0,
                collapsed: !1,
                sortOrder: ["selected", "title"],
                visualizationOnly: !1,
                displayText: "Custom Report"
            }, c.search = {
                dimensions: "",
                showDimensionInput: !1,
                measures: "",
                showMeasureInput: !1
            }, c.showAdd = !1, c.showIncomplete = !0, c.showIncompleteEditMode = !1, c.appHasTableMasterItems = function () {
                return void 0 !== g.find(c.layout.masterLibraryLists.masterObjects.qAppObjectList.qItems, function (e) {
                    return "table" === e.qData.visualization
                })
            }, c.showRequirements = function () {
                return !!u.inClient() && (!(0 < c.layout.props.reports.length) && (!c.object.isReadonly && (l.isInEditMode() ? (c.showIncomplete = !1, c.appHasTableMasterItems() ? (c.showAdd = !0, c.showIncompleteEditMode = !1) : (c.showAdd = !1, c.showIncompleteEditMode = !0)) : (c.showIncomplete = !0, c.showIncompleteEditMode = !1, c.showAdd = !1), !0)))
            }, c.disableSwitchVisualization = function () {
                return !c.reportManager.canSwitchVisualization()
            }, c.showDeferLayoutUpdate = function () {
                return !1
            }, c.showAddReport = function (e) {
                var t = function (e) {
                    c.luiPopoverShow && (c.luiPopoverShow.close(), c.luiPopoverShow = null), e && f(e.target).hasClass("pp-toplist-add-button") && (R.preventGestures(), c.adding = !1)
                },
                    n = s.getService("luiPopover");
                c.luiPopoverShow = n.show({
                    template: C.template,
                    controller: C.controller,
                    alignTo: e.currentTarget,
                    input: {
                        app: i,
                        reports: c.layout.props.reports,
                        closeAddPopover: t,
                        addLibraryItem: function (e) {
                            c.ext.addLibraryItem(e.qLibraryId, c.ext).then(function () {
                                c.$emit("saveProperties"), t()
                            })
                        }
                    },
                    dock: "bottom",
                    closeOnEscape: !0
                })
            }, c.showChangeReport = function (e) {
                var t = function () {
                    c.luiPopoverShow && (c.luiPopoverShow.close(), c.luiPopoverShow = null)
                },
                    n = s.getService("luiPopover");
                c.luiPopoverShow = n.show({
                    template: N.template,
                    controller: N.controller,
                    alignTo: e.currentTarget,
                    input: {
                        app: i,
                        reports: c.layout.props.reports,
                        masterObjects: c.layout.masterLibraryLists.masterObjects.qAppObjectList.qItems,
                        presets: c.layout.props.presets,
                        closePopover: t,
                        changeReport: function (e) {
                            c.reportManager.changeReport(e.qLibraryId), t()
                        },
                        applyPreset: function (e) {
                            c.reportManager.applyDefaultState(e.state, !0), t()
                        }
                    },
                    dock: "bottom",
                    closeOnEscape: !0
                })
            };
            var a = function (e, t) {
                return e.title.match(new RegExp(t, "i"))
            };
            if (c.searchFilterMeasures = function (e) {
                return a(e, c.search.measures)
            }, c.searchFilterDimensions = function (e) {
                return a(e, c.search.dimensions)
            }, c.isInitialized = function () {
                return c.initialized
            }, c.exportService = b, c.exportService.init({
                window: n,
                scope: c
            }), c.cacheService = D, O) {
                var o = O({
                    cacheService: D,
                    layout: c.layout,
                    app: i,
                    enigma: c.enigmaModel,
                    constants: p
                });
                c.cacheService.registerStorageType({
                    type: o,
                    name: "variable"
                })
            }
            c.updateStorageType = function () {
                c.cacheService.setStorageType("sessionStorage")
            }, c.patchService = E, c.reportManager = y({
                _: g,
                $q: d,
                util: h,
                qvangular: s,
                $scope: c,
                $timeout: t,
                $element: e,
                app: i,
                cacheService: D,
                patchService: E,
                $: f
            }), I(c.reportManager, _), c.onValidate = function () {
                void 0, c.reportManager.updateMasterItemsLabelExpressions()
            }, c.backendApi.isSnapshot || (c.component.model.Validated.bind(function () {
                c.onValidate()
            }), c.component.model.Closed.bind(function () {
                void 0, c.reportManager.closeActiveReport(c.reportManager.report)
            })), c.$watchGroup([function () {
                return e[0].offsetWidth
            }, function () {
                return e[0].offsetHeight
            }], function (e) {
                var t = _slicedToArray(e, 2),
                    n = t[0],
                    i = t[1];
                c.size.width = n, c.size.height = i, c.handleResize()
            });
            var r = function (e) {
                e.preventDefault(), e.stopPropagation()
            };
            c.reportConfig = {
                group: {
                    name: "report",
                    put: ["dim", "measure"]
                },
                animation: 150,
                ghostClass: "ghost",
                onStart: function () {
                    f("body").on("dragstart", ".qv-panel-wrap", r), f("body").on("dragover", ".qv-panel-wrap", r)
                },
                onEnd: function () {
                    f("body").off("dragstart", ".qv-panel-wrap", r), f("body").off("dragover", ".qv-panel-wrap", r)
                },
                onSort: c.reportManager.onSort
            }, c.handleResize = function () {
                c.layout.props.allowCollapse ? c.size.height < c.minHeightCollapsed || c.size.width < c.minWidthCollapsed ? c.options.collapsed || (c.options.collapsed = !0) : c.options.collapsed && (c.options.collapsed = !1) : c.options.collapsed = !1
            }, c.setSortOrder = function (e) {
                var t = [];
                c.layout.props.selectedFirst && t.push("-selected"), "SortByA" === e && t.push("title"), c.options.sortOrder = t
            }, c.getReportId = function (e) {
                if (e && e.qInfo) return e.qInfo.qId
            }, c.onChangeReport = function (e) {
                c.isInitialized() && c.reportManager.changeReport(c.getReportId(e))
            }, c.preUpdateVisualization = function () { }, c.updateVisualization = function () {
                c.reportManager.updateVisualization()
            }, c.clearAll = function () {
                c.preUpdateVisualization(), c.reportManager.clearAll(), c.updateVisualization()
            }, c.clearDimensions = function () {
                c.preUpdateVisualization(), c.reportManager.clearDimensions(), c.updateVisualization()
            }, c.clearMeasures = function () {
                c.preUpdateVisualization(), c.reportManager.clearMeasures(), c.updateVisualization()
            }, c.selectItem = function (e, t) {
                c.preUpdateVisualization(), t && t.stopPropagation(), c.search.showDimensionInput && c.closeDimensionSearch(), c.search.showMeasureInput && c.closeMeasureSearch(), c.reportManager.selectItem(e), c.updateVisualization()
            }, c.removeItem = function (e) {
                c.preUpdateVisualization(), c.reportManager.removeItem(e), c.updateVisualization()
            };
            c.exportData = function () {
                c.exportService.exportData({
                    reportManager: c.reportManager,
                    app: i,
                    exportTitle: c.layout.props.exportTitle
                })
            }, u.inClient() || e.on("contextmenu", function (e) {
                c.showMashupContextMenu(e)
            }), c.showMashupContextMenu = function (e) {
                if (!e.ctrlKey && !e.metaKey || !e.shiftKey) {
                    e.stopPropagation(), e.preventDefault();
                    var t = s.getService("qvContextMenu"),
                        n = t.menu();
                    c.addSortbarVisibilitySwitchToContextMenu(n), c.addItemsToContextMenu(n), c.addExportItemToContextMenu(n), t.show(n, {
                        position: {
                            x: e.pageX,
                            y: e.pageY
                        }
                    })
                }
            }, c.showSettingsMenu = function (e) {
                var t = s.getService("qvContextMenu"),
                    n = t.menu();
                c.addItemsToContextMenu(n), c.addVisualizationItemsToContextMenu(n), c.addExportItemToContextMenu(n), t.show(n, {
                    position: {
                        x: e.pageX,
                        y: e.pageY
                    },
                    docking: "BottomRight"
                })
            }, c.addVisualizationItemsToContextMenu = function (e) {
                l.isInEditMode() || c.reportManager.addVisulizationItemsToContextMenu(e, c.reportManager)
            }, c.addFieldsItemsToContextMenu = function (e) {
                var t = g.countBy(c.reportManager.report.items, "type"),
                    n = t.dimension ? c.reportManager.report.dimensions.length - t.dimension : c.reportManager.report.dimensions.length,
                    i = t.measure ? c.reportManager.report.measures.length - t.measure : c.reportManager.report.measures.length;
                if (n || i) {
                    var a = e.addItem({
                        translation: "Add fields",
                        tid: "add-submenu",
                        icon: "add icon-add"
                    });
                    if (n) {
                        var o = a.addItem({
                            translation: "Add dimension",
                            tid: "add-dimension-submenu",
                            icon: "add icon-add"
                        });
                        g.each(c.reportManager.report.dimensions, function (e) {
                            e.selected || o.addItem({
                                translation: e.title,
                                tid: "dimension",
                                select: function () {
                                    c.selectItem(e)
                                }
                            })
                        })
                    }
                    if (i) {
                        var r = a.addItem({
                            translation: "Add measure",
                            tid: "add-measure-submenu",
                            icon: "add icon-add"
                        });
                        g.each(c.reportManager.report.measures, function (e) {
                            e.selected || r.addItem({
                                translation: e.title,
                                tid: "add-measure",
                                select: function () {
                                    c.selectItem(e)
                                }
                            })
                        })
                    }
                }
                if (t.dimension || t.measure) {
                    var s = e.addItem({
                        translation: "Remove fields",
                        tid: "remove-submenu",
                        icon: "remove icon-remove"
                    });
                    if (t.dimension) {
                        var l = s.addItem({
                            translation: "Remove dimension",
                            tid: "remove-dimension-submenu",
                            icon: "remove icon-remove"
                        });
                        g.each(c.reportManager.report.dimensions, function (e) {
                            e.selected && l.addItem({
                                translation: e.title,
                                tid: "dimension",
                                select: function () {
                                    c.removeItem(e)
                                }
                            })
                        })
                    }
                    if (t.measure) {
                        var u = s.addItem({
                            translation: "Remove measure",
                            tid: "remove-measure-submenu",
                            icon: "remove icon-remove"
                        });
                        g.each(c.reportManager.report.measures, function (e) {
                            e.selected && u.addItem({
                                translation: e.title,
                                tid: "remove-measure",
                                select: function () {
                                    c.removeItem(e)
                                }
                            })
                        })
                    }
                }
            }, c.addSortbarVisibilitySwitchToContextMenu = function (e) {
                l.isInEditMode() || c.collapsed || (c.reportManager.options.fieldsAndSortbarVisible ? (e.addItem({
                    translation: "Hide fields/sortbar",
                    tid: "Expand",
                    icon: "maximize icon-maximize",
                    select: function () {
                        c.hideFieldAndSortbar()
                    }
                }), c.addVisualizationItemsToContextMenu(e)) : (e.addItem({
                    translation: "Show fields/sortbar",
                    tid: "Collapse",
                    icon: "minimize icon-minimize",
                    select: function () {
                        c.showFieldAndSortbar()
                    }
                }), c.addFieldsItemsToContextMenu(e)))
            }, c.addItemsToContextMenu = function (e) {
                if (!l.isInEditMode() && 1 < c.reportManager.options.masterObjects.length) {
                    var t = e.addItem({
                        translation: "Switch data set",
                        tid: "switch-submenu",
                        icon: "cogwheel icon-cogwheel"
                    });
                    g.each(c.reportManager.options.masterObjects, function (e) {
                        e.qInfo.qId !== c.reportManager.report.qLibraryId && t.addItem({
                            translation: e.qMeta.title,
                            tid: "switch",
                            icon: "table icon-table",
                            select: function () {
                                c.reportManager.changeReport(e.qInfo.qId)
                            }
                        })
                    })
                }
                return e
            }, c.addExportItemToContextMenu = function (e) {
                return e.addItem({
                    translation: "Export To New App",
                    tid: "export-on-demand",
                    icon: "application icon-application",
                    select: function () {
                        c.exportService.exportHyperCubeToNewApp({
                            report: c.reportManager.report,
                            app: i
                        })
                    }
                }), !c.isDesktop && c.addExportToTemplatesToContextMenu && c.layout.props.enableExportToTemplate && c.addExportToTemplatesToContextMenu(c, e), e.addItem({
                    translation: "contextMenu.export",
                    tid: "export",
                    icon: "toolbar-sharelist icon-toolbar-sharelist",
                    select: function () {
                        c.exportData()
                    }
                }), e
            }, c.showFields = function () {
                return !c.options.visualizationOnly
            }, c.showSortbar = function () {
                return !c.options.visualizationOnly && (!c.reportManager.options.hideSortBar && c.reportManager.showSortbar())
            }, c.showToolbar = function () {
                return !c.options.visualizationOnly
            }, c.$on("onRepeatLast", function (e, t, n) {
                "dimension" === n.onLastRepeat ? c.perfectScrollbars && c.perfectScrollbars.dimensions && c.perfectScrollbars.dimensions.update() : "measure" === n.onLastRepeat && c.perfectScrollbars && c.perfectScrollbars.measures && c.perfectScrollbars.measures.update()
            }), c.$watchCollection("layout.props.reports", function () {
                c.isInitialized() && c.reportManager.onReportsUpdate()
            }), c.$watch("layout.props.visualizationSettings.pivotTable.hideSortBar", function () {
                c.isInitialized() && c.reportManager.updateSortBarVisibility()
            }), c.$watch("layout.props.visualizationSettings.table.hideSortBar", function () {
                c.isInitialized() && c.reportManager.updateSortBarVisibility()
            }), c.$watch("layout.props.visualizationSettings.combochart.hideSortBar", function () {
                c.isInitialized() && c.reportManager.updateSortBarVisibility()
            }), c.$watch("layout.props.tagColor", function (e) {
                c.options.tagColor = e
            }), c.$watch("layout.props.collapseMinWidth", function (e) {
                c.minWidthCollapsed = e
            }), c.$watch("layout.props.collapseMinHeight", function (e) {
                c.minHeightCollapsed = e
            }), c.$watch("layout.props.allowCollapse", function () {
                c.handleResize()
            }), c.$watch("layout.props.hideExportIcon", function (e) {
                c.options.hideExportIcon = e
            }), c.$watch("layout.props.hideExpandIcon", function (e) {
                c.options.hideExpandIcon = e
            }), c.$watch("layout.props.sortOrder", function (e) {
                c.setSortOrder(e)
            }), c.$watch("layout.props.selectedFirst", function () {
                c.setSortOrder(c.layout.props.sortOrder)
            }), c.noInteractions = function () {
                return !l.isInAnalysisMode() && !c.showRequirements()
            }, c.closeDimensionSearch = function () {
                c.search.dimensions = "", c.search.showDimensionInput = !1
            }, c.openDimensionSearch = function () {
                c.search.showDimensionInput = !0, t(function () {
                    e.find(".dimension-search--input").focus()
                }, 0)
            }, c.closeMeasureSearch = function () {
                t(function () {
                    c.search.measures = "", c.search.showMeasureInput = !1
                }, 100)
            }, c.openMeasureSearch = function () {
                c.search.showMeasureInput = !0, t(function () {
                    e.find(".measure-search--input").focus()
                }, 0)
            }, c.hideFieldAndSortbar = function () {
                c.reportManager.options.fieldsAndSortbarVisible = !1, c.options.visualizationOnly = !0, c.reportManager.updateVisualization()
            }, c.showFieldAndSortbar = function () {
                c.reportManager.options.fieldsAndSortbarVisible = !0, c.options.visualizationOnly = !1, c.reportManager.updateVisualization()
            }, c.hideSetDefaultStateIcon = function () {
                return void 0 === c.options.defaultTable || "" === c.options.defaultTable
            }, c.showClimberLogo = !0, c.climberLogoSrc = u.inClient() ? "extensions/" : "", c.getListMaxHeight = function (e) {
                var t = c.reportManager.getDimensionCount(),
                    n = c.reportManager.getMeasureCount(),
                    i = 154 + (c.showClimberLogo ? 36 : 0),
                    a = (c.size.height - i) / 2,
                    o = 38 * t,
                    r = 38 * n,
                    s = Math.max(a - o, 0),
                    l = Math.max(a - r, 0);
                return o = Math.min(o, a + l), r = Math.min(r, a + s), 0 < t ? "dimension" === e ? {
                    "max-height": o + "px",
                    "min-height": o + "px"
                } : {
                        "max-height": r + "px",
                        "min-height": r + "px"
                    } : {
                        height: a + "px"
                    }
            }, c.getTableStyle = function () {
                f("#reportSortable-" + c.qId).height();
                var e = f("#reportSortable-" + c.qId).height(),
                    t = c.size.height - 60 - e + "px";
                return c.showSortbar() || (t = c.size.height - 60 + 19 + "px"), {
                    height: t
                }
            }, c.getContainerWidth = function (e) {
                return "left" === e ? {
                    width: "210px"
                } : {
                        width: (c.reportManager.options.fieldsAndSortbarVisible ? c.size.width - 210 - 4 : c.size.width) + "px"
                    }
            }, S && S({
                $scope: c,
                $timeout: t
            }), c.setupVariableAndExpression && c.setupVariableAndExpression(), c.initializeReportState = function () {
                var e = c.cacheService.getCachedOptions(c.cacheTokenId);
                c.options = g.extend(c.options, e), c.reportManager.changeReport(c.reportManager.getActiveReportId())
            }, c.init = function () {
                c.updateStorageType(c.layout.props.useBookmarks), c.reportManager.updateMasterObjects(), t(function () {
                    var e = document.getElementById("reportSortable-" + c.qId);
                    v.create(e, c.reportConfig), c.initialized = !0
                }, 200), c.initializeReportState()
            }, c.init()
        }]
    }
}), define("extensions/cl-custom-report/lib/js/factories/make-definition", [], function () {
    return function (e) {
        var l = e._,
            t = {
                deferLayoutUpdate: !1,
                useExpressionLabels: !1,
                tagColor: !0,
                selectedFirst: !1,
                sortOrder: "SortByA",
                storageType: "sessionStorage",
                exportTitle: !0,
                allowCollapse: !0,
                collapseMinWidth: 355,
                collapseMinHeight: 255,
                collapseText: "Custom Report",
                hideExpandIcon: !1,
                hideExportIcon: !1
            },
            n = {
                type: "boolean",
                component: "switch",
                label: "Defer layout update",
                ref: "props.deferLayoutUpdate",
                options: [{
                    value: !0,
                    label: "Enable"
                }, {
                    value: !1,
                    label: "Disable"
                }],
                defaultValue: t.deferLayoutUpdate,
                readOnly: !0
            },
            i = {
                type: "boolean",
                component: "switch",
                label: "Use Expression Labels",
                ref: "props.useExpressionLabels",
                options: [{
                    value: !0,
                    label: "Enable"
                }, {
                    value: !1,
                    label: "Use titles"
                }],
                defaultValue: t.useExpressionLabels,
                change: function (e, t, n, i) {
                    var a, o;
                    return a = i.model, (o = e).props.useExpressionLabels ? (o.masterLibraryLists.masterDimensions.qDimensionListDef.qData.qLabelExpression = "/qDim/qLabelExpression", o.masterLibraryLists.masterMeasures.qMeasureListDef.qData.qLabelExpression = "/qMeasure/qLabelExpression") : (delete o.masterLibraryLists.masterDimensions.qDimensionListDef.qData.qLabelExpression, delete o.masterLibraryLists.masterMeasures.qMeasureListDef.qData.qLabelExpression), a.setProperties(o), !0
                }
            },
            a = {
                type: "boolean",
                component: "switch",
                label: "Tag color",
                ref: "props.tagColor",
                options: [{
                    value: !0,
                    label: "Colors"
                }, {
                    value: !1,
                    label: "No colors"
                }],
                defaultValue: t.tagColor
            },
            o = {
                type: "boolean",
                component: "switch",
                label: "Sort selected items first",
                ref: "props.selectedFirst",
                defaultValue: t.selectedFirst,
                options: [{
                    value: !0,
                    label: "Enable"
                }, {
                    value: !1,
                    label: "Disable"
                }]
            },
            r = {
                type: "string",
                component: "dropdown",
                label: "Dimensions and measures sort order",
                ref: "props.sortOrder",
                defaultValue: t.sortOrder,
                options: [{
                    value: "SortByA",
                    label: "Sort alphabetical"
                }, {
                    value: "SortByTableOrder",
                    label: "Sort by table order"
                }]
            },
            s = {
                type: "boolean",
                component: "switch",
                label: "Export data set title ",
                ref: "props.exportTitle",
                options: [{
                    value: !0,
                    label: "Yes"
                }, {
                    value: !1,
                    label: "No"
                }],
                defaultValue: t.exportTitle
            },
            u = {
                type: "boolean",
                component: "switch",
                label: "Allow collapse",
                ref: "props.allowCollapse",
                options: [{
                    value: !0,
                    label: "Yes"
                }, {
                    value: !1,
                    label: "No"
                }],
                defaultValue: t.allowCollapse
            },
            c = {
                type: "number",
                label: "Trigger collapse min width",
                ref: "props.collapseMinWidth",
                defaultValue: t.collapseMinWidth,
                readOnly: function (e) {
                    return !e.props.allowCollapse
                }
            },
            p = {
                type: "number",
                label: "Trigger collapse min height",
                ref: "props.collapseMinHeight",
                defaultValue: t.collapseMinHeight,
                readOnly: function (e) {
                    return !e.props.allowCollapse
                }
            },
            d = {
                type: "items",
                component: "accordion",
                items: {
                    reports: {
                        type: "array",
                        component: "cl-custom-report",
                        translation: "Data Sets",
                        ref: "props.reports",
                        allowAdd: !0,
                        allowRemove: !0,
                        allowMove: !0,
                        addTranslation: "Add Data Set",
                        grouped: !1,
                        items: {
                            setDefaultStateButton: {
                                component: "button",
                                label: "Save default state",
                                action: function (e, t, n) {
                                    var i, a, o, r, s = t.getReportManager(t.layout.qInfo.qId);
                                    i = {
                                        report: e,
                                        model: n.ext.model,
                                        defaultState: s.getStateForReportId(e.qLibraryId)
                                    }, a = i.report, o = i.model, r = i.defaultState, o.getProperties().then(function (e) {
                                        var t = l.find(e.props.reports, function (e) {
                                            return e.cId === a.cId
                                        });
                                        t && (t.defaultState = r, o.setProperties(e))
                                    })
                                },
                                show: !0
                            },
                            applyDefaultStateButton: {
                                component: "button",
                                label: "Show default state",
                                action: function (e, t) {
                                    t.getReportManager(t.layout.qInfo.qId).applyDefaultState(e.defaultState, !0)
                                },
                                show: function (e) {
                                    return e.defaultState
                                }
                            }
                        }
                    },
                    presets: {
                        type: "items",
                        label: "Presets",
                        items: {}
                    },
                    bookmark: {
                        type: "items",
                        label: "Bookmarks",
                        items: {
                            useBookmarks: {
                                type: "boolean",
                                label: "Use bookmarks",
                                ref: "props.useBookmarks",
                                defaultValue: !1,
                                readOnly: !0
                            }
                        }
                    },
                    visualizationSettings: {
                        type: "items",
                        component: "expandable-items",
                        grouped: !0,
                        label: "Visualizations settings",
                        items: {
                            table: {
                                type: "items",
                                label: "Table",
                                items: {
                                    hideSortBar: {
                                        label: "Hide sort bar",
                                        type: "boolean",
                                        ref: "props.visualizationSettings.table.hideSortBar",
                                        defaultValue: !1
                                    }
                                }
                            },
                            pivotTable: {
                                type: "items",
                                label: "Pivot table",
                                items: {}
                            },
                            combochart: {
                                type: "items",
                                label: "Combo chart",
                                items: {}
                            }
                        }
                    },
                    addons: {
                        type: "items",
                        component: "expandable-items",
                        translation: "properties.addons",
                        items: {
                            dataHandling: {
                                uses: "dataHandling",
                                items: {
                                    suppressZero: null
                                }
                            }
                        }
                    },
                    settings: {
                        uses: "settings",
                        items: {
                            general: {
                                type: "items",
                                items: {
                                    canTakeSnapshot: {
                                        component: "switch",
                                        ref: "props.canTakeSnapshot",
                                        label: "Can take snapshot",
                                        type: "boolean",
                                        defaultValue: !1,
                                        options: [{
                                            value: !0,
                                            label: "Enabled"
                                        }, {
                                            value: !1,
                                            label: "Disabled"
                                        }],
                                        show: !0
                                    },
                                    canMaximize: {
                                        component: "switch",
                                        ref: "props.canMaximize",
                                        label: "Show maximize icon",
                                        type: "boolean",
                                        defaultValue: !0,
                                        options: [{
                                            value: !0,
                                            label: "Enabled"
                                        }, {
                                            value: !1,
                                            label: "Disabled"
                                        }],
                                        show: !0
                                    }
                                }
                            },
                            settings: {
                                type: "items",
                                label: "Settings",
                                items: {
                                    useExpressionLabels: i,
                                    tagColor: a,
                                    sortOrder: r,
                                    selectedFirst: o,
                                    exportTitle: s,
                                    allowCollapse: u,
                                    collapseText: {
                                        type: "string",
                                        label: "Collapse text",
                                        ref: "props.collapseText",
                                        defaultValue: t.collapseText,
                                        readOnly: function (e) {
                                            return !e.props.allowCollapse
                                        }
                                    },
                                    collapseMinWidth: c,
                                    collapseMinHeight: p
                                }
                            },
                            experimentalSettings: {
                                type: "items",
                                label: "Experimental settings",
                                items: {
                                    deferLayoutUpdate: n,
                                    deferLayoutUpdateText: {
                                        component: "text",
                                        label: "Defer layout update is only available in Custom Report+",
                                        show: !0
                                    }
                                }
                            }
                        }
                    }
                }
            };
        return d.items.about = {
            component: "pp-cl-custom-report-about",
            translation: "Common.About"
        }, d
    }
}), define("extensions/cl-custom-report/lib/js/factories/make-paint", [], function () {
    return function (e) {
        var n = e.$,
            i = e.qlik;
        return function (e, t) {
            return n(!t.showTitles) ? n(".qv-object-cl-custom-report").find("header.thin").addClass("no-title") : n(".qv-object-cl-custom-report").find("header.thin").removeClass("no-title"), void 0 !== t.props.canTakeSnapshot && (this.$scope.$parent.component.support.snapshot = t.props.canTakeSnapshot), void 0 === t.props.canMaximize || t.props.canMaximize ? n('div[tid="' + this.$scope.qId + '"] .qv-object-cl-custom-report .lui-icon--expand').css("display", "inherit") : n('div[tid="' + this.$scope.qId + '"] .qv-object-cl-custom-report .lui-icon--expand').css("display", "none"), this.$scope.size.clientHeight = e.height(), this.$scope.size.clientWidth = e.width(), this.$scope.handleResize(e), i.Promise.resolve()
        }
    }
}), define("extensions/cl-custom-report/lib/js/factories/make-extension", [], function () {
    return function (e) {
        var a = e.$,
            o = e.qvangular,
            t = e.util,
            n = e.initialProperties,
            i = e.definition,
            r = e.template,
            s = e.controller,
            l = e.paint,
            u = e.Handler,
            c = e.support;
        return t.addStyleSheet("extensions/cl-custom-report/style.css"), t.addStyleSheet("extensions/cl-custom-report/fonts/climber-icons.css"), t.addStyleSheet("extensions/cl-custom-report/external/perfect-scrollbar/perfect-scrollbar.css"), {
            initialProperties: n,
            definition: i,
            support: c,
            paint: l,
            template: r,
            controller: s,
            getCreatePropertyHandler: function (e) {
                return new u({
                    app: e
                })
            },
            destroy: function () {
                this.$scope.reportManager.closeActiveReport(this.$scope.reportManager.report)
            },
            addLibraryItem: function (n, i) {
                return i.model.getProperties().then(function (t) {
                    var e = i.getCreatePropertyHandler();
                    return e.setProperties(t), e.setModel(i.model), e.addLibraryItem(n).then(function (e) {
                        i.model.setProperties(t), o.$rootScope.$broadcast("pp-open-path", "reports." + e.cId)
                    })
                })
            },
            setStateExpression: function (n, i) {
                return i.model.getProperties().then(function (e) {
                    var t = i.getCreatePropertyHandler();
                    return t.setProperties(e), t.setModel(i.model), t.setStateExpression(n).then(function () { })
                })
            },
            getExportRawDataOptions: function (e, t, n) {
                var i = t.id;
                return a("#cl-custom-report-container-" + i).scope().addExportItemToContextMenu(e), void n.resolve()
            },
            getContextMenu: function (e, t) {
                var n = e.layout.qInfo.qId,
                    i = a("#cl-custom-report-container-" + n).scope();
                return i.addSortbarVisibilitySwitchToContextMenu(t), i.addItemsToContextMenu(t)
            },
            getDropOptions: function (e, t, n) {
                if ("visualization" === t.item.type && ["table"].contains(t.item.visualization)) {
                    var i = ["contextMenu.add", t.item.name];
                    t.menu.addItem({
                        translation: i,
                        tid: "add",
                        select: function () {
                            e.content.addLibraryItem(t.item.id, e)
                        }
                    }), t.menu.items.push(t.menu.items.shift()), n()
                } else n()
            },
            getDropTemplateOptions: function () { }
        }
    }
}), define("extensions/cl-custom-report/lib/js/services/export-service/make-export-service", [], function () {
    return function (e) {
        var f = e._,
            m = e.$q,
            n = e.Halyard,
            i = e.enigmaMixin,
            t = e.enigma,
            l = e.util,
            a = e.qixSchema,
            o = e.qvangular,
            r = e.appOnDemandDialogTemplate,
            s = e.enigmaSenseUtils,
            u = void 0,
            h = void 0,
            c = function (e) {
                return e.pathname.substr(0, e.pathname.toLowerCase().lastIndexOf("/sense/app"))
            },
            g = function (e) {
                return t.create(function (e) {
                    void 0 === e && (e = l.generateId());
                    var t = s.buildUrl({
                        host: window.location.hostname,
                        port: window.location.port,
                        appId: e,
                        prefix: c(window.location),
                        createSocket: function (e) {
                            return new WebSocket(e)
                        },
                        secure: "http:" !== window.location.protocol
                    });
                    return {
                        Promise: m,
                        schema: a,
                        url: t,
                        mixins: i
                    }
                }(e))
            },
            p = function (e) {
                for (var t = Math.floor(1e4 / e.qcx), n = Math.ceil(e.qcy / t), i = [], a = 0; a < n; a += 1) {
                    var o = t * a,
                        r = Math.min(o + t, e.qcy) - o;
                    i.push({
                        qTop: o,
                        qLeft: 0,
                        qHeight: r,
                        qWidth: e.qcx
                    })
                }
                return i
            },
            v = function (t) {
                var e = p(t.layout.qHyperCube.qSize),
                    n = f.map(e, function (e) {
                        return t.getHyperCubeData("/qHyperCubeDef", [e])
                    });
                return m.all(n)
            },
            q = function () {
                return new n
            },
            b = function (e, t) {
                return new n.HyperCube(e, t)
            },
            D = function (e) {
                var t = e.appId,
                    n = e.sheetId,
                    i = e.state,
                    a = u.location.protocol;
                return a += "//", a += u.location.hostname, a += null !== u.location.port ? ":" + u.location.port : "", a += c(u.location), a += "/sense/app/", a += t, n && (a += "/sheet/", a += n, a += "/state/" + i), a
            },
            O = function (t, n) {
                return ["$scope", function (e) {
                    e.states = {
                        CANCELED: -3,
                        TIMEOUT: -2,
                        FAILED: -1,
                        IDLE: 0,
                        PENDING: 1,
                        COMPLETED: 2
                    }, e.state = void 0 === n ? e.states.IDLE : n, e.exportAppName = "Custom Report Export", e.confirm = t(e)
                }]
            };
        return {
            init: function (e) {
                var t = e.window,
                    n = e.scope;
                u = t, h = n
            },
            canExportToApp: function () {
                return !1
            },
            exportHyperCubeToNewApp: function (e) {
                var d = e.report,
                    s = e.app,
                    t = O(function (p) {
                        return function (e) {
                            var r = e.exportAppName,
                                u = e.createDimensions,
                                c = e.createMeasures;
                            p.state = p.states.PENDING, p.pendingMessage = "Exporting data...", s.getObject(d.visualizationId).then(function (e) {
                                e.getEffectiveProperties(d.visualizationId).then(function (e) {
                                    var t = l.deepClone(e.qHyperCubeDef),
                                        n = t.qDimensions.length + t.qMeasures.length,
                                        i = f.times(n, function (e) {
                                            return e
                                        });
                                    t.qMode = "S", t.qColumnOrder = [].concat(_toConsumableArray(i)), t.columnOrder = [].concat(_toConsumableArray(i)), s.model.engineApp.createSessionObject({
                                        qInfo: {
                                            qId: "",
                                            qType: "Chart"
                                        },
                                        qHyperCubeDef: t,
                                        qInitialDataFetch: [{
                                            qTop: 0,
                                            qLeft: 0,
                                            qHeight: 0,
                                            qWidth: 0
                                        }]
                                    }).then(function (o) {
                                        o.getLayout().then(function () {
                                            v(o).then(function (e) {
                                                var t = l.deepClone(o.layout.qHyperCube);
                                                t.qDataPages = f.map(e, function (e) {
                                                    return e[0]
                                                });
                                                var n = q(),
                                                    i = b(t, {
                                                        name: "Custom Report Export",
                                                        section: "Custom Report Export"
                                                    });
                                                n.addHyperCube(i);
                                                var a = g(s.id);
                                                a.open().then(function (e) {
                                                    var t = r;
                                                    p.pendingMessage = "Creating App...", e.createApp(t).then(function (e) {
                                                        var t = e.qAppId;
                                                        g(t).open().then(function (e) {
                                                            e.openDoc(t).then(function (l) {
                                                                var e = n.getScript();
                                                                void 0, void 0, l.setScript(e).then(function () {
                                                                    p.pendingMessage = "Saving App...", l.doSave().then(function () {
                                                                        p.pendingMessage = "Reloading App...", l.doReload().then(function () {
                                                                            p.pendingMessage = "Creating sheet...", l.createObject({
                                                                                qInfo: {
                                                                                    qType: "sheet"
                                                                                },
                                                                                qMetaDef: {
                                                                                    title: "Custom Report Export",
                                                                                    description: ""
                                                                                },
                                                                                rank: -.6875,
                                                                                columns: 24,
                                                                                rows: 12,
                                                                                cells: [],
                                                                                thumbnail: {}
                                                                            }).then(function (e) {
                                                                                var t = e.id,
                                                                                    s = [],
                                                                                    n = l.id;
                                                                                if (".qvf" === n.substr(n.length - 4) && (n = encodeURIComponent(n)), c || u) f.each(d.items, function (e) {
                                                                                    var t, n, i, a, o, r;
                                                                                    "dimension" === e.type && u ? s.push((o = l, r = {
                                                                                        qInfo: {
                                                                                            qType: "dimension"
                                                                                        },
                                                                                        qDim: {
                                                                                            qGrouping: "N",
                                                                                            qFieldDefs: [(a = e).title],
                                                                                            qFieldLabels: [a.title],
                                                                                            qLabelExpression: "",
                                                                                            title: a.title
                                                                                        },
                                                                                        qMetaDef: {
                                                                                            description: a.description,
                                                                                            title: a.title,
                                                                                            tags: []
                                                                                        }
                                                                                    }, o.createDimension(r))) : "measure" === e.type && c && s.push((n = l, (i = {
                                                                                        qInfo: {
                                                                                            qType: "measure"
                                                                                        },
                                                                                        qMeasure: {
                                                                                            qLabel: (t = e).title,
                                                                                            qDef: "=Sum([" + t.title + "])",
                                                                                            qGrouping: "N",
                                                                                            qExpressions: [],
                                                                                            qActiveExpression: 0,
                                                                                            qLabelExpression: "",
                                                                                            coloring: {}
                                                                                        },
                                                                                        qMetaDef: {
                                                                                            description: t.description,
                                                                                            tags: []
                                                                                        }
                                                                                    }).qMetaDef.title = i.qMeasure.qLabel, n.createMeasure(i)))
                                                                                });
                                                                                else {
                                                                                    p.pendingMessage = "Creating master items...";
                                                                                    var i = m.defer();
                                                                                    s.push(i.promise), i.resolve()
                                                                                }
                                                                                m.all(s).then(function () {
                                                                                    p.pendingMessage = "Saving App...", l.doSave().then(function () {
                                                                                        var e = h.engineVersion && h.engineVersion.june2018orAfter ? "insight" : "edit";
                                                                                        p.exportUrl = D({
                                                                                            appId: n,
                                                                                            sheetId: t,
                                                                                            state: e
                                                                                        }), p.state = p.states.COMPLETED
                                                                                    })
                                                                                }).catch(function (e) {
                                                                                    void 0, p.state = p.states.FAILED, p.errorMessage = e.message, a.close()
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                }).catch(function (e) {
                                                                    p.state = p.states.FAILED, p.errorMessage = e.message, a.close()
                                                                })
                                                            }).catch(function () {
                                                                p.state = p.states.FAILED, p.errorMessage = "User is not allowed to create app", a.close()
                                                            })
                                                        }).catch(function (e) {
                                                            p.state = p.states.FAILED, p.errorMessage = e.message, a.close()
                                                        })
                                                    }).catch(function (e) {
                                                        p.state = p.states.FAILED, void 0, e.message && "App already exists" !== e.message ? p.errorMessage = "User is not allowed to create app" : p.errorMessage = e.message, a.close()
                                                    }).catch(function (e) {
                                                        p.state = p.states.FAILED, p.errorMessage = e.message, a.close()
                                                    })
                                                }, function (e) {
                                                    void 0, p.state = p.states.FAILED, p.errorMessage = e.message, a.close()
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        }
                    });
                o.getService("luiDialog").show({
                    controller: t,
                    template: r,
                    input: {
                        title: "Custom Report Export Dialog",
                        exportAppName: "Custom Report Export",
                        exportUrlMessage: "Click here to open app",
                        showCreateMasterItems: !0,
                        createDimensions: !0,
                        createMeasures: !0
                    }
                }).closed.then(function () { })
            },
            generatePagesFromSize: p,
            getHalyard: q,
            getHalyardHyperCube: b,
            exportDataPagesFromState: function (e) {
                var u = e.app,
                    c = e.state;
                return e.reportManager.getReport(c.qId).then(function (e) {
                    var t, n, i, a, o, r, s, l = (n = (t = {
                        state: c,
                        report: e
                    }).state, i = t.report, a = {
                        qDimensions: [],
                        qMeasures: [],
                        qInterColumnSortOrder: [],
                        qSuppressMissing: !0,
                        qInitialDataFetch: [],
                        qReductionMode: "N",
                        qMode: "S",
                        qPseudoDimPos: -1,
                        qNoOfLeftDims: -1,
                        qMaxStackedCells: 5e3,
                        qCalcCond: {},
                        qTitle: {},
                        qCalcCondition: {
                            qCond: {},
                            qMsg: {}
                        },
                        qColumnOrder: [],
                        columnWidths: []
                    }, f.each(n.cIds, function (t) {
                        var e = f.find(i.dimensions, function (e) {
                            return e.cId === t
                        });
                        if (e) a.qDimensions.push(e.columnOptions);
                        else {
                            var n = f.find(i.measures, function (e) {
                                return e.cId === t
                            });
                            n && a.qMeasures.push(n.columnOptions)
                        }
                    }), a);
                    return (o = {
                        app: u,
                        qHyperCubeDef: l
                    }, r = o.app, s = o.qHyperCubeDef, r.model.engineApp.createSessionObject({
                        qInfo: {
                            qId: "",
                            qType: "Chart"
                        },
                        qHyperCubeDef: s,
                        qInitialDataFetch: [{
                            qTop: 0,
                            qLeft: 0,
                            qHeight: 0,
                            qWidth: 0
                        }]
                    }).then(function (e) {
                        return e.getLayout().then(function () {
                            return e
                        })
                    })).then(function (t) {
                        return v(t).then(function (e) {
                            return {
                                sessionObject: t,
                                dataPages: e
                            }
                        })
                    })
                })
            },
            createSession: g,
            generateUrl: D,
            showExportDialog: function (e) {
                var t = e.makeConfirm,
                    n = e.exportAppName,
                    i = e.title,
                    a = O(t);
                i = i || "Custom Report Export Dialog", o.getService("luiDialog").show({
                    controller: a,
                    template: r,
                    input: {
                        title: i,
                        exportAppName: n,
                        exportUrlMessage: "Click here to open app",
                        showCreateMasterItems: !1
                    }
                }).closed.then(function () { })
            },
            exportData: function (e) {
                var t = e.reportManager,
                    n = e.app,
                    a = e.exportTitle,
                    i = ["$scope", function (i) {
                        i.states = {
                            CANCELED: -3,
                            TIMEOUT: -2,
                            FAILED: -1,
                            IDLE: 0,
                            PENDING: 1,
                            COMPLETED: 2
                        }, i.state = i.states.IDLE, i.hideConfirm = !0, i.hideAppNameInput = !0, t.hasSelections() && (i.state = i.states.PENDING, i.title = "Exporting data...", i.pendingMessage = "Exporting data...", n.getObject(null, t.report.visualizationId).then(function (e) {
                            e.exportData({
                                qFileName: a ? t.report.title : ""
                            }).then(function (e) {
                                var t = e.result ? e.result.qUrl : e.qUrl,
                                    n = window.location.pathname.toLowerCase().split("/")[1];
                                "sense" !== n && (t = "/" + n + t), i.exportUrl = t, i.completedMessage = "Your exported data is ready for download.", e.qWarnings && 1e3 === e.qWarnings[0] && (i.completedMessage += " Please note that your dataset was too large and has been truncated."), i.state = i.states.COMPLETED, i.input.title = "Export complete"
                            }).catch(function (e) {
                                i.state = i.states.FAILED, i.errorMessage = e.message
                            })
                        }).catch(function (e) {
                            i.state = i.states.FAILED, i.errorMessage = e.message
                        }))
                    }];
                o.getService("luiDialog").show({
                    controller: i,
                    template: r,
                    input: {
                        title: "Exporting data...",
                        exportUrlMessage: "Click here to download your data file.",
                        showCreateMasterItems: !1,
                        createDimensions: !1,
                        createMeasures: !1
                    }
                }).closed.then(function () { })
            }
        }
    }
}), define("extensions/cl-custom-report/lib/js/services/export-service/qix/schema", [], function () {
    return {
        structs: {
            Field: {
                GetCardinal: {
                    In: [],
                    Out: []
                },
                GetAndMode: {
                    In: [],
                    Out: []
                },
                SelectValues: {
                    In: [{
                        Name: "qFieldValues",
                        DefaultValue: [{
                            qText: "",
                            qIsNumeric: !1,
                            qNumber: 0
                        }]
                    }, {
                        Name: "qToggleMode",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                Select: {
                    In: [{
                        Name: "qMatch",
                        DefaultValue: ""
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qExcludedValuesMode",
                        DefaultValue: 0,
                        Optional: !0
                    }],
                    Out: []
                },
                ToggleSelect: {
                    In: [{
                        Name: "qMatch",
                        DefaultValue: ""
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qExcludedValuesMode",
                        DefaultValue: 0,
                        Optional: !0
                    }],
                    Out: []
                },
                ClearAllButThis: {
                    In: [{
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                SelectPossible: {
                    In: [{
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                SelectExcluded: {
                    In: [{
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                SelectAll: {
                    In: [{
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                Lock: {
                    In: [],
                    Out: []
                },
                Unlock: {
                    In: [],
                    Out: []
                },
                GetNxProperties: {
                    In: [],
                    Out: [{
                        Name: "qProperties"
                    }]
                },
                SetNxProperties: {
                    In: [{
                        Name: "qProperties",
                        DefaultValue: {
                            qOneAndOnlyOne: !1
                        }
                    }],
                    Out: []
                },
                SetAndMode: {
                    In: [{
                        Name: "qAndMode",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                SelectAlternative: {
                    In: [{
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                LowLevelSelect: {
                    In: [{
                        Name: "qValues",
                        DefaultValue: [0]
                    }, {
                        Name: "qToggleMode",
                        DefaultValue: !1
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                Clear: {
                    In: [],
                    Out: []
                }
            },
            Variable: {
                GetContent: {
                    In: [],
                    Out: [{
                        Name: "qContent"
                    }]
                },
                GetRawContent: {
                    In: [],
                    Out: []
                },
                SetContent: {
                    In: [{
                        Name: "qContent",
                        DefaultValue: ""
                    }, {
                        Name: "qUpdateMRU",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                ForceContent: {
                    In: [{
                        Name: "qs",
                        DefaultValue: ""
                    }, {
                        Name: "qd",
                        DefaultValue: 0
                    }],
                    Out: []
                },
                GetNxProperties: {
                    In: [],
                    Out: [{
                        Name: "qProperties"
                    }]
                },
                SetNxProperties: {
                    In: [{
                        Name: "qProperties",
                        DefaultValue: {
                            qName: "",
                            qNumberPresentation: {
                                qType: 0,
                                qnDec: 0,
                                qUseThou: 0,
                                qFmt: "",
                                qDec: "",
                                qThou: ""
                            },
                            qIncludeInBookmark: !1,
                            qUsePredefListedValues: !1,
                            qPreDefinedList: [""]
                        }
                    }],
                    Out: []
                }
            },
            GenericObject: {
                GetLayout: {
                    In: [],
                    Out: [{
                        Name: "qLayout"
                    }]
                },
                GetListObjectData: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qPages",
                        DefaultValue: [{
                            qLeft: 0,
                            qTop: 0,
                            qWidth: 0,
                            qHeight: 0
                        }]
                    }],
                    Out: [{
                        Name: "qDataPages"
                    }]
                },
                GetHyperCubeData: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qPages",
                        DefaultValue: [{
                            qLeft: 0,
                            qTop: 0,
                            qWidth: 0,
                            qHeight: 0
                        }]
                    }],
                    Out: [{
                        Name: "qDataPages"
                    }]
                },
                GetHyperCubeReducedData: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qPages",
                        DefaultValue: [{
                            qLeft: 0,
                            qTop: 0,
                            qWidth: 0,
                            qHeight: 0
                        }]
                    }, {
                        Name: "qZoomFactor",
                        DefaultValue: 0
                    }, {
                        Name: "qReductionMode",
                        DefaultValue: 0
                    }],
                    Out: [{
                        Name: "qDataPages"
                    }]
                },
                GetHyperCubePivotData: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qPages",
                        DefaultValue: [{
                            qLeft: 0,
                            qTop: 0,
                            qWidth: 0,
                            qHeight: 0
                        }]
                    }],
                    Out: [{
                        Name: "qDataPages"
                    }]
                },
                GetHyperCubeStackData: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qPages",
                        DefaultValue: [{
                            qLeft: 0,
                            qTop: 0,
                            qWidth: 0,
                            qHeight: 0
                        }]
                    }, {
                        Name: "qMaxNbrCells",
                        DefaultValue: 0,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qDataPages"
                    }]
                },
                GetHyperCubeContinuousData: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qOptions",
                        DefaultValue: {
                            qStart: 0,
                            qEnd: 0,
                            qNbrPoints: 0,
                            qMaxNbrTicks: 0,
                            qMaxNumberLines: 0
                        }
                    }, {
                        Name: "qReverseSort",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qDataPages"
                    }, {
                        Name: "qAxisData"
                    }]
                },
                GetHyperCubeBinnedData: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qPages",
                        DefaultValue: [{
                            qLeft: 0,
                            qTop: 0,
                            qWidth: 0,
                            qHeight: 0
                        }]
                    }, {
                        Name: "qViewport",
                        DefaultValue: {
                            qWidth: 0,
                            qHeight: 0,
                            qZoomLevel: 0
                        }
                    }, {
                        Name: "qDataRanges",
                        DefaultValue: [{
                            qLeft: 0,
                            qTop: 0,
                            qWidth: 0,
                            qHeight: 0
                        }]
                    }, {
                        Name: "qMaxNbrCells",
                        DefaultValue: 0
                    }, {
                        Name: "qQueryLevel",
                        DefaultValue: 0
                    }, {
                        Name: "qBinningMethod",
                        DefaultValue: 0
                    }],
                    Out: [{
                        Name: "qDataPages"
                    }]
                },
                ApplyPatches: {
                    In: [{
                        Name: "qPatches",
                        DefaultValue: [{
                            qOp: 0,
                            qPath: "",
                            qValue: ""
                        }]
                    }, {
                        Name: "qSoftPatch",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                ClearSoftPatches: {
                    In: [],
                    Out: []
                },
                SetProperties: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qExtendsId: "",
                            qMetaDef: {}
                        }
                    }],
                    Out: []
                },
                GetProperties: {
                    In: [],
                    Out: [{
                        Name: "qProp"
                    }]
                },
                GetEffectiveProperties: {
                    In: [],
                    Out: [{
                        Name: "qProp"
                    }]
                },
                SetFullPropertyTree: {
                    In: [{
                        Name: "qPropEntry",
                        DefaultValue: {
                            qProperty: {
                                qInfo: {
                                    qId: "",
                                    qType: ""
                                },
                                qExtendsId: "",
                                qMetaDef: {}
                            },
                            qChildren: [],
                            qEmbeddedSnapshotRef: null
                        }
                    }],
                    Out: []
                },
                GetFullPropertyTree: {
                    In: [],
                    Out: [{
                        Name: "qPropEntry"
                    }]
                },
                GetInfo: {
                    In: [],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                ClearSelections: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qColIndices",
                        DefaultValue: [0],
                        Optional: !0
                    }],
                    Out: []
                },
                ExportData: {
                    In: [{
                        Name: "qFileType",
                        DefaultValue: 0
                    }, {
                        Name: "qPath",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qFileName",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qExportState",
                        DefaultValue: 0,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qUrl"
                    }, {
                        Name: "qWarnings"
                    }]
                },
                SelectListObjectValues: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qValues",
                        DefaultValue: [0]
                    }, {
                        Name: "qToggleMode",
                        DefaultValue: !1
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SelectListObjectPossible: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SelectListObjectExcluded: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SelectListObjectAlternative: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SelectListObjectAll: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SelectListObjectContinuousRange: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRanges",
                        DefaultValue: [{
                            qMin: 0,
                            qMax: 0,
                            qMinInclEq: !1,
                            qMaxInclEq: !1
                        }]
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SearchListObjectFor: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qMatch",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                AbortListObjectSearch: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                AcceptListObjectSearch: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qToggleMode",
                        DefaultValue: !1
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                ExpandLeft: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRow",
                        DefaultValue: 0
                    }, {
                        Name: "qCol",
                        DefaultValue: 0
                    }, {
                        Name: "qAll",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                ExpandTop: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRow",
                        DefaultValue: 0
                    }, {
                        Name: "qCol",
                        DefaultValue: 0
                    }, {
                        Name: "qAll",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                CollapseLeft: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRow",
                        DefaultValue: 0
                    }, {
                        Name: "qCol",
                        DefaultValue: 0
                    }, {
                        Name: "qAll",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                CollapseTop: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRow",
                        DefaultValue: 0
                    }, {
                        Name: "qCol",
                        DefaultValue: 0
                    }, {
                        Name: "qAll",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                DrillUp: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qDimNo",
                        DefaultValue: 0
                    }, {
                        Name: "qNbrSteps",
                        DefaultValue: 0
                    }],
                    Out: []
                },
                Lock: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qColIndices",
                        DefaultValue: [0],
                        Optional: !0
                    }],
                    Out: []
                },
                Unlock: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qColIndices",
                        DefaultValue: [0],
                        Optional: !0
                    }],
                    Out: []
                },
                SelectHyperCubeValues: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qDimNo",
                        DefaultValue: 0
                    }, {
                        Name: "qValues",
                        DefaultValue: [0]
                    }, {
                        Name: "qToggleMode",
                        DefaultValue: !1
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SelectHyperCubeCells: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRowIndices",
                        DefaultValue: [0]
                    }, {
                        Name: "qColIndices",
                        DefaultValue: [0]
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qDeselectOnlyOneSelected",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SelectPivotCells: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qSelections",
                        DefaultValue: [{
                            qType: 0,
                            qCol: 0,
                            qRow: 0
                        }]
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qDeselectOnlyOneSelected",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                RangeSelectHyperCubeValues: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRanges",
                        DefaultValue: [{
                            qRange: {
                                qMin: 0,
                                qMax: 0,
                                qMinInclEq: !1,
                                qMaxInclEq: !1
                            },
                            qMeasureIx: 0
                        }]
                    }, {
                        Name: "qColumnsToSelect",
                        DefaultValue: [0],
                        Optional: !0
                    }, {
                        Name: "qOrMode",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qDeselectOnlyOneSelected",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                MultiRangeSelectHyperCubeValues: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRanges",
                        DefaultValue: [{
                            qRanges: [{
                                qRange: {
                                    qMin: 0,
                                    qMax: 0,
                                    qMinInclEq: !1,
                                    qMaxInclEq: !1
                                },
                                qMeasureIx: 0
                            }],
                            qColumnsToSelect: [0]
                        }]
                    }, {
                        Name: "qOrMode",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qDeselectOnlyOneSelected",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                SelectHyperCubeContinuousRange: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }, {
                        Name: "qRanges",
                        DefaultValue: [{
                            qRange: {
                                qMin: 0,
                                qMax: 0,
                                qMinInclEq: !1,
                                qMaxInclEq: !1
                            },
                            qDimIx: 0
                        }]
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                GetChild: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                GetChildInfos: {
                    In: [],
                    Out: [{
                        Name: "qInfos"
                    }]
                },
                CreateChild: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qExtendsId: "",
                            qMetaDef: {}
                        }
                    }, {
                        Name: "qPropForThis",
                        DefaultValue: null,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                DestroyChild: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }, {
                        Name: "qPropForThis",
                        DefaultValue: null,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                DestroyAllChildren: {
                    In: [{
                        Name: "qPropForThis",
                        DefaultValue: null,
                        Optional: !0
                    }],
                    Out: []
                },
                SetChildArrayOrder: {
                    In: [{
                        Name: "qIds",
                        DefaultValue: [""]
                    }],
                    Out: []
                },
                GetLinkedObjects: {
                    In: [],
                    Out: [{
                        Name: "qItems"
                    }]
                },
                CopyFrom: {
                    In: [{
                        Name: "qFromId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                BeginSelections: {
                    In: [{
                        Name: "qPaths",
                        DefaultValue: [""]
                    }],
                    Out: []
                },
                EndSelections: {
                    In: [{
                        Name: "qAccept",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                ResetMadeSelections: {
                    In: [],
                    Out: []
                },
                EmbedSnapshotObject: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                GetSnapshotObject: {
                    In: [],
                    Out: []
                },
                Publish: {
                    In: [],
                    Out: []
                },
                UnPublish: {
                    In: [],
                    Out: []
                }
            },
            GenericDimension: {
                GetLayout: {
                    In: [],
                    Out: [{
                        Name: "qLayout"
                    }]
                },
                ApplyPatches: {
                    In: [{
                        Name: "qPatches",
                        DefaultValue: [{
                            qOp: 0,
                            qPath: "",
                            qValue: ""
                        }]
                    }],
                    Out: []
                },
                SetProperties: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qDim: {
                                qGrouping: 0,
                                qFieldDefs: [""],
                                qFieldLabels: [""]
                            },
                            qMetaDef: {}
                        }
                    }],
                    Out: []
                },
                GetProperties: {
                    In: [],
                    Out: [{
                        Name: "qProp"
                    }]
                },
                GetInfo: {
                    In: [],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                GetDimension: {
                    In: [],
                    Out: [{
                        Name: "qDim"
                    }]
                },
                GetLinkedObjects: {
                    In: [],
                    Out: [{
                        Name: "qItems"
                    }]
                },
                Publish: {
                    In: [],
                    Out: []
                },
                UnPublish: {
                    In: [],
                    Out: []
                }
            },
            GenericBookmark: {
                GetFieldValues: {
                    In: [{
                        Name: "qField",
                        DefaultValue: ""
                    }, {
                        Name: "qGetExcludedValues",
                        DefaultValue: !1
                    }, {
                        Name: "qDataPage",
                        DefaultValue: {
                            qStartIndex: 0,
                            qEndIndex: 0
                        }
                    }],
                    Out: [{
                        Name: "qFieldValues"
                    }]
                },
                GetLayout: {
                    In: [],
                    Out: [{
                        Name: "qLayout"
                    }]
                },
                ApplyPatches: {
                    In: [{
                        Name: "qPatches",
                        DefaultValue: [{
                            qOp: 0,
                            qPath: "",
                            qValue: ""
                        }]
                    }],
                    Out: []
                },
                SetProperties: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qMetaDef: {}
                        }
                    }],
                    Out: []
                },
                GetProperties: {
                    In: [],
                    Out: [{
                        Name: "qProp"
                    }]
                },
                GetInfo: {
                    In: [],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                Apply: {
                    In: [],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                Publish: {
                    In: [],
                    Out: []
                },
                UnPublish: {
                    In: [],
                    Out: []
                }
            },
            GenericVariable: {
                GetLayout: {
                    In: [],
                    Out: [{
                        Name: "qLayout"
                    }]
                },
                ApplyPatches: {
                    In: [{
                        Name: "qPatches",
                        DefaultValue: [{
                            qOp: 0,
                            qPath: "",
                            qValue: ""
                        }]
                    }],
                    Out: []
                },
                SetProperties: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qMetaDef: {},
                            qName: "",
                            qComment: "",
                            qNumberPresentation: {
                                qType: 0,
                                qnDec: 0,
                                qUseThou: 0,
                                qFmt: "",
                                qDec: "",
                                qThou: ""
                            },
                            qIncludeInBookmark: !1,
                            qDefinition: ""
                        }
                    }],
                    Out: []
                },
                GetProperties: {
                    In: [],
                    Out: [{
                        Name: "qProp"
                    }]
                },
                GetInfo: {
                    In: [],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                SetStringValue: {
                    In: [{
                        Name: "qVal",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                SetNumValue: {
                    In: [{
                        Name: "qVal",
                        DefaultValue: 0
                    }],
                    Out: []
                },
                SetDualValue: {
                    In: [{
                        Name: "qText",
                        DefaultValue: ""
                    }, {
                        Name: "qNum",
                        DefaultValue: 0
                    }],
                    Out: []
                }
            },
            GenericMeasure: {
                GetLayout: {
                    In: [],
                    Out: [{
                        Name: "qLayout"
                    }]
                },
                ApplyPatches: {
                    In: [{
                        Name: "qPatches",
                        DefaultValue: [{
                            qOp: 0,
                            qPath: "",
                            qValue: ""
                        }]
                    }],
                    Out: []
                },
                SetProperties: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qMeasure: {
                                qLabel: "",
                                qDef: "",
                                qGrouping: 0,
                                qExpressions: [""],
                                qActiveExpression: 0
                            },
                            qMetaDef: {}
                        }
                    }],
                    Out: []
                },
                GetProperties: {
                    In: [],
                    Out: [{
                        Name: "qProp"
                    }]
                },
                GetInfo: {
                    In: [],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                GetMeasure: {
                    In: [],
                    Out: [{
                        Name: "qMeasure"
                    }]
                },
                GetLinkedObjects: {
                    In: [],
                    Out: [{
                        Name: "qItems"
                    }]
                },
                Publish: {
                    In: [],
                    Out: []
                },
                UnPublish: {
                    In: [],
                    Out: []
                }
            },
            GenericDerivedFields: {
                SetProperties: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qDerivedDefinitionId: "",
                            qFieldName: [""],
                            qMetaDef: {}
                        }
                    }],
                    Out: []
                },
                GetProperties: {
                    In: [],
                    Out: [{
                        Name: "qProp"
                    }]
                },
                GetInfo: {
                    In: [],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                GetDerivedFieldData: {
                    In: [],
                    Out: [{
                        Name: "qData"
                    }]
                },
                GetDerivedField: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qFields"
                    }]
                },
                GetListData: {
                    In: [],
                    Out: [{
                        Name: "qListData"
                    }]
                },
                GetDerivedFields: {
                    In: [],
                    Out: [{
                        Name: "qFields"
                    }]
                },
                GetDerivedGroups: {
                    In: [],
                    Out: [{
                        Name: "qGroups"
                    }]
                }
            },
            Doc: {
                GetField: {
                    In: [{
                        Name: "qFieldName",
                        DefaultValue: ""
                    }, {
                        Name: "qStateName",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: []
                },
                GetFieldDescription: {
                    In: [{
                        Name: "qFieldName",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                GetVariable: {
                    In: [{
                        Name: "qName",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                GetLooselyCoupledVector: {
                    In: [],
                    Out: [{
                        Name: "qv"
                    }]
                },
                SetLooselyCoupledVector: {
                    In: [{
                        Name: "qv",
                        DefaultValue: [0]
                    }],
                    Out: []
                },
                Evaluate: {
                    In: [{
                        Name: "qExpression",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                EvaluateEx: {
                    In: [{
                        Name: "qExpression",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qValue"
                    }]
                },
                ClearAll: {
                    In: [{
                        Name: "qLockedAlso",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qStateName",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: []
                },
                LockAll: {
                    In: [{
                        Name: "qStateName",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: []
                },
                UnlockAll: {
                    In: [{
                        Name: "qStateName",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: []
                },
                Back: {
                    In: [],
                    Out: []
                },
                Forward: {
                    In: [],
                    Out: []
                },
                ReduceData: {
                    In: [{
                        Name: "qConfirm",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qDropFieldNames",
                        DefaultValue: [""],
                        Optional: !0
                    }],
                    Out: []
                },
                RemoveAllData: {
                    In: [{
                        Name: "qConfirm",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                CreateVariable: {
                    In: [{
                        Name: "qName",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                RemoveVariable: {
                    In: [{
                        Name: "qName",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                GetLocaleInfo: {
                    In: [],
                    Out: []
                },
                GetTablesAndKeys: {
                    In: [{
                        Name: "qWindowSize",
                        DefaultValue: {
                            qcx: 0,
                            qcy: 0
                        }
                    }, {
                        Name: "qNullSize",
                        DefaultValue: {
                            qcx: 0,
                            qcy: 0
                        }
                    }, {
                        Name: "qCellHeight",
                        DefaultValue: 0
                    }, {
                        Name: "qSyntheticMode",
                        DefaultValue: !1
                    }, {
                        Name: "qIncludeSysVars",
                        DefaultValue: !1
                    }],
                    Out: [{
                        Name: "qtr"
                    }, {
                        Name: "qk"
                    }]
                },
                GetViewDlgSaveInfo: {
                    In: [],
                    Out: []
                },
                SetViewDlgSaveInfo: {
                    In: [{
                        Name: "qInfo",
                        DefaultValue: {
                            qPos: {
                                qLeft: 0,
                                qTop: 0,
                                qWidth: 0,
                                qHeight: 0
                            },
                            qCtlInfo: {
                                qInternalView: {
                                    qTables: [{
                                        qPos: {
                                            qLeft: 0,
                                            qTop: 0,
                                            qWidth: 0,
                                            qHeight: 0
                                        },
                                        qCaption: ""
                                    }],
                                    qBroomPoints: [{
                                        qPos: {
                                            qx: 0,
                                            qy: 0
                                        },
                                        qTable: "",
                                        qFields: [""]
                                    }],
                                    qConnectionPoints: [{
                                        qPos: {
                                            qx: 0,
                                            qy: 0
                                        },
                                        qFields: [""]
                                    }],
                                    qZoomFactor: 0
                                },
                                qSourceView: {
                                    qTables: [{
                                        qPos: {
                                            qLeft: 0,
                                            qTop: 0,
                                            qWidth: 0,
                                            qHeight: 0
                                        },
                                        qCaption: ""
                                    }],
                                    qBroomPoints: [{
                                        qPos: {
                                            qx: 0,
                                            qy: 0
                                        },
                                        qTable: "",
                                        qFields: [""]
                                    }],
                                    qConnectionPoints: [{
                                        qPos: {
                                            qx: 0,
                                            qy: 0
                                        },
                                        qFields: [""]
                                    }],
                                    qZoomFactor: 0
                                }
                            },
                            qMode: 0
                        }
                    }],
                    Out: []
                },
                GetEmptyScript: {
                    In: [{
                        Name: "qLocalizedMainSection",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: []
                },
                DoReload: {
                    In: [{
                        Name: "qMode",
                        DefaultValue: 0,
                        Optional: !0
                    }, {
                        Name: "qPartial",
                        DefaultValue: !1,
                        Optional: !0
                    }, {
                        Name: "qDebug",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                GetScriptBreakpoints: {
                    In: [],
                    Out: [{
                        Name: "qBreakpoints"
                    }]
                },
                SetScriptBreakpoints: {
                    In: [{
                        Name: "qBreakpoints",
                        DefaultValue: [{
                            qbufferName: "",
                            qlineIx: 0,
                            qEnabled: !1
                        }]
                    }],
                    Out: []
                },
                GetScript: {
                    In: [],
                    Out: [{
                        Name: "qScript"
                    }]
                },
                GetTextMacros: {
                    In: [],
                    Out: [{
                        Name: "qMacros"
                    }]
                },
                SetFetchLimit: {
                    In: [{
                        Name: "qLimit",
                        DefaultValue: 0
                    }],
                    Out: []
                },
                DoSave: {
                    In: [{
                        Name: "qFileName",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: []
                },
                GetTableData: {
                    In: [{
                        Name: "qOffset",
                        DefaultValue: 0
                    }, {
                        Name: "qRows",
                        DefaultValue: 0
                    }, {
                        Name: "qSyntheticMode",
                        DefaultValue: !1
                    }, {
                        Name: "qTableName",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qData"
                    }]
                },
                GetAppLayout: {
                    In: [],
                    Out: [{
                        Name: "qLayout"
                    }]
                },
                SetAppProperties: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qTitle: "",
                            qLastReloadTime: "",
                            qMigrationHash: "",
                            qSavedInProductVersion: "",
                            qThumbnail: {
                                qUrl: ""
                            }
                        }
                    }],
                    Out: []
                },
                GetAppProperties: {
                    In: [],
                    Out: [{
                        Name: "qProp"
                    }]
                },
                CreateSessionObject: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qExtendsId: "",
                            qMetaDef: {}
                        }
                    }],
                    Out: []
                },
                DestroySessionObject: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                CreateObject: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qExtendsId: "",
                            qMetaDef: {}
                        }
                    }],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                DestroyObject: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                GetObject: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                CloneObject: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qCloneId"
                    }]
                },
                CreateDraft: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qDraftId"
                    }]
                },
                CommitDraft: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                DestroyDraft: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }, {
                        Name: "qSourceId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                Undo: {
                    In: [],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                Redo: {
                    In: [],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                ClearUndoBuffer: {
                    In: [],
                    Out: []
                },
                CreateDimension: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qDim: {
                                qGrouping: 0,
                                qFieldDefs: [""],
                                qFieldLabels: [""]
                            },
                            qMetaDef: {}
                        }
                    }],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                DestroyDimension: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                GetDimension: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                CloneDimension: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qCloneId"
                    }]
                },
                CreateMeasure: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qMeasure: {
                                qLabel: "",
                                qDef: "",
                                qGrouping: 0,
                                qExpressions: [""],
                                qActiveExpression: 0
                            },
                            qMetaDef: {}
                        }
                    }],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                DestroyMeasure: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                GetMeasure: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                CloneMeasure: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qCloneId"
                    }]
                },
                CreateSessionVariable: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qMetaDef: {},
                            qName: "",
                            qComment: "",
                            qNumberPresentation: {
                                qType: 0,
                                qnDec: 0,
                                qUseThou: 0,
                                qFmt: "",
                                qDec: "",
                                qThou: ""
                            },
                            qIncludeInBookmark: !1,
                            qDefinition: ""
                        }
                    }],
                    Out: []
                },
                DestroySessionVariable: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                CreateVariableEx: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qMetaDef: {},
                            qName: "",
                            qComment: "",
                            qNumberPresentation: {
                                qType: 0,
                                qnDec: 0,
                                qUseThou: 0,
                                qFmt: "",
                                qDec: "",
                                qThou: ""
                            },
                            qIncludeInBookmark: !1,
                            qDefinition: ""
                        }
                    }],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                DestroyVariableById: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                DestroyVariableByName: {
                    In: [{
                        Name: "qName",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                GetVariableById: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                GetVariableByName: {
                    In: [{
                        Name: "qName",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                MigrateVariables: {
                    In: [],
                    Out: []
                },
                MigrateDerivedFields: {
                    In: [],
                    Out: []
                },
                CheckExpression: {
                    In: [{
                        Name: "qExpr",
                        DefaultValue: ""
                    }, {
                        Name: "qLabels",
                        DefaultValue: [""],
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qErrorMsg"
                    }, {
                        Name: "qBadFieldNames"
                    }, {
                        Name: "qDangerousFieldNames"
                    }]
                },
                CheckNumberOrExpression: {
                    In: [{
                        Name: "qExpr",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qErrorMsg"
                    }, {
                        Name: "qBadFieldNames"
                    }]
                },
                AddAlternateState: {
                    In: [{
                        Name: "qStateName",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                RemoveAlternateState: {
                    In: [{
                        Name: "qStateName",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                CreateBookmark: {
                    In: [{
                        Name: "qProp",
                        DefaultValue: {
                            qInfo: {
                                qId: "",
                                qType: ""
                            },
                            qMetaDef: {}
                        }
                    }],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                DestroyBookmark: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                GetBookmark: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                ApplyBookmark: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                CloneBookmark: {
                    In: [{
                        Name: "qId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qCloneId"
                    }]
                },
                AddFieldFromExpression: {
                    In: [{
                        Name: "qName",
                        DefaultValue: ""
                    }, {
                        Name: "qExpr",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                GetAllInfos: {
                    In: [],
                    Out: [{
                        Name: "qInfos"
                    }]
                },
                Resume: {
                    In: [],
                    Out: []
                },
                AbortModal: {
                    In: [{
                        Name: "qAccept",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                Publish: {
                    In: [{
                        Name: "qStreamId",
                        DefaultValue: ""
                    }, {
                        Name: "qName",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: []
                },
                UnPublish: {
                    In: [],
                    Out: []
                },
                GetMatchingFields: {
                    In: [{
                        Name: "qTags",
                        DefaultValue: [""]
                    }, {
                        Name: "qMatchingFieldMode",
                        DefaultValue: 0,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qFieldNames"
                    }]
                },
                FindMatchingFields: {
                    In: [{
                        Name: "qFieldName",
                        DefaultValue: ""
                    }, {
                        Name: "qTags",
                        DefaultValue: [""]
                    }],
                    Out: [{
                        Name: "qFieldNames"
                    }]
                },
                Scramble: {
                    In: [{
                        Name: "qFieldName",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                SaveObjects: {
                    In: [],
                    Out: []
                },
                GetAssociationScores: {
                    In: [{
                        Name: "qTable1",
                        DefaultValue: ""
                    }, {
                        Name: "qTable2",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qScore"
                    }]
                },
                GetMediaList: {
                    In: [],
                    Out: [{
                        Name: "qList"
                    }]
                },
                GetContentLibraries: {
                    In: [],
                    Out: [{
                        Name: "qList"
                    }]
                },
                GetLibraryContent: {
                    In: [{
                        Name: "qName",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qList"
                    }]
                },
                DoReloadEx: {
                    In: [{
                        Name: "qParams",
                        DefaultValue: {
                            qMode: 0,
                            qPartial: !1,
                            qDebug: !1
                        },
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qResult"
                    }]
                },
                BackCount: {
                    In: [],
                    Out: []
                },
                ForwardCount: {
                    In: [],
                    Out: []
                },
                SetScript: {
                    In: [{
                        Name: "qScript",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                CheckScriptSyntax: {
                    In: [],
                    Out: [{
                        Name: "qErrors"
                    }]
                },
                GetFavoriteVariables: {
                    In: [],
                    Out: [{
                        Name: "qNames"
                    }]
                },
                SetFavoriteVariables: {
                    In: [{
                        Name: "qNames",
                        DefaultValue: [""]
                    }],
                    Out: []
                },
                GetIncludeFileContent: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qContent"
                    }]
                },
                CreateConnection: {
                    In: [{
                        Name: "qConnection",
                        DefaultValue: {
                            qId: "",
                            qName: "",
                            qConnectionString: "",
                            qType: "",
                            qUserName: "",
                            qPassword: "",
                            qModifiedDate: "",
                            qMeta: {
                                qName: ""
                            },
                            qLogOn: 0
                        }
                    }],
                    Out: [{
                        Name: "qConnectionId"
                    }]
                },
                ModifyConnection: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qConnection",
                        DefaultValue: {
                            qId: "",
                            qName: "",
                            qConnectionString: "",
                            qType: "",
                            qUserName: "",
                            qPassword: "",
                            qModifiedDate: "",
                            qMeta: {
                                qName: ""
                            },
                            qLogOn: 0
                        }
                    }, {
                        Name: "qOverrideCredentials",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                DeleteConnection: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                GetConnection: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qConnection"
                    }]
                },
                GetConnections: {
                    In: [],
                    Out: [{
                        Name: "qConnections"
                    }]
                },
                GetDatabaseInfo: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qInfo"
                    }]
                },
                GetDatabases: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qDatabases"
                    }]
                },
                GetDatabaseOwners: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qDatabase",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qOwners"
                    }]
                },
                GetDatabaseTables: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qDatabase",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qOwner",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qTables"
                    }]
                },
                GetDatabaseTableFields: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qDatabase",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qOwner",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qTable",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qFields"
                    }]
                },
                GetDatabaseTablePreview: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qDatabase",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qOwner",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qTable",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qPreview"
                    }]
                },
                GetFolderItemsForConnection: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qRelativePath",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qFolderItems"
                    }]
                },
                GuessFileType: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qRelativePath",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qDataFormat"
                    }]
                },
                GetFileTables: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qRelativePath",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qDataFormat",
                        DefaultValue: {
                            qType: 0,
                            qLabel: "",
                            qQuote: "",
                            qComment: "",
                            qDelimiter: {
                                qName: "",
                                qScriptCode: "",
                                qNumber: 0,
                                qIsMultiple: !1
                            },
                            qCodePage: 0,
                            qHeaderSize: 0,
                            qRecordSize: 0,
                            qTabSize: 0,
                            qIgnoreEOF: !1,
                            qFixedWidthDelimiters: ""
                        }
                    }],
                    Out: [{
                        Name: "qTables"
                    }]
                },
                GetFileTableFields: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qRelativePath",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qDataFormat",
                        DefaultValue: {
                            qType: 0,
                            qLabel: "",
                            qQuote: "",
                            qComment: "",
                            qDelimiter: {
                                qName: "",
                                qScriptCode: "",
                                qNumber: 0,
                                qIsMultiple: !1
                            },
                            qCodePage: 0,
                            qHeaderSize: 0,
                            qRecordSize: 0,
                            qTabSize: 0,
                            qIgnoreEOF: !1,
                            qFixedWidthDelimiters: ""
                        }
                    }, {
                        Name: "qTable",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qFields"
                    }, {
                        Name: "qFormatSpec"
                    }]
                },
                GetFileTablePreview: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qRelativePath",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qDataFormat",
                        DefaultValue: {
                            qType: 0,
                            qLabel: "",
                            qQuote: "",
                            qComment: "",
                            qDelimiter: {
                                qName: "",
                                qScriptCode: "",
                                qNumber: 0,
                                qIsMultiple: !1
                            },
                            qCodePage: 0,
                            qHeaderSize: 0,
                            qRecordSize: 0,
                            qTabSize: 0,
                            qIgnoreEOF: !1,
                            qFixedWidthDelimiters: ""
                        }
                    }, {
                        Name: "qTable",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qPreview"
                    }, {
                        Name: "qFormatSpec"
                    }]
                },
                GetFileTablesEx: {
                    In: [{
                        Name: "qConnectionId",
                        DefaultValue: ""
                    }, {
                        Name: "qRelativePath",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qDataFormat",
                        DefaultValue: {
                            qType: 0,
                            qLabel: "",
                            qQuote: "",
                            qComment: "",
                            qDelimiter: {
                                qName: "",
                                qScriptCode: "",
                                qNumber: 0,
                                qIsMultiple: !1
                            },
                            qCodePage: 0,
                            qHeaderSize: 0,
                            qRecordSize: 0,
                            qTabSize: 0,
                            qIgnoreEOF: !1,
                            qFixedWidthDelimiters: ""
                        }
                    }],
                    Out: [{
                        Name: "qTables"
                    }]
                },
                SendGenericCommandToCustomConnector: {
                    In: [{
                        Name: "qProvider",
                        DefaultValue: ""
                    }, {
                        Name: "qCommand",
                        DefaultValue: ""
                    }, {
                        Name: "qMethod",
                        DefaultValue: ""
                    }, {
                        Name: "qParameters",
                        DefaultValue: [""]
                    }, {
                        Name: "qAppendConnection",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qResult"
                    }]
                },
                SearchSuggest: {
                    In: [{
                        Name: "qOptions",
                        DefaultValue: {
                            qSearchFields: [""],
                            qContext: 0
                        }
                    }, {
                        Name: "qTerms",
                        DefaultValue: [""]
                    }],
                    Out: [{
                        Name: "qResult"
                    }]
                },
                SearchAssociations: {
                    In: [{
                        Name: "qOptions",
                        DefaultValue: {
                            qSearchFields: [""],
                            qContext: 0
                        }
                    }, {
                        Name: "qTerms",
                        DefaultValue: [""]
                    }, {
                        Name: "qPage",
                        DefaultValue: {
                            qOffset: 0,
                            qCount: 0,
                            qMaxNbrFieldMatches: 0,
                            qGroupOptions: [{
                                qGroupType: 0,
                                qOffset: 0,
                                qCount: 0
                            }],
                            qGroupItemOptions: [{
                                qGroupItemType: 0,
                                qOffset: 0,
                                qCount: 0
                            }]
                        }
                    }],
                    Out: [{
                        Name: "qResults"
                    }]
                },
                SelectAssociations: {
                    In: [{
                        Name: "qOptions",
                        DefaultValue: {
                            qSearchFields: [""],
                            qContext: 0
                        }
                    }, {
                        Name: "qTerms",
                        DefaultValue: [""]
                    }, {
                        Name: "qMatchIx",
                        DefaultValue: 0
                    }, {
                        Name: "qSoftLock",
                        DefaultValue: null,
                        Optional: !0
                    }],
                    Out: []
                },
                SearchResults: {
                    In: [{
                        Name: "qOptions",
                        DefaultValue: {
                            qSearchFields: [""],
                            qContext: 0
                        }
                    }, {
                        Name: "qTerms",
                        DefaultValue: [""]
                    }, {
                        Name: "qPage",
                        DefaultValue: {
                            qOffset: 0,
                            qCount: 0,
                            qMaxNbrFieldMatches: 0,
                            qGroupOptions: [{
                                qGroupType: 0,
                                qOffset: 0,
                                qCount: 0
                            }],
                            qGroupItemOptions: [{
                                qGroupItemType: 0,
                                qOffset: 0,
                                qCount: 0
                            }]
                        }
                    }],
                    Out: [{
                        Name: "qResult"
                    }]
                },
                SearchObjects: {
                    In: [{
                        Name: "qOptions",
                        DefaultValue: {
                            qAttributes: [""]
                        }
                    }, {
                        Name: "qTerms",
                        DefaultValue: [""]
                    }, {
                        Name: "qPage",
                        DefaultValue: {
                            qOffset: 0,
                            qCount: 0,
                            qMaxNbrFieldMatches: 0,
                            qGroupOptions: [{
                                qGroupType: 0,
                                qOffset: 0,
                                qCount: 0
                            }],
                            qGroupItemOptions: [{
                                qGroupItemType: 0,
                                qOffset: 0,
                                qCount: 0
                            }]
                        }
                    }],
                    Out: [{
                        Name: "qResult"
                    }]
                }
            },
            Global: {
                AbortRequest: {
                    In: [{
                        Name: "qRequestId",
                        DefaultValue: 0
                    }],
                    Out: []
                },
                AbortAll: {
                    In: [],
                    Out: []
                },
                GetProgress: {
                    In: [{
                        Name: "qRequestId",
                        DefaultValue: 0
                    }],
                    Out: [{
                        Name: "qProgressData"
                    }]
                },
                QvVersion: {
                    In: [],
                    Out: []
                },
                OSVersion: {
                    In: [],
                    Out: []
                },
                OSName: {
                    In: [],
                    Out: []
                },
                QTProduct: {
                    In: [],
                    Out: []
                },
                GetDocList: {
                    In: [],
                    Out: [{
                        Name: "qDocList"
                    }]
                },
                GetInteract: {
                    In: [{
                        Name: "qRequestId",
                        DefaultValue: 0
                    }],
                    Out: [{
                        Name: "qDef"
                    }]
                },
                InteractDone: {
                    In: [{
                        Name: "qRequestId",
                        DefaultValue: 0
                    }, {
                        Name: "qDef",
                        DefaultValue: {
                            qType: 0,
                            qTitle: "",
                            qMsg: "",
                            qButtons: 0,
                            qLine: "",
                            qOldLineNr: 0,
                            qNewLineNr: 0,
                            qPath: "",
                            qHidden: !1,
                            qResult: 0,
                            qInput: ""
                        }
                    }],
                    Out: []
                },
                GetAuthenticatedUser: {
                    In: [],
                    Out: []
                },
                GetStreamList: {
                    In: [],
                    Out: [{
                        Name: "qStreamList"
                    }]
                },
                UploadToContentService: {
                    In: [{
                        Name: "qDirectory",
                        DefaultValue: ""
                    }, {
                        Name: "qAppId",
                        DefaultValue: ""
                    }, {
                        Name: "qQrsObjects",
                        DefaultValue: [{
                            qEngineObjectID: "",
                            qItemID: ""
                        }]
                    }],
                    Out: [{
                        Name: "qUploadedObjects"
                    }]
                },
                CreateDocEx: {
                    In: [{
                        Name: "qDocName",
                        DefaultValue: ""
                    }, {
                        Name: "qUserName",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qPassword",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qSerial",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qLocalizedScriptMainSection",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qDocId"
                    }]
                },
                GetActiveDoc: {
                    In: [],
                    Out: []
                },
                AllowCreateApp: {
                    In: [],
                    Out: []
                },
                CreateApp: {
                    In: [{
                        Name: "qAppName",
                        DefaultValue: ""
                    }, {
                        Name: "qLocalizedScriptMainSection",
                        DefaultValue: "",
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }, {
                        Name: "qAppId"
                    }]
                },
                DeleteApp: {
                    In: [{
                        Name: "qAppId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                IsDesktopMode: {
                    In: [],
                    Out: []
                },
                GetConfiguration: {
                    In: [],
                    Out: [{
                        Name: "qConfig"
                    }]
                },
                CancelRequest: {
                    In: [{
                        Name: "qRequestId",
                        DefaultValue: 0
                    }],
                    Out: []
                },
                ShutdownProcess: {
                    In: [],
                    Out: []
                },
                ReloadExtensionList: {
                    In: [],
                    Out: []
                },
                ReplaceAppFromID: {
                    In: [{
                        Name: "qTargetAppId",
                        DefaultValue: ""
                    }, {
                        Name: "qSrcAppID",
                        DefaultValue: ""
                    }, {
                        Name: "qIds",
                        DefaultValue: [""]
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                CopyApp: {
                    In: [{
                        Name: "qTargetAppId",
                        DefaultValue: ""
                    }, {
                        Name: "qSrcAppId",
                        DefaultValue: ""
                    }, {
                        Name: "qIds",
                        DefaultValue: [""]
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                ImportApp: {
                    In: [{
                        Name: "qAppId",
                        DefaultValue: ""
                    }, {
                        Name: "qSrcPath",
                        DefaultValue: ""
                    }, {
                        Name: "qIds",
                        DefaultValue: [""]
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                ImportAppEx: {
                    In: [{
                        Name: "qAppId",
                        DefaultValue: ""
                    }, {
                        Name: "qSrcPath",
                        DefaultValue: ""
                    }, {
                        Name: "qIds",
                        DefaultValue: [""]
                    }, {
                        Name: "qExcludeConnections",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                ExportApp: {
                    In: [{
                        Name: "qTargetPath",
                        DefaultValue: ""
                    }, {
                        Name: "qSrcAppId",
                        DefaultValue: ""
                    }, {
                        Name: "qIds",
                        DefaultValue: [""]
                    }],
                    Out: [{
                        Name: "qSuccess"
                    }]
                },
                PublishApp: {
                    In: [{
                        Name: "qAppId",
                        DefaultValue: ""
                    }, {
                        Name: "qName",
                        DefaultValue: ""
                    }, {
                        Name: "qStreamId",
                        DefaultValue: ""
                    }],
                    Out: []
                },
                IsPersonalMode: {
                    In: [],
                    Out: []
                },
                GetUniqueID: {
                    In: [],
                    Out: [{
                        Name: "qUniqueID"
                    }]
                },
                OpenDoc: {
                    In: [{
                        Name: "qDocName",
                        DefaultValue: ""
                    }, {
                        Name: "qUserName",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qPassword",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qSerial",
                        DefaultValue: "",
                        Optional: !0
                    }, {
                        Name: "qNoData",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: []
                },
                CreateSessionApp: {
                    In: [],
                    Out: [{
                        Name: "qSessionAppId"
                    }]
                },
                CreateSessionAppFromApp: {
                    In: [{
                        Name: "qSrcAppId",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qSessionAppId"
                    }]
                },
                ProductVersion: {
                    In: [],
                    Out: []
                },
                GetAppEntry: {
                    In: [{
                        Name: "qAppID",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qEntry"
                    }]
                },
                ConfigureReload: {
                    In: [{
                        Name: "qCancelOnScriptError",
                        DefaultValue: !1
                    }, {
                        Name: "qUseErrorData",
                        DefaultValue: !1
                    }, {
                        Name: "qInteractOnError",
                        DefaultValue: !1
                    }],
                    Out: []
                },
                CancelReload: {
                    In: [],
                    Out: []
                },
                GetBNF: {
                    In: [{
                        Name: "qBnfType",
                        DefaultValue: 0
                    }],
                    Out: [{
                        Name: "qBnfDefs"
                    }]
                },
                GetFunctions: {
                    In: [{
                        Name: "qGroup",
                        DefaultValue: 0,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qFunctions"
                    }]
                },
                GetOdbcDsns: {
                    In: [],
                    Out: [{
                        Name: "qOdbcDsns"
                    }]
                },
                GetOleDbProviders: {
                    In: [],
                    Out: [{
                        Name: "qOleDbProviders"
                    }]
                },
                GetDatabasesFromConnectionString: {
                    In: [{
                        Name: "qConnection",
                        DefaultValue: {
                            qId: "",
                            qName: "",
                            qConnectionString: "",
                            qType: "",
                            qUserName: "",
                            qPassword: "",
                            qModifiedDate: "",
                            qMeta: {
                                qName: ""
                            },
                            qLogOn: 0
                        }
                    }],
                    Out: [{
                        Name: "qDatabases"
                    }]
                },
                IsValidConnectionString: {
                    In: [{
                        Name: "qConnection",
                        DefaultValue: {
                            qId: "",
                            qName: "",
                            qConnectionString: "",
                            qType: "",
                            qUserName: "",
                            qPassword: "",
                            qModifiedDate: "",
                            qMeta: {
                                qName: ""
                            },
                            qLogOn: 0
                        }
                    }],
                    Out: []
                },
                GetDefaultAppFolder: {
                    In: [],
                    Out: [{
                        Name: "qPath"
                    }]
                },
                GetMyDocumentsFolder: {
                    In: [],
                    Out: [{
                        Name: "qFolder"
                    }]
                },
                GetLogicalDriveStrings: {
                    In: [],
                    Out: [{
                        Name: "qDrives"
                    }]
                },
                GetFolderItemsForPath: {
                    In: [{
                        Name: "qPath",
                        DefaultValue: ""
                    }],
                    Out: [{
                        Name: "qFolderItems"
                    }]
                },
                GetSupportedCodePages: {
                    In: [],
                    Out: [{
                        Name: "qCodePages"
                    }]
                },
                GetCustomConnectors: {
                    In: [{
                        Name: "qReloadList",
                        DefaultValue: !1,
                        Optional: !0
                    }],
                    Out: [{
                        Name: "qConnectors"
                    }]
                },
                EngineVersion: {
                    In: [],
                    Out: [{
                        Name: "qVersion"
                    }]
                }
            }
        },
        enums: {
            LocalizedMessageCode: {
                LOCMSG_SCRIPTEDITOR_EMPTY_MESSAGE: 0,
                LOCMSG_SCRIPTEDITOR_PROGRESS_SAVING_STARTED: 1,
                LOCMSG_SCRIPTEDITOR_PROGRESS_BYTES_LEFT: 2,
                LOCMSG_SCRIPTEDITOR_PROGRESS_STORING_TABLES: 3,
                LOCMSG_SCRIPTEDITOR_PROGRESS_QVD_ROWS_SO_FAR: 4,
                LOCMSG_SCRIPTEDITOR_PROGRESS_CONNECTED: 5,
                LOCMSG_SCRIPTEDITOR_PROGRESS_CONNECTING_TO: 6,
                LOCMSG_SCRIPTEDITOR_PROGRESS_CONNECT_FAILED: 7,
                LOCMSG_SCRIPTEDITOR_PROGRESS_QVD_ROWISH: 8,
                LOCMSG_SCRIPTEDITOR_PROGRESS_QVD_COLUMNAR: 9,
                LOCMSG_SCRIPTEDITOR_ERROR: 10,
                LOCMSG_SCRIPTEDITOR_DONE: 11,
                LOCMSG_SCRIPTEDITOR_LOAD_EXTERNAL_DATA: 12,
                LOCMSG_SCRIPTEDITOR_PROGRESS_OLD_QVD_ISLOADING: 13,
                LOCMSG_SCRIPTEDITOR_PROGRESS_QVC_LOADING: 14,
                LOCMSG_SCRIPTEDITOR_PROGRESS_QVD_BUFFERED: 15,
                LOCMSG_SCRIPTEDITOR_PROGRESS_QVC_PREPARING: 16,
                LOCMSG_SCRIPTEDITOR_PROGRESS_QVC_APPENDING: 17,
                LOCMSG_SCRIPTEDITOR_REMOVE_SYNTHETIC: 18,
                LOCMSG_SCRIPTEDITOR_PENDING_LINKEDTABLE_FETCHING: 19,
                LOCMSG_SCRIPTEDITOR_RELOAD: 20,
                LOCMSG_SCRIPTEDITOR_LINES_FETCHED: 21,
                LOCMSG_SCRIPTEDITOR_SEARCHINDEX_START: 22,
                LOCMSG_SCRIPTEDITOR_SEARCHINDEX_FIELD: 23,
                LOCMSG_SCRIPTEDITOR_SEARCHINDEX_SUCCESS: 24,
                LOCMSG_SCRIPTEDITOR_SEARCHINDEX_FAILURE: 25,
                LOCMSG_SCRIPTEDITOR_SEARCHINDEX_STARTABORT: 26,
                LOCMSG_SCRIPTEDITOR_SEARCHINDEX_ENDABORT: 27,
                LOCMSG_SCRIPTEDITOR_SEARCHINDEX_TIMEOUT: 28,
                LOCMSG_SCRIPTEDITOR_SEARCHINDEX_OUTOFMEMORY: 29
            },
            QrsChangeType: {
                QRS_CHANGE_UNDEFINED: 0,
                QRS_CHANGE_ADD: 1,
                QRS_CHANGE_UPDATE: 2,
                QRS_CHANGE_DELETE: 3
            },
            LocalizedErrorCode: {
                LOCERR_INTERNAL_ERROR: -128,
                LOCERR_GENERIC_UNKNOWN: -1,
                LOCERR_GENERIC_OK: 0,
                LOCERR_GENERIC_NOT_SET: 1,
                LOCERR_GENERIC_NOT_FOUND: 2,
                LOCERR_GENERIC_ALREADY_EXISTS: 3,
                LOCERR_GENERIC_INVALID_PATH: 4,
                LOCERR_GENERIC_ACCESS_DENIED: 5,
                LOCERR_GENERIC_OUT_OF_MEMORY: 6,
                LOCERR_GENERIC_NOT_INITIALIZED: 7,
                LOCERR_GENERIC_INVALID_PARAMETERS: 8,
                LOCERR_GENERIC_EMPTY_PARAMETERS: 9,
                LOCERR_GENERIC_INTERNAL_ERROR: 10,
                LOCERR_GENERIC_CORRUPT_DATA: 11,
                LOCERR_GENERIC_MEMORY_INCONSISTENCY: 12,
                LOCERR_GENERIC_INVISIBLE_OWNER_ABORT: 13,
                LOCERR_GENERIC_PROHIBIT_VALIDATE: 14,
                LOCERR_GENERIC_ABORTED: 15,
                LOCERR_GENERIC_CONNECTION_LOST: 16,
                LOCERR_GENERIC_UNSUPPORTED_IN_PRODUCT_VERSION: 17,
                LOCERR_GENERIC_REST_CONNECTION_FAILURE: 18,
                LOCERR_HTTP_400: 400,
                LOCERR_HTTP_401: 401,
                LOCERR_HTTP_402: 402,
                LOCERR_HTTP_403: 403,
                LOCERR_HTTP_404: 404,
                LOCERR_HTTP_405: 405,
                LOCERR_HTTP_406: 406,
                LOCERR_HTTP_407: 407,
                LOCERR_HTTP_408: 408,
                LOCERR_HTTP_409: 409,
                LOCERR_HTTP_410: 410,
                LOCERR_HTTP_411: 411,
                LOCERR_HTTP_412: 412,
                LOCERR_HTTP_413: 413,
                LOCERR_HTTP_414: 414,
                LOCERR_HTTP_415: 415,
                LOCERR_HTTP_416: 416,
                LOCERR_HTTP_417: 417,
                LOCERR_HTTP_500: 500,
                LOCERR_HTTP_501: 501,
                LOCERR_HTTP_502: 502,
                LOCERR_HTTP_503: 503,
                LOCERR_HTTP_504: 504,
                LOCERR_HTTP_505: 505,
                LOCERR_HTTP_509: 509,
                LOCERR_HTTP_COULDNT_RESOLVE_HOST: 700,
                LOCERR_APP_ALREADY_EXISTS: 1e3,
                LOCERR_APP_INVALID_NAME: 1001,
                LOCERR_APP_ALREADY_OPEN: 1002,
                LOCERR_APP_NOT_FOUND: 1003,
                LOCERR_APP_IMPORT_FAILED: 1004,
                LOCERR_APP_SAVE_FAILED: 1005,
                LOCERR_APP_CREATE_FAILED: 1006,
                LOCERR_APP_INVALID: 1007,
                LOCERR_APP_CONNECT_FAILED: 1008,
                LOCERR_APP_ALREADY_OPEN_IN_DIFFERENT_MODE: 1009,
                LOCERR_APP_MIGRATION_COULD_NOT_CONTACT_MIGRATION_SERVICE: 1010,
                LOCERR_APP_MIGRATION_COULD_NOT_START_MIGRATION: 1011,
                LOCERR_APP_MIGRATION_FAILURE: 1012,
                LOCERR_APP_SCRIPT_MISSING: 1013,
                LOCERR_CONNECTION_ALREADY_EXISTS: 2e3,
                LOCERR_CONNECTION_NOT_FOUND: 2001,
                LOCERR_CONNECTION_FAILED_TO_LOAD: 2002,
                LOCERR_CONNECTION_FAILED_TO_IMPORT: 2003,
                LOCERR_CONNECTION_NAME_IS_INVALID: 2004,
                LOCERR_FILE_ACCESS_DENIED: 3e3,
                LOCERR_FILE_NAME_INVALID: 3001,
                LOCERR_FILE_CORRUPT: 3002,
                LOCERR_FILE_NOT_FOUND: 3003,
                LOCERR_FILE_FORMAT_UNSUPPORTED: 3004,
                LOCERR_FILE_OPENED_IN_UNSUPPORTED_MODE: 3005,
                LOCERR_FILE_TABLE_NOT_FOUND: 3006,
                LOCERR_USER_ACCESS_DENIED: 4e3,
                LOCERR_USER_IMPERSONATION_FAILED: 4001,
                LOCERR_SERVER_OUT_OF_SESSION_AND_USER_CALS: 5e3,
                LOCERR_SERVER_OUT_OF_SESSION_CALS: 5001,
                LOCERR_SERVER_OUT_OF_USAGE_CALS: 5002,
                LOCERR_SERVER_OUT_OF_CALS: 5003,
                LOCERR_SERVER_OUT_OF_NAMED_CALS: 5004,
                LOCERR_SERVER_OFF_DUTY: 5005,
                LOCERR_SERVER_BUSY: 5006,
                LOCERR_SERVER_LICENSE_EXPIRED: 5007,
                LOCERR_SERVER_AJAX_DISABLED: 5008,
                LOCERR_HC_INVALID_OBJECT: 6e3,
                LOCERR_HC_RESULT_TOO_LARGE: 6001,
                LOCERR_HC_INVALID_OBJECT_STATE: 6002,
                LOCERR_HC_MODAL_OBJECT_ERROR: 6003,
                LOCERR_CALC_INVALID_DEF: 7e3,
                LOCERR_CALC_NOT_IN_LIB: 7001,
                LOCERR_CALC_HEAP_ERROR: 7002,
                LOCERR_CALC_TOO_LARGE: 7003,
                LOCERR_CALC_TIMEOUT: 7004,
                LOCERR_CALC_EVAL_CONDITION_FAILED: 7005,
                LOCERR_CALC_MIXED_LINKED_AGGREGATION: 7006,
                LOCERR_CALC_MISSING_LINKED: 7007,
                LOCERR_CALC_INVALID_COL_SORT: 7008,
                LOCERR_CALC_PAGES_TOO_LARGE: 7009,
                LOCERR_CALC_SEMANTIC_FIELD_NOT_ALLOWED: 7010,
                LOCERR_CALC_VALIDATION_STATE_INVALID: 7011,
                LOCERR_CALC_PIVOT_DIMENSIONS_ALREADY_EXISTS: 7012,
                LOCERR_CALC_MISSING_LINKED_FIELD: 7013,
                LOCERR_CALC_NOT_CALCULATED: 7014,
                LOCERR_LAYOUT_EXTENDS_INVALID_ID: 8e3,
                LOCERR_LAYOUT_LINKED_OBJECT_NOT_FOUND: 8001,
                LOCERR_LAYOUT_LINKED_OBJECT_INVALID: 8002,
                LOCERR_PERSISTENCE_WRITE_FAILED: 9e3,
                LOCERR_PERSISTENCE_READ_FAILED: 9001,
                LOCERR_PERSISTENCE_DELETE_FAILED: 9002,
                LOCERR_PERSISTENCE_NOT_FOUND: 9003,
                LOCERR_PERSISTENCE_UNSUPPORTED_VERSION: 9004,
                LOCERR_PERSISTENCE_MIGRATION_FAILED_READ_ONLY: 9005,
                LOCERR_PERSISTENCE_MIGRATION_CANCELLED: 9006,
                LOCERR_PERSISTENCE_MIGRATION_BACKUP_FAILED: 9007,
                LOCERR_PERSISTENCE_DISK_FULL: 9008,
                LOCERR_PERSISTENCE_NOT_SUPPORTED_FOR_SESSION_APP: 9009,
                LOCERR_PERSISTENCE_SYNC_SET_CHUNK_INVALID_PARAMETERS: 9510,
                LOCERR_PERSISTENCE_SYNC_GET_CHUNK_INVALID_PARAMETERS: 9511,
                LOCERR_SCRIPT_DATASOURCE_ACCESS_DENIED: 1e4,
                LOCERR_RELOAD_IN_PROGRESS: 11e3,
                LOCERR_RELOAD_TABLE_X_NOT_FOUND: 11001,
                LOCERR_RELOAD_UNKNOWN_STATEMENT: 11002,
                LOCERR_RELOAD_EXPECTED_SOMETHING_FOUND_UNKNOWN: 11003,
                LOCERR_RELOAD_EXPECTED_NOTHING_FOUND_UNKNOWN: 11004,
                LOCERR_RELOAD_EXPECTED_ONE_OF_1_TOKENS_FOUND_UNKNOWN: 11005,
                LOCERR_RELOAD_EXPECTED_ONE_OF_2_TOKENS_FOUND_UNKNOWN: 11006,
                LOCERR_RELOAD_EXPECTED_ONE_OF_3_TOKENS_FOUND_UNKNOWN: 11007,
                LOCERR_RELOAD_EXPECTED_ONE_OF_4_TOKENS_FOUND_UNKNOWN: 11008,
                LOCERR_RELOAD_EXPECTED_ONE_OF_5_TOKENS_FOUND_UNKNOWN: 11009,
                LOCERR_RELOAD_EXPECTED_ONE_OF_6_TOKENS_FOUND_UNKNOWN: 11010,
                LOCERR_RELOAD_EXPECTED_ONE_OF_7_TOKENS_FOUND_UNKNOWN: 11011,
                LOCERR_RELOAD_EXPECTED_ONE_OF_8_OR_MORE_TOKENS_FOUND_UNKNOWN: 11012,
                LOCERR_RELOAD_FIELD_X_NOT_FOUND: 11013,
                LOCERR_RELOAD_MAPPING_TABLE_X_NOT_FOUND: 11014,
                LOCERR_RELOAD_LIB_CONNECTION_X_NOT_FOUND: 11015,
                LOCERR_RELOAD_NAME_ALREADY_TAKEN: 11016,
                LOCERR_RELOAD_WRONG_FILE_FORMAT_DIF: 11017,
                LOCERR_RELOAD_WRONG_FILE_FORMAT_BIFF: 11018,
                LOCERR_RELOAD_WRONG_FILE_FORMAT_ENCRYPTED: 11019,
                LOCERR_RELOAD_OPEN_FILE_ERROR: 11020,
                LOCERR_RELOAD_AUTO_GENERATE_COUNT: 11021,
                LOCERR_RELOAD_PE_ILLEGAL_PREFIX_COMB: 11022,
                LOCERR_RELOAD_MATCHING_CONTROL_STATEMENT_ERROR: 11023,
                LOCERR_RELOAD_MATCHING_LIBPATH_X_NOT_FOUND: 11024,
                LOCERR_RELOAD_MATCHING_LIBPATH_X_INVALID: 11025,
                LOCERR_RELOAD_MATCHING_LIBPATH_X_OUTSIDE: 11026,
                LOCERR_RELOAD_NO_QUALIFIED_PATH_FOR_FILE: 11027,
                LOCERR_RELOAD_MODE_STATEMENT_ONLY_FOR_LIB_PATHS: 11028,
                LOCERR_RELOAD_INCONSISTENT_USE_OF_SEMANTIC_FIELDS: 11029,
                LOCERR_RELOAD_NO_OPEN_DATABASE: 11030,
                LOCERR_RELOAD_AGGREGATION_REQUIRED_BY_GROUP_BY: 11031,
                LOCERR_RELOAD_CONNECT_MUST_USE_LIB_PREFIX_IN_THIS_MODE: 11032,
                LOCERR_RELOAD_ODBC_CONNECT_FAILED: 11033,
                LOCERR_RELOAD_OLEDB_CONNECT_FAILED: 11034,
                LOCERR_RELOAD_CUSTOM_CONNECT_FAILED: 11035,
                LOCERR_RELOAD_ODBC_READ_FAILED: 11036,
                LOCERR_RELOAD_OLEDB_READ_FAILED: 11037,
                LOCERR_RELOAD_CUSTOM_READ_FAILED: 11038,
                LOCERR_RELOAD_BINARY_LOAD_PROHIBITED: 11039,
                LOCERR_RELOAD_CONNECTOR_START_FAILED: 11040,
                LOCERR_RELOAD_CONNECTOR_NOT_RESPONDING: 11041,
                LOCERR_RELOAD_CONNECTOR_REPLY_ERROR: 11042,
                LOCERR_RELOAD_CONNECTOR_CONNECT_ERROR: 11043,
                LOCERR_PERSONAL_NEW_VERSION_AVAILABLE: 12e3,
                LOCERR_PERSONAL_VERSION_EXPIRED: 12001,
                LOCERR_PERSONAL_SECTION_ACCESS_DETECTED: 12002,
                LOCERR_PERSONAL_APP_DELETION_FAILED: 12003,
                LOCERR_USER_AUTHENTICATION_FAILURE: 12004,
                LOCERR_EXPORT_OUT_OF_MEMORY: 13e3,
                LOCERR_EXPORT_NO_DATA: 13001,
                LOCERR_SYNC_INVALID_OFFSET: 14e3,
                LOCERR_SEARCH_TIMEOUT: 15e3,
                LOCERR_DIRECT_DISCOVERY_LINKED_EXPRESSION_FAIL: 16e3,
                LOCERR_DIRECT_DISCOVERY_ROWCOUNT_OVERFLOW: 16001,
                LOCERR_DIRECT_DISCOVERY_EMPTY_RESULT: 16002,
                LOCERR_DIRECT_DISCOVERY_DB_CONNECTION_FAILED: 16003,
                LOCERR_DIRECT_DISCOVERY_MEASURE_NOT_ALLOWED: 16004,
                LOCERR_DIRECT_DISCOVERY_DETAIL_NOT_ALLOWED: 16005,
                LOCERR_DIRECT_DISCOVERY_NOT_SYNTH_CIRCULAR_ALLOWED: 16006,
                LOCERR_DIRECT_DISCOVERY_ONLY_ONE_DD_TABLE_ALLOWED: 16007,
                LOCERR_DIRECT_DISCOVERY_DB_AUTHORIZATION_FAILED: 16008,
                LOCERR_SMART_LOAD_TABLE_NOT_FOUND: 17e3,
                LOCERR_SMART_LOAD_TABLE_DUPLICATED: 17001,
                LOCERR_VARIABLE_NO_NAME: 18e3,
                LOCERR_VARIABLE_DUPLICATE_NAME: 18001,
                LOCERR_VARIABLE_INCONSISTENCY: 18002,
                LOCERR_MEDIA_LIBRARY_LIST_FAILED: 19e3,
                LOCERR_MEDIA_LIBRARY_CONTENT_FAILED: 19001,
                LOCERR_MEDIA_BUNDLING_FAILED: 19002,
                LOCERR_MEDIA_UNBUNDLING_FAILED: 19003,
                LOCERR_MEDIA_LIBRARY_NOT_FOUND: 19004,
                LOCERR_FEATURE_DISABLED: 2e4,
                LOCERR_JSON_RPC_INVALID_REQUEST: -32600,
                LOCERR_JSON_RPC_METHOD_NOT_FOUND: -32601,
                LOCERR_JSON_RPC_INVALID_PARAMETERS: -32602,
                LOCERR_JSON_RPC_INTERNAL_ERROR: -32603,
                LOCERR_JSON_RPC_PARSE_ERROR: -32700
            },
            LocalizedWarningCode: {
                LOCWARN_PERSONAL_RELOAD_REQUIRED: 0,
                LOCWARN_PERSONAL_VERSION_EXPIRES_SOON: 1,
                LOCWARN_EXPORT_DATA_TRUNCATED: 1e3,
                LOCWARN_COULD_NOT_OPEN_ALL_OBJECTS: 2e3
            },
            GrpType: {
                GRP_NX_NONE: 0,
                GRP_NX_HIEARCHY: 1,
                GRP_NX_COLLECTION: 2
            },
            ExportFileType: {
                EXPORT_CSV_C: 0,
                EXPORT_CSV_T: 1,
                EXPORT_OOXML: 2
            },
            ExportState: {
                EXPORT_POSSIBLE: 0,
                EXPORT_ALL: 1
            },
            DimCellType: {
                NX_DIM_CELL_VALUE: 0,
                NX_DIM_CELL_EMPTY: 1,
                NX_DIM_CELL_NORMAL: 2,
                NX_DIM_CELL_TOTAL: 3,
                NX_DIM_CELL_OTHER: 4,
                NX_DIM_CELL_AGGR: 5,
                NX_DIM_CELL_PSEUDO: 6,
                NX_DIM_CELL_ROOT: 7,
                NX_DIM_CELL_NULL: 8
            },
            StackElemType: {
                NX_STACK_CELL_NORMAL: 0,
                NX_STACK_CELL_TOTAL: 1,
                NX_STACK_CELL_OTHER: 2,
                NX_STACK_CELL_SUM: 3,
                NX_STACK_CELL_VALUE: 4,
                NX_STACK_CELL_PSEUDO: 5
            },
            SortIndicatorType: {
                NX_SORT_INDICATE_NONE: 0,
                NX_SORT_INDICATE_ASC: 1,
                NX_SORT_INDICATE_DESC: 2
            },
            DimensionType: {
                NX_DIMENSION_TYPE_DISCRETE: 0,
                NX_DIMENSION_TYPE_NUMERIC: 1,
                NX_DIMENSION_TYPE_TIME: 2
            },
            FieldSelectionMode: {
                SELECTION_MODE_NORMAL: 0,
                SELECTION_MODE_AND: 1,
                SELECTION_MODE_NOT: 2
            },
            FrequencyMode: {
                NX_FREQUENCY_NONE: 0,
                NX_FREQUENCY_VALUE: 1,
                NX_FREQUENCY_PERCENT: 2,
                NX_FREQUENCY_RELATIVE: 3
            },
            DataReductionMode: {
                DATA_REDUCTION_NONE: 0,
                DATA_REDUCTION_ONEDIM: 1,
                DATA_REDUCTION_SCATTERED: 2,
                DATA_REDUCTION_CLUSTERED: 3,
                DATA_REDUCTION_STACKED: 4
            },
            HypercubeMode: {
                DATA_MODE_STRAIGHT: 0,
                DATA_MODE_PIVOT: 1,
                DATA_MODE_PIVOT_STACK: 2
            },
            PatchOperationType: {
                Add: 0,
                Remove: 1,
                Replace: 2
            },
            SelectionCellType: {
                NX_CELL_DATA: 0,
                NX_CELL_TOP: 1,
                NX_CELL_LEFT: 2
            },
            MatchingFieldMode: {
                MATCHINGFIELDMODE_MATCH_ALL: 0,
                MATCHINGFIELDMODE_MATCH_ONE: 1
            },
            ExtEngineDataType: {
                NX_EXT_DATATYPE_STRING: 0,
                NX_EXT_DATATYPE_DOUBLE: 1,
                NX_EXT_DATATYPE_BOTH: 2
            },
            ExtEngineFunctionType: {
                NX_EXT_FUNCTIONTYPE_SCALAR: 0,
                NX_EXT_FUNCTIONTYPE_AGGR: 1,
                NX_EXT_FUNCTIONTYPE_TENSOR: 2
            },
            ExtEngineMsgType: {
                NX_EXT_MSGTYPE_FUNCTION_CALL: 1,
                NX_EXT_MSGTYPE_SCRIPT_CALL: 2,
                NX_EXT_MSGTYPE_RETURN_VALUE: 3,
                NX_EXT_MSGTYPE_RETURN_MULTIPLE: 4,
                NX_EXT_MSGTYPE_RETURN_ERROR: 5
            }
        },
        version: "3.2"
    }
}), define("extensions/cl-custom-report/lib/js/dialogs/app-on-demand-dialog/template.ng.html", [], function () {
    return '<lui-dialog id="print-dialog" tcl="print-image-settings">\r\n  <lui-dialog-header>\r\n    <lui-dialog-title q-translation="{{input.title}}"></lui-dialog-title>\r\n  </lui-dialog-header>\r\n  <lui-dialog-body class="print-dialog">\r\n    <div ng-hide="hideAppNameInput">\r\n      <div class="section-title">New App Name:</div>\r\n      <div class="print-image">\r\n        <input class="lui-input" ng-model="input.exportAppName" required/>\r\n      </div>\r\n    </div>\r\n    </div>\r\n    <div ng-if="showCreateMasterItems">\r\n      <div class="section-title">Create master items:</div>\r\n      <label class="lui-checkbox" style="margin-bottom: 5px;">\r\n        <input class="lui-checkbox__input" type="checkbox" aria-label="Label" ng-model="input.createDimensions" />\r\n        <div class="lui-checkbox__check-wrap">\r\n          <span class="lui-checkbox__check"></span>\r\n          <span class="lui-checkbox__check-text">Create Dimensions</span>\r\n        </div>\r\n      </label>\r\n      <label class="lui-checkbox" style="margin-bottom: 5px;">\r\n        <input class="lui-checkbox__input" type="checkbox" aria-label="Label" ng-model="input.createMeasures" />\r\n        <div class="lui-checkbox__check-wrap">\r\n          <span class="lui-checkbox__check"></span>\r\n          <span class="lui-checkbox__check-text">Create Measures</span>\r\n        </div>\r\n      </label>\r\n    </div>\r\n    <div ng-if="state === states.PENDING" class="loading-screen">\r\n      <div class="spinner" style="margin-top: 20px;">\r\n        <div class="qv-loader"></div>\r\n      </div>\r\n      <div class="qv-loader-text qv-fade-in" style="color: #595959;" ng-bind="pendingMessage"></div>\r\n    </div>\r\n    <div ng-if="state === states.COMPLETED">\r\n      <div>\r\n        <p class="pb-10">\r\n          <span ng-bind="completedMessage"></span>\r\n        </p>\r\n        <p class="pb-10">\r\n          <a ng-href="{{exportUrl}}" target="_blank" ng-bind="exportUrlMessage"></a>\r\n        </p>\r\n      </div>\r\n    </div>\r\n    <div ng-if="state === states.TIMEOUT">\r\n      <div class="section">\r\n        <p class="dm-p" q-translation="Print.Failed.TimeoutMessage"></p>\r\n      </div>\r\n    </div>\r\n    <div ng-if="state === states.FAILED">\r\n      <div class="section">\r\n        <p class="dm-p" style="color: red;" ng-bind="errorMessage"></p>\r\n      </div>\r\n    </div>\r\n  </lui-dialog-body>\r\n  <lui-dialog-footer>\r\n    <lui-button ng-click="$event.preventDefault(); close()" name="cancel" q-translation="Common.Cancel" tid="print-cancel"></lui-button>\r\n    <lui-button ng-hide="hideConfirm" ng-click="$event.preventDefault(); confirm(input)" name="confirm" autofocus q-translation="Print.Download"\r\n      ng-disabled="state === states.PENDING" tid="print-export"></lui-button>\r\n  </lui-dialog-footer>\r\n</lui-dialog>\r\n'
}), define("extensions/cl-custom-report/lib/js/services/cache-service/make-cache-service", [], function () {
    return function (e) {
        var t = e.constants,
            a = "",
            o = {},
            r = function (e) {
                return o[a].get(e)
            };
        return {
            getStorageTokenId: function (e) {
                return t.STORAGE_ID_PREFIX + e
            },
            isCacheValid: function (e) {
                if (! function (e) {
                    try {
                        JSON.parse(e)
                    } catch (e) {
                        return !1
                    }
                    return !0
                }(e)) return !1;
                var t = JSON.parse(e);
                return !!(t && t.states && t.options)
            },
            getDefaultCache: function () {
                return {
                    options: {
                        fieldsAndSortbarVisible: !0,
                        activeReportId: null
                    },
                    states: {}
                }
            },
            setStorageType: function (e) {
                a = e
            },
            storageTypes: o,
            storageType: a,
            registerStorageType: function (e) {
                var t = e.type,
                    n = e.name;
                o[n] = t
            },
            getCache: r,
            getCachedState: function (e, t) {
                return r(e).states[t]
            },
            getCachedOptions: function (e) {
                return r(e).options
            },
            storeState: function (e, t) {
                var n = r(e);
                n.states[t.qId] = t, o[a].set(e, n), o.variable && "variable" !== a && o.variable.set(e, n)
            },
            storeOptions: function (e, t) {
                var n = r(e);
                n.options = t, o[a].set(e, n), o.variable && "variable" !== a && o.variable.set(e, n)
            },
            storeOptionsAndState: function (e, t, n) {
                var i = r(e);
                i.options = t, i.states[n.qId] = n, o[a].set(e, i), o.variable && "variable" !== a && o.variable.set(e, i)
            },
            reportHasCachedState: function (e, t) {
                return void 0 !== r(e).states[t]
            }
        }
    }
}), define("extensions/cl-custom-report/lib/js/services/cache-service/storage-types/make-session-storage-cache", [], function () {
    return function (e) {
        var n = e.cacheService;
        return {
            get: function (e) {
                var t = sessionStorage.getItem(n.getStorageTokenId(e));
                return n.isCacheValid(t) ? JSON.parse(t) : (void 0, n.getDefaultCache())
            },
            set: function (e, t) {
                sessionStorage.setItem(n.getStorageTokenId(e), JSON.stringify(t))
            }
        }
    }
}), define("extensions/cl-custom-report/lib/js/services/cache-service/storage-types/make-local-storage-cache", [], function () {
    return function (e) {
        var n = e.cacheService;
        return {
            get: function (e) {
                var t = localStorage.getItem(n.getStorageTokenId(e));
                return n.isCacheValid(t) ? JSON.parse(t) : n.getDefaultCache()
            },
            set: function (e, t) {
                localStorage.setItem(n.getStorageTokenId(e), JSON.stringify(t))
            }
        }
    }
}), define("extensions/cl-custom-report/lib/js/managers/report/make-report-manager", [], function () {
    return function (e) {
        var u = e._,
            c = e.$q,
            a = e.util,
            i = e.qvangular,
            t = e.$scope,
            o = e.$timeout,
            n = e.app,
            r = e.cacheService,
            s = e.patchService,
            l = e.$,
            p = e.$element,
            d = {},
            f = {},
            m = {
                layout: t.layout,
                cacheService: r,
                patchService: s,
                isInitialized: t.isInitialized,
                app: n,
                $timeout: o,
                qId: t.qId,
                elementId: "cl-custom-report-id-" + t.qId,
                cacheTokenId: t.cacheTokenId,
                $element: p,
                engineVersion: {}
            },
            h = function () {
                d.title = null, d.qLibraryId = "", d.items = [], d.dimensions = [], d.measures = [], d.qSuppressZero = !1, d.visualizationId = "", d.visualizationType = "", d.visualizationTypes = [], d.visualizationState = {}, d.prevEffectiveProperties = "", f.fieldsAndSortbarVisible = !0, f.cacheId = -1, f.activeMasterObject = null, f.loadedReportId = null, f.masterObjects = [], f.hideSortBar = !1
            };
        h();
        var g = {},
            v = function (t) {
                var e = u.find(d.dimensions, function (e) {
                    return e.cId === t
                });
                return e || ((e = u.find(d.measures, function (e) {
                    return e.cId === t
                })) || void 0)
            },
            q = function () {
                if (f && f.activeMasterObject && f.activeMasterObject.qInfo && f.activeMasterObject.qInfo.qId) return f.activeMasterObject.qInfo.qId
            },
            b = function () {
                u.each(d.dimensions, function (e) {
                    e.selected = u.contains(d.items, e)
                }), u.each(d.measures, function (e) {
                    e.selected = u.contains(d.items, e)
                })
            },
            D = function (e) {
                d.visualizationType && (d.visualizationState[d.visualizationType] = g[d.visualizationType].getState(e, d.visualizationState[d.visualizationType]))
            },
            O = function () {
                d.visualizationState[d.visualizationType] = g[d.visualizationType].getEmptyState(d)
            },
            y = function (i) {
                var a = u.map(i.qHyperCubeDef.qDimensions, function (e) {
                    return e.qDef.cId
                }),
                    e = u.map(i.qHyperCubeDef.qMeasures, function (e) {
                        return e.qDef.cId
                    }),
                    o = [];
                u.each(i.qHyperCubeDef[g[d.visualizationType].columnOrderProperty.value], function (e) {
                    if (e < a.length) {
                        var t = i.qHyperCubeDef.qDimensions[e];
                        t && o.push(t.qDef.cId)
                    } else {
                        var n = i.qHyperCubeDef.qMeasures[e - a.length];
                        n && o.push(n.qDef.cId)
                    }
                }), o.length < a.length + e.length && (o = u.union(o, [].concat(_toConsumableArray(a), _toConsumableArray(e)))), d.items = u.map(o, function (e) {
                    return v(e)
                }), b(), D(i)
            },
            I = function (e) {
                var t = !1;
                if (e && e.visualizationState && (t = d.visualizationType !== e.visualizationType), g[d.visualizationType].applyReportState) g[d.visualizationType].applyReportState({
                    state: e,
                    getItemWithCid: v,
                    updateSelectionState: b,
                    setEmptyVisualizationState: O,
                    report: d
                });
                else {
                    var n = [];
                    e && e.cIds && (u.each(e.cIds, function (e) {
                        var t = v(e);
                        t && n.push(t)
                    }), b()), d.items = n, e && e.visualizationState ? (t = d.visualizationType !== e.visualizationType, d.visualizationState = u.extend(d.visualizationState, e.visualizationState)) : O()
                }
                if (b(), t) return ee(e.visualizationType, e);
                var i = c.defer();
                return i.resolve(), i.promise
            },
            _ = function (e) {
                var t = u.map(d.items, function (e) {
                    return e.cId
                });
                return e = e || d.visualizationType || "table", {
                    qId: d.qLibraryId,
                    title: d.title,
                    cIds: t,
                    visualizationType: e,
                    visualizationState: d.visualizationState
                }
            },
            E = function () {
                return {
                    fieldsAndSortbarVisible: f.fieldsAndSortbarVisible,
                    activeReportId: q(),
                    cacheId: f.cacheId
                }
            },
            C = function (e) {
                d.items = u.without(d.items, e), e.selected = !1
            },
            N = function (e) {
                d.items.push(e), e.selected = !0
            },
            R = function () {
                if (0 < m.layout.props.reports.length) return m.layout.props.reports[0].qLibraryId
            },
            S = function () {
                d.items = []
            },
            T = function (e) {
                var t, n = (t = e, u.find(m.layout.masterLibraryLists.masterObjects.qAppObjectList.qItems, function (e) {
                    return e.qInfo.qId === t
                }));
                n !== f.activeMasterObject && (f.activeMasterObject = n)
            },
            L = function (e) {
                e !== f.loadedReportId && (f.loadedReportId = e)
            },
            x = function () {
                return u.countBy(d.items, "type").dimension
            },
            A = function () {
                0 < m.layout.masterLibraryLists.masterObjects.qAppObjectList.qItems.length ? f.masterObjects = u.filter(m.layout.masterLibraryLists.masterObjects.qAppObjectList.qItems, function (t) {
                    return u.find(m.layout.props.reports, function (e) {
                        return e.qLibraryId === t.qInfo.qId
                    })
                }) : f.masterObjects = []
            },
            M = function (t) {
                var n = ["table", "pivotTable", "combochart"],
                    e = u.find(m.layout.props.reports, function (e) {
                        return e.qLibraryId === t
                    });
                return e ? u.sortBy(e.visualizationTypes, function (e) {
                    return u.indexOf(n, e)
                }) : ["table"]
            },
            P = function (e, t) {
                if (e) return e.model.clearSoftPatches().then(function () {
                    return e.model.applyPatches(t, !0)
                });
                var n = c.defer();
                return n.resolve(), n.promise
            },
            w = function (e) {
                P(d.visual, e).then(function () { }).catch(function (e) {
                    void 0
                })
            },
            V = function () {
                return m.patchService.getPatchesFromReport(d)
            },
            k = function () {
                f.cacheId = (new Date).getTime();
                var e = _(d.visualizationType),
                    t = E();
                m.cacheService.storeOptionsAndState(m.cacheTokenId, t, e)
            },
            F = function (e) {
                var t = c.defer();
                e = e || d.visual;
                var n;
                return n = V(), 0 === d.items.length ? (k(), b(), t.resolve()) : 0 < n.length ? (f.cacheTimer && o.cancel(f.cacheTimer), o(function () {
                    t.resolve(P(e, n))
                }, 0)) : t.resolve(), t.promise
            },
            j = function (e, n) {
                u.each(e, function (t) {
                    var e = u.find(n, function (e) {
                        return t.qLibraryId === e.qInfo.qId
                    });
                    e && (m.engineVersion.beforeFeb2018 ? t.title = e.qMeta.title : void 0 === e.qData.qLabelExpression ? t.title = e.qMeta.title : t.title = e.qData.qLabelExpression)
                })
            },
            G = void 0,
            H = function () {
                return m.$element.find(".ui-draggable-dragging")[0]
            },
            z = function () {
                G = void 0;
                var e = l(m.$element).find("table").find("tr:first");
                1 < e.length && (l(e[1]).children("td[colspan=2]").length !== x() && (void 0, F(d.visual)))
            },
            U = function () {
                "table" === d.visualizationType && Boolean(H()) && void 0 === G && (G = H(), l(G).on("remove", z))
            },
            X = function () {
                var t;
                void 0, U(), f.cacheTimer && o.cancel(f.cacheTimer), (t = c.defer(), m.app.getObject(d.visualizationId).then(function (e) {
                    e.getEffectiveProperties().then(function (e) {
                        t.resolve(e)
                    }).catch(function (e) {
                        void 0
                    })
                }).catch(function (e) {
                    void 0
                }), t.promise).then(function (e) {
                    d.prevEffectiveProperties !== JSON.stringify(e) && (d.prevEffectiveProperties = JSON.stringify(e), y(e), f.cacheTimer = o(function () {
                        k()
                    }, 250))
                })
            },
            Y = function () {
                f.firstVisualisationChange ? (f.firstVisualisationChange = !1, b(), k()) : X()
            },
            W = function (e) {
                e.visual && (e.visual.model.Validated.unbind(Y), e.visual.close(), e.visual = null, e.visualizationId = null)
            },
            B = function (e, t) {
                var n;
                e.visual && W(e), e.visualizationId = t.id, e.visual = t, e.visualizationType = a.getVisualizationType(t.model.genericType), n = t, f.firstVisualisationChange = !0, n.model.Validated.bind(Y)
            },
            $ = function (e, t) {
                var n = {
                    showTitles: !1
                };
                (m.layout.props.exportTitle || void 0 === m.layout.props.exportTitle) && (n.title = e.title);
                var i = a.getQType(t);
                return m.app.visualization.create(i, [], n)
            },
            K = function (t) {
                return void 0 === u.find(m.layout.props.reports, function (e) {
                    return e.qLibraryId === t
                })
            },
            Q = function () {
                m.layout.props.visualizationSettings[d.visualizationType] ? f.hideSortBar = m.layout.props.visualizationSettings[d.visualizationType].hideSortBar : f.hideSortBar = !1
            },
            J = function (e) {
                var t = e.visual,
                    n = e.state;
                return I(n), F(t).then(function () {
                    return Q(), t.show(m.elementId)
                })
            },
            Z = function (e, n) {
                if (!e) {
                    var t = m.cacheService.getCachedOptions(m.cacheTokenId);
                    e = t.activeReportId ? t.activeReportId : R()
                }
                if (K(e) && (e = R(), K(e))) {
                    var i = c.defer();
                    return i.resolve(), i.promoise
                }
                var a, o, r, s, l;
                return !n && m.cacheService.reportHasCachedState(m.cacheTokenId, e) && (n = m.cacheService.getCachedState(m.cacheTokenId, e)), n || (a = e, o = u.find(m.layout.props.reports, function (e) {
                    return e.qLibraryId === a
                }), n = o && o.defaultState ? o.defaultState : _(o.visualizationTypes[0])), (r = e, s = n.visualizationType, l = c.defer(), f.loadedReportId === r && d.visualizationType === s ? l.resolve(d) : (S(), m.$timeout(function () {
                    m.app.getObjectProperties(r).then(function (e) {
                        d.title = e.properties.qMetaDef.title, d.qCalcCond = e.properties.qHyperCubeDef.qCalcCond, d.qCalcCondition = e.properties.qHyperCubeDef.qCalcCondition, d.qLibraryId = r, d.visualizationTypes = M(r), d.visualizationType = s;
                        var t = u.map(e.properties.qHyperCubeDef.qDimensions, function (t) {
                            var e = {
                                description: "",
                                type: "dimension",
                                selected: !1,
                                cId: t.qDef.cId
                            };
                            if (t.qLibraryId) {
                                var n = u.find(m.layout.masterLibraryLists.masterDimensions.qDimensionList.qItems, function (e) {
                                    return e.qInfo.qId === t.qLibraryId
                                }),
                                    i = t;
                                return i.qType = "dimension", e.qLibraryId = t.qLibraryId, void 0 === n.qData.qLabelExpression ? e.title = n.qMeta.title : e.title = n.qData.qLabelExpression, e.description = n.qMeta.description, e.columnOptions = i, e
                            }
                            return e.title = "" === t.qDef.qFieldLabels[0] ? t.qDef.qFieldDefs[0] : t.qDef.qFieldLabels[0], e.columnOptions = t, e
                        });
                        d.dimensions = t, d.qSuppressZero = e.properties.qHyperCubeDef.qSuppressZero;
                        var n = u.map(e.properties.qHyperCubeDef.qMeasures, function (t) {
                            var e = {
                                description: "",
                                type: "measure",
                                selected: !1,
                                cId: t.qDef.cId
                            };
                            if (t.qLibraryId) {
                                var n = u.find(m.layout.masterLibraryLists.masterMeasures.qMeasureList.qItems, function (e) {
                                    return e.qInfo.qId === t.qLibraryId
                                }),
                                    i = t;
                                return i.qType = "measure", e.qLibraryId = t.qLibraryId, void 0 === n.qData.qLabelExpression ? e.title = n.qMeta.title : e.title = n.qData.qLabelExpression, e.description = n.qMeta.description, e.columnOptions = i, e
                            }
                            return e.title = t.qDef.qLabel ? t.qDef.qLabel : t.qDef.qDef, e.columnOptions = t, e
                        });
                        d.measures = n, g[d.visualizationType].loadReport(d, F), T(r), L(r), l.resolve(d)
                    }).catch(function (e) {
                        T(void 0), L(void 0), l.reject(e)
                    })
                }, 500)), l.promise).then(function (t) {
                    return $(t, n.visualizationType).then(function (e) {
                        return B(t, e), J({
                            visual: e,
                            loadedReport: t,
                            state: n
                        })
                    }).catch(function (e) {
                        return void 0, e
                    })
                })
            },
            ee = function (e, t) {
                return g[e].loadReport(d, F), t = t || _(e), $(d, e).then(function (e) {
                    return B(d, e), J({
                        visual: e,
                        loadedReport: d,
                        state: t
                    })
                }).catch(function (e) {
                    void 0
                })
            },
            te = function (e) {
                return {
                    pivotTable: "pivot-table icon-pivot-table",
                    table: "table icon-table",
                    combochart: "combo-chart icon-combo-chart"
                }[e]
            };
        return {
            visualizationTypes: g,
            addVisulizationItemsToContextMenu: function (e, t) {
                g[d.visualizationType].addVisulizationItemsToContextMenu && g[d.visualizationType].addVisulizationItemsToContextMenu(e, t), e.addItem({
                    translation: "Include zero values on/off",
                    tid: "toogle-include-zero-values",
                    select: function () {
                        var e, t;
                        e = V(), (t = u.find(e, function (e) {
                            return "/qHyperCubeDef/qSuppressZero" === e.qPath
                        })) ? t.qValue = "true" === t.qValue ? "false" : "true" : e.push({
                            qPath: "/qHyperCubeDef/qSuppressZero",
                            qValue: "true"
                        }), w(e)
                    }
                })
            },
            registerVisualization: function (e) {
                var t = e.object,
                    n = e.visualizationName;
                g[n] = t
            },
            updateMasterObjects: A,
            onReportsUpdate: function () {
                var t;
                void 0, A(), 0 < m.layout.props.reports.length && m.isInitialized() ? null === f.loadedReportId ? Z() : (t = f.loadedReportId, u.find(m.layout.props.reports, function (e) {
                    return e.qLibraryId === t
                }) ? (d.visualizationTypes = M(f.loadedReportId), u.contains(d.visualizationTypes, d.visualizationType) || ee(d.visualizationTypes[0])) : Z()) : h()
            },
            applyDefaultState: function (e, t) {
                if (t || d.qLibraryId !== e.qId) Z(e.qId, e);
                else {
                    var n = d.visualizationState === e.visualizationState;
                    I(e), n && F()
                }
            },
            applyReportState: I,
            applyPatches: w,
            changeReport: Z,
            changeVisualization: ee,
            updateVisualization: F,
            updateSortBarVisibility: Q,
            clearAll: function () {
                u.each(d.dimensions, function (e) {
                    e.selected = !1
                }), u.each(d.measures, function (e) {
                    e.selected = !1
                }), S()
            },
            clearDimensions: function () {
                u.each(d.dimensions, function (e) {
                    e.selected = !1
                }), d.items = u.filter(d.items, function (e) {
                    return "measure" === e.type
                })
            },
            clearMeasures: function () {
                u.each(d.measures, function (e) {
                    e.selected = !1
                }), d.items = u.filter(d.items, function (e) {
                    return "dimension" === e.type
                })
            },
            switchVisualization: function (e) {
                var t = i.getService("qvContextMenu"),
                    n = t.menu();
                u.each(d.visualizationTypes, function (e) {
                    var t;
                    n.addItem({
                        translation: (t = e, {
                            pivotTable: "Pivot table",
                            table: "Table",
                            combochart: "Combo chart"
                        }[t]),
                        tid: "switch-report",
                        icon: te(e),
                        select: function () {
                            ee(e)
                        }
                    })
                }), t.show(n, {
                    position: {
                        x: e.pageX,
                        y: e.pageY
                    },
                    docking: "BottomRight"
                })
            },
            canSwitchVisualization: function () {
                return 1 < d.visualizationTypes.length
            },
            switchIcon: function () {
                return te(d.visualizationType)
            },
            getActiveReportId: q,
            getVisualizationId: function () {
                return d.visualizationId
            },
            getState: _,
            getStateForReportId: function (e) {
                return m.cacheService.getCachedState(m.cacheTokenId, e)
            },
            getOptions: E,
            getDimensionCount: function () {
                return d.dimensions.length
            },
            getMeasureCount: function () {
                return d.measures.length
            },
            onSort: function (e) {
                if (g[d.visualizationType].onSort) g[d.visualizationType].onSort(e, d);
                else {
                    var t = e.oldIndex,
                        n = e.newIndex;
                    d.items.splice(n, 0, d.items.splice(t, 1)[0])
                }
                F(d.visual)
            },
            removeItem: C,
            addItem: N,
            hasSelections: function () {
                return 0 < d.items.length
            },
            selectItem: function (e) {
                g[d.visualizationType].selectItem ? g[d.visualizationType].selectItem(e, d) : u.contains(d.items, e) ? C(e) : N(e)
            },
            closeActiveReport: W,
            report: d,
            options: f,
            data: m,
            showRequirementMessage: function () {
                return "" === d.visualizationType ? "" : g[d.visualizationType].showRequirementMessage(d.items)
            },
            visualizationRequirementMessage: function () {
                return "" !== d.visualizationType && g[d.visualizationType].visualizationRequirementMessage(d.items)
            },
            reportFilter: function (e) {
                return !g[d.visualizationType].reportFilter || g[d.visualizationType].reportFilter(e, d)
            },
            showSortbar: function () {
                return "" !== d.visualizationType && (!g[d.visualizationType].showSortbar || g[d.visualizationType].showSortbar(d))
            },
            getReport: function (t) {
                var n = {};
                return m.app.getObjectProperties(t).then(function (e) {
                    return n.title = e.properties.qMetaDef.title, n.qLibraryId = t, n.visualizationTypes = M(t), n.dimensions = u.map(e.properties.qHyperCubeDef.qDimensions, function (t) {
                        var e = {
                            description: "",
                            type: "dimension",
                            selected: !1,
                            cId: t.qDef.cId
                        };
                        if (t.qLibraryId) {
                            var n = u.find(m.layout.masterLibraryLists.masterDimensions.qDimensionList.qItems, function (e) {
                                return e.qInfo.qId === t.qLibraryId
                            }),
                                i = t;
                            return i.qType = "dimension", e.qLibraryId = t.qLibraryId, e.title = n.qMeta.title, e.description = n.qMeta.description, e.columnOptions = i, e
                        }
                        return e.title = "" === t.qDef.qFieldLabels[0] ? t.qDef.qFieldDefs[0] : t.qDef.qFieldLabels[0], e.columnOptions = t, e
                    }), n.measures = u.map(e.properties.qHyperCubeDef.qMeasures, function (t) {
                        var e = {
                            description: "",
                            type: "measure",
                            selected: !1,
                            cId: t.qDef.cId
                        };
                        if (t.qLibraryId) {
                            var n = u.find(m.layout.masterLibraryLists.masterMeasures.qMeasureList.qItems, function (e) {
                                return e.qInfo.qId === t.qLibraryId
                            }),
                                i = t;
                            return i.qType = "measure", e.qLibraryId = t.qLibraryId, e.title = n.qMeta.title, e.description = n.qMeta.description, e.columnOptions = i, e
                        }
                        return e.title = t.qDef.qLabel ? t.qDef.qLabel : t.qDef.qDef, e.columnOptions = t, e
                    }), n
                })
            },
            getPatchesFromReport: V,
            updateMasterItemsLabelExpressions: function () {
                j(d.dimensions, m.layout.masterLibraryLists.masterDimensions.qDimensionList.qItems), j(d.measures, m.layout.masterLibraryLists.masterMeasures.qMeasureList.qItems)
            },
            getVisualizationContextMenu: function (e) {
                var t, n, i = (t = m.qId, n = l("#cl-custom-report-container-" + t).find(".qvt-visualization")[0], l(n).scope());
                return i && i.object && i.object.getContextMenu ? i.object.getContextMenu(e, i.object) : e
            },
            setEngineVersion: function (e) {
                var t;
                m.engineVersion = e, m.engineVersion.beforeApril2018 && (t = "columnOrder", u.each(g, function (e) {
                    e.columnOrderProperty.value = t
                }), u.each(s.visualizationPatchers, function (e) {
                    e.columnOrderProperty.value = t
                }))
            }
        }
    }
}), define("extensions/cl-custom-report/lib/js/services/patch-service/make-patch-service", [], function () {
    return function (e) {
        var i = e._,
            a = {},
            n = function (e, t) {
                var n = i.filter(e.items, function (e) {
                    return e.type === t
                });
                return i.map(n, function (e) {
                    return t = e.columnOptions, JSON.parse(JSON.stringify(t));
                    var t
                })
            },
            o = function (e, n) {
                return i.map(e, function (e, t) {
                    return {
                        qOp: "replace",
                        qPath: "" + a[n.visualizationType].getPath(t) + t,
                        qValue: JSON.stringify(e)
                    }
                })
            };
        return {
            getPatchesFromReport: function (e) {
                var t = {
                    qDimensions: n(e, "dimension"),
                    qMeasures: n(e, "measure")
                };
                return a[e.visualizationType].updateDefinitions(t, e), o(t, e)
            },
            registerVisualization: function (e) {
                var t = e.object,
                    n = e.visualizationName;
                a[n] = t
            },
            visualizationPatchers: a,
            generatePatches: o
        }
    }
}), define("extensions/cl-custom-report/lib/js/components/pp-cl-custom-reports/add-cl-custom-report-popover.ng.html", [], function () {
    return '<lui-popover style="min-width: 200px;width: 230px;" \n  align-to="alignTo" \n  position="position" \n  collision="\'flipfit\'" \n  on-close-view="closeAddPopover(event)"\n  qva-outside-ignore-for="{{qvaOutsideIgnoreFor}}">\n  <object-add-typeahead>\n    <lui-popover-header>\n        \n      <div class="lui-input-group">\n            <span class="lui-input-group__item lui-search__search-icon"></span>\n            <input class="lui-search__input lui-input no-focus-highlight  lui-input-group__item" \n              maxlength="255" \n              ng-model="search.term" \n              style="padding-left:4px; width: 174px;"\n              spellcheck="false" \n              type="text" \n              q-placeholder="Common.Search" \n              ng-trim="true" \n              aria-invalid="false"\n              on-escape="onEscape($event)"\n              on-enter="onEnter($event)">\n            <button class="asset-search-panel-clear-search  lui-search__clear-button ng-hide" ng-click="onClear();" ng-hide="!search.term" q-title-translation="Common.Clear" aria-hidden="true">\n              <span class="lui-icon  lui-icon--small  lui-icon--close"></span>\n            </button>\n          \x3c!--/div--\x3e\n      </div>\n    </lui-popover-header>\n    <div class="object-add-popover-content" object-add-typeahead-menu>\n      <div class="object-add-popover-list-header" ng-if="libraryItems.length">Tables</div>\n      <ul class="lui-list">\n        <li class="lui-list__item lui-list__action" ng-repeat="libraryItem in libraryItems" tid="libraryItem-item" object-add-typeahead-item="libraryItem"\n          on-select="addLibraryItem(libraryItem)">\n          <span ng-if="libraryItem.isDrillDown" class="lui-icon lui-icon--select-alternative lui-list__aside" q-title-translation="Tooltip.dimensions.drilldown"></span>\n          <span qve-highlight text="{{libraryItem.label}}" title="{{libraryItem.label}}" query="search.term" class="lui-list__text lui-list__text--ellipsis"></span>\n        </li>\n      </ul>\n      <div class="object-add-popover-nohits" ng-if="!libraryItems.length" q-translation="Toolbox.Search.Nohits"></div>\n    </div>\n  </object-add-typeahead>\n</lui-popover>\n'
}), define("extensions/cl-custom-report/lib/js/components/pp-cl-custom-reports/add-cl-custom-report-popover-factory", ["./add-cl-custom-report-popover.ng.html"], function (n) {
    return function (e) {
        var s = e.deferred,
            l = e.stringNormalization,
            u = e.arrayUtil,
            t = e.supportUtil,
            c = e._;
        return {
            template: n,
            controller: ["$scope", function (o) {
                o.search = {
                    term: ""
                }, o.autoFocus = t.treatAsDesktop(), o.position = o.position ? o.position : "right", o.onEscape = function (e) {
                    "" !== o.search.term ? (e.stopPropagation(), o.search.term = "") : o.close()
                }, o.onEnter = function (e) {
                    "" !== o.search.term ? e.stopPropagation() : o.close()
                }, o.onClear = function () {
                    o.search.term = ""
                };
                var r = null;
                o.$watch("search.term", function (n) {
                    function i() {
                        var e, t;
                        o.libraryItems = (e = r.libraryItems, "" === (t = n) ? e : e.filter(function (e) {
                            return void 0 !== e.value && -1 < l.string(e.value.toLowerCase()).indexOf(l.string(t.toLowerCase()))
                        }))
                    }
                    var e, a, t;
                    r ? i() : s.all({
                        libraryItems: (e = o.app, a = o.reports, (t = e, t.getMasterObjectList ? t.getMasterObjectList().then(function (e) {
                            return e
                        }) : t.getList("masterobject").then(function (e) {
                            return e.layout.qAppObjectList.qItems
                        })).then(function (e) {
                            var t = c.filter(e, function (t) {
                                return "table" === t.qData.visualization && void 0 === c.find(a, function (e) {
                                    return e.qLibraryId === t.qInfo.qId
                                })
                            });
                            return u.copy(t).sort(function (e, t) {
                                return e.qData.name.toLowerCase().localeCompare(t.qData.name.toLowerCase())
                            })
                        }))
                    }).then(function (e) {
                        var t = e.libraryItems.map(function (e) {
                            return {
                                label: e.qMeta.title,
                                value: e.qMeta.title,
                                qLibraryId: e.qInfo.qId,
                                isDrillDown: "H" === e.qData.grouping,
                                activeDimensionIndex: -1
                            }
                        });
                        r = {
                            libraryItems: t
                        }, i()
                    })
                })
            }],
            scope: {
                alignTo: "=",
                app: "=",
                reports: "=",
                addLibraryItem: "=",
                qvaOutsideIgnoreFor: "=",
                close: "=",
                position: "=",
                allowExpressionEditor: "@",
                selectColorByDimIndex: "="
            }
        }
    }
}), define("extensions/cl-custom-report/lib/js/popovers/change-cl-custom-report-popover.ng.html", [], function () {
    return '<lui-popover style="min-width: 200px;width: 230px;" \n  align-to="alignTo" \n  position="position" \n  collision="\'flipfit\'" \n  on-close-view="closePopover(event)"\n  qva-outside-ignore-for="{{qvaOutsideIgnoreFor}}">\n  <object-add-typeahead>\n    <lui-popover-header>\n      <div class="lui-input-group">\n            <span class="lui-input-group__item lui-search__search-icon"></span>\n            <input class="lui-search__input lui-input no-focus-highlight  lui-input-group__item" \n              maxlength="255" \n              ng-model="search.term" \n              style="padding-left:4px; width: 174px;"\n              spellcheck="false" \n              type="text" \n              q-placeholder="Common.Search" \n              ng-trim="true" \n              aria-invalid="false"\n              on-escape="onEscape($event)"\n              on-enter="onEnter($event)">\n            <button class="asset-search-panel-clear-search  lui-search__clear-button ng-hide" ng-click="onClear();" ng-hide="!search.term" q-title-translation="Common.Clear" aria-hidden="true">\n              <span class="lui-icon  lui-icon--small  lui-icon--close"></span>\n            </button>\n          \x3c!--/div--\x3e\n      </div>\n    </lui-popover-header>\n    <div class="cl-change-popover-content" ng-if="filteredPresets.length" object-add-typeahead-menu>\n      <div class="object-add-popover-list-header" >Presets</div>\n      <ul class="lui-list">\n        <li class="lui-list__item lui-list__action" ng-repeat="preset in filteredPresets track by $index" tid="preset-item" object-add-typeahead-item="preset"\n          on-select="applyPreset(preset)">\n          <span qve-highlight text="{{preset.title}}" title="{{preset.title}}" query="search.term" class="lui-list__text lui-list__text--ellipsis"></span>\n        </li>\n      </ul>\n    </div>\n    <div class="cl-change-popover-content" object-add-typeahead-menu>\n      <div class="object-add-popover-list-header" ng-if="filteredReports.length">Data Sets</div>\n      <ul class="lui-list">\n        <li class="lui-list__item lui-list__action" ng-repeat="report in filteredReports track by $index" tid="report-item" object-add-typeahead-item="report"\n          on-select="changeReport(report)">\n          <span qve-highlight text="{{getReportTitle(report)}}" title="{{getReportTitle(report)}}" query="search.term" class="lui-list__text lui-list__text--ellipsis"></span>\n        </li>\n      </ul>\n      <div class="object-add-popover-nohits" ng-if="!filteredReports.length" q-translation="Toolbox.Search.Nohits" style="margin-bottom: 10px"></div>\n    </div>    \n  </object-add-typeahead>\n</lui-popover>\n'
}), define("extensions/cl-custom-report/lib/js/popovers/change-cl-custom-report-popover-factory", ["./change-cl-custom-report-popover.ng.html"], function (i) {
    return function (e) {
        var t = e.supportUtil,
            a = e.stringNormalization,
            n = e._;
        return {
            template: i,
            controller: ["$scope", function (i) {
                i.search = {
                    term: ""
                }, i.filterItems = function (e, n) {
                    return "" === n ? e : e.filter(function (e) {
                        var t = e.title || i.getReportTitle(e);
                        return void 0 !== t && -1 < a.string(t.toLowerCase()).indexOf(a.string(n.toLowerCase()))
                    })
                }, i.updateItemsOnSearch = function (e) {
                    i.filteredReports = i.filterItems(i.reports, e), i.filteredPresets = i.filterItems(i.presets, e)
                }, i.$watch("search.term", function (e) {
                    i.updateItemsOnSearch(e)
                }), i.updateItemsOnSearch(i.search.term), i.getReportTitle = function (t) {
                    return n.find(i.masterObjects, function (e) {
                        return e.qInfo.qId === t.qLibraryId
                    }).qMeta.title
                }, i.autoFocus = t.treatAsDesktop(), i.position = i.position ? i.position : "right", i.onEscape = function (e) {
                    "" !== i.search.title ? (e.stopPropagation(), i.search.title = "") : i.close()
                }, i.onEnter = function (e) {
                    "" !== i.search.title ? e.stopPropagation() : i.close()
                }, i.onClear = function () {
                    i.search.title = ""
                }
            }],
            scope: {
                alignTo: "=",
                app: "=",
                reports: "=",
                presets: "=",
                masterObjects: "=",
                changeReport: "=",
                applyPreset: "=",
                qvaOutsideIgnoreFor: "=",
                closePopover: "=",
                position: "=",
                allowExpressionEditor: "@",
                selectColorByDimIndex: "="
            }
        }
    }
}), define("extensions/cl-custom-report/lib/js/components/pp-cl-about/pp-cl-about.ng.html", [], function () {
    return '<div>\n  <a href="http://climberextensions.com/?utm_source=Custom_Report_Plus&utm_medium=Banner_CustomReport&utm_campaign=Extensions_Panels&utm_content=About_Panel" target="_blank" title="Click here to see more of our awesome extensions!" style="height:0px; background:#591050;">\n\t<div>\n    <svg version="1.1" id="Lager_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n      viewBox="0 0 250 125" style="enable-background:new 0 0 250 125; height: 125px;" xml:space="preserve">\n      <style type="text/css">\n        .cl-about-text {\n\t\t\tfont-family: arial, "FranklinGothic-Book", "QlikView Sans", sans-serif;\n          fill: #ffffff;\n          letter-spacing: 1px;\n        }\n\n        .cl-grey {\n          fill: #3C3C3B;\n        }\n\n\t\t.cl-about-background--plum {fill: #771B6E;}\n   \t\t.cl-about-background--plum-dark {fill: #591050;}\n\n\n\t\t.st1 {\n\t\t\tfill: #771B6E;\n\t\t}\n\n        .st3 {\n          fill: #ffffff;\n        }\n\n        .cl-about-title {\n          font-size: 23px;\n\t\t  text-transform: uppercase;\n        }\n\n        .cl-about-version {\n          font-size: 13px;\n          text-transform: none;\n        }\n\n\t\t.cl-about-version-spacer {\n          font-size: 24px;\n          text-transform: none;\n        }\n\n        .cl-climber-logo-grey {\n          fill: #A6A4A4;\n        }\n\n        .cl-dark-grey {\n          fill: #1D1D1B;\n        }\n\n        .cl-outline {\n          fill: none;\n          stroke: #1D1D1B;\n          stroke-width: 1.248;\n          stroke-miterlimit: 10;\n        }\n\n\t\t .cl-about-url {\n          font-size: 10px;\n        }\n\n        .cl-about-url-link {\n\t\t  text-decoration: underline;\n        }\n\n      </style>\n      <rect y="79.3" class="cl-grey" width="250" height="45.7" />\n      <polygon class="cl-about-background--plum-dark" points="250,81.9 0,81.9 0,0 56.9,0 250,0 " />\n      <text transform="matrix(1 0 0 1 15.1664 43.3424)">\n        <tspan x="0" y="0" class="cl-about-title cl-about-text">custom-report</tspan>\n\t\t<tspan x="0" y="20" class="cl-about-version cl-about-text"> Version 2.3.0  </tspan>\n\t\t<tspan x="76.7" y="20" class="cl-about-version-spacer cl-about-text"> </tspan>\n      </text>\n      <g>\n        <path class="cl-climber-logo-grey" d="M178.8,111.5V111c1.8,0,2.1-0.5,2.1-3.1v-1.3c0-2.7-0.3-3.1-2.1-3.1v-0.6l4-0.7v5.7c0,2.7,0.3,3.1,2.1,3.1v0.6\n\t\tH178.8z" />\n        <path class="cl-climber-logo-grey" d="M196.2,107.8c0,2.8,0.2,3.1,1.7,3.1v0.6h-5.2V111c1.5,0,1.7-0.3,1.7-3.1v-1.6c0-1.7-0.5-2.9-1.9-2.9\n\t\tc-0.9,0-2.8,1-2.8,2.7v1.7c0,2.8,0.2,3.1,1.7,3.1v0.6h-5.7V111c1.8,0,2.1-0.5,2.1-3.1v-1.3c0-2.7-0.3-3.1-2.1-3.1v-0.6l3.6-0.7\n\t\tc0.1,0.3,0.4,1.4,0.5,1.9c0.7-0.9,1.9-1.9,3.5-1.9c1.6,0,2.5,0.8,2.8,2c0.6-0.9,2.2-2,3.7-2c2.4,0,3.1,1.7,3.1,4v1.7\n\t\tc0,2.7,0.3,3.1,2.1,3.1v0.6h-5.7V111c1.5,0,1.7-0.3,1.7-3.1v-1.6c0-1.7-0.5-2.9-1.9-2.9c-0.9,0-2.8,1-2.8,2.7V107.8z" />\n        <path class="cl-climber-logo-grey" d="M233.9,105.1c-0.5,0-0.9-0.5-0.9-1c0-0.6-0.3-0.9-0.9-0.9c-0.6,0-2.1,1-2.1,3.1v1.5c0,2.7,0.3,3.1,2.1,3.1v0.6\n\t\th-6.1V111c1.8,0,2.1-0.5,2.1-3.1v-1.3c0-2.7-0.3-3.1-2.1-3.1v-0.6l3.6-0.7c0.1,0.3,0.4,1.4,0.5,1.9c0.5-1.1,1.7-1.9,2.8-1.9\n\t\tc1.5,0,2.1,1,2.1,1.7C235,104.4,234.8,105.1,233.9,105.1z" />\n        <path class="cl-climber-logo-grey" d="M182.7,99.7c0,0.6-0.5,1.2-1.2,1.2c-0.6,0-1.2-0.5-1.2-1.2c0-0.6,0.5-1.2,1.2-1.2\n\t\tC182.2,98.5,182.7,99.1,182.7,99.7z" />\n        <path class="cl-climber-logo-grey" d="M175.8,97v10.9c0,2.7,0.3,3.1,2.1,3.1v0.6h-6.1V111c1.8,0,2.1-0.5,2.1-3.1l0-10.8c0,0,0.1-1.5-0.3-2.6\n\t\tc-0.4-1.4-1.4-2.4-2.3-2.7c-1-0.3-1.6-0.3-2.2,0.2c-0.7,0.5-0.4,1.7-0.9,2.2c-0.3,0.2-0.8,0.5-1.4,0.1c-0.6-0.5-0.3-1.4-0.3-1.5\n\t\tc0.1-0.4,0.9-1.5,2.9-1.9c2.9-0.5,5.2,1.6,6,3.4C175.8,95.2,175.8,97,175.8,97z" />\n        <path class="cl-climber-logo-grey" d="M171.6,109.5c-0.1-0.1-0.2-0.1-0.3,0l0,0c-0.9,0.8-2,1.2-2.9,1.1c-2.2-0.1-3.2-1.5-3.1-3.7\n\t\tc0.1-2.5,1.3-4.2,2.7-4.2c0.5,0,1,0.3,0.9,1.2c0,0.6,0.4,1.1,1,1.1c0.9,0,1.2-0.7,1.2-1.1c0-1-0.9-2-3.1-2c-2.1-0.1-4.8,1.8-4.9,5\n\t\tc-0.1,2.7,1.6,4.7,4.6,4.8c1.5,0,3-0.6,4.1-1.6l0,0c0,0,0-0.1,0-0.1C171.9,109.8,171.8,109.6,171.6,109.5z" />\n        <path class="cl-climber-logo-grey" d="M208.7,96.2c2.9-1.6,5.4,0,6.3,0.9c0.8,0.9,0.5,1.8-0.2,2.1c-0.6,0.2-1.1,0.1-1.4-0.4\n\t\tc-0.2-0.3-0.1-0.5-0.3-1.4c-0.1-0.5-0.7-1.4-2.4-1c-3.1,0.7-3,4.9-3,4.9v2.4c0.8-1,1.9-1.6,3.3-1.6c2.5,0,4.6,2.2,4.6,4.9\n\t\tc0,2.7-2.1,4.9-4.6,4.9c-1.4,0-2.6-0.7-3.4-1.8l-1.7,1.8v-10.5C205.7,101.5,205.6,97.9,208.7,96.2z M207.6,108.8\n\t\tc0.5,1.3,1.5,2.1,2.7,2.1c2.1,0,3-1.7,3-3.9s-1-3.8-3-3.8c-1.2,0-2.2,0.9-2.7,2.1V108.8z" />\n        <path class="cl-climber-logo-grey" d="M225.6,110.2c0-0.1,0.1-0.1,0.1-0.2c0-0.2-0.2-0.4-0.4-0.4c0,0-0.1,0-0.1,0c0,0-0.1,0.1-0.2,0.1\n\t\tc-0.8,0.6-2,1.1-2.8,1.1c-2.8,0-3.8-2-3.5-4.5h6.5c0.6-2.3-1.3-4.2-3.6-4.2c-2.5,0-4.9,2.1-4.9,4.9c0,2.7,2,4.9,4.9,4.9\n\t\tC223,112,224.6,111.2,225.6,110.2C225.5,110.3,225.6,110.2,225.6,110.2z M221.4,103.2c1.8,0,2.2,1.3,1.9,2.2h-4.4\n\t\tC219.2,104.1,220.2,103.2,221.4,103.2z" />\n      </g>\n      <g>\n        <path class="cl-dark-grey" d="M248.8,1.2v122.5H1.2V1.2H248.8 M250,0H0v125h250V0L250,0z" />\n      </g>\n      <line class="cl-outline" x1="0" y1="81.9" x2="250" y2="81.9" />\n      <text class="cl-about-url cl-about-text" transform="matrix(1 0 0 1 17.1663 99.5838)">\n        <tspan x="0" y="0" >Learn more about our </tspan>\n        <tspan x="0" y="11" >other extensions </tspan>\n        <tspan y="11" class="cl-about-url-link cl-about-text">here!</tspan>\n      </text>\n\t</svg>\n</div>\n  </a>\n</div>\n<div style="text-align:right; padding-right:5px;"></div>\n'
}), define("extensions/cl-custom-report/lib/js/components/pp-cl-about/pp-cl-about", ["./pp-cl-about.ng.html"], function (a) {
    return function (e) {
        var t = e.components,
            n = e.componentUtils,
            i = {
                template: a,
                controller: ["$scope", function (e) {
                    var t = function () {
                        return e.data
                    };
                    n.defineLabel(e, e.definition, t, e.args.handler), n.defineVisible(e, e.args.handler), n.defineReadOnly(e, e.args.handler), n.defineChange(e, e.args.handler), n.defineValue(e, e.definition, t), e.getDescription = function (e) {
                        return "About" === e
                    }, e.href = window.location.href
                }]
            };
        return t.addComponent("pp-cl-custom-report-about", i), i
    }
}), define("extensions/cl-custom-report/lib/js/components/pp-cl-custom-reports/pp-cl-custom-reports.ng.html", [], function () {
    return '<div class="pp-component pp-list-component pp-toplist" tcl="libraryItems">\n  <button class="lui-button  lui-button--block  pp-toplist-add-button" ng-class="{\'lui-active\': adding }" ng-click="addClicked($event)"\n    qv-enter="addClicked($event)" ng-disabled="addDisabled() || !definition.allowAdd" q-translation="{{definition.addTranslation}}"\n    tid="add-libraryItem"></button>\n  <ul class="pp-expandable-list pp-toplist-content pp-dimension-list" pp-sortable="sortableOptions">\n    <li ng-repeat="item in items track by item.id" ng-class="{ \'locked\': item.locked || !definition.allowMove }">\n      <div class="pp-expandable-list-header pp-dimension" ng-click="itemClicked( $event, item )" qva-longtapdrag="enableTouchDrag()"\n      qva-context-menu="openContextMenu($event, item)"\n        ng-class="{ \'expanded\': item.expanded, \'disabled\': item.disabled, \'invalid\': isInvalid( $index ) }" pp-sortable-handle>\n        <span class="toggle-expand  lui-icon  {{ item.expanded ? \'lui-icon--triangle-bottom\' : \'lui-icon--triangle-right\' }}"></span>\n        <span class="text" title="{{item.title()}}">{{item.title()}}</span>\n        <span class="icon icon-handle pp-move-item qv-pp-sortable-handle" ng-if="definition.allowMove" q-title-translation="Common.Move"></span>\n      </div>\n      <div class="pp-expandable-list-content" ng-if="item.expanded && !item.disabled">\n        <div include-pp-component x-component="listItemComponent" x-definition="listItemDefinition" x-data="item.data" x-args="args"></div>\n        <button class="lui-button  lui-button--block  pp-remove-property" ng-click="removeCustomReport(item.index)">\n          <span class="lui-button__text" q-translation="Common.Delete"></span>\n          <span class="lui-button__icon  lui-icon  lui-icon--bin  remove-icon" q-title-translation="Common.Delete"></span>\n      </button>\n      </div>\n    </li>\n  </ul>\n</div>\n'
}), define("extensions/cl-custom-report/lib/js/components/pp-cl-custom-reports/pp-cl-custom-reports", ["./pp-cl-custom-reports.ng.html"], function (n) {
    return function (e) {
        var p = e.$,
            d = e._,
            f = e.touche,
            m = e.components,
            h = e.propertyResolver,
            g = e.resize,
            v = e.addPopover,
            q = e.qvangular,
            t = {
                template: n,
                controller: ["$scope", "$element", "$timeout", "luiPopover", function (r, e, t, n) {
                    var i = null,
                        s = r.args.cache,
                        l = "libraryItem_";

                    function a() {
                        var a = r.definition,
                            e = h.getValue(r.data, r.definition.ref, []),
                            o = {},
                            t = e.map(function (e, t) {
                                var n = e.cId,
                                    i = e.qLibraryId;
                                return {
                                    title: function () {
                                        var e, t;
                                        return void 0 === o[i] && (e = r.args.app, t = i, e.getMasterObjectList().then(function (e) {
                                            return d.find(e, function (e) {
                                                return e.qInfo.qId === t
                                            })
                                        })).then(function (e) {
                                            e && e.qData ? o[i] = e.qData.name : o[i] = null
                                        }), null === o[i] ? "Missing Master Item" : o[i]
                                    },
                                    component: m.getComponent("items"),
                                    definition: a,
                                    data: e,
                                    id: n,
                                    index: t,
                                    expanded: s.get(l + n) || !1,
                                    disabled: !1
                                }
                            });
                        r.items = t
                    }

                    function o(e) {
                        i && (i.close(), i = null), e && p(e.target).hasClass("pp-toplist-add-button") && (f.preventGestures(), r.adding = !1)
                    }

                    function u(e) {
                        r.args.handler.addLibraryItem(e.qLibraryId).then(function (e) {
                            s.put(l + e.cId, !0), r.$emit("saveProperties"), o()
                        })
                    }
                    r.removeCustomReport = function (e) {
                        r.args.handler.removeCustomReport(e).then(function () {
                            r.$emit("saveProperties")
                        })
                    };
                    var c = null;
                    r.openContextMenu = function (e, t) {
                        var n = q.getService("qvContextMenu").menu();
                        n.addItem({
                            translation: "Common.Delete",
                            tid: "delete",
                            select: function () {
                                r.removeCustomReport(t.index)
                            }
                        }), c = q.getService("qvContextMenu").show(n, {
                            position: {
                                x: e.pageX,
                                y: e.pageY
                            },
                            docking: "Top"
                        })
                    }, r.listItemComponent = m.getComponent("items"), r.listItemDefinition = {
                        items: r.definition.items || {},
                        grouped: r.definition.grouped
                    }, r.$watchCollection("data." + r.definition.ref, function () {
                        a()
                    }), r.$watchCollection("data." + r.definition.disabledRef, function () {
                        a()
                    }), r.isInvalid = function () {
                        return !1
                    }, r.itemClicked = function (e, t) {
                        var n = s.get(l + t.data.cId) || !1;
                        t.disabled || (t.expanded = !n, s.put(l + t.data.cId, !n))
                    }, r.addDisabled = function () {
                        return !1
                    }, r.addClicked = function (e) {
                        var t = void 0;
                        r.adding ? o() : (r.addDisabled() || r.adding || (i = n.show({
                            template: v.template,
                            controller: v.controller,
                            alignTo: e.currentTarget,
                            input: {
                                app: r.args.app,
                                reports: r.args.handler.getCustomReports(),
                                closeAddPopover: o,
                                addLibraryItem: u
                            },
                            dock: "bottom",
                            closeOnEscape: !0
                        }), r.adding = !0), i.closing.then(function (e) {
                            e && !p(e.target).hasClass("pp-toplist-add-button") && (r.adding = !1), t = e
                        }), i.closed.then(function () {
                            t || (r.adding = !1), i = null
                        }))
                    }, r.sortableOptions = {
                        disabled: !r.definition.allowMove,
                        onMove: function (e, t) {
                            r.args.handler.moveLibraryItem(e, t).then(function () {
                                r.$emit("saveProperties")
                            })
                        }
                    }, g.on("start", o), r.$on("$destroy", function () {
                        g.off("start", o), c && (c.close(), c = null)
                    })
                }]
            };
        return m.addComponent("cl-custom-report", t), t
    }
}), define("extensions/cl-custom-report/constants", [], function () {
    return {
        STORAGE_ID_PREFIX: "Climber Custom Report - ",
        VARIABLE_NAME_PREFIX: "ClimberCustomReport"
    }
}),
    function (e) {
        "function" == typeof define && define.amd ? define("extensions/cl-custom-report/external/sortable/Sortable", e) : "undefined" != typeof module && void 0 !== module.exports ? module.exports = e() : "undefined" != typeof Package ? Sortable = e() : window.Sortable = e()
    }(function () {
        if ("undefined" == typeof window || void 0 === window.document) return function () {
            throw new Error("Sortable.js requires a window with a document")
        };
        var E, C, N, R, S, T, f, m, L, x, A, u, i, M, l, o, P, e, h = {},
            a = /\s+/g,
            w = "Sortable" + (new Date).getTime(),
            g = window,
            c = g.document,
            r = g.parseInt,
            s = !!("draggable" in c.createElement("div")),
            p = ((e = c.createElement("x")).style.cssText = "pointer-events:auto", "auto" === e.style.pointerEvents),
            V = !1,
            v = Math.abs,
            d = [],
            k = t(function (e, t, n) {
                if (n && t.scroll) {
                    var i, a, o, r, s = t.scrollSensitivity,
                        l = t.scrollSpeed,
                        u = e.clientX,
                        c = e.clientY,
                        p = window.innerWidth,
                        d = window.innerHeight;
                    if (m !== n && (f = t.scroll, m = n, !0 === f)) {
                        f = n;
                        do {
                            if (f.offsetWidth < f.scrollWidth || f.offsetHeight < f.scrollHeight) break
                        } while (f = f.parentNode)
                    }
                    f && (a = (i = f).getBoundingClientRect(), o = (v(a.right - u) <= s) - (v(a.left - u) <= s), r = (v(a.bottom - c) <= s) - (v(a.top - c) <= s)), o || r || (r = (d - c <= s) - (c <= s), ((o = (p - u <= s) - (u <= s)) || r) && (i = g)), h.vx === o && h.vy === r && h.el === i || (h.el = i, h.vx = o, h.vy = r, clearInterval(h.pid), i && (h.pid = setInterval(function () {
                        i === g ? g.scrollTo(g.pageXOffset + o * l, g.pageYOffset + r * l) : (r && (i.scrollTop += r * l), o && (i.scrollLeft += o * l))
                    }, 24)))
                }
            }, 30),
            q = function (e) {
                var t = e.group;
                t && "object" == (void 0 === t ? "undefined" : _typeof(t)) || (t = e.group = {
                    name: t
                }), ["pull", "put"].forEach(function (e) {
                    e in t || (t[e] = !0)
                }), e.groups = " " + t.name + (t.put.join ? " " + t.put.join(" ") : "") + " "
            };

        function b(e, t) {
            if (!e || !e.nodeType || 1 !== e.nodeType) throw "Sortable: `el` must be HTMLElement, and not " + {}.toString.call(e);
            this.el = e, this.options = t = B({}, t), e[w] = this;
            var n = {
                group: Math.random(),
                sort: !0,
                disabled: !1,
                store: null,
                handle: null,
                scroll: !0,
                scrollSensitivity: 30,
                scrollSpeed: 10,
                draggable: /[uo]l/i.test(e.nodeName) ? "li" : ">*",
                ghostClass: "sortable-ghost",
                chosenClass: "sortable-chosen",
                ignore: "a, img",
                filter: null,
                animation: 0,
                setData: function (e, t) {
                    e.setData("Text", t.textContent)
                },
                dropBubble: !1,
                dragoverBubble: !1,
                dataIdAttr: "data-id",
                delay: 0,
                forceFallback: !1,
                fallbackClass: "sortable-fallback",
                fallbackOnBody: !1
            };
            for (var i in n) !(i in t) && (t[i] = n[i]);
            for (var a in q(t), this) "_" === a.charAt(0) && (this[a] = this[a].bind(this));
            this.nativeDraggable = !t.forceFallback && s, D(e, "mousedown", this._onTapStart), D(e, "touchstart", this._onTapStart), this.nativeDraggable && (D(e, "dragover", this), D(e, "dragenter", this)), d.push(this._onDragOver), t.store && this.sort(t.store.get(this))
        }

        function F(e) {
            R && R.state !== e && (G(R, "display", e ? "none" : ""), !e && R.state && S.insertBefore(R, E), R.state = e)
        }

        function j(e, t, n) {
            if (e) {
                n = n || c;
                do {
                    if (">*" === t && e.parentNode === n || W(e, t)) return e
                } while (e !== n && (e = e.parentNode))
            }
            return null
        }

        function D(e, t, n) {
            e.addEventListener(t, n, !1)
        }

        function O(e, t, n) {
            e.removeEventListener(t, n, !1)
        }

        function y(e, t, n) {
            if (e)
                if (e.classList) e.classList[n ? "add" : "remove"](t);
                else {
                    var i = (" " + e.className + " ").replace(a, " ").replace(" " + t + " ", " ");
                    e.className = (i + (n ? " " + t : "")).replace(a, " ")
                }
        }

        function G(e, t, n) {
            var i = e && e.style;
            if (i) {
                if (void 0 === n) return c.defaultView && c.defaultView.getComputedStyle ? n = c.defaultView.getComputedStyle(e, "") : e.currentStyle && (n = e.currentStyle), void 0 === t ? n : n[t];
                t in i || (t = "-webkit-" + t), i[t] = n + ("string" == typeof n ? "" : "px")
            }
        }

        function I(e, t, n) {
            if (e) {
                var i = e.getElementsByTagName(t),
                    a = 0,
                    o = i.length;
                if (n)
                    for (; a < o; a++) n(i[a], a);
                return i
            }
            return []
        }

        function _(e, t, n, i, a, o, r) {
            var s = c.createEvent("Event"),
                l = (e || t[w]).options,
                u = "on" + n.charAt(0).toUpperCase() + n.substr(1);
            s.initEvent(n, !0, !0), s.to = t, s.from = a || t, s.item = i || t, s.clone = R, s.oldIndex = o, s.newIndex = r, t.dispatchEvent(s), l[u] && l[u].call(e, s)
        }

        function H(e, t, n, i, a, o) {
            var r, s, l = e[w],
                u = l.options.onMove;
            return (r = c.createEvent("Event")).initEvent("move", !0, !0), r.to = t, r.from = e, r.dragged = n, r.draggedRect = i, r.related = a || t, r.relatedRect = o || t.getBoundingClientRect(), e.dispatchEvent(r), u && (s = u.call(l, r)), s
        }

        function z(e) {
            e.draggable = !1
        }

        function U() {
            V = !1
        }

        function X(e) {
            for (var t = e.tagName + e.className + e.src + e.href + e.textContent, n = t.length, i = 0; n--;) i += t.charCodeAt(n);
            return i.toString(36)
        }

        function Y(e, t) {
            var n = 0;
            if (!e || !e.parentNode) return -1;
            for (; e && (e = e.previousElementSibling);) "TEMPLATE" !== e.nodeName.toUpperCase() && W(e, t) && n++;
            return n
        }

        function W(e, t) {
            if (e) {
                var n = (t = t.split(".")).shift().toUpperCase(),
                    i = new RegExp("\\s(" + t.join("|") + ")(?=\\s)", "g");
                return !("" !== n && e.nodeName.toUpperCase() != n || t.length && ((" " + e.className + " ").match(i) || []).length != t.length)
            }
            return !1
        }

        function t(e, t) {
            var n, i;
            return function () {
                void 0 === n && (n = arguments, i = this, setTimeout(function () {
                    1 === n.length ? e.call(i, n[0]) : e.apply(i, n), n = void 0
                }, t))
            }
        }

        function B(e, t) {
            if (e && t)
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            return e
        }
        return b.prototype = {
            constructor: b,
            _onTapStart: function (e) {
                var t = this,
                    n = this.el,
                    i = this.options,
                    a = e.type,
                    o = e.touches && e.touches[0],
                    r = (o || e).target,
                    s = r,
                    l = i.filter;
                if (!("mousedown" === a && 0 !== e.button || i.disabled) && (r = j(r, i.draggable, n))) {
                    if (u = Y(r, i.draggable), "function" == typeof l) {
                        if (l.call(this, e, r, this)) return _(t, s, "filter", r, n, u), void e.preventDefault()
                    } else if (l && (l = l.split(",").some(function (e) {
                        if (e = j(s, e.trim(), n)) return _(t, e, "filter", r, n, u), !0
                    }))) return void e.preventDefault();
                    i.handle && !j(s, i.handle, n) || this._prepareDragStart(e, o, r)
                }
            },
            _prepareDragStart: function (e, t, n) {
                var i, a = this,
                    o = a.el,
                    r = a.options,
                    s = o.ownerDocument;
                n && !E && n.parentNode === o && (l = e, S = o, C = (E = n).parentNode, T = E.nextSibling, M = r.group, i = function () {
                    a._disableDelayedDrag(), E.draggable = !0, y(E, a.options.chosenClass, !0), a._triggerDragStart(t)
                }, r.ignore.split(",").forEach(function (e) {
                    I(E, e.trim(), z)
                }), D(s, "mouseup", a._onDrop), D(s, "touchend", a._onDrop), D(s, "touchcancel", a._onDrop), r.delay ? (D(s, "mouseup", a._disableDelayedDrag), D(s, "touchend", a._disableDelayedDrag), D(s, "touchcancel", a._disableDelayedDrag), D(s, "mousemove", a._disableDelayedDrag), D(s, "touchmove", a._disableDelayedDrag), a._dragStartTimer = setTimeout(i, r.delay)) : i())
            },
            _disableDelayedDrag: function () {
                var e = this.el.ownerDocument;
                clearTimeout(this._dragStartTimer), O(e, "mouseup", this._disableDelayedDrag), O(e, "touchend", this._disableDelayedDrag), O(e, "touchcancel", this._disableDelayedDrag), O(e, "mousemove", this._disableDelayedDrag), O(e, "touchmove", this._disableDelayedDrag)
            },
            _triggerDragStart: function (e) {
                e ? (l = {
                    target: E,
                    clientX: e.clientX,
                    clientY: e.clientY
                }, this._onDragStart(l, "touch")) : this.nativeDraggable ? (D(E, "dragend", this), D(S, "dragstart", this._onDragStart)) : this._onDragStart(l, !0);
                try {
                    c.selection ? c.selection.empty() : window.getSelection().removeAllRanges()
                } catch (e) { }
            },
            _dragStarted: function () {
                S && E && (y(E, this.options.ghostClass, !0), _(b.active = this, S, "start", E, S, u))
            },
            _emulateDragOver: function () {
                if (o) {
                    if (this._lastX === o.clientX && this._lastY === o.clientY) return;
                    this._lastX = o.clientX, this._lastY = o.clientY, p || G(N, "display", "none");
                    var e = c.elementFromPoint(o.clientX, o.clientY),
                        t = e,
                        n = " " + this.options.group.name,
                        i = d.length;
                    if (t)
                        do {
                            if (t[w] && -1 < t[w].options.groups.indexOf(n)) {
                                for (; i--;) d[i]({
                                    clientX: o.clientX,
                                    clientY: o.clientY,
                                    target: e,
                                    rootEl: t
                                });
                                break
                            }
                            e = t
                        } while (t = t.parentNode);
                    p || G(N, "display", "")
                }
            },
            _onTouchMove: function (e) {
                if (l) {
                    b.active || this._dragStarted(), this._appendGhost();
                    var t = e.touches ? e.touches[0] : e,
                        n = t.clientX - l.clientX,
                        i = t.clientY - l.clientY,
                        a = e.touches ? "translate3d(" + n + "px," + i + "px,0)" : "translate(" + n + "px," + i + "px)";
                    P = !0, o = t, G(N, "webkitTransform", a), G(N, "mozTransform", a), G(N, "msTransform", a), G(N, "transform", a), e.preventDefault()
                }
            },
            _appendGhost: function () {
                if (!N) {
                    var e, t = E.getBoundingClientRect(),
                        n = G(E),
                        i = this.options;
                    y(N = E.cloneNode(!0), i.ghostClass, !1), y(N, i.fallbackClass, !0), G(N, "top", t.top - r(n.marginTop, 10)), G(N, "left", t.left - r(n.marginLeft, 10)), G(N, "width", t.width), G(N, "height", t.height), G(N, "opacity", "0.8"), G(N, "position", "fixed"), G(N, "zIndex", "100000"), G(N, "pointerEvents", "none"), i.fallbackOnBody && c.body.appendChild(N) || S.appendChild(N), e = N.getBoundingClientRect(), G(N, "width", 2 * t.width - e.width), G(N, "height", 2 * t.height - e.height)
                }
            },
            _onDragStart: function (e, t) {
                var n = e.dataTransfer,
                    i = this.options;
                this._offUpEvents(), "clone" == M.pull && (G(R = E.cloneNode(!0), "display", "none"), S.insertBefore(R, E)), t ? ("touch" === t ? (D(c, "touchmove", this._onTouchMove), D(c, "touchend", this._onDrop), D(c, "touchcancel", this._onDrop)) : (D(c, "mousemove", this._onTouchMove), D(c, "mouseup", this._onDrop)), this._loopId = setInterval(this._emulateDragOver, 50)) : (n && (n.effectAllowed = "move", i.setData && i.setData.call(this, n, E)), D(c, "drop", this), setTimeout(this._dragStarted, 0))
            },
            _onDragOver: function (e) {
                var t, n, i, a, o, r, s = this.el,
                    l = this.options,
                    u = l.group,
                    c = u.put,
                    p = M === u,
                    d = l.sort;
                if (void 0 !== e.preventDefault && (e.preventDefault(), !l.dragoverBubble && e.stopPropagation()), P = !0, M && !l.disabled && (p ? d || (i = !S.contains(E)) : M.pull && c && (M.name === u.name || c.indexOf && ~c.indexOf(M.name))) && (void 0 === e.rootEl || e.rootEl === this.el)) {
                    if (k(e, l, this.el), V) return;
                    if (t = j(e.target, l.draggable, s), n = E.getBoundingClientRect(), i) return F(!0), void (R || T ? S.insertBefore(E, R || T) : d || S.appendChild(E));
                    if (0 === s.children.length || s.children[0] === N || s === e.target && (a = e, o = s.lastElementChild, r = o.getBoundingClientRect(), t = (5 < a.clientY - (r.top + r.height) || 5 < a.clientX - (r.right + r.width)) && o)) {
                        if (t) {
                            if (t.animated) return;
                            m = t.getBoundingClientRect()
                        }
                        F(p), !1 !== H(S, s, E, n, t, m) && (E.contains(s) || (s.appendChild(E), C = s), this._animate(n, E), t && this._animate(m, t))
                    } else if (t && !t.animated && t !== E && void 0 !== t.parentNode[w]) {
                        L !== t && (x = G(L = t), A = G(t.parentNode));
                        var f, m = t.getBoundingClientRect(),
                            h = m.right - m.left,
                            g = m.bottom - m.top,
                            v = /left|right|inline/.test(x.cssFloat + x.display) || "flex" == A.display && 0 === A["flex-direction"].indexOf("row"),
                            q = t.offsetWidth > E.offsetWidth,
                            b = t.offsetHeight > E.offsetHeight,
                            D = .5 < (v ? (e.clientX - m.left) / h : (e.clientY - m.top) / g),
                            O = t.nextElementSibling,
                            y = H(S, s, E, n, t, m);
                        if (!1 !== y) {
                            if (V = !0, setTimeout(U, 30), F(p), 1 === y || -1 === y) f = 1 === y;
                            else if (v) {
                                var I = E.offsetTop,
                                    _ = t.offsetTop;
                                f = I === _ ? t.previousElementSibling === E && !q || D && q : I < _
                            } else f = O !== E && !b || D && b;
                            E.contains(s) || (f && !O ? s.appendChild(E) : t.parentNode.insertBefore(E, f ? O : t)), C = E.parentNode, this._animate(n, E), this._animate(m, t)
                        }
                    }
                }
            },
            _animate: function (e, t) {
                var n = this.options.animation;
                if (n) {
                    var i = t.getBoundingClientRect();
                    G(t, "transition", "none"), G(t, "transform", "translate3d(" + (e.left - i.left) + "px," + (e.top - i.top) + "px,0)"), t.offsetWidth, G(t, "transition", "all " + n + "ms"), G(t, "transform", "translate3d(0,0,0)"), clearTimeout(t.animated), t.animated = setTimeout(function () {
                        G(t, "transition", ""), G(t, "transform", ""), t.animated = !1
                    }, n)
                }
            },
            _offUpEvents: function () {
                var e = this.el.ownerDocument;
                O(c, "touchmove", this._onTouchMove), O(e, "mouseup", this._onDrop), O(e, "touchend", this._onDrop), O(e, "touchcancel", this._onDrop)
            },
            _onDrop: function (e) {
                var t = this.el,
                    n = this.options;
                clearInterval(this._loopId), clearInterval(h.pid), clearTimeout(this._dragStartTimer), O(c, "mousemove", this._onTouchMove), this.nativeDraggable && (O(c, "drop", this), O(t, "dragstart", this._onDragStart)), this._offUpEvents(), e && (P && (e.preventDefault(), !n.dropBubble && e.stopPropagation()), N && N.parentNode.removeChild(N), E && (this.nativeDraggable && O(E, "dragend", this), z(E), y(E, this.options.ghostClass, !1), y(E, this.options.chosenClass, !1), S !== C ? 0 <= (i = Y(E, n.draggable)) && (_(null, C, "sort", E, S, u, i), _(this, S, "sort", E, S, u, i), _(null, C, "add", E, S, u, i), _(this, S, "remove", E, S, u, i)) : (R && R.parentNode.removeChild(R), E.nextSibling !== T && 0 <= (i = Y(E, n.draggable)) && (_(this, S, "update", E, S, u, i), _(this, S, "sort", E, S, u, i))), b.active && (null !== i && -1 !== i || (i = u), _(this, S, "end", E, S, u, i), this.save()))), this._nulling()
            },
            _nulling: function () {
                S = E = C = N = T = R = f = m = l = o = P = i = L = x = M = b.active = null
            },
            handleEvent: function (e) {
                var t = e.type;
                "dragover" === t || "dragenter" === t ? E && (this._onDragOver(e), function (e) {
                    e.dataTransfer && (e.dataTransfer.dropEffect = "move");
                    e.preventDefault()
                }(e)) : "drop" !== t && "dragend" !== t || this._onDrop(e)
            },
            toArray: function () {
                for (var e, t = [], n = this.el.children, i = 0, a = n.length, o = this.options; i < a; i++) j(e = n[i], o.draggable, this.el) && t.push(e.getAttribute(o.dataIdAttr) || X(e));
                return t
            },
            sort: function (e) {
                var i = {},
                    a = this.el;
                this.toArray().forEach(function (e, t) {
                    var n = a.children[t];
                    j(n, this.options.draggable, a) && (i[e] = n)
                }, this), e.forEach(function (e) {
                    i[e] && (a.removeChild(i[e]), a.appendChild(i[e]))
                })
            },
            save: function () {
                var e = this.options.store;
                e && e.set(this)
            },
            closest: function (e, t) {
                return j(e, t || this.options.draggable, this.el)
            },
            option: function (e, t) {
                var n = this.options;
                if (void 0 === t) return n[e];
                n[e] = t, "group" === e && q(n)
            },
            destroy: function () {
                var e = this.el;
                e[w] = null, O(e, "mousedown", this._onTapStart), O(e, "touchstart", this._onTapStart), this.nativeDraggable && (O(e, "dragover", this), O(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function (e) {
                    e.removeAttribute("draggable")
                }), d.splice(d.indexOf(this._onDragOver), 1), this._onDrop(), this.el = e = null
            }
        }, b.utils = {
            on: D,
            off: O,
            css: G,
            find: I,
            is: function (e, t) {
                return !!j(e, t, e)
            },
            extend: B,
            throttle: t,
            closest: j,
            toggleClass: y,
            index: Y
        }, b.create = function (e, t) {
            return new b(e, t)
        }, b.version = "1.4.2", b
    }),
    function (e, t) {
        "object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("extensions/cl-custom-report/external/perfect-scrollbar/perfect-scrollbar.min", t) : e.PerfectScrollbar = t()
    }(void 0, function () {
        function g(e) {
            return getComputedStyle(e)
        }

        function d(e, t) {
            for (var n in t) {
                var i = t[n];
                "number" == typeof i && (i += "px"), e.style[n] = i
            }
            return e
        }

        function f(e) {
            var t = document.createElement("div");
            return t.className = e, t
        }
        var n = "undefined" != typeof Element && (Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector);

        function s(e, t) {
            if (!n) throw new Error("No element matching method supported");
            return n.call(e, t)
        }

        function i(e) {
            e.remove ? e.remove() : e.parentNode && e.parentNode.removeChild(e)
        }

        function a(e, t) {
            return Array.prototype.filter.call(e.children, function (e) {
                return s(e, t)
            })
        }
        var v = {
            main: "ps",
            element: {
                thumb: function (e) {
                    return "ps__thumb-" + e
                },
                rail: function (e) {
                    return "ps__rail-" + e
                },
                consuming: "ps__child--consume"
            },
            state: {
                focus: "ps--focus",
                active: function (e) {
                    return "ps--active-" + e
                },
                scrolling: function (e) {
                    return "ps--scrolling-" + e
                }
            }
        },
            o = {
                x: null,
                y: null
            };

        function q(e, t) {
            var n = e.element.classList,
                i = v.state.scrolling(t);
            n.contains(i) ? clearTimeout(o[t]) : n.add(i)
        }

        function b(e, t) {
            o[t] = setTimeout(function () {
                return e.isAlive && e.element.classList.remove(v.state.scrolling(t))
            }, e.settings.scrollingThreshold)
        }
        var r = function (e) {
            this.element = e, this.handlers = {}
        },
            e = {
                isEmpty: {
                    configurable: !0
                }
            };
        r.prototype.bind = function (e, t) {
            void 0 === this.handlers[e] && (this.handlers[e] = []), this.handlers[e].push(t), this.element.addEventListener(e, t, !1)
        }, r.prototype.unbind = function (t, n) {
            var i = this;
            this.handlers[t] = this.handlers[t].filter(function (e) {
                return !(!n || e === n) || (i.element.removeEventListener(t, e, !1), !1)
            })
        }, r.prototype.unbindAll = function () {
            for (var e in this.handlers) this.unbind(e)
        }, e.isEmpty.get = function () {
            var t = this;
            return Object.keys(this.handlers).every(function (e) {
                return 0 === t.handlers[e].length
            })
        }, Object.defineProperties(r.prototype, e);
        var m = function () {
            this.eventElements = []
        };

        function h(e) {
            if ("function" == typeof window.CustomEvent) return new CustomEvent(e);
            var t = document.createEvent("CustomEvent");
            return t.initCustomEvent(e, !1, !1, void 0), t
        }
        m.prototype.eventElement = function (t) {
            var e = this.eventElements.filter(function (e) {
                return e.element === t
            })[0];
            return e || (e = new r(t), this.eventElements.push(e)), e
        }, m.prototype.bind = function (e, t, n) {
            this.eventElement(e).bind(t, n)
        }, m.prototype.unbind = function (e, t, n) {
            var i = this.eventElement(e);
            i.unbind(t, n), i.isEmpty && this.eventElements.splice(this.eventElements.indexOf(i), 1)
        }, m.prototype.unbindAll = function () {
            this.eventElements.forEach(function (e) {
                return e.unbindAll()
            }), this.eventElements = []
        }, m.prototype.once = function (e, n, i) {
            var a = this.eventElement(e);
            a.bind(n, function e(t) {
                a.unbind(n, e), i(t)
            })
        };
        var t = function (e, t, n, i, a) {
            var o;
            if (void 0 === i && (i = !0), void 0 === a && (a = !1), "top" === t) o = ["contentHeight", "containerHeight", "scrollTop", "y", "up", "down"];
            else {
                if ("left" !== t) throw new Error("A proper axis should be provided");
                o = ["contentWidth", "containerWidth", "scrollLeft", "x", "left", "right"]
            } ! function (e, t, n, i, a) {
                var o = n[0],
                    r = n[1],
                    s = n[2],
                    l = n[3],
                    u = n[4],
                    c = n[5];
                void 0 === i && (i = !0);
                void 0 === a && (a = !1);
                var p = e.element;
                e.reach[l] = null, p[s] < 1 && (e.reach[l] = "start");
                p[s] > e[o] - e[r] - 1 && (e.reach[l] = "end");
                t && (p.dispatchEvent(h("ps-scroll-" + l)), t < 0 ? p.dispatchEvent(h("ps-scroll-" + u)) : 0 < t && p.dispatchEvent(h("ps-scroll-" + c)), i && (q(d = e, f = l), b(d, f)));
                var d, f;
                e.reach[l] && (t || a) && p.dispatchEvent(h("ps-" + l + "-reach-" + e.reach[l]))
            }(e, n, o, i, a)
        };

        function D(e) {
            return parseInt(e, 10) || 0
        }
        var O = {
            isWebKit: "undefined" != typeof document && "WebkitAppearance" in document.documentElement.style,
            supportsTouch: "undefined" != typeof window && ("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            supportsIePointer: "undefined" != typeof navigator && navigator.msMaxTouchPoints,
            isChrome: "undefined" != typeof navigator && /Chrome/i.test(navigator && navigator.userAgent)
        },
            y = function (e) {
                var t = e.element;
                e.containerWidth = t.clientWidth, e.containerHeight = t.clientHeight, e.contentWidth = t.scrollWidth, e.contentHeight = t.scrollHeight, t.contains(e.scrollbarXRail) || (a(t, v.element.rail("x")).forEach(function (e) {
                    return i(e)
                }), t.appendChild(e.scrollbarXRail)), t.contains(e.scrollbarYRail) || (a(t, v.element.rail("y")).forEach(function (e) {
                    return i(e)
                }), t.appendChild(e.scrollbarYRail)), !e.settings.suppressScrollX && e.containerWidth + e.settings.scrollXMarginOffset < e.contentWidth ? (e.scrollbarXActive = !0, e.railXWidth = e.containerWidth - e.railXMarginWidth, e.railXRatio = e.containerWidth / e.railXWidth, e.scrollbarXWidth = l(e, D(e.railXWidth * e.containerWidth / e.contentWidth)), e.scrollbarXLeft = D((e.negativeScrollAdjustment + t.scrollLeft) * (e.railXWidth - e.scrollbarXWidth) / (e.contentWidth - e.containerWidth))) : e.scrollbarXActive = !1, !e.settings.suppressScrollY && e.containerHeight + e.settings.scrollYMarginOffset < e.contentHeight ? (e.scrollbarYActive = !0, e.railYHeight = e.containerHeight - e.railYMarginHeight, e.railYRatio = e.containerHeight / e.railYHeight, e.scrollbarYHeight = l(e, D(e.railYHeight * e.containerHeight / e.contentHeight)), e.scrollbarYTop = D(t.scrollTop * (e.railYHeight - e.scrollbarYHeight) / (e.contentHeight - e.containerHeight))) : e.scrollbarYActive = !1, e.scrollbarXLeft >= e.railXWidth - e.scrollbarXWidth && (e.scrollbarXLeft = e.railXWidth - e.scrollbarXWidth), e.scrollbarYTop >= e.railYHeight - e.scrollbarYHeight && (e.scrollbarYTop = e.railYHeight - e.scrollbarYHeight),
                    function (e, t) {
                        var n = {
                            width: t.railXWidth
                        };
                        t.isRtl ? n.left = t.negativeScrollAdjustment + e.scrollLeft + t.containerWidth - t.contentWidth : n.left = e.scrollLeft;
                        t.isScrollbarXUsingBottom ? n.bottom = t.scrollbarXBottom - e.scrollTop : n.top = t.scrollbarXTop + e.scrollTop;
                        d(t.scrollbarXRail, n);
                        var i = {
                            top: e.scrollTop,
                            height: t.railYHeight
                        };
                        t.isScrollbarYUsingRight ? t.isRtl ? i.right = t.contentWidth - (t.negativeScrollAdjustment + e.scrollLeft) - t.scrollbarYRight - t.scrollbarYOuterWidth : i.right = t.scrollbarYRight - e.scrollLeft : t.isRtl ? i.left = t.negativeScrollAdjustment + e.scrollLeft + 2 * t.containerWidth - t.contentWidth - t.scrollbarYLeft - t.scrollbarYOuterWidth : i.left = t.scrollbarYLeft + e.scrollLeft;
                        d(t.scrollbarYRail, i), d(t.scrollbarX, {
                            left: t.scrollbarXLeft,
                            width: t.scrollbarXWidth - t.railBorderXWidth
                        }), d(t.scrollbarY, {
                            top: t.scrollbarYTop,
                            height: t.scrollbarYHeight - t.railBorderYWidth
                        })
                    }(t, e), e.scrollbarXActive ? t.classList.add(v.state.active("x")) : (t.classList.remove(v.state.active("x")), e.scrollbarXWidth = 0, e.scrollbarXLeft = 0, t.scrollLeft = 0), e.scrollbarYActive ? t.classList.add(v.state.active("y")) : (t.classList.remove(v.state.active("y")), e.scrollbarYHeight = 0, e.scrollbarYTop = 0, t.scrollTop = 0)
            };

        function l(e, t) {
            return e.settings.minScrollbarLength && (t = Math.max(t, e.settings.minScrollbarLength)), e.settings.maxScrollbarLength && (t = Math.min(t, e.settings.maxScrollbarLength)), t
        }

        function u(t, e) {
            var n = e[0],
                i = e[1],
                a = e[2],
                o = e[3],
                r = e[4],
                s = e[5],
                l = e[6],
                u = e[7],
                c = t.element,
                p = null,
                d = null,
                f = null;

            function m(e) {
                c[l] = p + f * (e[a] - d), q(t, u), y(t), e.stopPropagation(), e.preventDefault()
            }

            function h() {
                b(t, u), t.event.unbind(t.ownerDocument, "mousemove", m)
            }
            t.event.bind(t[r], "mousedown", function (e) {
                p = c[l], d = e[a], f = (t[i] - t[n]) / (t[o] - t[s]), t.event.bind(t.ownerDocument, "mousemove", m), t.event.once(t.ownerDocument, "mouseup", h), e.stopPropagation(), e.preventDefault()
            })
        }
        var I = {
            "click-rail": function (n) {
                n.event.bind(n.scrollbarY, "mousedown", function (e) {
                    return e.stopPropagation()
                }), n.event.bind(n.scrollbarYRail, "mousedown", function (e) {
                    var t = e.pageY - window.pageYOffset - n.scrollbarYRail.getBoundingClientRect().top > n.scrollbarYTop ? 1 : -1;
                    n.element.scrollTop += t * n.containerHeight, y(n), e.stopPropagation()
                }), n.event.bind(n.scrollbarX, "mousedown", function (e) {
                    return e.stopPropagation()
                }), n.event.bind(n.scrollbarXRail, "mousedown", function (e) {
                    var t = e.pageX - window.pageXOffset - n.scrollbarXRail.getBoundingClientRect().left > n.scrollbarXLeft ? 1 : -1;
                    n.element.scrollLeft += t * n.containerWidth, y(n), e.stopPropagation()
                })
            },
            "drag-thumb": function (e) {
                u(e, ["containerWidth", "contentWidth", "pageX", "railXWidth", "scrollbarX", "scrollbarXWidth", "scrollLeft", "x"]), u(e, ["containerHeight", "contentHeight", "pageY", "railYHeight", "scrollbarY", "scrollbarYHeight", "scrollTop", "y"])
            },
            keyboard: function (o) {
                var r = o.element;
                o.event.bind(o.ownerDocument, "keydown", function (e) {
                    if (!(e.isDefaultPrevented && e.isDefaultPrevented() || e.defaultPrevented) && (s(r, ":hover") || s(o.scrollbarX, ":focus") || s(o.scrollbarY, ":focus"))) {
                        var t, n = document.activeElement ? document.activeElement : o.ownerDocument.activeElement;
                        if (n) {
                            if ("IFRAME" === n.tagName) n = n.contentDocument.activeElement;
                            else
                                for (; n.shadowRoot;) n = n.shadowRoot.activeElement;
                            if (s(t = n, "input,[contenteditable]") || s(t, "select,[contenteditable]") || s(t, "textarea,[contenteditable]") || s(t, "button,[contenteditable]")) return
                        }
                        var i = 0,
                            a = 0;
                        switch (e.which) {
                            case 37:
                                i = e.metaKey ? -o.contentWidth : e.altKey ? -o.containerWidth : -30;
                                break;
                            case 38:
                                a = e.metaKey ? o.contentHeight : e.altKey ? o.containerHeight : 30;
                                break;
                            case 39:
                                i = e.metaKey ? o.contentWidth : e.altKey ? o.containerWidth : 30;
                                break;
                            case 40:
                                a = e.metaKey ? -o.contentHeight : e.altKey ? -o.containerHeight : -30;
                                break;
                            case 32:
                                a = e.shiftKey ? o.containerHeight : -o.containerHeight;
                                break;
                            case 33:
                                a = o.containerHeight;
                                break;
                            case 34:
                                a = -o.containerHeight;
                                break;
                            case 36:
                                a = o.contentHeight;
                                break;
                            case 35:
                                a = -o.contentHeight;
                                break;
                            default:
                                return
                        }
                        o.settings.suppressScrollX && 0 !== i || o.settings.suppressScrollY && 0 !== a || (r.scrollTop -= a, r.scrollLeft += i, y(o), function (e, t) {
                            var n = r.scrollTop;
                            if (0 === e) {
                                if (!o.scrollbarYActive) return !1;
                                if (0 === n && 0 < t || n >= o.contentHeight - o.containerHeight && t < 0) return !o.settings.wheelPropagation
                            }
                            var i = r.scrollLeft;
                            if (0 === t) {
                                if (!o.scrollbarXActive) return !1;
                                if (0 === i && e < 0 || i >= o.contentWidth - o.containerWidth && 0 < e) return !o.settings.wheelPropagation
                            }
                            return !0
                        }(i, a) && e.preventDefault())
                    }
                })
            },
            wheel: function (m) {
                var h = m.element;

                function e(e) {
                    var t, n, i, a = (n = (t = e).deltaX, i = -1 * t.deltaY, void 0 !== n && void 0 !== i || (n = -1 * t.wheelDeltaX / 6, i = t.wheelDeltaY / 6), t.deltaMode && 1 === t.deltaMode && (n *= 10, i *= 10), n != n && i != i && (n = 0, i = t.wheelDelta), t.shiftKey ? [-i, -n] : [n, i]),
                        o = a[0],
                        r = a[1];
                    if (! function (e, t, n) {
                        if (!O.isWebKit && h.querySelector("select:focus")) return !0;
                        if (!h.contains(e)) return !1;
                        for (var i = e; i && i !== h;) {
                            if (i.classList.contains(v.element.consuming)) return !0;
                            var a = g(i);
                            if ([a.overflow, a.overflowX, a.overflowY].join("").match(/(scroll|auto)/)) {
                                var o = i.scrollHeight - i.clientHeight;
                                if (0 < o && !(0 === i.scrollTop && 0 < n || i.scrollTop === o && n < 0)) return !0;
                                var r = i.scrollLeft - i.clientWidth;
                                if (0 < r && !(0 === i.scrollLeft && t < 0 || i.scrollLeft === r && 0 < t)) return !0
                            }
                            i = i.parentNode
                        }
                        return !1
                    }(e.target, o, r)) {
                        var s, l, u, c, p, d, f = !1;
                        m.settings.useBothWheelAxes ? m.scrollbarYActive && !m.scrollbarXActive ? (r ? h.scrollTop -= r * m.settings.wheelSpeed : h.scrollTop += o * m.settings.wheelSpeed, f = !0) : m.scrollbarXActive && !m.scrollbarYActive && (o ? h.scrollLeft += o * m.settings.wheelSpeed : h.scrollLeft -= r * m.settings.wheelSpeed, f = !0) : (h.scrollTop -= r * m.settings.wheelSpeed, h.scrollLeft += o * m.settings.wheelSpeed), y(m), (f = f || (s = o, l = r, u = 0 === h.scrollTop, c = h.scrollTop + h.offsetHeight === h.scrollHeight, p = 0 === h.scrollLeft, d = h.scrollLeft + h.offsetWidth === h.offsetWidth, !(Math.abs(l) > Math.abs(s) ? u || c : p || d) || !m.settings.wheelPropagation)) && !e.ctrlKey && (e.stopPropagation(), e.preventDefault())
                    }
                }
                void 0 !== window.onwheel ? m.event.bind(h, "wheel", e) : void 0 !== window.onmousewheel && m.event.bind(h, "mousewheel", e)
            },
            touch: function (s) {
                if (O.supportsTouch || O.supportsIePointer) {
                    var l = s.element,
                        u = {},
                        c = 0,
                        p = {},
                        n = null;
                    O.supportsTouch ? (s.event.bind(l, "touchstart", e), s.event.bind(l, "touchmove", t), s.event.bind(l, "touchend", i)) : O.supportsIePointer && (window.PointerEvent ? (s.event.bind(l, "pointerdown", e), s.event.bind(l, "pointermove", t), s.event.bind(l, "pointerup", i)) : window.MSPointerEvent && (s.event.bind(l, "MSPointerDown", e), s.event.bind(l, "MSPointerMove", t), s.event.bind(l, "MSPointerUp", i)))
                }

                function d(e, t) {
                    l.scrollTop -= t, l.scrollLeft -= e, y(s)
                }

                function f(e) {
                    return e.targetTouches ? e.targetTouches[0] : e
                }

                function m(e) {
                    return !(e.pointerType && "pen" === e.pointerType && 0 === e.buttons || (!e.targetTouches || 1 !== e.targetTouches.length) && (!e.pointerType || "mouse" === e.pointerType || e.pointerType === e.MSPOINTER_TYPE_MOUSE))
                }

                function e(e) {
                    if (m(e)) {
                        var t = f(e);
                        u.pageX = t.pageX, u.pageY = t.pageY, c = (new Date).getTime(), null !== n && clearInterval(n)
                    }
                }

                function t(e) {
                    if (m(e)) {
                        var t = f(e),
                            n = {
                                pageX: t.pageX,
                                pageY: t.pageY
                            },
                            i = n.pageX - u.pageX,
                            a = n.pageY - u.pageY;
                        if (function (e, t, n) {
                            if (!l.contains(e)) return !1;
                            for (var i = e; i && i !== l;) {
                                if (i.classList.contains(v.element.consuming)) return !0;
                                var a = g(i);
                                if ([a.overflow, a.overflowX, a.overflowY].join("").match(/(scroll|auto)/)) {
                                    var o = i.scrollHeight - i.clientHeight;
                                    if (0 < o && !(0 === i.scrollTop && 0 < n || i.scrollTop === o && n < 0)) return !0;
                                    var r = i.scrollLeft - i.clientWidth;
                                    if (0 < r && !(0 === i.scrollLeft && t < 0 || i.scrollLeft === r && 0 < t)) return !0
                                }
                                i = i.parentNode
                            }
                            return !1
                        }(e.target, i, a)) return;
                        d(i, a), u = n;
                        var o = (new Date).getTime(),
                            r = o - c;
                        0 < r && (p.x = i / r, p.y = a / r, c = o),
                            function (e, t) {
                                var n = l.scrollTop,
                                    i = l.scrollLeft,
                                    a = Math.abs(e),
                                    o = Math.abs(t);
                                if (a < o) {
                                    if (t < 0 && n === s.contentHeight - s.containerHeight || 0 < t && 0 === n) return 0 === window.scrollY && 0 < t && O.isChrome
                                } else if (o < a && (e < 0 && i === s.contentWidth - s.containerWidth || 0 < e && 0 === i)) return !0;
                                return !0
                            }(i, a) && e.preventDefault()
                    }
                }

                function i() {
                    s.settings.swipeEasing && (clearInterval(n), n = setInterval(function () {
                        s.isInitialized ? clearInterval(n) : p.x || p.y ? Math.abs(p.x) < .01 && Math.abs(p.y) < .01 ? clearInterval(n) : (d(30 * p.x, 30 * p.y), p.x *= .8, p.y *= .8) : clearInterval(n)
                    }, 10))
                }
            }
        },
            c = function (e, t) {
                var n = this;
                if (void 0 === t && (t = {}), "string" == typeof e && (e = document.querySelector(e)), !e || !e.nodeName) throw new Error("no element is specified to initialize PerfectScrollbar");
                for (var i in (this.element = e).classList.add(v.main), this.settings = {
                    handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
                    maxScrollbarLength: null,
                    minScrollbarLength: null,
                    scrollingThreshold: 1e3,
                    scrollXMarginOffset: 0,
                    scrollYMarginOffset: 0,
                    suppressScrollX: !1,
                    suppressScrollY: !1,
                    swipeEasing: !0,
                    useBothWheelAxes: !1,
                    wheelPropagation: !1,
                    wheelSpeed: 1
                }, t) n.settings[i] = t[i];
                this.containerWidth = null, this.containerHeight = null, this.contentWidth = null, this.contentHeight = null;
                var a, o, r = function () {
                    return e.classList.add(v.state.focus)
                },
                    s = function () {
                        return e.classList.remove(v.state.focus)
                    };
                this.isRtl = "rtl" === g(e).direction, this.isNegativeScroll = (o = e.scrollLeft, e.scrollLeft = -1, a = e.scrollLeft < 0, e.scrollLeft = o, a), this.negativeScrollAdjustment = this.isNegativeScroll ? e.scrollWidth - e.clientWidth : 0, this.event = new m, this.ownerDocument = e.ownerDocument || document, this.scrollbarXRail = f(v.element.rail("x")), e.appendChild(this.scrollbarXRail), this.scrollbarX = f(v.element.thumb("x")), this.scrollbarXRail.appendChild(this.scrollbarX), this.scrollbarX.setAttribute("tabindex", 0), this.event.bind(this.scrollbarX, "focus", r), this.event.bind(this.scrollbarX, "blur", s), this.scrollbarXActive = null, this.scrollbarXWidth = null, this.scrollbarXLeft = null;
                var l = g(this.scrollbarXRail);
                this.scrollbarXBottom = parseInt(l.bottom, 10), isNaN(this.scrollbarXBottom) ? (this.isScrollbarXUsingBottom = !1, this.scrollbarXTop = D(l.top)) : this.isScrollbarXUsingBottom = !0, this.railBorderXWidth = D(l.borderLeftWidth) + D(l.borderRightWidth), d(this.scrollbarXRail, {
                    display: "block"
                }), this.railXMarginWidth = D(l.marginLeft) + D(l.marginRight), d(this.scrollbarXRail, {
                    display: ""
                }), this.railXWidth = null, this.railXRatio = null, this.scrollbarYRail = f(v.element.rail("y")), e.appendChild(this.scrollbarYRail), this.scrollbarY = f(v.element.thumb("y")), this.scrollbarYRail.appendChild(this.scrollbarY), this.scrollbarY.setAttribute("tabindex", 0), this.event.bind(this.scrollbarY, "focus", r), this.event.bind(this.scrollbarY, "blur", s), this.scrollbarYActive = null, this.scrollbarYHeight = null, this.scrollbarYTop = null;
                var u, c, p = g(this.scrollbarYRail);
                this.scrollbarYRight = parseInt(p.right, 10), isNaN(this.scrollbarYRight) ? (this.isScrollbarYUsingRight = !1, this.scrollbarYLeft = D(p.left)) : this.isScrollbarYUsingRight = !0, this.scrollbarYOuterWidth = this.isRtl ? (u = this.scrollbarY, D((c = g(u)).width) + D(c.paddingLeft) + D(c.paddingRight) + D(c.borderLeftWidth) + D(c.borderRightWidth)) : null, this.railBorderYWidth = D(p.borderTopWidth) + D(p.borderBottomWidth), d(this.scrollbarYRail, {
                    display: "block"
                }), this.railYMarginHeight = D(p.marginTop) + D(p.marginBottom), d(this.scrollbarYRail, {
                    display: ""
                }), this.railYHeight = null, this.railYRatio = null, this.reach = {
                    x: e.scrollLeft <= 0 ? "start" : e.scrollLeft >= this.contentWidth - this.containerWidth ? "end" : null,
                    y: e.scrollTop <= 0 ? "start" : e.scrollTop >= this.contentHeight - this.containerHeight ? "end" : null
                }, this.isAlive = !0, this.settings.handlers.forEach(function (e) {
                    return I[e](n)
                }), this.lastScrollTop = e.scrollTop, this.lastScrollLeft = e.scrollLeft, this.event.bind(this.element, "scroll", function (e) {
                    return n.onScroll(e)
                }), y(this)
            };
        return c.prototype.update = function () {
            this.isAlive && (this.negativeScrollAdjustment = this.isNegativeScroll ? this.element.scrollWidth - this.element.clientWidth : 0, d(this.scrollbarXRail, {
                display: "block"
            }), d(this.scrollbarYRail, {
                display: "block"
            }), this.railXMarginWidth = D(g(this.scrollbarXRail).marginLeft) + D(g(this.scrollbarXRail).marginRight), this.railYMarginHeight = D(g(this.scrollbarYRail).marginTop) + D(g(this.scrollbarYRail).marginBottom), d(this.scrollbarXRail, {
                display: "none"
            }), d(this.scrollbarYRail, {
                display: "none"
            }), y(this), t(this, "top", 0, !1, !0), t(this, "left", 0, !1, !0), d(this.scrollbarXRail, {
                display: ""
            }), d(this.scrollbarYRail, {
                display: ""
            }))
        }, c.prototype.onScroll = function (e) {
            this.isAlive && (y(this), t(this, "top", this.element.scrollTop - this.lastScrollTop), t(this, "left", this.element.scrollLeft - this.lastScrollLeft), this.lastScrollTop = this.element.scrollTop, this.lastScrollLeft = this.element.scrollLeft)
        }, c.prototype.destroy = function () {
            this.isAlive && (this.event.unbindAll(), i(this.scrollbarX), i(this.scrollbarY), i(this.scrollbarXRail), i(this.scrollbarYRail), this.removePsClasses(), this.element = null, this.scrollbarX = null, this.scrollbarY = null, this.scrollbarXRail = null, this.scrollbarYRail = null, this.isAlive = !1)
        }, c.prototype.removePsClasses = function () {
            this.element.className = this.element.className.split(" ").filter(function (e) {
                return !e.match(/^ps([-_].+|)$/)
            }).join(" ")
        }, c
    }),
    function (e, t) {
        "object" == ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("extensions/cl-custom-report/external/enigmajs/enigma.min", t) : e.enigma = t()
    }(void 0, function () {
        var s = {};

        function i() {
            i.init.call(this)
        }
        s.isObject = function (e) {
            return "object" == (void 0 === e ? "undefined" : _typeof(e)) && null !== e
        }, s.isNumber = function (e) {
            return "number" == typeof e
        }, s.isUndefined = function (e) {
            return void 0 === e
        }, s.isFunction = function (e) {
            return "function" == typeof e
        };
        var n = i;
        (i.EventEmitter = i).prototype._events = void 0, i.prototype._maxListeners = void 0, i.defaultMaxListeners = 10, i.init = function () {
            this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
        }, i.prototype.setMaxListeners = function (e) {
            if (!s.isNumber(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
            return this._maxListeners = e, this
        }, i.prototype.emit = function (e) {
            var t, n, i, a, o, r;
            if (this._events || (this._events = {}), "error" === e && !this._events.error) throw (t = arguments[1]) instanceof Error ? t : Error('Uncaught, unspecified "error" event.');
            if (n = this._events[e], s.isUndefined(n)) return !1;
            if (s.isFunction(n)) switch (arguments.length) {
                case 1:
                    n.call(this);
                    break;
                case 2:
                    n.call(this, arguments[1]);
                    break;
                case 3:
                    n.call(this, arguments[1], arguments[2]);
                    break;
                default:
                    for (i = arguments.length, a = new Array(i - 1), o = 1; o < i; o++) a[o - 1] = arguments[o];
                    n.apply(this, a)
            } else if (s.isObject(n)) {
                for (i = arguments.length, a = new Array(i - 1), o = 1; o < i; o++) a[o - 1] = arguments[o];
                for (i = (r = n.slice()).length, o = 0; o < i; o++) r[o].apply(this, a)
            } return !0
        }, i.prototype.on = i.prototype.addListener = function (e, t) {
            var n;
            if (!s.isFunction(t)) throw TypeError("listener must be a function");
            return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, s.isFunction(t.listener) ? t.listener : t), this._events[e] ? s.isObject(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, s.isObject(this._events[e]) && !this._events[e].warned && (n = s.isUndefined(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners) && 0 < n && this._events[e].length > n && (this._events[e].warned = !0, s.isFunction(console.error) && void 0, s.isFunction(console.trace) && void 0), this
        }, i.prototype.once = function (e, t) {
            if (!s.isFunction(t)) throw TypeError("listener must be a function");
            var n = !1;

            function i() {
                this.removeListener(e, i), n || (n = !0, t.apply(this, arguments))
            }
            return i.listener = t, this.on(e, i), this
        }, i.prototype.removeListener = function (e, t) {
            var n, i, a, o;
            if (!s.isFunction(t)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[e]) return this;
            if (a = (n = this._events[e]).length, i = -1, n === t || s.isFunction(n.listener) && n.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
            else if (s.isObject(n)) {
                for (o = a; 0 < o--;)
                    if (n[o] === t || n[o].listener && n[o].listener === t) {
                        i = o;
                        break
                    } if (i < 0) return this;
                1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(i, 1), this._events.removeListener && this.emit("removeListener", e, t)
            }
            return this
        }, i.prototype.removeAllListeners = function (e) {
            var t, n;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
            if (0 === arguments.length) {
                for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                return this.removeAllListeners("removeListener"), this._events = {}, this
            }
            if (n = this._events[e], s.isFunction(n)) this.removeListener(e, n);
            else if (Array.isArray(n))
                for (; n.length;) this.removeListener(e, n[n.length - 1]);
            return delete this._events[e], this
        }, i.prototype.listeners = function (e) {
            return this._events && this._events[e] ? s.isFunction(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
        }, i.listenerCount = function (e, t) {
            return e._events && e._events[t] ? s.isFunction(e._events[t]) ? 1 : e._events[t].length : 0
        };
        var u = {
            mixin: function (t) {
                Object.keys(n.prototype).forEach(function (e) {
                    t[e] = n.prototype[e]
                }), n.init(t)
            }
        },
            r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
                return void 0 === e ? "undefined" : _typeof(e)
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : void 0 === e ? "undefined" : _typeof(e)
            },
            o = function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            },
            c = function () {
                function i(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }
                return function (e, t, n) {
                    return t && i(e.prototype, t), n && i(e, n), e
                }
            }(),
            p = Object.assign || function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
                }
                return e
            },
            l = function e(t, n, i) {
                null === t && (t = Function.prototype);
                var a = Object.getOwnPropertyDescriptor(t, n);
                if (void 0 === a) {
                    var o = Object.getPrototypeOf(t);
                    return null === o ? void 0 : e(o, n, i)
                }
                if ("value" in a) return a.value;
                var r = a.get;
                return void 0 !== r ? r.call(i) : void 0
            },
            t = function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != (void 0 === t ? "undefined" : _typeof(t)) && "function" != typeof t ? e : t
            },
            d = function (e) {
                if (Array.isArray(e)) {
                    for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                    return n
                }
                return Array.from(e)
            },
            a = 0,
            f = function () {
                function s(e) {
                    o(this, s);
                    var t = this;
                    p(t, e), this.Promise = this.config.Promise, this.definition = this.config.definition, u.mixin(t), a += 1, t.id = a, t.rpc.on("socket-error", t.onRpcError.bind(t)), t.rpc.on("closed", t.onRpcClosed.bind(t)), t.rpc.on("message", t.onRpcMessage.bind(t)), t.rpc.on("notification", t.onRpcNotification.bind(t)), t.rpc.on("traffic", t.onRpcTraffic.bind(t)), t.on("closed", function () {
                        return t.onSessionClosed()
                    })
                }
                return c(s, [{
                    key: "onRpcError",
                    value: function (e) {
                        this.suspendResume.isSuspended || this.emit("socket-error", e)
                    }
                }, {
                    key: "onRpcClosed",
                    value: function (e) {
                        var t = this;
                        this.suspendResume.isSuspended || 1e3 !== e.code && 4e3 !== e.code && (this.config.suspendOnClose ? this.suspendResume.suspend().then(function () {
                            return t.emit("suspended", {
                                initiator: "network"
                            })
                        }) : this.emit("closed", e))
                    }
                }, {
                    key: "onRpcMessage",
                    value: function (e) {
                        var t = this;
                        this.suspendResume.isSuspended || (e.change && e.change.forEach(function (e) {
                            return t.emitHandleChanged(e)
                        }), e.close && e.close.forEach(function (e) {
                            return t.emitHandleClosed(e)
                        }))
                    }
                }, {
                    key: "onRpcNotification",
                    value: function (e) {
                        this.emit("notification:*", e.method, e.params), this.emit("notification:" + e.method, e.params)
                    }
                }, {
                    key: "onRpcTraffic",
                    value: function (e, t) {
                        this.emit("traffic:*", e, t), this.emit("traffic:" + e, t)
                    }
                }, {
                    key: "onSessionClosed",
                    value: function () {
                        this.apis.getApis().forEach(function (e) {
                            e.api.emit("closed"), e.api.removeAllListeners()
                        }), this.apis.clear()
                    }
                }, {
                    key: "getObjectApi",
                    value: function (e) {
                        var t = e.handle,
                            n = e.id,
                            i = e.type,
                            a = e.genericType,
                            o = this.apis.getApi(t);
                        return o || (o = this.definition.generate(i)(this, t, n, a), this.apis.add(t, o), o)
                    }
                }, {
                    key: "open",
                    value: function () {
                        var t = this;
                        if (!this.globalPromise) {
                            var e = {
                                handle: -1,
                                id: "Global",
                                type: "Global",
                                genericType: "Global"
                            };
                            this.globalPromise = this.rpc.open().then(function () {
                                return t.getObjectApi(e)
                            }).then(function (e) {
                                return t.emit("opened"), e
                            })
                        }
                        return this.globalPromise
                    }
                }, {
                    key: "send",
                    value: function (i) {
                        var a = this;
                        if (this.suspendResume.isSuspended) return this.Promise.reject(new Error("Session suspended"));
                        i.id = this.rpc.createRequestId();
                        var e = this.intercept.executeRequests(this, this.Promise.resolve(i)).then(function (e) {
                            var t = p({}, a.config.protocol, e);
                            delete t.outKey;
                            var n = a.rpc.send(t);
                            return e.retry = function () {
                                return a.send(i)
                            }, a.intercept.executeResponses(a, n, e)
                        });
                        return s.addToPromiseChain(e, "requestId", i.id), e
                    }
                }, {
                    key: "suspend",
                    value: function () {
                        var e = this;
                        return this.suspendResume.suspend().then(function () {
                            return e.emit("suspended", {
                                initiator: "manual"
                            })
                        })
                    }
                }, {
                    key: "resume",
                    value: function (e) {
                        var t = this;
                        return this.suspendResume.resume(e).then(function (e) {
                            return t.emit("resumed"), e
                        })
                    }
                }, {
                    key: "close",
                    value: function () {
                        var t = this;
                        return this.globalPromise = void 0, this.rpc.close().then(function (e) {
                            return t.emit("closed", e)
                        })
                    }
                }, {
                    key: "emitHandleChanged",
                    value: function (e) {
                        var t = this.apis.getApi(e);
                        t && t.emit("changed")
                    }
                }, {
                    key: "emitHandleClosed",
                    value: function (e) {
                        var t = this.apis.getApi(e);
                        t && (t.emit("closed"), t.removeAllListeners())
                    }
                }], [{
                    key: "addToPromiseChain",
                    value: function (e, a, o) {
                        e[a] = o;
                        var r = e.then;
                        e.then = function () {
                            for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                            var i = r.apply(this, t);
                            return s.addToPromiseChain(i, a, o), i
                        }
                    }
                }]), s
            }(),
            m = function () {
                function e() {
                    o(this, e), this.entries = {}
                }
                return c(e, [{
                    key: "add",
                    value: function (e, t) {
                        if (e += "", void 0 !== this.entries[e]) throw new Error("Entry already defined with key " + e);
                        this.entries[e] = t
                    }
                }, {
                    key: "set",
                    value: function (e, t) {
                        e += "", this.entries[e] = t
                    }
                }, {
                    key: "remove",
                    value: function (e) {
                        delete this.entries[e]
                    }
                }, {
                    key: "get",
                    value: function (e) {
                        return this.entries[e]
                    }
                }, {
                    key: "getAll",
                    value: function () {
                        var t = this;
                        return Object.keys(this.entries).map(function (e) {
                            return {
                                key: e,
                                value: t.entries[e]
                            }
                        })
                    }
                }, {
                    key: "getKey",
                    value: function (t) {
                        var n = this;
                        return Object.keys(this.entries).filter(function (e) {
                            return n.entries[e] === t
                        })[0]
                    }
                }, {
                    key: "clear",
                    value: function () {
                        this.entries = {}
                    }
                }]), e
            }(),
            h = Object.prototype.hasOwnProperty;

        function g(e) {
            return e.substring(0, 1).toLowerCase() + e.substring(1)
        }
        var v = function () {
            function t(e) {
                o(this, t), this.config = e, this.Promise = e.Promise, this.schema = e.schema, this.mixins = new m, this.types = new m
            }
            return c(t, [{
                key: "registerMixin",
                value: function (e) {
                    var n = this,
                        t = e.types,
                        i = e.type,
                        a = e.extend,
                        o = e.override,
                        r = e.init;
                    Array.isArray(t) || (t = [t]), i && t.push(i);
                    var s = {
                        extend: a,
                        override: o,
                        init: r
                    };
                    t.forEach(function (e) {
                        var t = n.mixins.get(e);
                        t ? t.push(s) : n.mixins.add(e, [s])
                    })
                }
            }, {
                key: "generate",
                value: function (e) {
                    var t = this.types.get(e);
                    if (t) return t;
                    if (!this.schema.structs[e]) throw new Error(e + " not found");
                    var n = this.generateApi(e, this.schema.structs[e]);
                    return this.types.add(e, n), n
                }
            }, {
                key: "generateApi",
                value: function (s, e) {
                    var l = Object.create({});
                    return this.generateDefaultApi(l, e), this.mixinType(s, l), this.mixinNamedParamFacade(l, e),
                        function (e, t, n, i) {
                            var a = this,
                                o = Object.create(l);
                            u.mixin(o), Object.defineProperties(o, {
                                session: {
                                    enumerable: !0,
                                    value: e
                                },
                                handle: {
                                    enumerable: !0,
                                    value: t,
                                    writable: !0
                                },
                                id: {
                                    enumerable: !0,
                                    value: n
                                },
                                type: {
                                    enumerable: !0,
                                    value: s
                                },
                                genericType: {
                                    enumerable: !0,
                                    value: i
                                }
                            });
                            var r = this.mixins.get(s) || [];
                            return i !== s && (this.mixinType(i, o), r = r.concat(this.mixins.get(i) || [])), r.forEach(function (e) {
                                "function" == typeof e.init && e.init({
                                    config: a.config,
                                    api: o
                                })
                            }), o
                        }.bind(this)
                }
            }, {
                key: "generateDefaultApi",
                value: function (n, o) {
                    Object.keys(o).forEach(function (i) {
                        var e = o[i].Out,
                            a = 1 === e.length ? e[0].Name : -1,
                            t = g(i);
                        n[t] = function () {
                            for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                            return this.session.send({
                                handle: this.handle,
                                method: i,
                                params: t,
                                outKey: a
                            })
                        }
                    })
                }
            }, {
                key: "mixinType",
                value: function (r, s) {
                    var e = this.mixins.get(r);
                    e && e.forEach(function (e) {
                        var t = e.extend,
                            n = void 0 === t ? {} : t,
                            i = e.override,
                            o = void 0 === i ? {} : i;
                        Object.keys(o).forEach(function (i) {
                            if ("function" != typeof s[i] || "function" != typeof o[i]) throw new Error("No function to override. Type: " + r + " function: " + i);
                            var a = s[i];
                            s[i] = function () {
                                for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                                return o[i].apply(this, [a.bind(this)].concat(t))
                            }
                        }), Object.keys(n).forEach(function (e) {
                            if ("function" == typeof s[e] && "function" == typeof n[e]) throw new Error("Extend is not allowed for this mixin. Type: " + r + " function: " + e);
                            s[e] = n[e]
                        })
                    })
                }
            }, {
                key: "mixinNamedParamFacade",
                value: function (n, o) {
                    Object.keys(o).forEach(function (e) {
                        var t = g(e),
                            i = n[t],
                            a = o[e].In.reduce(function (e, t) {
                                return e[t.Name] = t.DefaultValue, e
                            }, {});
                        n[t] = function () {
                            for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                            return function (e, t) {
                                for (var n = arguments.length, i = Array(2 < n ? n - 2 : 0), a = 2; a < n; a++) i[a - 2] = arguments[a];
                                return 1 === i.length && "object" === r(i[0]) && Object.keys(i[0]).every(function (e) {
                                    return h.call(t, e)
                                }) && (i = Object.keys(t).map(function (e) {
                                    return i[0][e] || t[e]
                                })), e.apply(this, i)
                            }.apply(this, [i, a].concat(t))
                        }
                    })
                }
            }]), t
        }(),
            q = function () {
                function i(e, t, n) {
                    o(this, i), u.mixin(this), this.id = e, this.resolve = t, this.reject = n
                }
                return c(i, [{
                    key: "resolveWith",
                    value: function (e) {
                        this.resolve(e), this.emit("resolved", this.id)
                    }
                }, {
                    key: "rejectWith",
                    value: function (e) {
                        this.reject(e), this.emit("rejected", this.id)
                    }
                }]), i
            }(),
            b = function () {
                function t(e) {
                    o(this, t), p(this, e), u.mixin(this), this.resolvers = {}, this.requestId = 0, this.openedPromise = void 0
                }
                return c(t, [{
                    key: "open",
                    value: function () {
                        var n = this;
                        if (!(0 < arguments.length && void 0 !== arguments[0] && arguments[0]) && this.openedPromise) return this.openedPromise;
                        try {
                            this.socket = this.createSocket(this.url)
                        } catch (n) {
                            return this.Promise.reject(n)
                        }
                        return this.socket.onopen = this.onOpen.bind(this), this.socket.onclose = this.onClose.bind(this), this.socket.onerror = this.onError.bind(this), this.socket.onmessage = this.onMessage.bind(this), this.openedPromise = new this.Promise(function (e, t) {
                            return n.registerResolver("opened", e, t)
                        }), this.closedPromise = new this.Promise(function (e, t) {
                            return n.registerResolver("closed", e, t)
                        }), this.openedPromise
                    }
                }, {
                    key: "onOpen",
                    value: function () {
                        var e = this;
                        this.resolvers.opened.resolveWith(function () {
                            return e.closedPromise
                        })
                    }
                }, {
                    key: "onClose",
                    value: function (e) {
                        this.emit("closed", e), this.resolvers.closed.resolveWith(e), this.rejectAllOutstandingResolvers({
                            code: -1,
                            message: "Socket closed"
                        })
                    }
                }, {
                    key: "close",
                    value: function () {
                        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 1e3,
                            t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "";
                        return this.socket && (this.socket.close(e, t), this.socket = null), this.closedPromise
                    }
                }, {
                    key: "onError",
                    value: function (e) {
                        this.resolvers.opened ? this.resolvers.opened.rejectWith(e) : this.emit("socket-error", e), this.rejectAllOutstandingResolvers({
                            code: -1,
                            message: "Socket error"
                        })
                    }
                }, {
                    key: "onMessage",
                    value: function (e) {
                        var t = JSON.parse(e.data);
                        this.emit("traffic", "received", t), void 0 !== t.id ? (this.emit("message", t), this.resolvers[t.id].resolveWith(t)) : this.emit(t.params ? "notification" : "message", t)
                    }
                }, {
                    key: "rejectAllOutstandingResolvers",
                    value: function (t) {
                        var n = this;
                        Object.keys(this.resolvers).forEach(function (e) {
                            "opened" !== e && "closed" !== e && n.resolvers[e].rejectWith(t)
                        })
                    }
                }, {
                    key: "unregisterResolver",
                    value: function (e) {
                        this.resolvers[e].removeAllListeners(), delete this.resolvers[e]
                    }
                }, {
                    key: "registerResolver",
                    value: function (e, t, n) {
                        var i = this,
                            a = new q(e, t, n);
                        (this.resolvers[e] = a).on("resolved", function (e) {
                            return i.unregisterResolver(e)
                        }), a.on("rejected", function (e) {
                            return i.unregisterResolver(e)
                        })
                    }
                }, {
                    key: "send",
                    value: function (n) {
                        var i = this;
                        return this.socket && this.socket.readyState === this.socket.OPEN ? (n.id || (n.id = this.createRequestId()), n.jsonrpc = "2.0", new this.Promise(function (e, t) {
                            return i.socket.send(JSON.stringify(n)), i.emit("traffic", "sent", n), i.registerResolver(n.id, e, t)
                        })) : this.Promise.reject(new Error("Not connected"))
                    }
                }, {
                    key: "createRequestId",
                    value: function () {
                        return this.requestId += 1, this.requestId
                    }
                }]), t
            }(),
            D = function () {
                function l(e) {
                    var n = this;
                    o(this, l), p(this, e), this.isSuspended = !1, this.rpc.on("traffic", function (e, t) {
                        "sent" === e && "OpenDoc" === t.method && (n.openDocParams = t.params)
                    })
                }
                return c(l, [{
                    key: "restoreRpcConnection",
                    value: function (t) {
                        var n = this;
                        return this.reopen(5e3).then(function (e) {
                            return "SESSION_CREATED" === e && t ? n.Promise.reject(new Error("Not attached")) : n.Promise.resolve()
                        })
                    }
                }, {
                    key: "restoreGlobal",
                    value: function (e) {
                        var t = this.apis.getApisByType("Global").pop();
                        return e.push(t.api), this.Promise.resolve()
                    }
                }, {
                    key: "restoreDoc",
                    value: function (n, i) {
                        var a = this,
                            o = this.apis.getApisByType("Doc").pop();
                        return o ? this.rpc.send({
                            method: "GetActiveDoc",
                            handle: -1,
                            params: []
                        }).then(function (e) {
                            return e.error && a.openDocParams ? a.rpc.send({
                                method: "OpenDoc",
                                handle: -1,
                                params: a.openDocParams
                            }) : e
                        }).then(function (e) {
                            if (e.error) return n.push(o.api), a.Promise.resolve();
                            var t = e.result.qReturn.qHandle;
                            return o.api.handle = t, i.push(o.api), a.Promise.resolve(o.api)
                        }) : this.Promise.resolve()
                    }
                }, {
                    key: "restoreDocObjects",
                    value: function (i, a, o) {
                        var r = this,
                            s = [],
                            e = this.apis.getApis().map(function (e) {
                                return e.api
                            }).filter(function (e) {
                                return "Global" !== e.type && "Doc" !== e.type
                            });
                        return i ? (e.forEach(function (t) {
                            var e = l.buildGetMethodName(t.type);
                            if (e) {
                                var n = r.rpc.send({
                                    method: e,
                                    handle: i.handle,
                                    params: [t.id]
                                }).then(function (e) {
                                    e.error || !e.result.qReturn.qHandle ? a.push(t) : (t.handle = e.result.qReturn.qHandle, o.push(t))
                                });
                                s.push(n)
                            } else a.push(t)
                        }), this.Promise.all(s)) : (e.forEach(function (e) {
                            return a.push(e)
                        }), this.Promise.resolve())
                    }
                }, {
                    key: "suspend",
                    value: function () {
                        return this.isSuspended = !0, this.rpc.close(4e3)
                    }
                }, {
                    key: "resume",
                    value: function (e) {
                        var t = this,
                            n = [],
                            i = [];
                        return this.restoreRpcConnection(e).then(function () {
                            return t.restoreGlobal(n)
                        }).then(function () {
                            return t.restoreDoc(i, n)
                        }).then(function (e) {
                            return t.restoreDocObjects(e, i, n)
                        }).then(function () {
                            t.isSuspended = !1, t.apis.clear(), i.forEach(function (e) {
                                e.emit("closed"), e.removeAllListeners()
                            }), n.forEach(function (e) {
                                t.apis.add(e.handle, e), "Global" !== e.type && e.emit("changed")
                            })
                        }).catch(function (e) {
                            return t.rpc.close().then(function () {
                                return t.Promise.reject(e)
                            })
                        })
                    }
                }, {
                    key: "reopen",
                    value: function (e) {
                        var t = this,
                            n = void 0,
                            i = void 0,
                            a = !1,
                            o = new this.Promise(function (e) {
                                i = e
                            }),
                            r = function (e) {
                                "OnConnected" === e.method && (clearTimeout(n), i(e.params.qSessionState), a = !0)
                            };
                        return this.rpc.on("notification", r), this.rpc.open(!0).then(function () {
                            return a || (n = setTimeout(function () {
                                return i("SESSION_CREATED")
                            }, e)), o
                        }).then(function (e) {
                            return t.rpc.removeListener("notification", r), e
                        }).catch(function (e) {
                            return t.rpc.removeListener("notification", r), t.Promise.reject(e)
                        })
                    }
                }], [{
                    key: "buildGetMethodName",
                    value: function (e) {
                        return "Field" === e || "Variable" === e ? null : "GenericVariable" === e ? "GetVariableById" : e.replace("Generic", "Get")
                    }
                }]), l
            }(),
            O = "qSuccess";

        function y(e, t, n) {
            return n.qHandle && n.qType ? e.getObjectApi({
                handle: n.qHandle,
                type: n.qType,
                id: n.qGenericId,
                genericType: n.qGenericType
            }) : null === n.qHandle && null === n.qType ? e.config.Promise.reject(new Error("Object not found")) : n
        }
        var I = Object.prototype.hasOwnProperty,
            _ = Object.prototype.toString,
            E = function (e) {
                return "function" == typeof Array.isArray ? Array.isArray(e) : "[object Array]" === _.call(e)
            },
            C = function (e) {
                if (!e || "[object Object]" !== _.call(e)) return !1;
                var t, n = I.call(e, "constructor"),
                    i = e.constructor && e.constructor.prototype && I.call(e.constructor.prototype, "isPrototypeOf");
                if (e.constructor && !n && !i) return !1;
                for (t in e);
                return void 0 === t || I.call(e, t)
            },
            N = function e() {
                var t, n, i, a, o, r, s = arguments[0],
                    l = 1,
                    u = arguments.length,
                    c = !1;
                for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, l = 2), (null == s || "object" != (void 0 === s ? "undefined" : _typeof(s)) && "function" != typeof s) && (s = {}); l < u; ++l)
                    if (null != (t = arguments[l]))
                        for (n in t) i = s[n], s !== (a = t[n]) && (c && a && (C(a) || (o = E(a))) ? (o ? (o = !1, r = i && E(i) ? i : []) : r = i && C(i) ? i : {}, s[n] = e(c, r, a)) : void 0 !== a && (s[n] = a));
                return s
            }.bind(null, !0),
            R = {},
            S = Array.isArray;

        function T(e) {
            return null != e && !Array.isArray(e) && "object" === (void 0 === e ? "undefined" : r(e))
        }

        function L(e) {
            return void 0 === e
        }

        function x(e, t) {
            return "function" == typeof e[t] || "$$" === t.substring(0, 2) || "_" === t.substring(0, 1)
        }

        function A(i, e) {
            var a = e.substring(1).split("/").slice(0, -1),
                o = void 0;
            return a.forEach(function (e, t) {
                if (t !== a.length) {
                    o = +e;
                    var n = isNaN(o) ? {} : [];
                    i[o || e] = L(i[o || e]) ? n : i[e], i = i[o || e]
                }
            }), i
        }

        function M(t, n) {
            var i = !0;
            if (T(t) && T(n)) return Object.keys(t).length === Object.keys(n).length && (Object.keys(t).forEach(function (e) {
                M(t[e], n[e]) || (i = !1)
            }), i);
            if (S(t) && S(n)) {
                if (t.length !== n.length) return !1;
                for (var e = 0, a = t.length; e < a; e += 1)
                    if (!M(t[e], n[e])) return !1;
                return !0
            }
            return t === n
        }
        R.generate = function (a, o, r) {
            r = r || "";
            var s = [];
            return Object.keys(o).forEach(function (e) {
                var t, n = (t = o[e]) ? N({}, {
                    val: t
                }).val : t,
                    c = a[e],
                    i = r + "/" + e;
                M(n, c) || x(o, e) || (L(c) ? s.push({
                    op: "add",
                    path: i,
                    value: n
                }) : T(n) && T(c) ? s = s.concat(R.generate(c, n, i)) : S(n) && S(c) ? s = s.concat(function (e, t, n) {
                    var i = [],
                        a = c.slice(),
                        o = -1;

                    function r(e, t, n) {
                        if (e[n] && L(e[n].qInfo)) return null;
                        if (e[n] && e[n].qInfo.qId === t) return n;
                        for (var i = 0, a = e.length; i < a; i += 1)
                            if (e[i] && e[i].qInfo.qId === t) return i;
                        return -1
                    }
                    if (M(t, a)) return i;
                    if (!L(t[0]) && L(t[0].qInfo)) return i.push({
                        op: "replace",
                        path: n,
                        value: t
                    }), i;
                    for (var s = a.length - 1; 0 <= s; s -= 1) - 1 === (o = r(t, a[s].qInfo && a[s].qInfo.qId, s)) ? (i.push({
                        op: "remove",
                        path: n + "/" + s
                    }), a.splice(s, 1)) : i = i.concat(R.generate(a[s], t[o], n + "/" + s));
                    for (var l = 0, u = t.length; l < u; l += 1) - 1 === (o = r(a, t[l].qInfo && t[l].qInfo.qId)) ? (i.push({
                        op: "add",
                        path: n + "/" + l,
                        value: t[l]
                    }), a.splice(l, 0, t[l])) : o !== l && (i.push({
                        op: "move",
                        path: n + "/" + l,
                        from: n + "/" + o
                    }), a.splice(l, 0, a.splice(o, 1)[0]));
                    return i
                }(0, n, i)) : s.push({
                    op: "replace",
                    path: r + "/" + e,
                    value: n
                }))
            }), Object.keys(a).forEach(function (e) {
                L(o[e]) && !x(a, e) && s.push({
                    op: "remove",
                    path: r + "/" + e
                })
            }), s
        }, R.apply = function (u, e) {
            e.forEach(function (e) {
                var t, n = A(u, e.path),
                    i = e.path.split("/").splice(-1)[0],
                    a = i && isNaN(+i) ? n[i] : n[+i] || n,
                    o = e.from ? e.from.split("/").splice(-1)[0] : null;
                if ("/" === e.path && (n = null, a = u), "add" === e.op || "replace" === e.op)
                    if (S(n)) "-" === i && (i = n.length), n.splice(+i, "add" === e.op ? 0 : 1, e.value);
                    else if (S(a) && S(e.value)) {
                        var r, s = e.value.slice();
                        a.length = 0, (r = a).push.apply(r, d(s))
                    } else if (T(a) && T(e.value)) t = a, Object.keys(t).forEach(function (e) {
                        Object.getOwnPropertyDescriptor(t, e).configurable && !x(t, e) && delete t[e]
                    }), N(a, e.value);
                    else {
                        if (!n) throw new Error("Patchee is not an object we can patch");
                        n[i] = e.value
                    } else if ("move" === e.op) {
                        var l = A(u, e.from);
                        S(n) ? n.splice(+i, 0, l.splice(+o, 1)[0]) : (n[i] = l[o], delete l[o])
                    } else "remove" === e.op && (S(n) ? n.splice(+i, 1) : delete n[i])
            })
        }, R.clone = function (e) {
            return N({}, e)
        }, R.createPatch = function (e, t, n) {
            var i = {
                op: e.toLowerCase(),
                path: n
            };
            return "move" === i.op ? i.from = t : void 0 !== t && (i.value = t), i
        }, R.updateObject = function (e, t) {
            Object.keys(e).length ? R.apply(e, R.generate(e, t)) : N(e, t)
        };
        var P = {},
            w = function (e, t, n, i) {
                var a = function (e, t) {
                    ! function (e) {
                        if (!P[e.id]) {
                            var t = {};
                            P[e.id] = t, e.on("traffic:received", function (e) {
                                return e.close && e.close.forEach(function (e) {
                                    return delete t[e]
                                })
                            }), e.on("closed", function () {
                                return delete P[e.id]
                            })
                        }
                    }(e);
                    var n = P[e.id];
                    return n[t] || (n[t] = new m), n[t]
                }(e, t),
                    o = a.get(n);
                return void 0 === o && (o = Array.isArray(i[0].value) ? [] : {}), i.length && ("/" === i[0].path && "object" !== r(i[0].value) ? o = i[0].value : R.apply(o, i), a.set(n, o)), o
            };

        function V(t, n, e) {
            var i = e.delta,
                a = e.result;
            return i ? (Object.keys(a).forEach(function (e) {
                if (!Array.isArray(a[e])) throw new Error("Unexpected RPC response, expected array of patches");
                a[e] = w(t, n.handle, n.method + "-" + e, a[e])
            }), JSON.parse(JSON.stringify(e))) : e
        }
        V.sessions = P;
        var k = "qReturn",
            F = function () {
                function t(e) {
                    o(this, t), p(this, e), this.request = [{
                        onFulfilled: function (e, t) {
                            var n = e.config.protocol.delta && -1 !== t.outKey && t.outKey !== O;
                            return n && (t.delta = n), t
                        }
                    }].concat(d(this.request || [])), this.response = [{
                        onFulfilled: function (e, t, n) {
                            if (void 0 !== n.error) {
                                var i = n.error,
                                    a = new Error(i.message);
                                return a.code = i.code, a.parameter = i.parameter, e.config.Promise.reject(a)
                            }
                            return n
                        }
                    }, {
                        onFulfilled: V
                    }, {
                        onFulfilled: function (e, t, n) {
                            return n.result
                        }
                    }, {
                        onFulfilled: function (e, t, n) {
                            return "CreateSessionApp" === t.method || "CreateSessionAppFromApp" === t.method ? n[k].qGenericId = n[k].qGenericId || n.qSessionAppId : "GetInteract" === t.method && delete n[k], hasOwnProperty.call(n, k) ? n[k] : -1 !== t.outKey ? n[t.outKey] : n
                        }
                    }].concat(d(this.response || []), [{
                        onFulfilled: y
                    }])
                }
                return c(t, [{
                    key: "executeRequests",
                    value: function (i, e) {
                        var a = this;
                        return this.request.reduce(function (e, t) {
                            var n = t.onFulfilled && t.onFulfilled.bind(a, i);
                            return e.then(n)
                        }, e)
                    }
                }, {
                    key: "executeResponses",
                    value: function (n, e, i) {
                        var a = this;
                        return this.response.reduce(function (e, t) {
                            return e.then(t.onFulfilled && t.onFulfilled.bind(a, n, i), t.onRejected && t.onRejected.bind(a, n, i))
                        }, e)
                    }
                }]), t
            }(),
            j = function (e) {
                function a() {
                    return o(this, a), t(this, (a.__proto__ || Object.getPrototypeOf(a)).apply(this, arguments))
                }
                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + (void 0 === t ? "undefined" : _typeof(t)));
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }(a, m), c(a, [{
                    key: "add",
                    value: function (e, t) {
                        var n = this,
                            i = {
                                api: t
                            };
                        return l(a.prototype.__proto__ || Object.getPrototypeOf(a.prototype), "add", this).call(this, e.toString(), i), t.on("closed", function () {
                            return n.remove(e)
                        }), i
                    }
                }, {
                    key: "getApi",
                    value: function (e) {
                        var t = void 0 !== e ? this.get(e.toString()) : void 0;
                        return t && t.api
                    }
                }, {
                    key: "getApis",
                    value: function () {
                        return l(a.prototype.__proto__ || Object.getPrototypeOf(a.prototype), "getAll", this).call(this).map(function (e) {
                            return {
                                handle: e.key,
                                api: e.value.api
                            }
                        })
                    }
                }, {
                    key: "getApisByType",
                    value: function (t) {
                        return this.getApis().filter(function (e) {
                            return e.api.type === t
                        })
                    }
                }]), a
            }();
        return function () {
            function e() {
                o(this, e)
            }
            return c(e, null, [{
                key: "getSession",
                value: function (e) {
                    var t = e.createSocket,
                        n = e.Promise,
                        i = e.requestInterceptors,
                        a = e.responseInterceptors,
                        o = e.url,
                        r = new j,
                        s = new F({
                            apis: r,
                            Promise: n,
                            request: i,
                            response: a
                        }),
                        l = new b({
                            createSocket: t,
                            Promise: n,
                            url: o
                        }),
                        u = new D({
                            apis: r,
                            Promise: n,
                            rpc: l
                        });
                    return new f({
                        apis: r,
                        config: e,
                        intercept: s,
                        rpc: l,
                        suspendResume: u
                    })
                }
            }, {
                key: "create",
                value: function (t) {
                    return e.configureDefaults(t), t.mixins.forEach(function (e) {
                        t.definition.registerMixin(e)
                    }), e.getSession(t)
                }
            }, {
                key: "configureDefaults",
                value: function (e) {
                    if (!e) throw new Error("You need to supply a configuration.");
                    if (!e.Promise && "undefined" == typeof Promise) throw new Error("Your environment has no Promise implementation. You must provide a Promise implementation in the config.");
                    "function" != typeof e.createSocket && "function" == typeof WebSocket && (e.createSocket = function (e) {
                        return new WebSocket(e)
                    }), void 0 === e.suspendOnClose && (e.suspendOnClose = !1), e.protocol = e.protocol || {}, e.protocol.delta = void 0 === e.protocol.delta || e.protocol.delta, e.Promise = e.Promise || Promise, e.mixins = e.mixins || [], e.definition = e.definition || new v(e)
                }
            }]), e
        }()
    }),
    function (e, t) {
        "object" == ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("extensions/cl-custom-report/external/enigmajs/sense-utilities.min", t) : e.senseUtilities = t()
    }(void 0, function () {
        var v = Array.isArray || function (e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        };

        function o(e) {
            switch (void 0 === e ? "undefined" : _typeof(e)) {
                case "string":
                    return e;
                case "boolean":
                    return e ? "true" : "false";
                case "number":
                    return isFinite(e) ? e : "";
                default:
                    return ""
            }
        }

        function e(n, i, a, e) {
            return i = i || "&", a = a || "=", null === n && (n = void 0), "object" == (void 0 === n ? "undefined" : _typeof(n)) ? r(t(n), function (e) {
                var t = encodeURIComponent(o(e)) + a;
                return v(n[e]) ? r(n[e], function (e) {
                    return t + encodeURIComponent(o(e))
                }).join(i) : t + encodeURIComponent(o(n[e]))
            }).join(i) : e ? encodeURIComponent(o(e)) + a + encodeURIComponent(o(n)) : ""
        }

        function r(e, t) {
            if (e.map) return e.map(t);
            for (var n = [], i = 0; i < e.length; i++) n.push(t(e[i], i));
            return n
        }
        var t = Object.keys || function (e) {
            var t = [];
            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
            return t
        };

        function n(e, t, n, i) {
            t = t || "&", n = n || "=";
            var a = {};
            if ("string" != typeof e || 0 === e.length) return a;
            var o = /\+/g;
            e = e.split(t);
            var r = 1e3;
            i && "number" == typeof i.maxKeys && (r = i.maxKeys);
            var s, l, u = e.length;
            0 < r && r < u && (u = r);
            for (var c = 0; c < u; ++c) {
                var p, d, f, m, h = e[c].replace(o, "%20"),
                    g = h.indexOf(n);
                0 <= g ? (p = h.substr(0, g), d = h.substr(g + 1)) : (p = h, d = ""), f = decodeURIComponent(p), m = decodeURIComponent(d), s = a, l = f, Object.prototype.hasOwnProperty.call(s, l) ? v(a[f]) ? a[f].push(m) : a[f] = [a[f], m] : a[f] = m
            }
            return a
        }
        var f = {
            encode: e,
            stringify: e,
            decode: n,
            parse: n
        },
            i = function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            },
            a = function () {
                function i(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }
                return function (e, t, n) {
                    return t && i(e.prototype, t), n && i(e, n), e
                }
            }();

        function m(e) {
            return e.replace(/(^[/]+)|([/]+$)/g, "")
        }
        return function () {
            function d() {
                i(this, d)
            }
            return a(d, null, [{
                key: "configureDefaults",
                value: function (e) {
                    e.host || (e.host = "localhost"), void 0 === e.secure && (e.secure = !0), e.appId || e.route || (e.route = "app/engineData"), void 0 === e.noData && (e.noData = !1)
                }
            }, {
                key: "buildUrl",
                value: function (e) {
                    d.configureDefaults(e);
                    var t = e.secure,
                        n = e.host,
                        i = e.port,
                        a = e.prefix,
                        o = e.subpath,
                        r = e.route,
                        s = e.identity,
                        l = e.urlParams,
                        u = e.ttl,
                        c = e.appId,
                        p = "";
                    return p += (t ? "wss" : "ws") + "://", p += n || "localhost", i && (p += ":" + i), a && (p += "/" + m(a)), o && (p += "/" + m(o)), r ? p += "/" + m(r) : c && "" !== c && (p += "/app/" + encodeURIComponent(c)), s && (p += "/identity/" + encodeURIComponent(s)), u && (p += "/ttl/" + u), l && (p += "?" + f.stringify(l)), p
                }
            }]), d
        }()
    }),
    function (e, t) {
        "object" == ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "object" == ("undefined" == typeof module ? "undefined" : _typeof(module)) ? module.exports = t() : "function" == typeof define && define.amd ? define("extensions/cl-custom-report/external/halyardjs/halyard-enigma-mixin.min", [], t) : "object" == ("undefined" == typeof exports ? "undefined" : _typeof(exports)) ? exports["halyard-enigma-mixin"] = t() : e["halyard-enigma-mixin"] = t()
    }(void 0, function () {
        return function (n) {
            function i(e) {
                if (a[e]) return a[e].exports;
                var t = a[e] = {
                    exports: {},
                    id: e,
                    loaded: !1
                };
                return n[e].call(t.exports, t, t.exports, i), t.loaded = !0, t.exports
            }
            var a = {};
            return i.m = n, i.c = a, i.p = "", i(0)
        }([function (e, t, n) {
            function r(e, t, n) {
                return {
                    type: e,
                    message: t.message || t.qErrorString,
                    item: n,
                    qixError: t
                }
            }
            var i, a = n(1),
                s = (i = a) && i.__esModule ? i : {
                    default: i
                },
                o = {
                    types: "Global",
                    init: function (e) {
                        e.config ? e.api.Promise = e.config.Promise : e.api.Promise = e.Promise
                    },
                    extend: {
                        createSessionAppUsingHalyard: function (t) {
                            var n = this;
                            return n.createSessionApp().then(function (e) {
                                return n.setScriptAndReloadWithHalyard(e, t, !1)
                            })
                        },
                        createAppUsingHalyard: function (e, n) {
                            var i = this;
                            return i.createApp(e).then(function (e) {
                                var t = e.qAppId;
                                return i.openDoc(t).then(function (e) {
                                    return i.setScriptAndReloadWithHalyard(e, n, !0)
                                })
                            })
                        },
                        reloadAppUsingHalyard: function (t, n, i) {
                            var a = this;
                            return a.openDoc(t).catch(function (e) {
                                return i && 1003 === e.code ? a.createApp(t).then(function (e) {
                                    return a.openDoc(e.qAppId)
                                }) : a.Promise.reject(e)
                            }).then(function (e) {
                                return a.setScriptAndReloadWithHalyard(e, n, !0)
                            })
                        },
                        setScriptAndReloadWithHalyard: function (i, a, t) {
                            var o = [];
                            return a.getConnections().forEach(function (t) {
                                var e = t.getQixConnectionObject();
                                if (e) {
                                    var n = i.createConnection(e).then(function (e) {
                                        return e
                                    }, function (e) {
                                        if (!e.code || 2e3 !== e.code) throw r("Connection Error", e, t)
                                    });
                                    o.push(n)
                                }
                            }), this.Promise.all(o).then(function () {
                                return i.getLocaleInfo().then(function (e) {
                                    return a.setDefaultSetStatements((0, s.default)(e), !0), i.globalApi.configureReload(!0, !0, !1).then(function () {
                                        return i.setScript(a.getScript()).then(function () {
                                            return i.doReload().then(function () {
                                                return i.globalApi.getProgress(0).then(function (n) {
                                                    return 0 !== n.qErrorData.length ? i.checkScriptSyntax().then(function (e) {
                                                        if (0 === e.length) throw r("Loading Error", n.qErrorData[0]);
                                                        var t = a.getItemThatGeneratedScriptAt(e[0].qTextPos);
                                                        throw r("Syntax Error", n.qErrorData[0], t)
                                                    }) : t ? i.doSave().then(function () {
                                                        return i
                                                    }) : i
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        }
                    }
                };
            e.exports = [o, {
                types: "Doc",
                init: function (e) {
                    var t = {
                        handle: -1,
                        id: "Global",
                        type: "Global"
                    };
                    e.config ? t.genericType = "Global" : (t.customType = "Global", t.delta = !0), e.api.globalApi = e.api.session.getObjectApi(t)
                }
            }]
        }, function (e, t) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = function (e) {
                return {
                    ThousandSep: e.qThousandSep,
                    DecimalSep: e.qDecimalSep,
                    MoneyThousandSep: e.qMoneyThousandSep,
                    MoneyDecimalSep: e.qMoneyDecimalSep,
                    MoneyFormat: e.qMoneyFmt,
                    TimeFormat: e.qTimeFmt,
                    DateFormat: e.qDateFmt,
                    TimestampFormat: e.qTimestampFmt,
                    FirstWeekDay: e.qFirstWeekDay,
                    ReferenceDay: e.qReferenceDay,
                    FirstMonthOfYear: e.qFirstMonthOfYear,
                    CollationLocale: e.qCollation,
                    MonthNames: e.qCalendarStrings.qMonthNames,
                    LongMonthNames: e.qCalendarStrings.qLongMonthNames,
                    DayNames: e.qCalendarStrings.qDayNames,
                    LongDayNames: e.qCalendarStrings.qLongDayNames
                }
            }
        }])
    }),
    function (e, t) {
        "object" == ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("extensions/cl-custom-report/external/halyardjs/halyard.min", t) : e.halyard = t()
    }(void 0, function () {
        function a(e) {
            return e.replace(/"/g, '""')
        }

        function i(e) {
            return -1 < ["time", "timestamp", "date", "interval"].indexOf((e = e || "").toLowerCase())
        }

        function n(e) {
            return e.name || e.src
        }
        var t = function () {
            function n(e, t) {
                _classCallCheck(this, n), this.path = e, this.connectionType = t, this.fileExtension = ""
            }
            return _createClass(n, [{
                key: "getFileExtension",
                value: function () {
                    return this.fileExtension
                }
            }, {
                key: "getConnectionType",
                value: function () {
                    return this.connectionType
                }
            }, {
                key: "getQixConnectionObject",
                value: function () {
                    return {
                        qName: this.getName(),
                        qConnectionString: this.path,
                        qType: this.getConnectionType()
                    }
                }
            }, {
                key: "getName",
                value: function () {
                    return this.name || (this.name = "xxxxx-8xxxx-yxxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                        var t = 16 * Math.random() | 0;
                        return ("x" === e ? t : 3 & t | 8).toString(16)
                    })), this.name
                }
            }, {
                key: "getLibStatement",
                value: function () {
                    return "lib://" + this.getName()
                }
            }, {
                key: "getScript",
                value: function () {
                    return "FROM [" + this.getLibStatement() + "]"
                }
            }]), n
        }(),
            o = {
                File: function (e) {
                    function s(e) {
                        var t, n, i, a, o, r;
                        return _classCallCheck(this, s), (t = _possibleConstructorReturn(this, (s.__proto__ || Object.getPrototypeOf(s)).call(this, (r = (o = e).match(/^(.*)(\\.*\..*$|\\.*)$/)) ? r[1] : (r = o.match(/^(.*)(\/.*\..*$|\/.*)$/)) && r[1], "folder"))).fileName = (a = (i = e).match(/^.*\\(.*\..*|.*)$/)) ? a[1] : (a = i.match(/^.*\/(.*\..*|.*)$/)) && a[1], t.fileExtension = (n = e.match(/^.*\.(.*)$/)) && n[1] || "txt", t
                    }
                    return _inherits(s, t), _createClass(s, [{
                        key: "getLibStatement",
                        value: function () {
                            return _get(s.prototype.__proto__ || Object.getPrototypeOf(s.prototype), "getLibStatement", this).call(this) + "/" + this.fileName
                        }
                    }]), s
                }(),
                Web: function (e) {
                    function a(e, t) {
                        _classCallCheck(this, a);
                        var n = _possibleConstructorReturn(this, (a.__proto__ || Object.getPrototypeOf(a)).call(this, e, "internet")),
                            i = e.match(/^https?:\/\/.*\/.*\.(\w*)\?.*$/) || e.match(/^https?:\/\/.*\/.*\.(\w*)$/);
                        return n.fileExtension = t || i && i[1] || "html", n
                    }
                    return _inherits(a, t), a
                }(),
                Inline: function (e) {
                    function n(e) {
                        var t;
                        return _classCallCheck(this, n), (t = _possibleConstructorReturn(this, (n.__proto__ || Object.getPrototypeOf(n)).call(this))).data = e, t.fileExtension = "txt", t
                    }
                    return _inherits(n, t), _createClass(n, [{
                        key: "getScript",
                        value: function () {
                            return 'INLINE "\n' + a(this.data) + '\n"'
                        }
                    }, {
                        key: "getLibStatement",
                        value: function () { }
                    }, {
                        key: "getQixConnectionObject",
                        value: function () { }
                    }]), n
                }()
            };

        function r(e, t) {
            return e && "string" == typeof e && (-1 < e.indexOf(t) || -1 < e.indexOf("\n")) ? '"' + e.replace(/"/g, '""').replace(/\n/g, " ") + '"' : e
        }
        var s = new (function () {
            function e() {
                _classCallCheck(this, e), this.connectionsRegistry = []
            }
            return _createClass(e, [{
                key: "addConnection",
                value: function (e, t) {
                    this.connectionsRegistry.push({
                        matchingFn: e,
                        connection: t
                    })
                }
            }, {
                key: "findMatch",
                value: function (e) {
                    for (var t = 0; t < this.connectionsRegistry.length; t += 1)
                        if (this.connectionsRegistry[t].matchingFn(e)) return this.connectionsRegistry[t].connection(e);
                    return e
                }
            }]), e
        }());

        function l(e) {
            return -1 < ["utf8", "unicode", "ansi", "oem", "mac"].indexOf(e) && e || "NaN" !== Number(e).toString() && "codepage is " + e
        }
        s.addConnection(function (e) {
            return "string" == typeof e && e.match(/^https?:\/\/(.*)$/g)
        }, function (e) {
            return new o.Web(e)
        }), s.addConnection(function (e) {
            return "string" == typeof e && e.match(/^.*\.(.*)$/g)
        }, function (e) {
            return new o.File(e)
        }), s.addConnection(function (e) {
            return e instanceof Array && !!((e = e) instanceof Array && e[0] && "object" == _typeof(e[0]))
        }, function (e) {
            return new o.Inline(function (e) {
                e instanceof Array == 0 && (e = [e]);
                var t = "",
                    n = Object.keys(e[0]);
                t = t + n.map(function (e) {
                    return r(e, ",")
                }).join(",") + "\n";
                for (var i = [], a = 0; a < e.length; a += 1) {
                    i = [];
                    for (var o = 0; o < n.length; o += 1) i.push(r(e[a][n[o]], ","));
                    t = t + i.join(",") + "\n"
                }
                return t.slice(0, -"\n".length)
            }(e))
        }), s.addConnection(function (e) {
            return "string" == typeof e
        }, function (e) {
            return new o.Inline(e)
        });
        var u = function () {
            function n(e, t) {
                _classCallCheck(this, n), this.connection = s.findMatch(e), "string" == typeof (t = t || {}) ? (this.name = t, t = {}) : (this.name = t.name, this.fields = t.fields, this.prefix = t.prefix, t.section && (this.section = t.section)), this.options = t
            }
            return _createClass(n, [{
                key: "getFields",
                value: function () {
                    return this.fields
                }
            }, {
                key: "getFieldList",
                value: function () {
                    return this.fields ? this.fields.map(function (e) {
                        var t = '"' + a(e.src || "") + '"';
                        if (i(e.type)) {
                            var n = e.type.toUpperCase();
                            e.inputFormat && (t = n + "#(" + t + ", '" + e.inputFormat + "')"), t = e.displayFormat ? n + "(" + t + ", '" + e.displayFormat + "')" : n + "(" + t + ")"
                        }
                        if (e.expr && (t = e.expr), !e.name && !e.src) throw new Error("A name or src needs to specified on the field: " + JSON.stringify(e));
                        return "  " + t + ' AS "' + a(e.name || e.src) + '"'
                    }).join(",\n") : "*"
                }
            }, {
                key: "isProceedingLoad",
                value: function () {
                    return this.connection instanceof n
                }
            }, {
                key: "getPrefix",
                value: function () {
                    return this.prefix ? this.prefix + "\n" : ""
                }
            }, {
                key: "getScript",
                value: function () {
                    return this.isProceedingLoad() ? this.getPrefix() + "LOAD\n" + this.getFieldList() + ";\n" + this.connection.getScript() : (this.connection.getFileExtension && (this.options.fileExtension = this.connection.getFileExtension()), this.getPrefix() + "LOAD\n" + this.getFieldList() + "\n" + this.connection.getScript() + function (e) {
                        e || (e = {});
                        var t = [];
                        if (e.fileExtension) {
                            var n = e.fileExtension;
                            "xlsx" === n && (n = "ooxml"), "csv" === n && (n = "txt"), "htm" === n && (n = "html"), t.push(n)
                        } (e.headerRowNr || 0 === e.headerRowNr) && (t.push("header is " + e.headerRowNr + " lines"), t.push("embedded labels")), e.delimiter && t.push("delimiter is '" + e.delimiter + "'"), e.characterSet && l(e.characterSet) && t.push(l(e.characterSet)), e.srcTable && t.push('table is "' + a(e.srcTable) + '"'), e.noLabels && t.push("no labels");
                        var i = "";
                        return 0 < t.length && (i = "\n(" + t.join(", ") + ")"), i
                    }(this.options) + ";")
                }
            }, {
                key: "getName",
                value: function () {
                    return this.name || ""
                }
            }, {
                key: "getSection",
                value: function () {
                    return this.section
                }
            }, {
                key: "getConnection",
                value: function () {
                    return this.connection
                }
            }]), n
        }(),
            c = {
                qTypes: {
                    timestamp: "TS",
                    date: "D",
                    time: "T",
                    interval: "IV"
                },
                qDimensionType: {
                    timestamp: "T",
                    text: "D",
                    numeric: "N"
                }
            },
            p = ",";

        function d(e, t) {
            return -1 < e.indexOf(t) || -1 < e.indexOf("\n") ? "'" + e.replace(/'/g, "''").replace(/\n/g, " ") + "'" : e
        }
        var f = function () {
            function n(e, t) {
                _classCallCheck(this, n), this.items = [], this.fields = [], this.hyperCubeLayout = this.validateHyperCubeLayout(e), "string" == typeof (t = t || {}) ? (this.name = t, t = {}) : (this.name = t.name, t.section && (this.section = t.section)), this.parseHyperCubeLayout(t), this.options = t
            }
            return _createClass(n, [{
                key: "validateHyperCubeLayout",
                value: function (e) {
                    if (!e) throw new Error("Hyper cube layout is undefined");
                    if (!e.qDimensionInfo) throw new Error("qDimensionInfo is undefined");
                    if (!e.qMeasureInfo) throw new Error("qMeasureInfo is undefined");
                    if ("P" === e.qMode) throw new Error("Cannot add hyper cube in pivot mode, qMode:P(DATA_MODE_PIVOT) is not supported");
                    if ("K" === e.qMode) throw new Error("Cannot add hyper cube in stacked mode, qMode:K(DATA_MODE_PIVOT_STACK) is not supported");
                    if ("S" === e.qMode) return this.validateDataPages(e.qDataPages), this.validateDataPagesCoverage(e.qDataPages, e), e;
                    throw new Error("HyperCubeLayout is not valid")
                }
            }, {
                key: "validateDataPages",
                value: function (e) {
                    if (!e) throw new Error("qDataPages are undefined");
                    if (e[0].qArea && 0 < e[0].qArea.qTop) throw new Error("qDataPages first page should start at qTop: 0.")
                }
            }, {
                key: "validateDataPagesCoverage",
                value: function (e, t) {
                    var n = this,
                        i = 0;
                    if (e.forEach(function (e) {
                        n.validateQMatrix(e), n.validateQArea(e, t, i), i += e.qArea.qHeight
                    }, this), t.qSize.qcy !== i) throw new Error("qDataPages are missing pages.")
                }
            }, {
                key: "validateQMatrix",
                value: function (e) {
                    if (!e.qMatrix) throw new Error("qMatrix of qDataPages are undefined");
                    if (0 === e.qMatrix.length) throw new Error("qDataPages are empty")
                }
            }, {
                key: "validateQArea",
                value: function (e, t, n) {
                    if (!e.qArea) throw new Error("qArea of qDataPages are undefined");
                    if (0 < e.qArea.qLeft) throw new Error("qDataPages have data pages that's not of full qWidth.");
                    if (e.qArea.qWidth < t.qSize.qcx) throw new Error("qDataPages have data pages that's not of full qWidth.");
                    if (e.qArea.qTop < n) throw new Error("qDataPages have overlapping data pages.");
                    if (e.qArea.qTop > n) throw new Error("qDataPages are missing pages.")
                }
            }, {
                key: "parseHyperCubeLayout",
                value: function () {
                    var t = this;
                    t.fields = t.getFieldsFromHyperCubeLayout(), t.data = t.getDataFromHyperCubeLayout();
                    var e = t.fields.map(function (e) {
                        return e.name
                    }).join(",") + "\n" + this.data,
                        n = !1;
                    t.fields.forEach(function (e) {
                        e.isDual && (n = !0, t.items.push(t.getMapTableForDualField(e)))
                    });
                    var i = {
                        name: t.name,
                        fields: t.getFieldsDefinition(t.fields)
                    };
                    t.section && !n && (i.section = t.section), t.items.push(new u(e, i))
                }
            }, {
                key: "getFieldsDefinition",
                value: function (e) {
                    return e.map(function (e) {
                        var t = {
                            name: e.name
                        };
                        return i(e.dimensionType) && (t.type = e.dimensionType, t.displayFormat = e.displayFormat), e.isDual ? t.expr = "Dual(ApplyMap('MapDual__" + e.name + "', \"" + e.name + '"), "' + e.name + '")' : t.src = e.name, t
                    })
                }
            }, {
                key: "mapDualFieldQMatrix",
                value: function (e, t) {
                    return e.map(function (e) {
                        return "" + (n = e[t.index]).qNum + p + d(n.qText, p)
                    }).filter(function (e, t, n) {
                        return n.indexOf(e) === t
                    });
                    var n
                }
            }, {
                key: "getMapTableForDualField",
                value: function (e) {
                    var t, n = this.hyperCubeLayout.qDataPages.reduce(function (e, t) {
                        return [].concat(_toConsumableArray(e), _toConsumableArray(t.qMatrix))
                    }, []),
                        i = this.mapDualFieldQMatrix(n, e),
                        a = "" + (t = e).name + p + t.name + "_qText}\n" + i.join("\n"),
                        o = {
                            name: "MapDual__" + e.name,
                            prefix: "Mapping"
                        };
                    return this.section && 0 === this.items.length && (o.section = this.section), new u(a, o)
                }
            }, {
                key: "getDataFromHyperCubeLayout",
                value: function () {
                    var s = this;
                    return s.hyperCubeLayout.qDataPages.map(function (e) {
                        return e.qMatrix.map(function (e) {
                            return e.map(function (e, t) {
                                var n, i, a, o, r = s.fields[t];
                                return !r.isDual && (e = e, "dimension" === (o = r).type && "num" === o.dimensionType && e.qText !== Number(e.qNum).toString()) && (r.isDual = !0), n = e, "measure" === (i = r).type || "dimension" === i.type && (a = i.dimensionType, -1 < ["timestamp", "interval", "time", "date", "num"].indexOf((a = a || "").toLowerCase())) ? n.qNum : d(n.qText, p)
                            }).join(",")
                        }).join("\n")
                    }).join("\n")
                }
            }, {
                key: "getFieldsFromHyperCubeLayout",
                value: function () {
                    for (var e, t, n, i, a, o, r = this, s = [], l = 0; l < r.hyperCubeLayout.qDimensionInfo.length; l += 1) s.push({
                        type: "dimension",
                        dimensionType: (e = r.hyperCubeLayout.qDimensionInfo[l], t = void 0, n = void 0, i = void 0, a = void 0, o = void 0, e.qDimensionType === c.qDimensionType.text ? "text" : (o = e).qDimensionType === c.qDimensionType.numeric && 0 === o.qTags.length ? "mixed" : (a = e).qDimensionType === c.qDimensionType.timestamp || a.qDimensionType === c.qDimensionType.numeric && a.qNumFormat.qType === c.qTypes.timestamp ? "timestamp" : (i = e).qDimensionType === c.qDimensionType.numeric && i.qNumFormat.qType === c.qTypes.time ? "time" : (n = e).qDimensionType === c.qDimensionType.numeric && n.qNumFormat.qType === c.qTypes.date ? "date" : (t = e).qDimensionType === c.qDimensionType.numeric && t.qNumFormat.qType === c.qTypes.interval ? "interval" : "num"),
                        name: r.hyperCubeLayout.qDimensionInfo[l].qFallbackTitle,
                        displayFormat: r.hyperCubeLayout.qDimensionInfo[l].qNumFormat.qFmt,
                        index: l
                    });
                    for (var u = 0; u < r.hyperCubeLayout.qMeasureInfo.length; u += 1) s.push({
                        type: "measure",
                        name: r.hyperCubeLayout.qMeasureInfo[u].qFallbackTitle,
                        index: r.hyperCubeLayout.qDimensionInfo.length + u
                    });
                    return s
                }
            }, {
                key: "getItems",
                value: function () {
                    return this.items
                }
            }]), n
        }(),
            m = function () {
                function t(e) {
                    _classCallCheck(this, t), this.defaultSetStatements = e
                }
                return _createClass(t, [{
                    key: "getScript",
                    value: function () {
                        var t = this;
                        return Object.keys(this.defaultSetStatements).map(function (e) {
                            return "SET " + e + "='" + (Array.isArray(t.defaultSetStatements[e]) ? t.defaultSetStatements[e].join(";") : t.defaultSetStatements[e]) + "';"
                        }).join("\n")
                    }
                }, {
                    key: "getName",
                    value: function () {
                        return ""
                    }
                }]), t
            }(),
            h = function () {
                function t(e) {
                    _classCallCheck(this, t), this.getFieldFn = e.fieldMatchFunction, this.name = e.name, this.fieldTag = e.fieldTag, this.derivedFieldDefinition = e.derivedFieldDefinition
                }
                return _createClass(t, [{
                    key: "getScript",
                    value: function () {
                        var e = this.getFieldFn() || [];
                        if (0 < e.length) return this.getDefinition(e.map(n))
                    }
                }, {
                    key: "getDefinition",
                    value: function (e) {
                        return '"' + a(this.name) + "\":\nDECLARE FIELD DEFINITION Tagged ('$" + this.fieldTag + "')\nFIELDS\n" + this.derivedFieldDefinition + "\nDERIVE FIELDS FROM FIELDS [" + e.join(", ") + '] USING "' + a(this.name) + '";'
                    }
                }]), t
            }(),
            g = "Dual(Year($1), YearStart($1)) AS [Year] Tagged ('$axis', '$year'),\n  Dual('Q'&Num(Ceil(Num(Month($1))/3)),Num(Ceil(NUM(Month($1))/3),00)) AS [Quarter] Tagged ('$quarter', '$cyclic'),\n  Dual(Year($1)&'-Q'&Num(Ceil(Num(Month($1))/3)),QuarterStart($1)) AS [YearQuarter] Tagged ('$yearquarter', '$qualified'),\n  Dual('Q'&Num(Ceil(Num(Month($1))/3)),QuarterStart($1)) AS [_YearQuarter] Tagged ('$yearquarter', '$hidden', '$simplified'),\n  Month($1) AS [Month] Tagged ('$month', '$cyclic'),\n  Dual(Year($1)&'-'&Month($1), monthstart($1)) AS [YearMonth] Tagged ('$axis', '$yearmonth', '$qualified'),\n  Dual(Month($1), monthstart($1)) AS [_YearMonth] Tagged ('$axis', '$yearmonth', '$simplified', '$hidden'),\n  Dual('W'&Num(Week($1),00), Num(Week($1),00)) AS [Week] Tagged ('$weeknumber', '$cyclic'),\n  Date(Floor($1)) AS [Date] Tagged ('$axis', '$date', '$qualified'),\n  Date(Floor($1), 'D') AS [_Date] Tagged ('$axis', '$date', '$hidden', '$simplified'),\n  If (DayNumberOfYear($1) <= DayNumberOfYear(Today()), 1, 0) AS [InYTD] ,\nYear(Today())-Year($1) AS [YearsAgo] ,\n  If (DayNumberOfQuarter($1) <= DayNumberOfQuarter(Today()),1,0) AS [InQTD] ,\n4*Year(Today())+Ceil(Month(Today())/3)-4*Year($1)-Ceil(Month($1)/3) AS [QuartersAgo] ,\nCeil(Month(Today())/3)-Ceil(Month($1)/3) AS [QuarterRelNo] ,\n  If(Day($1)<=Day(Today()),1,0) AS [InMTD] ,\n12*Year(Today())+Month(Today())-12*Year($1)-Month($1) AS [MonthsAgo] ,\nMonth(Today())-Month($1) AS [MonthRelNo] ,\n  If(WeekDay($1)<=WeekDay(Today()),1,0) AS [InWTD] ,\n(WeekStart(Today())-WeekStart($1))/7 AS [WeeksAgo] ,\nWeek(Today())-Week($1) AS [WeekRelNo];",
            e = function () {
                function n() {
                    var e, t = this;
                    _classCallCheck(this, n), this.defaultSetStatements = {}, this.items = [], this.addItem(new m(this.defaultSetStatements)), this.lastItems = [(e = function (e) {
                        return t.getFields(e)
                    }, new h({
                        name: "autoCalendar",
                        fieldTag: "date",
                        derivedFieldDefinition: g,
                        fieldMatchFunction: function () {
                            return e(function (e) {
                                return e.calendarTemplate
                            })
                        }
                    }))]
                }
                return _createClass(n, [{
                    key: "getConnections",
                    value: function () {
                        return this.items.filter(function (e) {
                            return e.getConnection
                        }).map(function (e) {
                            return e.getConnection()
                        })
                    }
                }, {
                    key: "getQixConnections",
                    value: function () {
                        return this.getConnections().map(function (e) {
                            return e.getQixConnectionObject()
                        }).filter(function (e) {
                            return e
                        })
                    }
                }, {
                    key: "getFields",
                    value: function (t) {
                        t = t || function () {
                            return !0
                        };
                        var n = [];
                        return this.items.forEach(function (e) {
                            e.getFields && e.getFields() && n.push.apply(n, _toConsumableArray(e.getFields().filter(t)))
                        }), n
                    }
                }, {
                    key: "setDefaultSetStatements",
                    value: function (t, n) {
                        var i = this;
                        Object.keys(t).forEach(function (e) {
                            n && i.defaultSetStatements[e] || (i.defaultSetStatements[e] = t[e])
                        })
                    }
                }, {
                    key: "getItemScript",
                    value: function (e) {
                        var t = e.getScript();
                        return e.getName && e.getName() && (t = e.section ? "///$tab " + a(e.section) + '\n"' + a(e.getName()) + '":\n' + t : '"' + a(e.getName()) + '":\n' + t), t
                    }
                }, {
                    key: "getAllScriptBlocks",
                    value: function () {
                        return this.items.concat(this.lastItems).filter(function (e) {
                            return e.getScript()
                        })
                    }
                }, {
                    key: "getScript",
                    value: function () {
                        var t = this;
                        return this.getAllScriptBlocks().map(function (e) {
                            return t.getItemScript(e)
                        }).join("\n\n")
                    }
                }, {
                    key: "addHyperCube",
                    value: function (e, t) {
                        var n;
                        n = e instanceof f ? e : new f(e, t);
                        for (var i = 0; i < n.items.length; i += 1) this.checkIfItemNameExists(n.items[i]);
                        for (var a = 0; a < n.items.length; a += 1) this.addItem(n.items[a]);
                        return n
                    }
                }, {
                    key: "addTable",
                    value: function (e, t) {
                        var n;
                        return n = e instanceof u ? e : new u(e, t), this.addItem(n)
                    }
                }, {
                    key: "checkIfItemNameExists",
                    value: function (t) {
                        if (t.getName && t.getName() && 0 < this.items.filter(function (e) {
                            return e.getName() === t.getName()
                        }).length) throw new Error("Cannot add another table with the same name.")
                    }
                }, {
                    key: "addItem",
                    value: function (e) {
                        return this.checkIfItemNameExists(e), this.items.push(e), e
                    }
                }, {
                    key: "getItemThatGeneratedScriptAt",
                    value: function (e) {
                        for (var t = this.getAllScriptBlocks(), n = 0, i = 0; i < t.length; i += 1) {
                            var a = n + (this.getItemScript(t[i]) + "\n\n").length;
                            if (n <= e && e <= a) return t[i];
                            n = a
                        }
                    }
                }]), n
            }();
        return e.Table = u, e.HyperCube = f, e.Connections = o, "undefined" != typeof module && (module.exports = e), e
    }), define("extensions/cl-custom-report/make-main-core", ["./feature-flags", "./utils", "text!./lib/partials/template.html", "./initial-properties", "./support", "./lib/js/directives/register-on-last-repeat", "./lib/js/factories/make-controller", "./lib/js/factories/make-definition", "./lib/js/factories/make-paint", "./lib/js/factories/make-extension", "./lib/js/services/export-service/make-export-service", "./lib/js/services/export-service/qix/schema", "./lib/js/dialogs/app-on-demand-dialog/template.ng.html", "./lib/js/services/cache-service/make-cache-service", "./lib/js/services/cache-service/storage-types/make-session-storage-cache", "./lib/js/services/cache-service/storage-types/make-local-storage-cache", "./lib/js/managers/report/make-report-manager", "./lib/js/services/patch-service/make-patch-service", "./lib/js/components/pp-cl-custom-reports/add-cl-custom-report-popover-factory", "./lib/js/popovers/change-cl-custom-report-popover-factory", "./lib/js/components/pp-cl-about/pp-cl-about", "./lib/js/components/pp-cl-custom-reports/pp-cl-custom-reports", "./constants", "./external/sortable/Sortable", "./external/perfect-scrollbar/perfect-scrollbar.min", "./external/enigmajs/enigma.min", "./external/enigmajs/sense-utilities.min", "./external/halyardjs/halyard-enigma-mixin.min", "./external/halyardjs/halyard.min", "client.utils/state", "core.utils/environment", "client.property-panel/component-utils", "client.property-panel/components/components", "client.utils/property-resolver", "touche", "core.utils/resize", "core.utils/deferred", "general.utils/string-normalization", "general.utils/array-util", "general.utils/support", "qvangular"], function (_, E, C, N, R, S, T, L, x, A, M, P, w, V, k, F, j, G, H, z, U, X, Y, W, B, $, K, Q, J, Z, ee, te, ne, ie, ae, oe, re, se, le, ue, ce) {
        return function (e) {
            var t = e.Handler,
                n = e.makeVariableCache,
                i = e.extendDefinition,
                a = e.patchers,
                o = e.visualizationTypes,
                r = e.registerComponentAboutPlus,
                s = e.extendScope,
                l = window.requirejs && window.requirejs.defined,
                u = require(l("qlik") ? "qlik" : "js/qlik"),
                c = ce.getService("$q"),
                p = require("underscore"),
                d = require("jquery");
            l("general.directives/apply-style") && require("general.directives/apply-style"), l("client.services/export-dialog/export-dialog") && require("client.services/export-dialog/export-dialog"), S({
                qvangular: ce
            });
            var f = H({
                deferred: re,
                stringNormalization: se,
                arrayUtil: le,
                supportUtil: ue,
                _: p
            }),
                m = z({
                    supportUtil: ue,
                    stringNormalization: se,
                    _: p
                });
            U({
                components: ne,
                componentUtils: te
            }), r && r({
                components: ne,
                componentUtils: te
            }), X({
                $: d,
                _: p,
                touche: ae,
                components: ne,
                propertyResolver: ie,
                resize: oe,
                addPopover: f,
                qvangular: ce
            });
            var h = V({
                constants: Y
            }),
                g = k({
                    cacheService: h
                }),
                v = F({
                    cacheService: h
                });
            h.registerStorageType({
                type: g,
                name: "sessionStorage"
            }), h.registerStorageType({
                type: v,
                name: "localStorage"
            });
            var q = function (t, e) {
                p.each(e, function (e) {
                    t.registerVisualization({
                        object: e.object,
                        visualizationName: e.visualizationName
                    })
                })
            },
                b = G({
                    _: p
                });
            q(b, a);
            var D = M({
                _: p,
                $q: c,
                Halyard: J,
                enigmaMixin: Q,
                enigma: $,
                enigmaSenseUtils: K,
                util: E,
                qixSchema: P,
                qvangular: ce,
                appOnDemandDialogTemplate: w
            }),
                O = T({
                    qvangular: ce,
                    stateUtil: Z,
                    environmentUtil: ee,
                    $: d,
                    qlik: u,
                    util: E,
                    $q: c,
                    _: p,
                    constants: Y,
                    makeReportManager: j,
                    registerVisualization: q,
                    visualizationTypes: o,
                    exportService: D,
                    cacheService: h,
                    makeVariableCache: n,
                    patchService: b,
                    sortable: W,
                    PerfectScrollbar: B,
                    addPopover: f,
                    changePopover: m,
                    touche: ae,
                    extendScope: s
                }),
                y = L({
                    featureFlags: _,
                    _: p
                });
            i && i({
                definition: y,
                cacheService: h
            });
            var I = x({
                $: d,
                qlik: u
            });
            return A({
                $: d,
                qvangular: ce,
                util: E,
                support: R,
                initialProperties: N,
                definition: y,
                template: C,
                controller: O,
                paint: I,
                Handler: t
            })
        }
    }), define("extensions/cl-custom-report/lib/js/factories/make-handler", [], function () {
        return function (e) {
            var t = e.dataPropertyHandler,
                i = e.$q,
                n = e.$,
                a = e.util,
                o = e.arrayUtil;
            return t.extend({
                init: function (e) {
                    this._super(e)
                },
                setModel: function (e) {
                    this.model = e
                },
                getReportManager: function (e) {
                    return n("#cl-custom-report-container-" + e).scope().reportManager
                },
                createCustomReport: function (e) {
                    return {
                        qLibraryId: e,
                        cId: a.generateId(),
                        visualizationTypes: ["table"]
                    }
                },
                addLibraryItem: function (e) {
                    var t = this.createCustomReport(e);
                    return this.addCustomReport(t)
                },
                getCustomReports: function () {
                    return this.properties && this.properties.props ? this.properties.props.reports : []
                },
                moveLibraryItem: function (e, t) {
                    var n = this.getCustomReports();
                    return o.move(n, e, t), i.resolve()
                },
                addCustomReport: function (e) {
                    return this.getCustomReports().push(e), i.resolve(e)
                },
                removeCustomReport: function (e) {
                    var t = this.getCustomReports();
                    return i.resolve(t.splice(e, 1))
                }
            })
        }
    }), define("extensions/cl-custom-report/lib/js/services/patch-service/visualization-types/make-table-patcher", [], function () {
        return function (e) {
            var h = e._,
                g = {
                    value: "qColumnOrder"
                };
            return {
                getPath: function () {
                    return "/qHyperCubeDef/"
                },
                updateDefinitions: function (e, t) {
                    var n, i, a, o, r, s, l, u, c, p, d, f, m;
                    return n = e, (i = t).visualizationState && i.visualizationState.table ? n.qSuppressZero = !!i.visualizationState.table.qSuppressZero : n.qSuppressZero = !0, o = t, r = -1, s = (a = e).qDimensions.length - 1, l = h.map(o.items, function (e) {
                        return "dimension" === e.type ? r += 1 : s += 1
                    }), "qColumnOrder" === g.value && (a.qColumnOrder = l), a.columnOrder = l, u = e, p = {
                        dimension: [],
                        measure: []
                    }, d = {}, (c = t).visualizationState && c.visualizationState.table && c.visualizationState.table.columnWidths && (d = c.visualizationState.table.columnWidths), h.each(c.items, function (e) {
                        d[e.cId] ? p[e.type].push(d[e.cId]) : p[e.type].push(-1)
                    }), u.columnWidths = [].concat(_toConsumableArray(p.dimension), _toConsumableArray(p.measure)),
                        function (n, e) {
                            var i = [];
                            if (e.visualizationState && e.visualizationState.table && e.visualizationState.table.qInterColumnSortOrder && h.each(e.visualizationState.table.qInterColumnSortOrder, function (e) {
                                var t = void 0;
                                "measure" === e.type ? -1 < (t = n.qMeasures.map(function (e) {
                                    return e.qDef.cId
                                }).indexOf(e.cId)) && (i.push(t + n.qDimensions.length), n.qMeasures[t].qSortBy = e.qSortBy, e.qReverseSort && (n.qMeasures[t].qDef.autoSort = !1, n.qMeasures[t].qDef.qReverseSort = e.qReverseSort)) : -1 < (t = n.qDimensions.map(function (e) {
                                    return e.qDef.cId
                                }).indexOf(e.cId)) && (i.push(t), e.qReverseSort && (n.qDimensions[t].qDef.autoSort = !1, n.qDimensions[t].qDef.qReverseSort = e.qReverseSort))
                            }), i.length !== n[g.value].length) {
                                var t = h.difference(n[g.value], i);
                                h.each(t, function (e) {
                                    i.push(e)
                                })
                            }
                            n.qInterColumnSortOrder = i
                        }(e, t), f = e, m = t, h.each(f.qMeasures, function (e) {
                            h.contains(m.visualizationState.table.totals, e.qDef.cId) || (e.qDef.qAggrFunc = "None")
                        }), e
                },
                columnOrderProperty: g
            }
        }
    }), define("extensions/cl-custom-report/lib/js/managers/report/visualization-types/make-table", [], function () {
        return function (e) {
            var c = e._,
                s = {
                    value: "qColumnOrder"
                },
                p = function (t) {
                    var e, n = t.qHyperCubeDef.qDimensions.length,
                        i = t.qHyperCubeDef.qMeasures.length,
                        a = s.value;
                    "qColumnOrder" === a && (e = t, JSON.stringify(e.qHyperCubeDef.qColumnOrder) !== JSON.stringify(e.qHyperCubeDef.columnOrder)) && (a = "columnOrder");
                    var o = t.qHyperCubeDef[a];
                    if (o.length < n + i) {
                        var r = Array.from(new Array(n + i), function (e, t) {
                            return t
                        });
                        o = c.union(o, r)
                    }
                    return c.map(o, function (e) {
                        return -1 === e ? {
                            index: -1,
                            type: "pseudo-dimension"
                        } : n <= e ? {
                            cId: t.qHyperCubeDef.qMeasures[e - n].qDef.cId,
                            type: "measure"
                        } : {
                                    cId: t.qHyperCubeDef.qDimensions[e].qDef.cId,
                                    type: "dimension"
                                }
                    })
                },
                t = function (e) {
                    return {
                        qInterColumnSortOrder: [],
                        columnWidths: [],
                        qSuppressZero: e.qSuppressZero,
                        totals: [],
                        qColumnOrder: []
                    }
                },
                n = function (e) {
                    return !c.countBy(e, "type").dimension
                };
            return {
                getState: function (e, t) {
                    return {
                        qInterColumnSortOrder: (s = e, l = s.qHyperCubeDef.qDimensions.length, u = [], c.each(s.qHyperCubeDef.qInterColumnSortOrder, function (e) {
                            var t = void 0;
                            l <= e ? ((t = {
                                cId: s.qHyperCubeDef.qMeasures[e - l].qDef.cId,
                                type: "measure"
                            }).qSortBy = s.qHyperCubeDef.qMeasures[e - l].qSortBy, s.qHyperCubeDef.qMeasures[e - l].qDef.qReverseSort && (t.qReverseSort = !0)) : (t = {
                                cId: s.qHyperCubeDef.qDimensions[e].qDef.cId,
                                type: "dimension"
                            }, s.qHyperCubeDef.qDimensions[e].qDef.qReverseSort && (t.qReverseSort = !0)), u.push(t)
                        }), u),
                        columnWidths: (i = e, a = t, o = i.qHyperCubeDef.qDimensions.length, r = {}, a && a.columnWidths && (r = a.columnWidths), c.each(i.qHyperCubeDef.columnWidths, function (e, t) {
                            var n = void 0;
                            n = o <= t ? i.qHyperCubeDef.qMeasures[t - o].qDef.cId : i.qHyperCubeDef.qDimensions[t].qDef.cId, r[n] = e
                        }), r),
                        qSuppressZero: (n = e, n.qHyperCubeDef.qSuppressZero || !1),
                        totals: t.totals || [],
                        qColumnOrder: p(e)
                    };
                    var n, i, a, o, r, s, l, u
                },
                getEmptyState: t,
                loadReport: function (i, a) {
                    i.visualizationState.table || (i.visualizationState.table = t(i)), c.each(i.dimensions, function (e) {
                        delete e.action
                    }), c.each(i.measures, function (n) {
                        (n.columnOptions.qDef.qAggrFunc && "none" !== n.columnOptions.qDef.qAggrFunc.toLowerCase() || !n.columnOptions.qDef.qAggrFunc) && (n.action = {
                            class: function () {
                                return c.contains(i.visualizationState.table.totals, n.cId) ? "cl-icon cl-icon--totals" : "cl-icon cl-icon--no-totals"
                            },
                            title: function () {
                                return c.contains(i.visualizationState.table.totals, n.cId) ? "Show totals" : "Hide totals"
                            },
                            onClick: function (e) {
                                if (n.selected && (e.stopPropagation(), e.preventDefault()), c.contains(i.visualizationState.table.totals, n.cId)) {
                                    var t = c.indexOf(i.visualizationState.table.totals, n.cId);
                                    i.visualizationState.table.totals.splice(t, 1)
                                } else i.visualizationState.table.totals.push(n.cId);
                                a()
                            }
                        })
                    })
                },
                showRequirementMessage: n,
                visualizationRequirementMessage: function (e) {
                    return n(e) ? "Select at least 1 dimension" : ""
                },
                addVisulizationItemsToContextMenu: function (e, t) {
                    var n = e.addItem({
                        translation: "Table",
                        tid: "table-submenu",
                        icon: "table icon-table"
                    });
                    n.addItem({
                        translation: "Reset column widths",
                        tid: "reset-column-widths",
                        select: function () {
                            ! function (e) {
                                var t = e.getPatchesFromReport(),
                                    n = c.find(t, function (e) {
                                        return "/qHyperCubeDef/columnWidths" === e.qPath
                                    });
                                if (n) {
                                    var i = c.map(e.report.items, function () {
                                        return -1
                                    });
                                    n.qValue = JSON.stringify(i), e.applyPatches(t)
                                }
                            }(t)
                        }
                    }), t.getVisualizationContextMenu(n)
                },
                columnOrderProperty: s
            }
        }
    }), define("extensions/cl-custom-report/lib/js/components/pp-cl-about-plus/pp-cl-about-plus.ng.html", [], function () {
        return '<div>\n  <a href="http://climberextensions.com/?utm_source=Custom_Report_Plus&utm_medium=Banner_CustomReport&utm_campaign=Extensions_Panels&utm_content=About_Panel" target="_blank" title="Click here to see more of our awesome extensions!" style="height:0px;  background:#591050;">\n    <div style="background:#591050; border-top: 1px solid #1D1D1B; border-bottom: 1px solid #1D1D1B;">\n      <svg version="1.1" id="Lager_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n        viewBox="0 0 250 95" style="height: 95px;">\n        <style type="text/css">\n          .cl-about-background--plum {\n            fill: #771B6E;\n          }\n\n          .cl-about-background--plum-dark {\n            fill: #591050;\n          }\n\n          .cl-no-fill {\n            fill: none;\n          }\n\n          .cl-climber-logo-white {\n            fill: #FFFFFF;\n          }\n\n          .cl-about-text {\n            font-family: arial, "FranklinGothic-Book", "QlikView Sans", sans-serif;\n            fill: #ffffff;\n          }\n\n          .cl-about-header {\n            font-size: 25px;\n          }\n\n          .cl-outline {\n            fill: #1D1D1B;\n          }\n\n          .cl-about-body {\n            font-size: 12px;\n          }\n\n          .cl-about-plus-url {\n            font-size: 11px;\n          }\n\n        </style>\n        <text transform="matrix(1 0 0 1 15 34)" class="cl-about-text cl-about-header">Want more?</text>\n        <g transform="translate(4,0)">\n          <path class="cl-climber-logo-white" d="M182.2,85.7v-0.5c1.6,0,1.9-0.4,1.9-2.8v-1.2c0-2.4-0.3-2.7-1.9-2.7V78l3.6-0.6v5c0,2.4,0.3,2.8,1.9,2.8v0.5\n     H182.2z" />\n          <path class="cl-climber-logo-white" d="M197.6,82.4c0,2.5,0.2,2.8,1.5,2.8v0.5h-4.6v-0.5c1.3,0,1.5-0.3,1.5-2.8V81c0-1.5-0.5-2.5-1.7-2.5\n     c-0.8,0-2.4,0.9-2.4,2.4v1.5c0,2.5,0.2,2.8,1.5,2.8v0.5h-5v-0.5c1.6,0,1.9-0.4,1.9-2.8v-1.2c0-2.4-0.3-2.7-1.9-2.7V78l3.2-0.6\n     c0.1,0.2,0.3,1.2,0.4,1.7c0.6-0.8,1.7-1.7,3.1-1.7c1.4,0,2.2,0.7,2.5,1.8c0.5-0.8,1.9-1.8,3.3-1.8c2.1,0,2.7,1.5,2.7,3.5v1.5\n     c0,2.4,0.3,2.8,1.9,2.8v0.5h-5v-0.5c1.3,0,1.5-0.3,1.5-2.8V81c0-1.5-0.5-2.5-1.7-2.5c-0.8,0-2.5,0.9-2.5,2.4V82.4z" />\n          <path class="cl-climber-logo-white" d="M231.1,80c-0.5,0-0.8-0.4-0.8-0.9c0-0.5-0.3-0.8-0.8-0.8c-0.5,0-1.8,0.9-1.8,2.8v1.3c0,2.4,0.3,2.8,1.9,2.8\n     v0.5h-5.4v-0.5c1.6,0,1.9-0.4,1.9-2.8v-1.2c0-2.4-0.3-2.7-1.9-2.7V78l3.2-0.6c0.1,0.2,0.3,1.2,0.4,1.7c0.5-0.9,1.5-1.7,2.5-1.7\n     c1.3,0,1.9,0.9,1.9,1.5C232,79.4,231.8,80,231.1,80z" />\n          <path class="cl-climber-logo-white" d="M185.7,75.2c0,0.6-0.5,1-1,1c-0.6,0-1-0.5-1-1c0-0.6,0.5-1,1-1C185.2,74.2,185.7,74.6,185.7,75.2z" />\n          <path class="cl-climber-logo-white" d="M179.5,72.8v9.6c0,2.4,0.3,2.8,1.9,2.8v0.5H176v-0.5c1.6,0,1.9-0.4,1.9-2.8l0-9.6c0,0,0.1-1.3-0.2-2.3\n     c-0.4-1.2-1.2-2.2-2.1-2.4c-0.9-0.2-1.4-0.2-1.9,0.1c-0.6,0.5-0.3,1.5-0.8,1.9c-0.3,0.2-0.7,0.5-1.3,0c-0.6-0.4-0.3-1.2-0.3-1.3\n     c0.1-0.3,0.8-1.3,2.6-1.7c2.5-0.4,4.6,1.4,5.3,3C179.6,71.2,179.5,72.8,179.5,72.8z" />\n          <path class="cl-climber-logo-white" d="M175.8,83.9c-0.1,0-0.2-0.1-0.3,0l0,0c-0.8,0.7-1.8,1-2.6,1c-1.9-0.1-2.8-1.3-2.7-3.2c0.1-2.2,1.1-3.8,2.4-3.7\n     c0.4,0,0.8,0.3,0.8,1c0,0.5,0.4,1,0.9,1c0.8,0,1.1-0.6,1.1-1c0-0.9-0.8-1.7-2.8-1.8c-1.9-0.1-4.2,1.6-4.3,4.4\n     c-0.1,2.4,1.4,4.2,4,4.3c1.4,0,2.6-0.5,3.6-1.4l0,0c0,0,0-0.1,0-0.1C176,84.1,176,83.9,175.8,83.9z" />\n          <path class="cl-climber-logo-white" d="M208.7,72.1c2.6-1.4,4.8,0,5.6,0.8c0.7,0.8,0.5,1.6-0.2,1.9c-0.5,0.2-0.9,0.1-1.3-0.4\n     c-0.2-0.3-0.1-0.4-0.3-1.2c-0.1-0.4-0.6-1.2-2.2-0.9c-2.8,0.6-2.7,4.4-2.7,4.4v2.1c0.7-0.9,1.7-1.4,2.9-1.4c2.3,0,4.1,1.9,4.1,4.3\n     c0,2.4-1.8,4.4-4.1,4.4c-1.3,0-2.3-0.6-3-1.6l-1.5,1.6v-9.3C206.1,76.7,206,73.6,208.7,72.1z M207.8,83.3c0.4,1.1,1.3,1.9,2.4,1.9\n     c1.8,0,2.7-1.5,2.7-3.4s-0.9-3.4-2.7-3.4c-1.1,0-2,0.8-2.4,1.9V83.3z" />\n          <path class="cl-climber-logo-white" d="M223.6,84.5c0-0.1,0.1-0.1,0.1-0.2c0-0.2-0.2-0.3-0.3-0.3c0,0-0.1,0-0.1,0c0,0-0.1,0.1-0.2,0.1\n     c-0.7,0.6-1.7,1-2.4,1c-2.5,0-3.4-1.7-3.1-4h5.7c0.5-2-1.1-3.7-3.2-3.7c-2.2,0-4.4,1.8-4.4,4.3c0,2.4,1.8,4.4,4.4,4.4\n     C221.3,86.1,222.7,85.4,223.6,84.5C223.6,84.6,223.6,84.5,223.6,84.5z M219.9,78.3c1.6,0,1.9,1.2,1.7,1.9h-3.9\n     C218,79.1,218.9,78.3,219.9,78.3z" />\n        </g>\n        <text transform="matrix(1 0 0 1 17 54)">\n          <tspan x="0" y="0" class="cl-about-text cl-about-body">{{missingFeature}} {{isOrAre}} available in </tspan>\n          <tspan x="0" y="13" class="cl-about-text cl-about-body" style="text-transform: uppercase;">custom-report+. </tspan>\n          <tspan x="0" y="32" class="cl-about-text cl-about-plus-url" style="text-decoration: underline;">Learn more here!</tspan>\n        </text>\n      </svg>\n    </div>\n  </a>\n</div>\n<div style="text-align:right; padding-right:5px;"></div>\n'
    }), define("extensions/cl-custom-report/lib/js/components/pp-cl-about-plus/pp-cl-about-plus", ["./pp-cl-about-plus.ng.html"], function (a) {
        return function (e) {
            var t = e.components,
                n = e.componentUtils,
                i = {
                    template: a,
                    controller: ["$scope", function (e) {
                        var t = function () {
                            return e.data
                        };
                        n.defineLabel(e, e.definition, t, e.args.handler), n.defineVisible(e, e.args.handler), n.defineReadOnly(e, e.args.handler), n.defineChange(e, e.args.handler), n.defineValue(e, e.definition, t), e.missingFeature = e.definition.missingFeature, e.isOrAre = e.definition.isOrAre, e.getDescription = function (e) {
                            return "About" === e
                        }, e.href = window.location.href
                    }]
                };
            return t.addComponent("pp-cl-custom-report-about-plus", i), i
        }
    }), define("extensions/cl-custom-report/lib/js/components/data-property-handler/class", [], function () {
        var s = /xyz/.test(function () { }) ? /\b_super\b/ : /.*/,
            e = function () { };
        return e.extend = function e(t, n) {
            var a = this.prototype;
            "string" != typeof t && (n = t, t = "Class");
            var i = Object.create(this.prototype);
            for (var o in n) i[o] = "function" == typeof n[o] && "function" == typeof a[o] && s.test(n[o]) ? function (n, i) {
                return function () {
                    var e = this._super;
                    this._super = a[n];
                    var t = i.apply(this, arguments);
                    return this._super = e, t
                }
            }(o, n[o]) : n[o];
            if (!/^[_a-z][_a-z\d]*$/i.test(t)) throw new Error("Invalid subclass name. Alphanumericals only.");
            var r = new Function("return (function " + t + "(){ typeof this.init === 'function' && this.init.apply(this, [].slice.call(arguments)) });")();
            return r.prototype = i, (r.prototype.constructor = r).extend = e, r
        }, e
    }), define("extensions/cl-custom-report/lib/js/components/data-property-handler/data-property-handler", ["./class", "underscore", "translator"], function (e, a, t) {
        var n = "Not supported in this object, need to implement in subclass.";
        return e.extend({
            init: function (e) {
                e = e || {}, this.dimensionDefinition = e.dimensionDefinition || {
                    max: 0
                }, this.measureDefinition = e.measureDefinition || {
                    max: 0
                }, e.dimensionDefinition && (this.dimensionProperties = e.dimensionProperties || {}), e.measureDefinition && (this.measureProperties = e.measureProperties || {}), e.globalChangeListeners && (this.globalChangeListeners = e.globalChangeListeners), e.addDimensionLabel && (this.addDimensionLabel = e.addDimensionLabel), this.app = e.app
            },
            setProperties: function (e) {
                this.properties = e
            },
            setGlobalChangeListeners: function (e) {
                this.globalChangeListeners = e
            },
            setLayout: function (e) {
                this.layout = e
            },
            type: function () {
                throw "Must override this method"
            },
            getDimensions: function () {
                return []
            },
            getDimension: function (e) {
                for (var t = this.getDimensions(), n = 0; n < t.length; n += 1)
                    if (t[n].qDef.cId === e) return t[n];
                return null
            },
            minDimensions: function () {
                return "function" == typeof this.dimensionDefinition.min ? this.dimensionDefinition.min.call(null, this.properties, this) : this.dimensionDefinition.min || 0
            },
            maxDimensions: function (e) {
                return e = e || 0, "function" == typeof this.dimensionDefinition.max ? this.dimensionDefinition.max.call(null, this.getMeasures().length) : Number.isNaN(this.dimensionDefinition.max) ? 1e4 : this.dimensionDefinition.max
            },
            canAddDimension: function () {
                return this.getDimensions().length < this.maxDimensions()
            },
            minMeasures: function () {
                return "function" == typeof this.measureDefinition.min ? this.measureDefinition.min.call(null, this.properties, this) : this.measureDefinition.min || 0
            },
            maxMeasures: function (e) {
                return e = e || 0, "function" == typeof this.measureDefinition.max ? this.measureDefinition.max.call(null, this.getDimensions().length) : Number.isNaN(this.measureDefinition.max) ? 1e4 : this.measureDefinition.max
            },
            canAddMeasure: function () {
                return this.getMeasures().length < this.maxMeasures()
            },
            getMeasures: function () {
                return []
            },
            getLabels: function () {
                return []
            },
            getMeasure: function (e) {
                for (var t = this.getMeasures(), n = 0; n < t.length; n += 1)
                    if (t[n].qDef.cId === e) return t[n];
                return null
            },
            addDimension: function () {
                throw n
            },
            getSorting: function () {
                throw n
            },
            addFieldDimension: function (e, t, n) {
                var i = this.createFieldDimension(e, t, n);
                return this.addDimension(i)
            },
            addLibraryDimension: function (e, t) {
                var n = this.createLibraryDimension(e, t);
                return this.addDimension(n)
            },
            addMeasure: function () {
                throw n
            },
            addExpressionMeasure: function (e, t, n) {
                var i = this.createExpressionMeasure(e, t, n);
                return this.addMeasure(i)
            },
            addLibraryMeasure: function (e, t) {
                var n = this.createLibraryMeasure(e, t);
                return this.addMeasure(n)
            },
            addAlternativeFieldDimension: function (e, t, n) {
                var i = this.createFieldDimension(e, t, n);
                return this.addDimension(i, !0)
            },
            addAlternativeLibraryDimension: function (e, t) {
                var n = this.createLibraryDimension(e, t);
                return this.addDimension(n, !0)
            },
            addAlternativeExpressionMeasure: function (e, t, n) {
                var i = this.createExpressionMeasure(e, t, n);
                return this.addMeasure(i, !0)
            },
            addAlternativeLibraryMeasure: function (e, t) {
                var n = this.createLibraryMeasure(e, t);
                return this.addMeasure(n, !0)
            },
            replaceDimension: function () {
                throw n
            },
            replaceMeasure: function () {
                throw n
            },
            autoSortDimension: function () {
                throw n
            },
            autoSortMeasure: function () {
                throw n
            },
            createFieldDimension: function (e, t, n) {
                var i = a.extend(!0, {}, this.dimensionProperties || {}, n || {});
                return i.qDef || (i.qDef = {}), i.qOtherTotalSpec || (i.qOtherTotalSpec = {}), e ? (i.qDef.qFieldDefs = [e], i.qDef.qFieldLabels = t ? [t] : [""], i.qDef.qSortCriterias = [{
                    qSortByLoadOrder: 1
                }]) : (i.qDef.qFieldDefs = [], i.qDef.qFieldLabels = [], i.qDef.qSortCriterias = []), i.qDef.autoSort = !0, i
            },
            createLibraryDimension: function (e, t) {
                var n = a.extend(!0, {}, this.dimensionProperties || {}, t || {});
                return n.qDef || (n.qDef = {}), n.qOtherTotalSpec || (n.qOtherTotalSpec = {}), n.qLibraryId = e, n.qDef.qSortCriterias = [{
                    qSortByLoadOrder: 1
                }], n.qDef.autoSort = !0, delete n.qDef.qFieldDefs, delete n.qDef.qFieldLabels, n
            },
            createExpressionMeasure: function (e, t, n) {
                var i = a.extend(!0, {}, this.measureProperties || {}, n || {});
                return i.qDef || (i.qDef = {}), i.qDef.qNumFormat || (i.qDef.qNumFormat = {}), i.qDef.qDef = e, i.qDef.qLabel = t, i.qDef.autoSort = !0, i
            },
            createLibraryMeasure: function (e, t) {
                var n = a.extend(!0, {}, this.measureProperties || {}, t || {});
                return n.qDef || (n.qDef = {}), n.qDef.qNumFormat || (n.qDef.qNumFormat = {}), n.qLibraryId = e, n.qDef.autoSort = !0, delete n.qDef.qDef, delete n.qDef.qLabel, n
            },
            updateGlobalChangeListeners: function () {
                var t = this;
                this.globalChangeListeners && (this.globalChangeListeners || []).forEach(function (e) {
                    e && "function" == typeof e && e(t.properties, t)
                })
            },
            removeDimension: function () {
                throw n
            },
            removeMeasure: function () {
                throw n
            },
            moveDimension: function () {
                throw n
            },
            moveMeasure: function () {
                throw n
            },
            changeSorting: function () {
                throw n
            },
            getAddDimensionLabel: function () {
                return this.addDimensionLabel || t.get("Visualization.Requirements.AddDimension")
            }
        })
    }), define(["./make-main-core", "./utils", "./lib/js/factories/make-handler", "./lib/js/services/patch-service/visualization-types/make-table-patcher", "./lib/js/managers/report/visualization-types/make-table", "./lib/js/components/pp-cl-about-plus/pp-cl-about-plus", "./lib/js/components/data-property-handler/data-property-handler", "general.utils/array-util"], function (e, t, n, i, a, o, r, s) {
        var l = require("qvangular"),
            u = require("jquery"),
            c = l.getService("$q"),
            p = require("underscore");
        return e({
            extendDefinition: function (e) {
                var t = e.definition;
                t.items.bookmark.items.bookmarksText = {
                    missingFeature: "Bookmarks",
                    isOrAre: "are",
                    component: "pp-cl-custom-report-about-plus",
                    show: !0
                };
                t.items.presets.items.presetsText = {
                    missingFeature: "Presets",
                    isOrAre: "are",
                    component: "pp-cl-custom-report-about-plus",
                    show: !0
                };
                t.items.visualizationSettings.items.pivotTable.items.pivotTableText = {
                    missingFeature: "Pivot Table",
                    isOrAre: "is",
                    component: "pp-cl-custom-report-about-plus",
                    show: !0
                };
                t.items.visualizationSettings.items.combochart.items.comboChartText = {
                    missingFeature: "Combo Chart",
                    isOrAre: "is",
                    component: "pp-cl-custom-report-about-plus",
                    show: !0
                }
            },
            Handler: n({
                dataPropertyHandler: r,
                $q: c,
                $: u,
                util: t,
                arrayUtil: s
            }),
            patchers: [{
                object: i({
                    _: p
                }),
                visualizationName: "table"
            }],
            visualizationTypes: [{
                object: a({
                    _: p
                }),
                visualizationName: "table"
            }],
            registerComponentAboutPlus: o
        })
    });