export default {
  nameCN: "管理中心",
  nameEN:"Management Center",
  path: "admin",
  children: [
    {
      nameCN: "用户管理",
      nameEN: "User Config",
      path: "usersConfig",
      icon: "usersConfig"
    },
      {
          nameCN: "摄像机管理",
          nameEN: "Camera Config",
          path: "camerasConfig",
          icon: "camerasConfig"
      },
  ]
}
