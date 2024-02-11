const axios = require('axios');

const clientKey = 'YOUR CLIENT KEY';

// 인증 코드 생성 작업
async function createTask(websiteUrl, websiteKey, taskType, pageAction) {
    const url = 'https://api.yescaptcha.com/createTask';
    const params = {
        "clientKey": clientKey,
        "task": {
            "websiteURL": websiteUrl,
            "websiteKey": websiteKey,
            "pageAction": pageAction,
            "type": taskType
        },
        "softID": 'YOUR CLIENT KEY'
    }
    const response = await axios.post(url, params);
    return response.data;
}

// 인증 코드 결과 받기
async function getTaskResult(taskId) {
    const url = 'https://api.yescaptcha.com/getTaskResult';
    const params = {
        clientKey: clientKey,
        taskId: taskId
    }

    const response = await axios.post(url, params);
    const sleep = (minutes) => {
        const milliseconds = minutes * 60 * 1000;
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };
    await sleep(0.2);
    if (response.data.status === 'ready') {
        return response.data;

    } else if (response.data.status === 'processing') {
        await getTaskResult(taskId);
    }
}


module.exports = { createTask, getTaskResult };