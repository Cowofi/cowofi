const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/Index.vue"),
        meta: {
          isPublic: true,
        },
      },
      {
        path: "explorer",
        component: () => import("src/pages/ExploreSpaces.vue"),
        meta: {
          isPublic: true,
        },
      },
      {
        path: "profile",
        component: () => import("src/pages/User/ProfileDetails.vue"),
        meta: {
          isPublic: false,
        },
      },
      {
        path: "messages/:userId?",
        component: () => import("src/pages/User/IndexMessages.vue"),
        meta: {
          isPublic: false,
        },
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("pages/Auth/Login.vue"),
        meta: {
          isPublic: true,
        },
      },
      {
        path: "register",
        component: () => import("pages/Auth/Register.vue"),
        meta: {
          isPublic: true,
        },
      },
      {
        path: "forgot-password",
        component: () => import("pages/Auth/ForgotPassword.vue"),
        meta: {
          isPublic: true,
        },
      },
      {
        path: "reset-password",
        name: "PageResetPassword",
        component: () => import("pages/Auth/ResetPassword.vue"),
        meta: {
          isPublic: true,
        },
      },
    ],
  },
  {
    path: "/spaces",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "create",
        component: () => import("pages/Spaces/Create.vue"),
        meta: {
          isPublic: false,
        },
      },
      {
        path: "view/:spaceId",
        component: () => import("src/pages/Spaces/CompleteDetails.vue"),
        meta: {
          isPublic: true,
        },
      },
      {
        path: "edit/:spaceId",
        component: () => import("src/pages/Spaces/Edit.vue"),
        meta: {
          isPublic: false,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
