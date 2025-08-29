import NineSquareLottery from '../../../packages/common/model/nineSquareLottery/index.vue';
import {usePreloadImg} from "../../../packages/common/helper/usePreload";
import {useCopy} from "../../../packages/common/helper/useCopy";
import {useExternalMethod} from "../../../packages/common/helper/useExternalMethod";
import {useUrl} from "../../../packages/common/helper/useUrl";
import {useVersionUpdater} from "../../../packages/common/helper/useVersionUpdater";
import {useVersionUpdaterV2} from "../../../packages/common/helper/useVersionUpdaterV2";
import Toast from "../../../packages/common/kuUi/Toast/index.vue";
import Bubble from "../../../packages/common/kuUi/Bubble/index.vue";
import MessageCarousel from "../../../packages/common/kuUi/MessageCarousel/index.vue";
import Modal from "../../../packages/common/kuUi/BaseModal.vue";

export default {
    usePreloadImg,
    useCopy,
    useExternalMethod,
    useUrl,
    useVersionUpdater,
    useVersionUpdaterV2,
    Toast,
    Bubble,
    MessageCarousel,
    Modal,
};

// 九宫格抽奖
export const registerNineSquareLottery = (app) => {
    app.component('NineSquareLottery', NineSquareLottery);
};
