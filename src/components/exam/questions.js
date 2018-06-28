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
        text: "东北农业大学北门临着哪条街",
        options: [
            "长江路",
            "化工路",
            "木材街",
            "南直路"
        ],
        answer: "长江路"
    },
    {
        text: "东北农业大学小红帽经常喝什么饮料",
        options: [
            "娃哈哈",
            "营养快线",
            "可乐、冰红茶",
            "西瓜汁、柠檬汁"
        ],
        answer: "可乐、冰红茶"
    },
    {
        text: "东北农业大学本科生大约多少人",
        options: [
            "10000多人",
            "15000多人",
            "20000多人",
            "30000多人"
        ],
        answer: "20000多人"
    },
    {
        text: "东北农业大学的特色",
        options: [
            "玩在农大",
            "爱在农大",
            "吃在农大",
            "学在农大"
        ],
        answer: "吃在农大"
    },
    {
        text: "东北农业大学人数最多的学院是",
        options: [
            "电信学院",
            "艺术学院",
            "工程学院",
            "经管学院"
        ],
        answer: "经管学院"
    },
    {
        text: "东北农业大学校车不经过以下哪个地方",
        options: [
            "研究生教学楼",
            "城栋楼",
            "新图书馆",
            "北四食堂"
        ],
        answer: "新图书馆"
    },
]