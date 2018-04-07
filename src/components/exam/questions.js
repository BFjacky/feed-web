export default
    function getQuestions(number) {
    const randoms = [];
    while (number) {
        let sameHappen = false;
        // console.log('执行了多少次', number)
        const randomNumber = Math.random() * questions.length;
        for (const ele of randoms) {
            if (ele === parseInt(randomNumber)) {
                sameHappen = true;
                continue;
            }
        }
        if (sameHappen) {
            continue
        }
        randoms.push(parseInt(randomNumber));
        number--;
    }
    const resQuestions = [];
    for (const ele of randoms) {
        resQuestions.push(questions[ele]);
    }
    return resQuestions;
}

const questions = [
    {
        text: "Jser以哪门编程语言为基石",
        options: [
            "Javascript",
            "Java",
            "Python",
            "由Jser俱乐部自创的Jser编程语言"
        ],
        answer: "Javascript"
    },
    {
        text: "谁是Jser俱乐部的创始人",
        options: [
            "费滕",
            "李宇春",
            "扎克伯格",
            "费腾"
        ],
        answer: "费腾"
    },
    {
        text: "px是什么计量单位",
        options: [
            "厘米",
            "流明",
            "像素",
            "楼层"
        ],
        answer: "像素"
    },
    {
        text: "Jser俱乐部的地址",
        options: [
            "哈尔滨大学科技楼503",
            "东北大学东门教师公寓5号2单元2603",
            "哈尔滨工业大学男生第5寝室303",
            "东北农业大学东门教师公寓5号2单元2603"
        ],
        answer: "东北农业大学东门教师公寓5号2单元2603"
    },
    {
        text: "Jser俱乐部的传销头目",
        options: [
            "刘秉南",
            "王卫国",
            "刘秉楠",
            "杰森"
        ],
        answer: "刘秉楠"
    },
    {
        text: "Oppo品牌logo的底板颜色是什么",
        options: [
            "绿色",
            "蓝色",
            "红色",
            "黄色"
        ],
        answer: "绿色"
    },
    {
        text: "Jser俱乐部一张桌子的尺寸是多大",
        options: [
            "长:240cm,宽:120cm",
            "长:240cm,宽:80cm",
            "长:260cm,宽:120cm",
            "长:260cm,宽:80cm"
        ],
        answer: "长:240cm,宽:120cm"
    },
    {
        text: "以下几组成员中全是Jser俱乐部成员的选项是",
        options: [
            "曾锐 蓝标 崔航 沈星移 贺言",
            "吴桐 徐菩 刘培杰 杨钦钦 马天睿",
            "刘斯琦 葛天 高敏 施心平 刘秉楠",
            "韩慧鹏 卢绿萍 周莹 赵白石 郭华鑫"
        ],
        answer: "吴桐 徐菩 刘培杰 杨钦钦 马天睿"
    },
    {
        text: "JS中Math.random()的作用的是",
        options: [
            "随机出一道多元方程数学题",
            "生成0-100的随机数",
            "生成一个二维码....",
            "生成0-1的随机数"
        ],
        answer: "生成0-1的随机数"

    },
    {
        text: "vuejs 默认情况下启动项目一般会监听哪一个端口",
        options: [
            "localhost:7001",
            "localhost:6379",
            "localhost:8080",
            "localhost:27017"
        ],
        answer: "localhost:8080"
    },
    //-----------------重复
    {
        text: "Jser以哪门编程语言为基石",
        options: [
            "Javascript",
            "Java",
            "Python",
            "由Jser俱乐部自创的Jser编程语言"
        ],
        answer: "Javascript"
    },
    {
        text: "谁是Jser俱乐部的创始人",
        options: [
            "费滕",
            "李宇春",
            "扎克伯格",
            "费腾"
        ],
        answer: "费腾"
    },
    {
        text: "px是什么计量单位",
        options: [
            "厘米",
            "流明",
            "像素",
            "楼层"
        ],
        answer: "像素"
    },
    {
        text: "Jser俱乐部的地址",
        options: [
            "哈尔滨大学科技楼503",
            "东北大学东门教师公寓5号2单元2603",
            "哈尔滨工业大学男生第5寝室303",
            "东北农业大学东门教师公寓5号2单元2603"
        ],
        answer: "东北农业大学东门教师公寓5号2单元2603"
    },
    {
        text: "Jser俱乐部的传销头目",
        options: [
            "刘秉南",
            "王卫国",
            "刘秉楠",
            "杰森"
        ],
        answer: "刘秉楠"
    },
    {
        text: "Oppo品牌logo的底板颜色是什么",
        options: [
            "绿色",
            "蓝色",
            "红色",
            "黄色"
        ],
        answer: "绿色"
    },
    {
        text: "Jser俱乐部一张桌子的尺寸是多大",
        options: [
            "长:240cm,宽:120cm",
            "长:240cm,宽:80cm",
            "长:260cm,宽:120cm",
            "长:260cm,宽:80cm"
        ],
        answer: "长:240cm,宽:120cm"
    },
    {
        text: "以下几组成员中全是Jser俱乐部成员的选项是",
        options: [
            "曾锐 蓝标 崔航 沈星移 贺言",
            "吴桐 徐菩 刘培杰 杨钦钦 马天睿",
            "刘斯琦 葛天 高敏 施心平 刘秉楠",
            "韩慧鹏 卢绿萍 周莹 赵白石 郭华鑫"
        ],
        answer: "吴桐 徐菩 刘培杰 杨钦钦 马天睿"
    },
    {
        text: "JS中Math.random()的作用的是",
        options: [
            "随机出一道多元方程数学题",
            "生成0-100的随机数",
            "生成一个二维码....",
            "生成0-1的随机数"
        ],
        answer: "生成0-1的随机数"

    },
    {
        text: "vuejs 默认情况下启动项目一般会监听哪一个端口",
        options: [
            "localhost:7001",
            "localhost:6379",
            "localhost:8080",
            "localhost:27017"
        ],
        answer: "localhost:8080"
    }

]