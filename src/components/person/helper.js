import axios from "axios"
import helper from "../helper/helper"
import config from "../helper/config"
export default {
    getNoReadNotify: async function () {
        let firstTime = true;

        while (true) {
            const notifies = await axios({
                url: `${config.url.feedUrl}/user/getNotifyNoRead`,
                withCredentials: true,
                method: 'post',
                data: {
                    firstTime
                }
            });
            if (notifies.data.success) {
                this.notifies = notifies.data.notifies;
            }
            firstTime = false;
            await helper.wait(500);
        }
    },
    notifies: [],
}