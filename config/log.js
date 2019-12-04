/*
 * Copyright(c) 2017-2019, CETC
 *
 * @filename：log.js
 * @summary：日志配置
 * @version:：1.0
 * *************************************************************************
 * revision             author            reason                 date
 * 1.0                  zhyuanan            新增             2019-12-04
 * *************************************************************************
 */
const log4js = require('log4js');
// 级别按照为数大小排列，只输出大于指定值 为数的信息
const levels = {
    ALL_1  : 'all',
    TRACE_2: 'trace',
    DEBUG_3: 'debug',
    INFO_4 : 'info',
    WARN_5 : 'warn',
    ERROR_6: 'error',
    FATAL_7: 'fatal',
    MARK_8 : 'mark',
    OFF_9  : 'off'
}
log4js.configure({
    replaceConsole: true,
    appenders: {
        stdout: {
            type: 'stdout' // 控制台输出
        },
        req: {
            type: 'dateFile',
            filename: 'logs/reqlog',
            pattern: 'req-yyyy-MM-dd.log',
            maxLogSize:10485769, // 日志大小
            compress:true,
            backups: 20,
            alwaysIncludePattern: true
        },
    },
    categories: {
        // appenders:采用的appender,取appenders项,level:设置级别
        default: {
            appenders: ['stdout', 'req'],
            level:levels.ALL_1
        },
    }
});
const logger = log4js.getLogger('robot')
module.exports = logger