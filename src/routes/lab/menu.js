export default {
  nameCN: "实验室",
  nameEN: "Lab",
  path: "lab",
  children: [
    {
      nameCN: "复杂系统实验室",
      nameEN: "Complicated System",
      path: "complicatedSystem",
      icon: "complicatedSystem",
      children: [
        {
          name: "板球系统",
          path: "ballPlate",
        },
        {
          name: "球杆系统",
          path: "ballBeam",
          //add children
          children: [
            {
              name:"球杆1",
              path:"ballBeam1",
            },
            {
              name: "球杆2",
              path: "ballBeam2",
            },
          ]
        },

        {
          name: "无线电能传输",
          path: "WPT",
        },
        {
          name: "磁悬浮系统",
          path: "magneticLevitation",
        },
        {
          name: "二自由度飞行器",
          path: "twoDofHover",
        },
        {
          name: "三自由度飞行器",
          path: "threeDofHover",
        },
        {
          name: "自平衡小车",
          path: "selfBalancingRobot",
        }
      ]
    },
    {
      name: "过程控制实验室",
      path: "processControl",
      icon: "processControl",
      children: [
        {
          name: "真实水箱",
          path: "realTank",
        },
        {
          name: "虚拟水箱",
          path: "virtualTank",
        },
        {
          name: "单容水箱",
          path: "singleTank",
        },
        {
          name: "双容水箱",
          path: "doubleTank",
        },
        {
          name: "三容水箱",
          path: "tripleTank",
        },
        {
          name: "串级双容水箱",
          path: "cascadeDoubleTank",
        }
      ]
    },
    {
      name: "风扇控制实验室",
      path: "fanControl",
      icon: "fanControl",
      children: [
        {
          name: "风扇1",
          path: "fan1",
        },
        {
          name: "风扇2",
          path: "fan2",
        },
        {
          name: "风扇3",
          path: "fan3",
        },
        {
          name: "风扇4",
          path: "fan4",
        },
        {
          name: "风扇5",
          path: "fan5",
        }
      ]
    },
    {
      name: "倒立摆系统实验室",
      path: "invertedPendulum",
      icon: "invertedPendulum",
      children: [
        {
          name: "线性一阶倒立摆",
          path: "L1IP",
        },
        {
          name: "线性二阶倒立摆",
          path: "L2IP",
        },
        {
          name: "环形一阶倒立摆",
          path: "R1IP",
        },
        {
          name: "环形二阶倒立摆",
          path: "R2IP",
        }
      ]
    },
    {
      name: "伺服系统实验室",
      path: "servoSystem",
      icon: "servoSystem",
      children: [
        {
          name: "力矩电机",
          path: "torqueMotor",
        },
        {
          name: "直流电机",
          path: "DCMotor",
        },
        {
          name: "异步电机",
          path: "AsynMotor",
        },
        {
          name: "步进电机",
          path: "steppingMotor",
        }
      ]
    },
    {
      name: "新型实验室",
      path: "newLab",
      icon: "newLab",
      children: [
        {
          name: "三卫星模型",
          path: "threeSatellite",
        },
        {
          name: "小车系统",
          path: "car",
        }
      ]
    },
      {
          name: "热工控制系统实验室",
          path: "ThermalControlSystem",
          icon: "ThermalControlSystem",
          children: [
              {
                  name: "汽包锅炉给水系统",
                  path: "DrumBoilerFeedWaterSystem",
              },
          ]
      }
  ]
}
