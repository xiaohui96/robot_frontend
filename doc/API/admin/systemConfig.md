# 管理中心

## 系统设定

- 配置查询

  **Request:**

  ```
  url: '/api/getsystemconfig'
  requestData: null
  ```

  **Response:**

  ``` json
  {
    "retcode": 1,
    "data": {
      "loginLevel": "visitor",
      "publicRegister": true,
      "pubDefaultRole": "primary",
      "pubDefaultPeriod": 120,
      "internalRegister": true,
      "internalDefaultRole": "senior",
      "internalDefaultPeriod": 20,
      "authCode": "whu2015",
      "internalMailVerification": false,

      "physicalExperiment":true,
      "uploadAlgorithm":true,
      "onlineCompiling":true,
      "onlineSimulink":true,
      "uploadLevel":"senior",

      "inspectionInterval": 10,
      "maxQueueLength": 10,
      "queuePriority": 10,
      "occupationLimit": 2,
      "duplicateClaim": true
    }
  }
  ```

- 配置更新

  **Request:**

  ``` json
  url: '/api/updatesystemconfig'
  requestData: {
    "loginLevel": "visitor",
    "publicRegister": true,
    "pubDefaultRole": "primary",
    "pubDefaultPeriod": 120,
    "internalRegister": true,
    "internalDefaultRole": "senior",
    "internalDefaultPeriod": 20,
    "authCode": "whu2015",
    "internalMailVerification": false,

    "physicalExperiment":true,
    "uploadAlgorithm":true,
    "onlineCompiling":true,
    "onlineSimulink":true,
    "uploadLevel":"senior",

    "inspectionInterval": 10,
    "maxQueueLength": 10,
    "queuePriority": 10,
    "occupationLimit": 2,
    "duplicateClaim": true
  }
  ```

  **Response:**

  ``` json
  {
    "retcode": 1
  }
  ```
