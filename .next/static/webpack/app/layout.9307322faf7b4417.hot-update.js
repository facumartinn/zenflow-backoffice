"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"c70c9b34bcca\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9zdHlsZXMvZ2xvYmFscy5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBLCtEQUFlLGNBQWM7QUFDN0IsSUFBSSxJQUFVLElBQUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9zdHlsZXMvZ2xvYmFscy5jc3M/YmMzNiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcImM3MGM5YjM0YmNjYVwiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/styles/globals.css\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/providers/auth-provider.tsx":
/*!*****************************************!*\
  !*** ./src/providers/auth-provider.tsx ***!
  \*****************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: function() { return /* binding */ AuthProvider; },\n/* harmony export */   useAuth: function() { return /* binding */ useAuth; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @supabase/auth-helpers-nextjs */ \"(app-pages-browser)/./node_modules/@supabase/auth-helpers-nextjs/dist/index.js\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-hot-toast */ \"(app-pages-browser)/./node_modules/react-hot-toast/dist/index.mjs\");\n/* __next_internal_client_entry_do_not_use__ useAuth,AuthProvider auto */ \nvar _s = $RefreshSig$(), _s1 = $RefreshSig$();\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction useAuth() {\n    _s();\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (!context) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n}\n_s(useAuth, \"b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=\");\nfunction AuthProvider(param) {\n    let { children } = param;\n    _s1();\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const supabase = (0,_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_2__.createClientComponentClient)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const initAuth = async ()=>{\n            try {\n                const { data: { session } } = await supabase.auth.getSession();\n                if (session === null || session === void 0 ? void 0 : session.user) {\n                    setUser({\n                        id: session.user.id,\n                        email: session.user.email,\n                        role: session.user.role,\n                        user_metadata: session.user.user_metadata,\n                        app_metadata: session.user.app_metadata,\n                        aud: session.user.aud,\n                        created_at: session.user.created_at\n                    });\n                }\n            } catch (error) {\n                console.error(\"Error initializing auth:\", error);\n            } finally{\n                setIsLoading(false);\n            }\n        };\n        initAuth();\n        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session)=>{\n            if (session === null || session === void 0 ? void 0 : session.user) {\n                setUser({\n                    id: session.user.id,\n                    email: session.user.email,\n                    role: session.user.role,\n                    user_metadata: session.user.user_metadata,\n                    app_metadata: session.user.app_metadata,\n                    aud: session.user.aud,\n                    created_at: session.user.created_at\n                });\n            } else {\n                setUser(null);\n            }\n            setIsLoading(false);\n        });\n        return ()=>{\n            subscription.unsubscribe();\n        };\n    }, [\n        supabase.auth\n    ]);\n    const login = async (credentials)=>{\n        try {\n            const { data: { session }, error } = await supabase.auth.signInWithPassword(credentials);\n            if (error) throw error;\n            if (!(session === null || session === void 0 ? void 0 : session.user)) throw new Error(\"No user returned from login\");\n            setUser({\n                id: session.user.id,\n                email: session.user.email,\n                role: session.user.role,\n                user_metadata: session.user.user_metadata,\n                app_metadata: session.user.app_metadata,\n                aud: session.user.aud,\n                created_at: session.user.created_at\n            });\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_3__.toast.success(\"Successfully logged in!\");\n            window.location.href = \"/dashboard\";\n        } catch (error) {\n            console.error(\"Login error:\", error);\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_3__.toast.error(error instanceof Error ? error.message : \"Failed to login\");\n            throw error;\n        }\n    };\n    const logout = async ()=>{\n        try {\n            await supabase.auth.signOut();\n            setUser(null);\n            window.location.href = \"/login\";\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_3__.toast.success(\"Successfully logged out!\");\n        } catch (error) {\n            console.error(\"Logout error:\", error);\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_3__.toast.error(error instanceof Error ? error.message : \"Failed to logout\");\n            throw error;\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            isAuthenticated: !!user,\n            isLoading,\n            login,\n            logout\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/famacartin/Downloads/project 3/src/providers/auth-provider.tsx\",\n        lineNumber: 117,\n        columnNumber: 5\n    }, this);\n}\n_s1(AuthProvider, \"YajQB7LURzRD+QP5gw0+K2TZIWA=\");\n_c = AuthProvider;\nvar _c;\n$RefreshReg$(_c, \"AuthProvider\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9wcm92aWRlcnMvYXV0aC1wcm92aWRlci50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUV1RTtBQUNLO0FBQ3BDO0FBV3hDLE1BQU1NLDRCQUFjTixvREFBYUEsQ0FBOEJPO0FBRXhELFNBQVNDOztJQUNkLE1BQU1DLFVBQVVSLGlEQUFVQSxDQUFDSztJQUMzQixJQUFJLENBQUNHLFNBQVM7UUFDWixNQUFNLElBQUlDLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNUO0dBTmdCRDtBQVFULFNBQVNHLGFBQWEsS0FBMkM7UUFBM0MsRUFBRUMsUUFBUSxFQUFpQyxHQUEzQzs7SUFDM0IsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdaLCtDQUFRQSxDQUFjO0lBQzlDLE1BQU0sQ0FBQ2EsV0FBV0MsYUFBYSxHQUFHZCwrQ0FBUUEsQ0FBQztJQUMzQyxNQUFNZSxXQUFXYiwwRkFBMkJBO0lBRTVDRCxnREFBU0EsQ0FBQztRQUNSLE1BQU1lLFdBQVc7WUFDZixJQUFJO2dCQUNGLE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxPQUFPLEVBQUUsRUFBRSxHQUFHLE1BQU1ILFNBQVNJLElBQUksQ0FBQ0MsVUFBVTtnQkFDNUQsSUFBSUYsb0JBQUFBLDhCQUFBQSxRQUFTUCxJQUFJLEVBQUU7b0JBQ2pCQyxRQUFRO3dCQUNOUyxJQUFJSCxRQUFRUCxJQUFJLENBQUNVLEVBQUU7d0JBQ25CQyxPQUFPSixRQUFRUCxJQUFJLENBQUNXLEtBQUs7d0JBQ3pCQyxNQUFNTCxRQUFRUCxJQUFJLENBQUNZLElBQUk7d0JBQ3ZCQyxlQUFlTixRQUFRUCxJQUFJLENBQUNhLGFBQWE7d0JBQ3pDQyxjQUFjUCxRQUFRUCxJQUFJLENBQUNjLFlBQVk7d0JBQ3ZDQyxLQUFLUixRQUFRUCxJQUFJLENBQUNlLEdBQUc7d0JBQ3JCQyxZQUFZVCxRQUFRUCxJQUFJLENBQUNnQixVQUFVO29CQUNyQztnQkFDRjtZQUNGLEVBQUUsT0FBT0MsT0FBTztnQkFDZEMsUUFBUUQsS0FBSyxDQUFDLDRCQUE0QkE7WUFDNUMsU0FBVTtnQkFDUmQsYUFBYTtZQUNmO1FBQ0Y7UUFFQUU7UUFFQSxNQUFNLEVBQUVDLE1BQU0sRUFBRWEsWUFBWSxFQUFFLEVBQUUsR0FBR2YsU0FBU0ksSUFBSSxDQUFDWSxpQkFBaUIsQ0FBQyxPQUFPQyxRQUFRZDtZQUNoRixJQUFJQSxvQkFBQUEsOEJBQUFBLFFBQVNQLElBQUksRUFBRTtnQkFDakJDLFFBQVE7b0JBQ05TLElBQUlILFFBQVFQLElBQUksQ0FBQ1UsRUFBRTtvQkFDbkJDLE9BQU9KLFFBQVFQLElBQUksQ0FBQ1csS0FBSztvQkFDekJDLE1BQU1MLFFBQVFQLElBQUksQ0FBQ1ksSUFBSTtvQkFDdkJDLGVBQWVOLFFBQVFQLElBQUksQ0FBQ2EsYUFBYTtvQkFDekNDLGNBQWNQLFFBQVFQLElBQUksQ0FBQ2MsWUFBWTtvQkFDdkNDLEtBQUtSLFFBQVFQLElBQUksQ0FBQ2UsR0FBRztvQkFDckJDLFlBQVlULFFBQVFQLElBQUksQ0FBQ2dCLFVBQVU7Z0JBQ3JDO1lBQ0YsT0FBTztnQkFDTGYsUUFBUTtZQUNWO1lBQ0FFLGFBQWE7UUFDZjtRQUVBLE9BQU87WUFDTGdCLGFBQWFHLFdBQVc7UUFDMUI7SUFDRixHQUFHO1FBQUNsQixTQUFTSSxJQUFJO0tBQUM7SUFFbEIsTUFBTWUsUUFBUSxPQUFPQztRQUNuQixJQUFJO1lBQ0YsTUFBTSxFQUFFbEIsTUFBTSxFQUFFQyxPQUFPLEVBQUUsRUFBRVUsS0FBSyxFQUFFLEdBQUcsTUFBTWIsU0FBU0ksSUFBSSxDQUFDaUIsa0JBQWtCLENBQUNEO1lBRTVFLElBQUlQLE9BQU8sTUFBTUE7WUFDakIsSUFBSSxFQUFDVixvQkFBQUEsOEJBQUFBLFFBQVNQLElBQUksR0FBRSxNQUFNLElBQUlILE1BQU07WUFFcENJLFFBQVE7Z0JBQ05TLElBQUlILFFBQVFQLElBQUksQ0FBQ1UsRUFBRTtnQkFDbkJDLE9BQU9KLFFBQVFQLElBQUksQ0FBQ1csS0FBSztnQkFDekJDLE1BQU1MLFFBQVFQLElBQUksQ0FBQ1ksSUFBSTtnQkFDdkJDLGVBQWVOLFFBQVFQLElBQUksQ0FBQ2EsYUFBYTtnQkFDekNDLGNBQWNQLFFBQVFQLElBQUksQ0FBQ2MsWUFBWTtnQkFDdkNDLEtBQUtSLFFBQVFQLElBQUksQ0FBQ2UsR0FBRztnQkFDckJDLFlBQVlULFFBQVFQLElBQUksQ0FBQ2dCLFVBQVU7WUFDckM7WUFFQXhCLGtEQUFLQSxDQUFDa0MsT0FBTyxDQUFDO1lBQ2RDLE9BQU9DLFFBQVEsQ0FBQ0MsSUFBSSxHQUFHO1FBQ3pCLEVBQUUsT0FBT1osT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsZ0JBQWdCQTtZQUM5QnpCLGtEQUFLQSxDQUFDeUIsS0FBSyxDQUFDQSxpQkFBaUJwQixRQUFRb0IsTUFBTWEsT0FBTyxHQUFHO1lBQ3JELE1BQU1iO1FBQ1I7SUFDRjtJQUVBLE1BQU1jLFNBQVM7UUFDYixJQUFJO1lBQ0YsTUFBTTNCLFNBQVNJLElBQUksQ0FBQ3dCLE9BQU87WUFDM0IvQixRQUFRO1lBQ1IwQixPQUFPQyxRQUFRLENBQUNDLElBQUksR0FBRztZQUN2QnJDLGtEQUFLQSxDQUFDa0MsT0FBTyxDQUFDO1FBQ2hCLEVBQUUsT0FBT1QsT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsaUJBQWlCQTtZQUMvQnpCLGtEQUFLQSxDQUFDeUIsS0FBSyxDQUFDQSxpQkFBaUJwQixRQUFRb0IsTUFBTWEsT0FBTyxHQUFHO1lBQ3JELE1BQU1iO1FBQ1I7SUFDRjtJQUVBLHFCQUNFLDhEQUFDeEIsWUFBWXdDLFFBQVE7UUFDbkJDLE9BQU87WUFDTGxDO1lBQ0FtQyxpQkFBaUIsQ0FBQyxDQUFDbkM7WUFDbkJFO1lBQ0FxQjtZQUNBUTtRQUNGO2tCQUVDaEM7Ozs7OztBQUdQO0lBdkdnQkQ7S0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL3Byb3ZpZGVycy9hdXRoLXByb3ZpZGVyLnRzeD81NGExIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcblxuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9hdXRoLWhlbHBlcnMtbmV4dGpzJztcbmltcG9ydCB7IHRvYXN0IH0gZnJvbSAncmVhY3QtaG90LXRvYXN0JztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICdAL3R5cGVzL3N1cGFiYXNlJztcblxuaW50ZXJmYWNlIEF1dGhDb250ZXh0VHlwZSB7XG4gIHVzZXI6IFVzZXIgfCBudWxsO1xuICBpc0F1dGhlbnRpY2F0ZWQ6IGJvb2xlYW47XG4gIGlzTG9hZGluZzogYm9vbGVhbjtcbiAgbG9naW46IChjcmVkZW50aWFsczogeyBlbWFpbDogc3RyaW5nOyBwYXNzd29yZDogc3RyaW5nIH0pID0+IFByb21pc2U8dm9pZD47XG4gIGxvZ291dDogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0PEF1dGhDb250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGgoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoIG11c3QgYmUgdXNlZCB3aXRoaW4gYW4gQXV0aFByb3ZpZGVyJyk7XG4gIH1cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBdXRoUHJvdmlkZXIoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfSkge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZTxVc2VyIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnRDb21wb25lbnRDbGllbnQoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGluaXRBdXRoID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBkYXRhOiB7IHNlc3Npb24gfSB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRTZXNzaW9uKCk7XG4gICAgICAgIGlmIChzZXNzaW9uPy51c2VyKSB7XG4gICAgICAgICAgc2V0VXNlcih7XG4gICAgICAgICAgICBpZDogc2Vzc2lvbi51c2VyLmlkLFxuICAgICAgICAgICAgZW1haWw6IHNlc3Npb24udXNlci5lbWFpbCEsXG4gICAgICAgICAgICByb2xlOiBzZXNzaW9uLnVzZXIucm9sZSBhcyAnUk9VVElOR19BRE1JTicgfCAnUElDS0lOR19BRE1JTicsXG4gICAgICAgICAgICB1c2VyX21ldGFkYXRhOiBzZXNzaW9uLnVzZXIudXNlcl9tZXRhZGF0YSBhcyB7IHJvbGU6ICdST1VUSU5HX0FETUlOJyB8ICdQSUNLSU5HX0FETUlOJyB9LFxuICAgICAgICAgICAgYXBwX21ldGFkYXRhOiBzZXNzaW9uLnVzZXIuYXBwX21ldGFkYXRhLFxuICAgICAgICAgICAgYXVkOiBzZXNzaW9uLnVzZXIuYXVkLFxuICAgICAgICAgICAgY3JlYXRlZF9hdDogc2Vzc2lvbi51c2VyLmNyZWF0ZWRfYXRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5pdGlhbGl6aW5nIGF1dGg6JywgZXJyb3IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5pdEF1dGgoKTtcblxuICAgIGNvbnN0IHsgZGF0YTogeyBzdWJzY3JpcHRpb24gfSB9ID0gc3VwYWJhc2UuYXV0aC5vbkF1dGhTdGF0ZUNoYW5nZShhc3luYyAoX2V2ZW50LCBzZXNzaW9uKSA9PiB7XG4gICAgICBpZiAoc2Vzc2lvbj8udXNlcikge1xuICAgICAgICBzZXRVc2VyKHtcbiAgICAgICAgICBpZDogc2Vzc2lvbi51c2VyLmlkLFxuICAgICAgICAgIGVtYWlsOiBzZXNzaW9uLnVzZXIuZW1haWwhLFxuICAgICAgICAgIHJvbGU6IHNlc3Npb24udXNlci5yb2xlIGFzICdST1VUSU5HX0FETUlOJyB8ICdQSUNLSU5HX0FETUlOJyxcbiAgICAgICAgICB1c2VyX21ldGFkYXRhOiBzZXNzaW9uLnVzZXIudXNlcl9tZXRhZGF0YSBhcyB7IHJvbGU6ICdST1VUSU5HX0FETUlOJyB8ICdQSUNLSU5HX0FETUlOJyB9LFxuICAgICAgICAgIGFwcF9tZXRhZGF0YTogc2Vzc2lvbi51c2VyLmFwcF9tZXRhZGF0YSxcbiAgICAgICAgICBhdWQ6IHNlc3Npb24udXNlci5hdWQsXG4gICAgICAgICAgY3JlYXRlZF9hdDogc2Vzc2lvbi51c2VyLmNyZWF0ZWRfYXRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRVc2VyKG51bGwpO1xuICAgICAgfVxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbc3VwYWJhc2UuYXV0aF0pO1xuXG4gIGNvbnN0IGxvZ2luID0gYXN5bmMgKGNyZWRlbnRpYWxzOiB7IGVtYWlsOiBzdHJpbmc7IHBhc3N3b3JkOiBzdHJpbmcgfSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGRhdGE6IHsgc2Vzc2lvbiB9LCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduSW5XaXRoUGFzc3dvcmQoY3JlZGVudGlhbHMpO1xuICAgICAgXG4gICAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xuICAgICAgaWYgKCFzZXNzaW9uPy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoJ05vIHVzZXIgcmV0dXJuZWQgZnJvbSBsb2dpbicpO1xuXG4gICAgICBzZXRVc2VyKHtcbiAgICAgICAgaWQ6IHNlc3Npb24udXNlci5pZCxcbiAgICAgICAgZW1haWw6IHNlc3Npb24udXNlci5lbWFpbCEsXG4gICAgICAgIHJvbGU6IHNlc3Npb24udXNlci5yb2xlIGFzICdST1VUSU5HX0FETUlOJyB8ICdQSUNLSU5HX0FETUlOJyxcbiAgICAgICAgdXNlcl9tZXRhZGF0YTogc2Vzc2lvbi51c2VyLnVzZXJfbWV0YWRhdGEgYXMgeyByb2xlOiAnUk9VVElOR19BRE1JTicgfCAnUElDS0lOR19BRE1JTicgfSxcbiAgICAgICAgYXBwX21ldGFkYXRhOiBzZXNzaW9uLnVzZXIuYXBwX21ldGFkYXRhLFxuICAgICAgICBhdWQ6IHNlc3Npb24udXNlci5hdWQsXG4gICAgICAgIGNyZWF0ZWRfYXQ6IHNlc3Npb24udXNlci5jcmVhdGVkX2F0XG4gICAgICB9KTtcblxuICAgICAgdG9hc3Quc3VjY2VzcygnU3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbiEnKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9kYXNoYm9hcmQnO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdMb2dpbiBlcnJvcjonLCBlcnJvcik7XG4gICAgICB0b2FzdC5lcnJvcihlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdGYWlsZWQgdG8gbG9naW4nKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBsb2dvdXQgPSBhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnbk91dCgpO1xuICAgICAgc2V0VXNlcihudWxsKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9sb2dpbic7XG4gICAgICB0b2FzdC5zdWNjZXNzKCdTdWNjZXNzZnVsbHkgbG9nZ2VkIG91dCEnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignTG9nb3V0IGVycm9yOicsIGVycm9yKTtcbiAgICAgIHRvYXN0LmVycm9yKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0ZhaWxlZCB0byBsb2dvdXQnKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlclxuICAgICAgdmFsdWU9e3tcbiAgICAgICAgdXNlcixcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiAhIXVzZXIsXG4gICAgICAgIGlzTG9hZGluZyxcbiAgICAgICAgbG9naW4sXG4gICAgICAgIGxvZ291dCxcbiAgICAgIH19XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59Il0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJjcmVhdGVDbGllbnRDb21wb25lbnRDbGllbnQiLCJ0b2FzdCIsIkF1dGhDb250ZXh0IiwidW5kZWZpbmVkIiwidXNlQXV0aCIsImNvbnRleHQiLCJFcnJvciIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidXNlciIsInNldFVzZXIiLCJpc0xvYWRpbmciLCJzZXRJc0xvYWRpbmciLCJzdXBhYmFzZSIsImluaXRBdXRoIiwiZGF0YSIsInNlc3Npb24iLCJhdXRoIiwiZ2V0U2Vzc2lvbiIsImlkIiwiZW1haWwiLCJyb2xlIiwidXNlcl9tZXRhZGF0YSIsImFwcF9tZXRhZGF0YSIsImF1ZCIsImNyZWF0ZWRfYXQiLCJlcnJvciIsImNvbnNvbGUiLCJzdWJzY3JpcHRpb24iLCJvbkF1dGhTdGF0ZUNoYW5nZSIsIl9ldmVudCIsInVuc3Vic2NyaWJlIiwibG9naW4iLCJjcmVkZW50aWFscyIsInNpZ25JbldpdGhQYXNzd29yZCIsInN1Y2Nlc3MiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJtZXNzYWdlIiwibG9nb3V0Iiwic2lnbk91dCIsIlByb3ZpZGVyIiwidmFsdWUiLCJpc0F1dGhlbnRpY2F0ZWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/providers/auth-provider.tsx\n"));

/***/ })

});