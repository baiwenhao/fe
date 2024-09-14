import Vue from "vue";
import Router from "vue-router";
import acsRouterFactory from "@ma-dev/atom-acs-client";

/* Layout */
import Layout from "../layout";

Vue.use(Router);

const permissionRouter = acsRouterFactory(Layout);

export const constantRoutes = [
    // {
    //     path: "/",
    //     component: Layout,
    //     redirect: "/mvp",
    //     children: [
    //         {
    //             path: "mvp",
    //             name: "mvp",
    //             component: () => import("@/pages/main/views/mvp"),
    //             meta: { title: "MVP", icon: "dashboard2" }
    //         }
    //     ]
    // },
    // {
    //     path: "/404",
    //     component: () => import("@/views/404"),
    //     hidden: true
    // },
    // {
    //     path: "/",
    //     component: Layout,
    //     redirect: "/mvp",
    //     children: [
    //         {
    //             path: "mvp",
    //             name: "mvp",
    //             component: () => import("@/pages/main/views/mvp"),
    //             meta: { title: "MVP", icon: "dashboard2" }
    //         }
    //     ]
    // },
    {
        path: "/",
        component: Layout,
        redirect: "/config/dashboard"
    },
    {
        path: "/404",
        component: () => import("@/views/404"),
        hidden: true
    },
    {
        path: "/config",
        component: Layout,
        redirect: "/config/dashboard",
        // meta: { title: 'Data Dashboard', icon: 'dashboard' },
        children: [
            {
                path: "dashboard",
                name: "configDashboard",
                component: () => import("@/pages/main/views/dashboard"),
                meta: { title: "Dashboard", icon2: "dashboard" }
            },
            {
                path: "detail",
                name: "configDetail",
                component: () => import("@/pages/main/views/config"),
                meta: { title: "Config", icon2: "dashboard" },
                hidden: true
            }
        ]
    },
    {
        path: "/blank",
        name: "blank",
        hidden: true,
        component: () => import("@/pages/main/views/blank"),
        meta: { title: "blank", icon2: "dashboard" }
    },
    // {
    //     path: "/page",
    //     component: Layout,
    //     redirect: "/page/blank",
    //     children: [
    //         {
    //             path: "blank",
    //             name: "blank",
    //             component: () => import("@/pages/main/views/blank"),
    //             meta: { title: "blank", icon: "dashboard" }
    //         }
    //     ]
    // },
    {
        path: "/systemmanagement",
        name: "systemManagement",
        component: Layout,
        redirect: "/signal/list",
        meta: { title: "System Management", icon2: "dashboard" },
        children: [
            {
                path: "/list",
                name: "signal",
                redirect: "/signal/info",
                // component: Layout,
                component: () => import("@/pages/main/views/signal/home"),
                meta: { title: "Signal", icon2: "dashboard" },
                children: [
                    {
                        path: "/signal/info",
                        name: "signalInfo",
                        component: () => import("@/pages/main/views/signal"),
                        meta: { title: "Signal Catalog", icon2: "dashboard" }
                    },
                    {
                        path: "/signal/detail",
                        name: "signalDetail",
                        component: () =>
                            import("@/pages/main/views/signal/signalDetail"),
                        meta: { title: "Signal Detail", icon2: "dashboard" },
                        hidden: true
                    }
                ]
            },
            // {
            //     path: "list",
            //     name: "signal",
            //     component: () => import("@/pages/main/views/signal"),
            //     meta: { title: "Signal Catalog", icon: "dashboard" }
            // },
            {
                path: "/testconsent",
                name: "testconsent",
                redirect: "/testConsent/info",
                // component: Layout,
                component: () => import("@/pages/main/views/testConsent/home"),
                meta: { title: "Test Consent", icon2: "dashboard" },
                children: [
                    {
                        path: "/testconsent/info",
                        name: "consentInfo",
                        component: () =>
                            import("@/pages/main/views/testConsent"),
                        meta: { title: "Test Consent", icon2: "dashboard" }
                    },
                    {
                        path: "/testconsent/detail",
                        name: "consentDetail",
                        component: () =>
                            import("@/pages/main/views/newTestconsent"),
                        meta: {
                            title: "Test Consent Detail",
                            icon2: "dashboard"
                        },
                        hidden: true
                    }
                ]
            }
        ]
    }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    permissionRouter,
    // 404 page must be placed at the end !!!
    { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
