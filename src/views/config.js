const areaAll = [
  {
    title: "基础组件库",
    temp: [
      {
        iconClass: "ziti",
        text: "文本",
        id: "111",
        modelType: "wb",
        modelTitle: "文本属性",
        type: 2001, // 编辑器同步的id
        max: 10,
        isApi: false, // 是否ip
        api: null, // ip 地址
        textArr: [
          {
            label: "静态数据",
            value: false,
          },
        ],
        content: "", // 静态数据内容
      },
      {
        id: "",
        iconClass: "fl-tupian",
        text: "图片",
        type: 2002,
        max: 10,
        modelType: "tp",
        modelTitle: "图片属性",
        code: "",
      },

      {
        iconClass: "shipin",
        id: "",
        text: "视频",
        max: 4,
        modelType: "sp",
        type: 2010,
        modelTitle: "视频属性",
        code: "",
        isApi: false, // 是否ip
        api: null, // ip 地址
        textArr: [
          {
            label: "静态数据",
            value: false,
          },
        ],
      },
      {
        iconClass: "biaoge",
        text: "表格",
        id: "",
        max: 4,
        type: 2009,
        modelType: "bg",
        modelTitle: "表格属性",
        isApi: false, // 是否ip
        api: null, // ip 地址
        formData: [
          ["", "", "", ""],
          ["", "", "", ""],
          ["", "", "", ""],
          ["", "", "", ""],
        ], // 单独给编辑器用的数据
        form: {
          tableRow: 4,
          tableCol: 4,
          max: 20,
          tableData: [],
          textArr: [
            {
              label: "静态数据",
              value: false,
            },
          ],
        },
      },
    ],
  },
  {
    title: "基础组件库",
    temp: [
      {
        id: "",
        iconClass: "tubiao-zhexiantu",
        text: "折线图",
        modelType: "zxt",
        modelTitle: "折线图属性",
        max: 4,
        type: 2015,
        chartData: {
          xAxisDataDic: {
            数据1: ["0", "0", "0", "0"],
            数据2: ["0", "0", "0", "0"],
            数据3: ["0", "0", "0", "0"],
            数据4: ["0", "0", "0", "0"],
          },
          xAxisNameList: ["值1", "值2", "值3", "值4"],
          xAxisDataKeys: ["数据1", "数据2", "数据3", "数据4"],
        },
        isApi: false,
        api: null,
        form: {
          textArr: [
            {
              label: "静态数据",
              value: false,
            },
          ],
          tableRow: 4,
          tableCol: 4,
          max: 100,
          tableData: [],
        },
      },
      {
        id: "",
        iconClass: "jurassic_pie-chart",
        text: "饼图",
        type: 2016,
        max: 4,
        modelType: "bt",
        modelTitle: "饼图属性",
        chartData: {
          xAxisDataDic: {
            数据1: ["0", "0", "0", "0"],
          },
          xAxisNameList: ["值1", "值2", "值3", "值4"],
          xAxisDataKeys: ["数据1"],
        },
        isApi: false,
        api: null,
        form: {
          textArr: [
            {
              label: "静态数据",
              value: false,
            },
          ],
          tableRow: 1,
          tableCol: 4,
          max: 100,
          tableData: [],
        },
      },
    ],
  },
];
export { areaAll };
