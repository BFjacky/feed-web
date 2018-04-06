module.exports = function getQuestions(number) {
    const 
}
const questions = [
    {
        text: "Jser以哪门编程语言为基石",
        options: [
            { text: "Javascript" },
            { text: "Java" },
            { text: "Python" },
            { text: "由Jser俱乐部自创的Jser编程语言" }
        ],
        answer: { text: "Javascript" }
    },
    {
        text: "谁是Jser俱乐部的创始人",
        options: [
            { text: "费滕" },
            { text: "李宇春" },
            { text: "扎克伯格" },
            { text: "费腾" }
        ],
        answer: { text: "费腾" }
    },
    {
        text: "px是什么计量单位",
        options: [
            { text: "厘米" },
            { text: "流明" },
            { text: "像素" },
            { text: "楼层" }
        ],
        answer: { text: "像素" }
    },
    {
        text: "Jser俱乐部的地址",
        options: [
            { text: "哈尔滨大学科技楼503" },
            { text: "东北大学东门教师公寓5号2单元2603" },
            { text: "哈尔滨工业大学男生第5寝室303" },
            { text: "东北农业大学东门教师公寓5号2单元2603" }
        ],
        answer: { text: "东北农业大学东门教师公寓5号2单元2603" }
    },
    {
        text: "Jser俱乐部的传销头目",
        options: [
            { text: "刘秉南" },
            { text: "王卫国" },
            { text: "刘秉楠" },
            { text: "杰森" }
        ],
        answer: { text: "刘秉楠" }
    },
    {
        text: "Oppo品牌logo的底板颜色是什么",
        options: [
            { text: "绿色" },
            { text: "蓝色" },
            { text: "红色" },
            { text: "黄色" }
        ],
        answer: { text: "绿色" }
    },
    {
        text: "Jser俱乐部一张桌子的尺寸是多大",
        options: [
            { text: "长:240cm,宽:120cm" },
            { text: "长:240cm,宽:80cm" },
            { text: "长:260cm,宽:120cm" },
            { text: "长:260cm,宽:80cm" }
        ],
        answer: { text: "长:240cm,宽:120cm" }
    },
    {
        text: "以下几组成员中全是Jser俱乐部成员的选项是",
        options: [
            { text: "曾锐 蓝标 崔航 沈星移 贺言" },
            { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" },
            { text: "刘斯琦 葛天 高敏 施心平 刘秉楠" },
            { text: "韩慧鹏 卢绿萍 周莹 赵白石 郭华鑫" }
        ],
        answer: { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" }
    },
    {
        text: "JS中Math.random()的作用的是",
        options: [
            { text: "随机出一道多元方程数学题" },
            { text: "生成0-100的随机数" },
            { text: "生成一个二维码...." },
            { text: "生成0-1的随机数" }
        ],
        answer: { text: "生成0-1的随机数" }
    },
    {
        text: "vuejs 默认情况下启动项目一般会监听哪一个端口",
        options: [
            { text: "localhost:7001" },
            { text: "localhost:6379" },
            { text: "localhost:8080" },
            { text: "localhost:27017" }
        ],
        answer: { text: "localhost:8080" }
    },
    {
        text: "Jser以哪门编程语言为基石",
        options: [
            { text: "Javascript" },
            { text: "Java" },
            { text: "Python" },
            { text: "由Jser俱乐部自创的Jser编程语言" }
        ],
        answer: { text: "Javascript" }
    },
    {
        text: "谁是Jser俱乐部的创始人",
        options: [
            { text: "费滕" },
            { text: "李宇春" },
            { text: "扎克伯格" },
            { text: "费腾" }
        ],
        answer: { text: "费腾" }
    },
    {
        text: "px是什么计量单位",
        options: [
            { text: "厘米" },
            { text: "流明" },
            { text: "像素" },
            { text: "楼层" }
        ],
        answer: { text: "像素" }
    },
    {
        text: "Jser俱乐部的地址",
        options: [
            { text: "哈尔滨大学科技楼503" },
            { text: "东北大学东门教师公寓5号2单元2603" },
            { text: "哈尔滨工业大学男生第5寝室303" },
            { text: "东北农业大学东门教师公寓5号2单元2603" }
        ],
        answer: { text: "东北农业大学东门教师公寓5号2单元2603" }
    },
    {
        text: "Jser俱乐部的传销头目",
        options: [
            { text: "刘秉南" },
            { text: "王卫国" },
            { text: "刘秉楠" },
            { text: "杰森" }
        ],
        answer: { text: "刘秉楠" }
    },
    {
        text: "Oppo品牌logo的底板颜色是什么",
        options: [
            { text: "绿色" },
            { text: "蓝色" },
            { text: "红色" },
            { text: "黄色" }
        ],
        answer: { text: "绿色" }
    },
    {
        text: "Jser俱乐部一张桌子的尺寸是多大",
        options: [
            { text: "长:240cm,宽:120cm" },
            { text: "长:240cm,宽:80cm" },
            { text: "长:260cm,宽:120cm" },
            { text: "长:260cm,宽:80cm" }
        ],
        answer: { text: "长:240cm,宽:120cm" }
    },
    {
        text: "以下几组成员中全是Jser俱乐部成员的选项是",
        options: [
            { text: "曾锐 蓝标 崔航 沈星移 贺言" },
            { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" },
            { text: "刘斯琦 葛天 高敏 施心平 刘秉楠" },
            { text: "韩慧鹏 卢绿萍 周莹 赵白石 郭华鑫" }
        ],
        answer: { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" }
    },
    {
        text: "JS中Math.random()的作用的是",
        options: [
            { text: "随机出一道多元方程数学题" },
            { text: "生成0-100的随机数" },
            { text: "生成一个二维码...." },
            { text: "生成0-1的随机数" }
        ],
        answer: { text: "生成0-1的随机数" }
    },
    {
        text: "vuejs 默认情况下启动项目一般会监听哪一个端口",
        options: [
            { text: "localhost:7001" },
            { text: "localhost:6379" },
            { text: "localhost:8080" },
            { text: "localhost:27017" }
        ],
        answer: { text: "localhost:8080" }
    },
    {
        text: "Jser以哪门编程语言为基石",
        options: [
            { text: "Javascript" },
            { text: "Java" },
            { text: "Python" },
            { text: "由Jser俱乐部自创的Jser编程语言" }
        ],
        answer: { text: "Javascript" }
    },
    {
        text: "谁是Jser俱乐部的创始人",
        options: [
            { text: "费滕" },
            { text: "李宇春" },
            { text: "扎克伯格" },
            { text: "费腾" }
        ],
        answer: { text: "费腾" }
    },
    {
        text: "px是什么计量单位",
        options: [
            { text: "厘米" },
            { text: "流明" },
            { text: "像素" },
            { text: "楼层" }
        ],
        answer: { text: "像素" }
    },
    {
        text: "Jser俱乐部的地址",
        options: [
            { text: "哈尔滨大学科技楼503" },
            { text: "东北大学东门教师公寓5号2单元2603" },
            { text: "哈尔滨工业大学男生第5寝室303" },
            { text: "东北农业大学东门教师公寓5号2单元2603" }
        ],
        answer: { text: "东北农业大学东门教师公寓5号2单元2603" }
    },
    {
        text: "Jser俱乐部的传销头目",
        options: [
            { text: "刘秉南" },
            { text: "王卫国" },
            { text: "刘秉楠" },
            { text: "杰森" }
        ],
        answer: { text: "刘秉楠" }
    },
    {
        text: "Oppo品牌logo的底板颜色是什么",
        options: [
            { text: "绿色" },
            { text: "蓝色" },
            { text: "红色" },
            { text: "黄色" }
        ],
        answer: { text: "绿色" }
    },
    {
        text: "Jser俱乐部一张桌子的尺寸是多大",
        options: [
            { text: "长:240cm,宽:120cm" },
            { text: "长:240cm,宽:80cm" },
            { text: "长:260cm,宽:120cm" },
            { text: "长:260cm,宽:80cm" }
        ],
        answer: { text: "长:240cm,宽:120cm" }
    },
    {
        text: "以下几组成员中全是Jser俱乐部成员的选项是",
        options: [
            { text: "曾锐 蓝标 崔航 沈星移 贺言" },
            { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" },
            { text: "刘斯琦 葛天 高敏 施心平 刘秉楠" },
            { text: "韩慧鹏 卢绿萍 周莹 赵白石 郭华鑫" }
        ],
        answer: { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" }
    },
    {
        text: "JS中Math.random()的作用的是",
        options: [
            { text: "随机出一道多元方程数学题" },
            { text: "生成0-100的随机数" },
            { text: "生成一个二维码...." },
            { text: "生成0-1的随机数" }
        ],
        answer: { text: "生成0-1的随机数" }
    },
    {
        text: "vuejs 默认情况下启动项目一般会监听哪一个端口",
        options: [
            { text: "localhost:7001" },
            { text: "localhost:6379" },
            { text: "localhost:8080" },
            { text: "localhost:27017" }
        ],
        answer: { text: "localhost:8080" }
    },
    {
        text: "Jser以哪门编程语言为基石",
        options: [
            { text: "Javascript" },
            { text: "Java" },
            { text: "Python" },
            { text: "由Jser俱乐部自创的Jser编程语言" }
        ],
        answer: { text: "Javascript" }
    },
    {
        text: "谁是Jser俱乐部的创始人",
        options: [
            { text: "费滕" },
            { text: "李宇春" },
            { text: "扎克伯格" },
            { text: "费腾" }
        ],
        answer: { text: "费腾" }
    },
    {
        text: "px是什么计量单位",
        options: [
            { text: "厘米" },
            { text: "流明" },
            { text: "像素" },
            { text: "楼层" }
        ],
        answer: { text: "像素" }
    },
    {
        text: "Jser俱乐部的地址",
        options: [
            { text: "哈尔滨大学科技楼503" },
            { text: "东北大学东门教师公寓5号2单元2603" },
            { text: "哈尔滨工业大学男生第5寝室303" },
            { text: "东北农业大学东门教师公寓5号2单元2603" }
        ],
        answer: { text: "东北农业大学东门教师公寓5号2单元2603" }
    },
    {
        text: "Jser俱乐部的传销头目",
        options: [
            { text: "刘秉南" },
            { text: "王卫国" },
            { text: "刘秉楠" },
            { text: "杰森" }
        ],
        answer: { text: "刘秉楠" }
    },
    {
        text: "Oppo品牌logo的底板颜色是什么",
        options: [
            { text: "绿色" },
            { text: "蓝色" },
            { text: "红色" },
            { text: "黄色" }
        ],
        answer: { text: "绿色" }
    },
    {
        text: "Jser俱乐部一张桌子的尺寸是多大",
        options: [
            { text: "长:240cm,宽:120cm" },
            { text: "长:240cm,宽:80cm" },
            { text: "长:260cm,宽:120cm" },
            { text: "长:260cm,宽:80cm" }
        ],
        answer: { text: "长:240cm,宽:120cm" }
    },
    {
        text: "以下几组成员中全是Jser俱乐部成员的选项是",
        options: [
            { text: "曾锐 蓝标 崔航 沈星移 贺言" },
            { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" },
            { text: "刘斯琦 葛天 高敏 施心平 刘秉楠" },
            { text: "韩慧鹏 卢绿萍 周莹 赵白石 郭华鑫" }
        ],
        answer: { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" }
    },
    {
        text: "JS中Math.random()的作用的是",
        options: [
            { text: "随机出一道多元方程数学题" },
            { text: "生成0-100的随机数" },
            { text: "生成一个二维码...." },
            { text: "生成0-1的随机数" }
        ],
        answer: { text: "生成0-1的随机数" }
    },
    {
        text: "vuejs 默认情况下启动项目一般会监听哪一个端口",
        options: [
            { text: "localhost:7001" },
            { text: "localhost:6379" },
            { text: "localhost:8080" },
            { text: "localhost:27017" }
        ],
        answer: { text: "localhost:8080" }
    }
]